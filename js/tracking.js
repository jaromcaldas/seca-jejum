/* ============================================================
   Seca Jejum — Camada de Tracking (SOMENTE Supabase / background)
   ------------------------------------------------------------
   - NÃO dispara Meta Pixel. O pixel do Meta é gerenciado 100%
     pela Utmify (tag em index.html). Aqui só registramos a
     jornada do quiz no Supabase para análise interna.
   - Captura _fbp / _fbc / fbclid + UTMs e repassa ao checkout
     (Kiwify) — isso ajuda a CAPI da Kiwify, não é evento de pixel.
   Exposto como window.SJTrack — chamado pelo quiz.js
   ============================================================ */

(function () {
  'use strict';

  var CONFIG = {
    SUPABASE_URL:  'https://uhnptfhvjyuyritrhhda.supabase.co',
    SUPABASE_KEY:  'sb_publishable_qSleuIZv4vL-D0Kf5cMVYg_ZJ31DZxd',
    SUPABASE_TABLE: 'seca_jejum_quiz_events'
  };

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop()) : '';
  }

  function getUtms() {
    var p = new URLSearchParams(window.location.search);
    var out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      if (p.get(k)) out[k] = p.get(k);
    });
    return out;
  }

  // Sessão persistente por aba (agrupa a jornada de um lead)
  function getSessionId() {
    var sid = '';
    try { sid = sessionStorage.getItem('sj_session_id') || ''; } catch (e) {}
    if (!sid) {
      sid = uuid();
      try { sessionStorage.setItem('sj_session_id', sid); } catch (e) {}
    }
    return sid;
  }

  var SESSION_ID = getSessionId();
  var leadData = {};   // { name, email, phone } — preenchido quando o lead digita

  // ----------------------------------------------------------
  // Supabase — insert via REST (anon, insert-only por RLS)
  // ----------------------------------------------------------
  function logSupabase(row) {
    try {
      var payload = {
        session_id: SESSION_ID,
        event_name: row.event_name,
        step_index: (typeof row.step_index === 'number') ? row.step_index : null,
        step_title: row.step_title || null,
        question:   row.question || null,
        answer:     row.answer || null,
        answers:    row.answers || null,
        lead_name:  leadData.name || null,
        lead_email: leadData.email || null,
        lead_phone: leadData.phone || null,
        fbp:    getCookie('_fbp') || null,
        fbc:    getCookie('_fbc') || null,
        fbclid: new URLSearchParams(window.location.search).get('fbclid') || null,
        utm:    Object.keys(getUtms()).length ? getUtms() : null,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };
      var body = JSON.stringify(payload);
      var url = CONFIG.SUPABASE_URL + '/rest/v1/' + CONFIG.SUPABASE_TABLE;

      // sendBeacon não envia headers custom; usamos fetch keepalive
      fetch(url, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SUPABASE_KEY,
          'Authorization': 'Bearer ' + CONFIG.SUPABASE_KEY,
          'Prefer': 'return=minimal'
        },
        body: body
      }).catch(function () { /* silencioso */ });
    } catch (e) { /* silencioso */ }
  }

  // ----------------------------------------------------------
  // API pública — só registra no Supabase (sem Meta Pixel)
  // ----------------------------------------------------------
  var SJTrack = {
    // fbp / fbc / fbclid para repassar ao checkout da Kiwify (ajuda a CAPI dela)
    getFbParams: function () {
      var out = {};
      var fbp = getCookie('_fbp');
      var fbc = getCookie('_fbc');
      var fbclid = new URLSearchParams(window.location.search).get('fbclid');
      if (fbp) out.fbp = fbp;
      if (fbc) out.fbc = fbc;
      if (fbclid) out.fbclid = fbclid;
      return out;
    },

    // Início do quiz
    quizStart: function () {
      logSupabase({ event_name: 'QuizStart' });
    },

    // Entrou numa etapa (drop-off do funil)
    stepReached: function (stepIndex, stepTitle) {
      logSupabase({ event_name: 'StepReached', step_index: stepIndex, step_title: stepTitle });
    },

    // Respondeu uma pergunta (1 registro por etapa + resposta)
    answer: function (stepIndex, stepTitle, question, answer) {
      var answerStr = Array.isArray(answer) ? answer.join(' | ') : answer;
      logSupabase({
        event_name: 'Answer',
        step_index: stepIndex,
        step_title: stepTitle,
        question: question || stepTitle,
        answer: answerStr,
        answers: Array.isArray(answer) ? answer : null
      });
    },

    // Capturou dados pessoais (guarda p/ enriquecer os registros do Supabase)
    setLead: function (data, fireLeadEvent) {
      if (data && typeof data === 'object') {
        if (data.name)  leadData.name = data.name;
        if (data.email) leadData.email = data.email;
        if (data.phone) leadData.phone = data.phone;
      }
      if (fireLeadEvent) {
        logSupabase({ event_name: 'Lead' });
      }
    },

    // Clique no botão de compra (antes de ir pra Kiwify)
    initiateCheckout: function () {
      logSupabase({ event_name: 'InitiateCheckout' });
    }
  };

  window.SJTrack = SJTrack;
})();
