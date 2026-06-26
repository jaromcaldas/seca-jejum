/* ============================================================
   Seca Jejum — Camada de Tracking (Meta Pixel + Supabase)
   ------------------------------------------------------------
   - Inicializa o Meta Pixel e dispara eventos padrão e custom
   - Advanced Matching (e-mail / telefone / nome hasheados pelo pixel)
   - Deduplicação por eventID (pronto para CAPI futuro)
   - Captura _fbp / _fbc / fbclid + UTMs e repassa ao checkout
   - Registra cada etapa e resposta do quiz no Supabase
   Exposto como window.SJTrack — chamado pelo quiz.js
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // CONFIG  — preencha o META_PIXEL_ID com o ID do seu Pixel
  // (Gerenciador de Eventos → Fontes de dados → seu Pixel)
  // ----------------------------------------------------------
  var CONFIG = {
    META_PIXEL_ID: '2085220528633875',           // Pixel do Meta — Seca Jejum
    SUPABASE_URL:  'https://uhnptfhvjyuyritrhhda.supabase.co',
    SUPABASE_KEY:  'sb_publishable_qSleuIZv4vL-D0Kf5cMVYg_ZJ31DZxd',
    SUPABASE_TABLE: 'seca_jejum_quiz_events',
    LOG_STEP_REACHED_TO_META: false  // true = manda cada etapa ao Meta também (mais ruído)
  };

  var pixelReady = CONFIG.META_PIXEL_ID &&
                   CONFIG.META_PIXEL_ID.indexOf('__META_PIXEL_ID__') === -1;

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
  // Meta Pixel — bootstrap oficial
  // ----------------------------------------------------------
  function loadPixel() {
    if (!pixelReady) {
      console.warn('[SJTrack] META_PIXEL_ID não configurado — eventos do Meta desativados (Supabase segue ativo).');
      return;
    }
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', CONFIG.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function metaTrack(eventName, params, eventId, isStandard) {
    if (!pixelReady || !window.fbq) return;
    try {
      var method = isStandard ? 'track' : 'trackCustom';
      window.fbq(method, eventName, params || {}, eventId ? { eventID: eventId } : undefined);
    } catch (e) { /* silencioso */ }
  }

  // Advanced Matching — re-inicializa o pixel com os dados do lead.
  // O fbevents.js faz o hash (SHA-256) automaticamente no cliente.
  function applyAdvancedMatching() {
    if (!pixelReady || !window.fbq) return;
    var ud = {};
    if (leadData.email) ud.em = String(leadData.email).trim().toLowerCase();
    if (leadData.phone) ud.ph = String(leadData.phone).replace(/\D/g, '');
    if (leadData.name) {
      var parts = String(leadData.name).trim().toLowerCase().split(/\s+/);
      ud.fn = parts[0];
      if (parts.length > 1) ud.ln = parts[parts.length - 1];
    }
    if (Object.keys(ud).length === 0) return;
    try { window.fbq('init', CONFIG.META_PIXEL_ID, ud); } catch (e) {}
  }

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
  // API pública
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
      var id = uuid();
      metaTrack('ViewContent', { content_name: 'Quiz Seca Jejum' }, id, true);
      metaTrack('QuizStart', {}, id, false);
      logSupabase({ event_name: 'QuizStart' });
    },

    // Entrou numa etapa (drop-off do funil)
    stepReached: function (stepIndex, stepTitle) {
      if (CONFIG.LOG_STEP_REACHED_TO_META) {
        metaTrack('QuizStep', { step_index: stepIndex, step_title: stepTitle }, uuid(), false);
      }
      logSupabase({ event_name: 'StepReached', step_index: stepIndex, step_title: stepTitle });
    },

    // Respondeu uma pergunta (1 evento por etapa + resposta)
    answer: function (stepIndex, stepTitle, question, answer) {
      var answerStr = Array.isArray(answer) ? answer.join(' | ') : answer;
      metaTrack('QuizStep', {
        step_index: stepIndex,
        step_title: stepTitle,
        question: question || stepTitle,
        answer: answerStr
      }, uuid(), false);
      logSupabase({
        event_name: 'Answer',
        step_index: stepIndex,
        step_title: stepTitle,
        question: question || stepTitle,
        answer: answerStr,
        answers: Array.isArray(answer) ? answer : null
      });
    },

    // Capturou dados pessoais → Advanced Matching + Lead
    setLead: function (data, fireLeadEvent) {
      if (data && typeof data === 'object') {
        if (data.name)  leadData.name = data.name;
        if (data.email) leadData.email = data.email;
        if (data.phone) leadData.phone = data.phone;
      }
      applyAdvancedMatching();
      if (fireLeadEvent) {
        var id = uuid();
        metaTrack('Lead', { content_name: 'Quiz Seca Jejum' }, id, true);
        logSupabase({ event_name: 'Lead' });
      }
    },

    // Clique no botão de compra (antes de ir pra Kiwify)
    initiateCheckout: function () {
      var id = uuid();
      metaTrack('InitiateCheckout', { content_name: 'Plano Seca Jejum' }, id, true);
      logSupabase({ event_name: 'InitiateCheckout' });
    }
  };

  window.SJTrack = SJTrack;

  // Bootstrap do pixel o quanto antes
  loadPixel();
})();
