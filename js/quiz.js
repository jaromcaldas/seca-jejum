/* ============================================================
   Quiz Funnel Engine - Pure Vanilla JS
   Reads QUIZ_DATA (from data.js) and renders a dynamic,
   step-by-step quiz with animations, tracking, and UTM support.
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. State
  // ----------------------------------------------------------
  var quizState = {
    currentStep: 0,
    answers: {},
    inputValues: {},
    selectedOptions: {},
    stepHistory: []
  };

  // ----------------------------------------------------------
  // 2. Utility helpers
  // ----------------------------------------------------------

  /** Return the current URL search string (including leading ?) or '' */
  function getUrlParams() {
    return window.location.search || '';
  }

  /** Append current URL params to a checkout / redirect URL,
   *  filling in default UTM values only for keys not already present.
   *  `extra` (optional) is an object of extra params to merge in
   *  (ex.: fbp / fbc / fbclid para a CAPI da Kiwify). */
  function buildCheckoutUrl(baseUrl, extra) {
    var utmDefaults = {
      utm_source: 'organic',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: ''
    };

    var hashIndex = baseUrl.indexOf('#');
    var hash = hashIndex > -1 ? baseUrl.substring(hashIndex) : '';
    var urlNoHash = hashIndex > -1 ? baseUrl.substring(0, hashIndex) : baseUrl;

    var queryIndex = urlNoHash.indexOf('?');
    var basePath = queryIndex > -1 ? urlNoHash.substring(0, queryIndex) : urlNoHash;
    var baseQuery = queryIndex > -1 ? urlNoHash.substring(queryIndex + 1) : '';

    var merged = new URLSearchParams(baseQuery);
    var current = new URLSearchParams(window.location.search);
    current.forEach(function (value, key) {
      merged.set(key, value);
    });

    if (extra && typeof extra === 'object') {
      Object.keys(extra).forEach(function (key) {
        if (extra[key]) merged.set(key, extra[key]);
      });
    }

    Object.keys(utmDefaults).forEach(function (key) {
      if (!merged.has(key)) {
        merged.set(key, utmDefaults[key]);
      }
    });

    var finalQuery = merged.toString();
    return basePath + (finalQuery ? '?' + finalQuery : '') + hash;
  }

  /** True se a etapa contém algum botão de checkout (página de oferta) */
  function stepHasCheckout(step) {
    if (!step || !step.components) return false;
    for (var i = 0; i < step.components.length; i++) {
      if (step.components[i].type === 'button' && step.components[i].action === 'checkout') return true;
    }
    return false;
  }

  /** Mapeia ids de opções (índices) para os textos das opções de uma etapa */
  function getStepOptionLabels(stepIndex, ids) {
    var step = QUIZ_DATA.steps[stepIndex];
    var labels = [];
    if (!step || !step.components) return labels;
    var items = null;
    for (var i = 0; i < step.components.length; i++) {
      if (step.components[i].type === 'options') {
        items = step.components[i].items || step.components[i].options || [];
        break;
      }
    }
    if (!items) return ids;
    for (var k = 0; k < ids.length; k++) {
      var it = items[parseInt(ids[k], 10)];
      labels.push(it ? (it.text || it.name || ids[k]) : ids[k]);
    }
    return labels;
  }

  /** Smooth-scroll to top of page */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Sanitize step index: ensure it is a valid integer within range */
  function clampStep(idx) {
    if (typeof idx !== 'number' || isNaN(idx)) return 0;
    var max = QUIZ_DATA.steps.length - 1;
    if (idx < 0) return 0;
    if (idx > max) return max;
    return Math.floor(idx);
  }

  // ----------------------------------------------------------
  // 3. Tracking & back-redirect setup
  // ----------------------------------------------------------

  // Tracking scripts are injected inline in index.html <head>.

  function setupBackRedirect() {
    if (!QUIZ_DATA || !QUIZ_DATA.settings || !QUIZ_DATA.settings.backRedirectUrl) return;

    var link = QUIZ_DATA.settings.backRedirectUrl.trim();
    if (!link) return;

    var paramStr = document.location.search.replace('?', '').toString();
    var url = link + (link.indexOf('?') > 0 ? '&' : '?') + paramStr;

    history.pushState({}, '', location.href);
    history.pushState({}, '', location.href);
    history.pushState({}, '', location.href);

    window.addEventListener('popstate', function () {
      setTimeout(function () {
        location.href = url;
      }, 1);
    });
  }

  // ----------------------------------------------------------
  // 4. Progress bar
  // ----------------------------------------------------------

  function updateProgress(stepIndex) {
    var total = QUIZ_DATA.steps.length;
    var pct = ((stepIndex + 1) / total) * 100;
    var fill = document.getElementById('progress-fill');
    if (fill) {
      fill.style.width = pct + '%';
    }
  }

  // ----------------------------------------------------------
  // 5. Navigation
  // ----------------------------------------------------------

  // ---- Pré-carregamento de imagens (warm cache das próximas etapas) ----
  var _preloaded = {};
  function _collectStepImages(step) {
    var urls = [];
    if (!step || !step.components) return urls;
    for (var i = 0; i < step.components.length; i++) {
      var c = step.components[i];
      if (c.type === 'image' && c.url) urls.push(c.url);
      if (c.type === 'carousel' && c.images) urls = urls.concat(c.images);
      if (c.items) {
        for (var j = 0; j < c.items.length; j++) {
          var ic = c.items[j].icon;
          if (ic && /^https?:\/\//.test(ic)) urls.push(ic);
        }
      }
    }
    return urls;
  }
  function preloadStep(stepIndex) {
    var step = QUIZ_DATA.steps[stepIndex];
    if (!step) return;
    var urls = _collectStepImages(step);
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      if (_preloaded[url]) continue;
      _preloaded[url] = true;
      var img = new Image();
      img.decoding = 'async';
      img.src = url;
    }
  }
  function preloadUpcoming(stepIndex) {
    preloadStep(stepIndex);          // garante a etapa atual (anula o lazy)
    preloadStep(stepIndex + 1);      // próxima sequencial
    preloadStep(stepIndex + 2);      // a seguinte
    var step = QUIZ_DATA.steps[stepIndex];
    if (step && typeof step.next === 'number') preloadStep(step.next); // destino do botão
  }

  function goToStep(stepIndex, isBackNav) {
    stepIndex = clampStep(stepIndex);
    var container = document.getElementById('quiz-content');
    if (!container) return;

    if (!isBackNav && stepIndex !== quizState.currentStep) {
      quizState.stepHistory.push(quizState.currentStep);
    }

    container.classList.add('fade-out');
    container.classList.remove('fade-in');

    setTimeout(function () {
      quizState.currentStep = stepIndex;
      renderStep(stepIndex);
      container.classList.remove('fade-out');
      container.classList.add('fade-in');
      scrollToTop();
      updateProgress(stepIndex);
      updateBackButton();
      preloadUpcoming(stepIndex);

      // ---- Tracking: etapa alcançada + Lead ao chegar na oferta ----
      if (window.SJTrack) {
        var _st = QUIZ_DATA.steps[stepIndex];
        window.SJTrack.stepReached(stepIndex, _st && _st.title);
        if (stepHasCheckout(_st) && !quizState._leadFired) {
          quizState._leadFired = true;
          window.SJTrack.setLead({}, true);
        }
      }

      setTimeout(function () {
        container.classList.remove('fade-in');
      }, 500);
    }, 300);
  }

  function goBack() {
    if (quizState.stepHistory.length === 0) return;
    var prev = quizState.stepHistory.pop();
    goToStep(prev, true);
  }

  function updateBackButton() {
    var btn = document.getElementById('back-button');
    if (!btn) return;
    if (quizState.stepHistory.length === 0) {
      btn.classList.add('hidden');
    } else {
      btn.classList.remove('hidden');
    }
  }

  /** Navigate to the next step defined by the current step's `next` prop,
      or simply stepIndex + 1 as a fallback. */
  function goToNextStep() {
    var step = QUIZ_DATA.steps[quizState.currentStep];
    var nextIdx = (step && typeof step.next === 'number') ? step.next : quizState.currentStep + 1;
    goToStep(nextIdx);
  }

  // ----------------------------------------------------------
  // 6. Component renderers
  // ----------------------------------------------------------

  // 6a. Spacer
  function renderSpacer() {
    return '<div class="spacer"></div>';
  }

  // 6b. Paragraph (Quill HTML content)
  function renderParagraph(meta) {
    return '<div class="paragraph">' + (meta.content || '') + '</div>';
  }

  // 6c. Image
  function renderImage(meta) {
    var widthClass = 'width-' + (meta.width || 'full');
    var src = meta.url || meta.content || '';
    return '<div class="image-container"><img src="' + src +
      '" class="quiz-image ' + widthClass + '" alt="" loading="eager" decoding="async" fetchpriority="high"></div>';
  }

  // 6d. Alert
  function renderAlert(meta) {
    var variant = meta.variant || 'info';
    return '<div class="alert alert-' + variant + '">' +
      (meta.title ? '<div class="alert-title">' + meta.title + '</div>' : '') +
      (meta.description ? '<div class="alert-description">' + meta.description + '</div>' : '') +
      '</div>';
  }

  // 6e. Terms
  function renderTerms() {
    return '';
  }

  // ---------- Dynamic diagnosis helpers ----------
  function _findInputValue(labelRegex) {
    for (var k in quizState.inputValues) {
      if (labelRegex.test(k)) {
        var v = parseFloat(quizState.inputValues[k]);
        if (!isNaN(v) && v > 0) return v;
      }
    }
    return null;
  }

  function _calcBMI() {
    var alt = _findInputValue(/Altura/i);
    var peso = _findInputValue(/Peso[_\s]*atual/i);
    if (!alt || !peso) return null;
    var h = alt / 100;
    return peso / (h * h);
  }

  function _calcWeightLoss4w() {
    var pesoAtual = _findInputValue(/Peso[_\s]*atual/i);
    var pesoDesejado = _findInputValue(/Peso[_\s]*desejado/i);
    if (!pesoAtual || !pesoDesejado) return null;
    var diff = pesoAtual - pesoDesejado;
    if (diff <= 0) return null;
    return Math.min(15, Math.round(diff));
  }

  function _bmiTarget(bmi) {
    // Map BMI 15-40 to 0-100% on the bar
    return Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
  }

  function _bmiLabel(bmi) {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25)   return 'Peso normal';
    if (bmi < 30)   return 'Sobrepeso';
    if (bmi < 35)   return 'Obesidade grau I';
    if (bmi < 40)   return 'Obesidade grau II';
    return 'Obesidade grau III';
  }

  function _answerIdx(stepIdx) {
    var v = quizState.answers[stepIdx];
    if (v === undefined || v === null || v === '') return null;
    var n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  }

  function _multiSelected(stepIdx) {
    var obj = quizState.selectedOptions[stepIdx] || {};
    var out = [];
    for (var k in obj) out.push(parseInt(k, 10));
    return out;
  }

  // 6f-d. Dynamic Level (IMC calculated from user inputs)
  function renderDynamicLevel(meta) {
    var bmi = _calcBMI();
    var copy = {
      target: meta.target || 50,
      variant: meta.variant || 'green-to-red',
      indicator: meta.indicator || 'Você está aqui',
      title: meta.title || 'Índice de massa corporal (IMC)',
      subtitle: meta.subtitle || '',
      legends: meta.legends || ['Abaixo', 'Normal', 'Acima']
    };
    if (bmi) {
      copy.target = _bmiTarget(bmi);
      copy.subtitle = _bmiLabel(bmi) + ' — IMC ' + bmi.toFixed(1);
    }
    return renderLevel(copy);
  }

  // 6f-b. Dynamic Bullets (personalized diagnosis)
  function renderDynamicBullets() {
    var bullets = [];

    // 1) Estilo de vida — exercício (step 20) + dia a dia (step 23)
    var ex = _answerIdx(20);   // 0..4: 1-3x, 4-5x, 6-7x, raramente, não exercito
    var rt = _answerIdx(23);   // 0..2: sentado, misto, em pé
    var lifeText;
    if (ex === 4 || (ex === 3 && rt === 0)) lifeText = 'sedentário e precisa de mais movimento';
    else if (ex === 3 || rt === 0)          lifeText = 'pouco ativo e pode evoluir bastante';
    else if ((ex === 0 || ex === 1) && rt !== 2) lifeText = 'ativo, mas ainda dá para otimizar';
    else if (ex === 2 || rt === 2)          lifeText = 'bem ativo — mantenha a constância!';
    else                                     lifeText = 'razoável e tem espaço para evoluir';
    bullets.push('Seu estilo de vida é <strong>' + lifeText + '</strong>');

    // 2) Alimentação — fixo
    bullets.push('Você tem uma alimentação <strong>irregular</strong>');

    // 3) Sono (step 26)
    var sl = _answerIdx(26);   // 0=<5h, 1=5-6h, 2=7-8h, 3=>8h
    var sleepText;
    if (sl === 0)      sleepText = 'muito abaixo do ideal';
    else if (sl === 1) sleepText = 'abaixo do ideal';
    else if (sl === 2) sleepText = 'bom, mas a qualidade pode melhorar';
    else if (sl === 3) sleepText = 'em excesso — equilibre os horários';
    else               sleepText = 'precisa ser ajustado';
    bullets.push('Seu sono está <strong>' + sleepText + '</strong>');

    // 4) Hidratação (step 27)
    var wt = _answerIdx(27);   // 0=café/chá, 1=2 copos, 2=2-6 copos, 3=>6 copos
    var hydraText;
    if (wt === 0)      hydraText = 'muito abaixo do ideal — aumente urgente';
    else if (wt === 1) hydraText = 'abaixo do ideal — precisa melhorar';
    else if (wt === 2) hydraText = 'razoável, mas pode aumentar';
    else if (wt === 3) hydraText = 'boa — mantenha esse hábito';
    else               hydraText = 'precisa ser avaliada';
    bullets.push('Sua hidratação está <strong>' + hydraText + '</strong>');

    // 5) Estresse — fixo
    bullets.push('Seu nível de estresse é <strong>elevado</strong>');

    var html = '';
    for (var i = 0; i < bullets.length; i++) {
      html += '<p>• ' + bullets[i] + '</p>';
    }
    return '<div class="paragraph">' + html + '</div>';
  }

  // 6f. Level (BMI indicator)
  function renderLevel(meta) {
    var target = meta.target || 50;
    var title = meta.title || '';
    var subtitle = meta.subtitle || '';
    var indicator = meta.indicator || '';
    var legends = meta.legends || ['Anormal', 'Normal', 'Obeso'];

    var legendsHtml = '';
    for (var i = 0; i < legends.length; i++) {
      legendsHtml += '<span>' + legends[i] + '</span>';
    }

    return '<div class="level-container">' +
      '<div class="level-title">' + title + '</div>' +
      '<div class="level-subtitle">' + subtitle + '</div>' +
      '<div class="level-bar-container">' +
        '<div class="level-bar"></div>' +
        '<div class="level-indicator" style="left: ' + target + '%">' +
          '<div class="level-arrow"></div>' +
          '<span>' + indicator + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="level-legends">' + legendsHtml + '</div>' +
    '</div>';
  }

  // 6g. Cartesian chart
  function renderCartesian(meta) {
    var items = meta.items || [];
    if (!items.length) return '';

    // Find max value for scaling
    var maxVal = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].value > maxVal) maxVal = items[i].value;
    }
    if (maxVal === 0) maxVal = 1;

    var barsHtml = '';
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var heightPct = (item.value / maxVal) * 100;
      // Color gradient: higher values = red, lower = green
      var ratio = item.value / maxVal;
      var r = Math.round(ratio * 220 + (1 - ratio) * 76);
      var g = Math.round(ratio * 53 + (1 - ratio) * 175);
      var b = Math.round(ratio * 69 + (1 - ratio) * 80);
      var color = 'rgb(' + r + ',' + g + ',' + b + ')';

      barsHtml += '<div class="cartesian-bar-wrapper">' +
        '<div class="cartesian-tooltip">' + (item.tooltip || item.value) + '</div>' +
        '<div class="cartesian-bar" style="height: ' + heightPct + '%; background-color: ' + color + ';" ' +
          'data-tooltip="' + (item.tooltip || item.value) + '"></div>' +
        '<div class="cartesian-label">' + (item.label || item.name || '') + '</div>' +
      '</div>';
    }

    return '<div class="cartesian-container">' +
      '<div class="cartesian-chart">' + barsHtml + '</div>' +
    '</div>';
  }

  // 6h. Input
  function renderInput(meta, stepIndex) {
    var inputId = 'quiz-input-' + stepIndex + '-' + (meta.label || '').replace(/\s/g, '_');
    var type = meta.inputType || meta.type || 'text';
    var placeholder = meta.placeholder || '';
    var label = meta.label || '';

    return '<div class="input-container" data-input-id="' + inputId + '">' +
      (label ? '<label class="input-label" for="' + inputId + '">' + label + '</label>' : '') +
      '<input type="' + type + '" id="' + inputId + '" class="quiz-input" ' +
        'placeholder="' + placeholder + '" inputmode="' + (type === 'number' ? 'numeric' : 'text') + '" />' +
    '</div>';
  }

  // 6i. Button
  function renderButton(meta) {
    var text = meta.text || meta.content || 'Continuar';
    var action = meta.action;
    var nextStep = meta.next;
    var dataAttrs = '';

    if (action === 'checkout') {
      dataAttrs = 'data-action="checkout"';
    } else if (action === 'redirect' && meta.url) {
      dataAttrs = 'data-action="redirect" data-url="' + meta.url + '"';
    } else if (typeof nextStep === 'number') {
      dataAttrs = 'data-action="specificStep" data-url="' + nextStep + '"';
    } else {
      dataAttrs = 'data-action="nextStep"';
    }

    return '<div class="button-container">' +
      '<button class="quiz-button" ' + dataAttrs + '>' + text + '</button>' +
    '</div>';
  }

  // 6j. Options
  function renderOptions(meta, stepIndex) {
    var options = meta.items || meta.options || [];
    var layout = meta.layout || 'list';
    var disposition = meta.disposition || 'noImage';
    var multiple = !!meta.multiple;
    var autoProceed = !!meta.autoProceed;
    var layoutClass = layout === 'grid-2' ? 'options-grid-2' : 'options-list';

    var html = '<div class="options-container ' + layoutClass + '" ' +
      'data-step="' + stepIndex + '" ' +
      'data-multiple="' + (multiple ? 'true' : 'false') + '" ' +
      'data-auto-proceed="' + (autoProceed ? 'true' : 'false') + '">';

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var iconHtml = '';
      var icon = opt.icon || '';

      if (disposition !== 'noImage' && icon) {
        // Infer iconType: URL if starts with http, else emoji
        var isUrl = /^https?:\/\//i.test(icon);
        if (isUrl) {
          iconHtml = '<span class="option-icon option-icon-image"><img src="' + icon + '" alt="" loading="lazy" /></span>';
        } else {
          iconHtml = '<span class="option-icon option-icon-emoji">' + icon + '</span>';
        }
      }

      var label = opt.text || opt.name || '';
      var nameHtml = '<span class="option-text">' + label + '</span>';
      var innerHtml = '';

      if (disposition === 'textFirst') {
        innerHtml = nameHtml + iconHtml;
      } else if (disposition === 'imageFirst') {
        innerHtml = iconHtml + nameHtml;
      } else {
        innerHtml = nameHtml;
      }

      var dest = '';
      if (typeof opt.next === 'number') dest = opt.next;
      else if (opt.destination !== undefined && opt.destination !== null) dest = opt.destination;

      html += '<div class="option-card disposition-' + disposition + '" ' +
        'data-option-id="' + i + '" ' +
        'data-destination="' + dest + '">' +
        innerHtml +
      '</div>';
    }

    html += '</div>';
    return html;
  }

  // 6k. Loader
  function renderLoader(meta) {
    var duration = meta.duration || 7;
    var target = meta.target || 100;
    var label = meta.label || '';
    var description = meta.description || '';

    return '<div class="loader-container" data-duration="' + duration + '" data-target="' + target + '">' +
      (label ? '<div class="loader-label">' + label + '</div>' : '') +
      '<div class="loader-bar-wrapper">' +
        '<div class="loader-bar"><div class="loader-fill" style="width: 0%"></div></div>' +
        '<div class="loader-percentage">0%</div>' +
      '</div>' +
      (description ? '<div class="loader-description">' + description + '</div>' : '') +
    '</div>';
  }

  // 6l. Carousel
  function renderCarousel(meta) {
    var images = meta.images || [];
    if (!images.length) return '';
    var autoplay = meta.autoplay || 5000;

    var slidesHtml = '';
    var dotsHtml = '';
    for (var i = 0; i < images.length; i++) {
      var src = typeof images[i] === 'string' ? images[i] : (images[i].url || images[i].content || '');
      slidesHtml += '<div class="carousel-slide' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '">' +
        '<img src="' + src + '" alt="" loading="lazy" />' +
      '</div>';
      dotsHtml += '<span class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '"></span>';
    }

    return '<div class="carousel-container" data-autoplay="' + autoplay + '">' +
      '<button class="carousel-arrow prev" aria-label="Anterior">&#8249;</button>' +
      '<div class="carousel-track">' + slidesHtml + '</div>' +
      '<button class="carousel-arrow next" aria-label="Próximo">&#8250;</button>' +
      '<div class="carousel-dots">' + dotsHtml + '</div>' +
    '</div>';
  }

  // 6m. Line Chart (animated)
  function renderLineChart(meta) {
    var items = meta.items || [];
    if (items.length < 2) return '';

    var title = meta.title || '';
    if (meta.dynamicTitle === 'weightLoss4Weeks') {
      var loss = _calcWeightLoss4w();
      if (loss !== null && loss > 0) title = '-' + loss + ' KGs em 4 semanas';
    }
    var W = 320, H = 215;
    var padL = 14, padR = 14, padT = 38, padB = 34;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var maxVal = -Infinity, minVal = Infinity;
    for (var i = 0; i < items.length; i++) {
      if (items[i].value > maxVal) maxVal = items[i].value;
      if (items[i].value < minVal) minVal = items[i].value;
    }
    var valRange = maxVal - minVal || 1;

    var pts = [];
    for (var i = 0; i < items.length; i++) {
      var x = padL + (i / (items.length - 1)) * chartW;
      var y = padT + (1 - (items[i].value - minVal) / valRange) * chartH;
      pts.push({
        x: x, y: y,
        label:        items[i].label        || '',
        topLabel:     items[i].topLabel     || '',
        calloutLabel: items[i].calloutLabel || ''
      });
    }

    function catmullRom(pts) {
      var d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
      for (var i = 1; i < pts.length; i++) {
        d += 'L' + pts[i].x.toFixed(2) + ',' + pts[i].y.toFixed(2);
      }
      return d;
    }

    var linePath = catmullRom(pts);
    var bottomY = padT + chartH;
    var areaPath = linePath +
      'L' + pts[pts.length - 1].x.toFixed(2) + ',' + bottomY +
      'L' + pts[0].x.toFixed(2) + ',' + bottomY + 'Z';

    var uid = 'lc' + Math.floor(Math.random() * 1e6);
    var isHoriz = (meta.gradient === 'horizontal');

    var circlesHtml = '';
    var labelsHtml = '';
    var calloutsHtml = '';
    var dotIdx = 0;

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var needsDot = p.label || p.topLabel || p.calloutLabel;

      if (needsDot) {
        var delay = (0.7 + dotIdx * 0.3).toFixed(2);
        circlesHtml += '<circle class="lc-dot" cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '"' +
          ' r="5.5" fill="#fff" stroke="url(#lgS' + uid + ')" stroke-width="2.5"' +
          ' style="opacity:0;transition:opacity 0.35s ' + delay + 's ease"/>';
        dotIdx++;
      }

      if (p.topLabel) {
        var tlText = p.topLabel;
        var tlHigh = !!p.topHighlight;
        var tlW = tlText.length * 7.5 + 18;
        var tlH = 22;
        var tlCx = Math.min(Math.max(p.x, padL + tlW / 2), W - padR - tlW / 2);
        var tlY = p.y - 14;
        var tlBg   = tlHigh ? '#00a36a' : '#f3f4f6';
        var tlCol  = tlHigh ? '#ffffff' : '#4b5563';
        var tlFont = tlHigh ? '600' : '500';
        calloutsHtml +=
          '<rect x="' + (tlCx - tlW / 2).toFixed(1) + '" y="' + (tlY - tlH + 4).toFixed(1) + '"' +
          ' width="' + tlW.toFixed(1) + '" height="' + tlH + '" rx="6" fill="' + tlBg + '"/>' +
          '<text x="' + tlCx.toFixed(1) + '" y="' + (tlY - 1).toFixed(1) + '"' +
          ' text-anchor="middle" font-weight="' + tlFont + '" class="lc-callout" fill="' + tlCol + '">' + tlText + '</text>';
      }

      if (p.calloutLabel) {
        var clText = p.calloutLabel;
        var clDir  = p.calloutDir || 'left';
        var clW = clText.length * 7.5 + 18;
        var clH = 22;
        var clCx;
        if (clDir === 'right') {
          clCx = p.x + 10 + clW / 2;
          clCx = Math.min(clCx, W - padR - clW / 2);
        } else {
          clCx = p.x - 10 - clW / 2;
          clCx = Math.max(clCx, padL + clW / 2);
        }
        var clCy = p.y;
        calloutsHtml +=
          '<rect x="' + (clCx - clW / 2).toFixed(1) + '" y="' + (clCy - clH / 2).toFixed(1) + '"' +
          ' width="' + clW.toFixed(1) + '" height="' + clH + '" rx="6" fill="#f3f4f6"/>' +
          '<text x="' + clCx.toFixed(1) + '" y="' + (clCy + 4.5).toFixed(1) + '"' +
          ' text-anchor="middle" class="lc-callout" fill="#4b5563">' + clText + '</text>';
      }

      if (p.label) {
        var anchor = 'middle';
        if (p.x <= padL + 8) anchor = 'start';
        else if (p.x >= W - padR - 8) anchor = 'end';
        labelsHtml += '<text x="' + p.x.toFixed(2) + '" y="' + (H - 6) + '"' +
          ' text-anchor="' + anchor + '" class="lc-label">' + p.label + '</text>';
      }
    }

    var gX2 = isHoriz ? '1' : '0';
    var gY2 = isHoriz ? '0' : '1';

    return '<div class="linechart-container">' +
      (title ? '<div class="linechart-title">' + title + '</div>' : '') +
      '<svg class="linechart-svg" id="' + uid + '" viewBox="0 0 ' + W + ' ' + H + '">' +
        '<defs>' +
          '<linearGradient id="lgS' + uid + '" x1="0" y1="0" x2="' + gX2 + '" y2="' + gY2 + '">' +
            '<stop offset="0%" stop-color="#ef4444"/>' +
            '<stop offset="100%" stop-color="#00a36a"/>' +
          '</linearGradient>' +
          '<linearGradient id="lgF' + uid + '" x1="0" y1="0" x2="' + gX2 + '" y2="' + gY2 + '">' +
            '<stop offset="0%" stop-color="#ef4444" stop-opacity="0.22"/>' +
            '<stop offset="100%" stop-color="#00a36a" stop-opacity="0.06"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path class="lc-area" d="' + areaPath + '" fill="url(#lgF' + uid + ')" opacity="0"/>' +
        '<path class="lc-line" d="' + linePath + '" fill="none" stroke="url(#lgS' + uid + ')" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        circlesHtml +
        calloutsHtml +
        labelsHtml +
      '</svg>' +
    '</div>';
  }

  // 6n. FAQ Accordion
  function renderFaq(meta) {
    var items = meta.items || [];
    if (!items.length) return '';

    var html = '<div class="faq-container">';
    for (var i = 0; i < items.length; i++) {
      var isOpen = i === 0;
      html += '<div class="faq-item' + (isOpen ? ' open' : '') + '">' +
        '<div class="faq-question">' +
          '<span class="faq-question-text">' + items[i].question + '</span>' +
          '<span class="faq-arrow">' + (isOpen ? '&#9650;' : '&#9660;') + '</span>' +
        '</div>' +
        '<div class="faq-answer"' + (isOpen ? '' : ' style="display:none"') + '>' +
          '<p>' + items[i].answer + '</p>' +
        '</div>' +
      '</div>';
    }
    html += '</div>';
    return html;
  }

  // ----------------------------------------------------------
  // 7. Component dispatcher
  // ----------------------------------------------------------

  function renderComponent(component, stepIndex) {
    var type = component.type;
    var meta = component.metadata || component;

    switch (type) {
      case 'spacer':     return renderSpacer();
      case 'paragraph':  return renderParagraph(meta);
      case 'image':      return renderImage(meta);
      case 'alert':      return renderAlert(meta);
      case 'terms':      return renderTerms();
      case 'level':      return renderLevel(meta);
      case 'dynamicLevel':   return renderDynamicLevel(meta);
      case 'dynamicBullets': return renderDynamicBullets();
      case 'cartesian':  return renderCartesian(meta);
      case 'input':      return renderInput(meta, stepIndex);
      case 'button':     return renderButton(meta);
      case 'options':    return renderOptions(meta, stepIndex);
      case 'loader':     return renderLoader(meta);
      case 'carousel':   return renderCarousel(meta);
      case 'linechart':  return renderLineChart(meta);
      case 'faq':        return renderFaq(meta);
      default:           return '';
    }
  }

  // ----------------------------------------------------------
  // 8. Event binding (post-render)
  // ----------------------------------------------------------

  /** Attach click handlers for option cards inside the rendered step */
  function bindOptionEvents(container, stepIndex) {
    var optionContainers = container.querySelectorAll('.options-container');

    for (var oc = 0; oc < optionContainers.length; oc++) {
      (function (optContainer) {
        var isMultiple = optContainer.getAttribute('data-multiple') === 'true';
        var isAutoProceed = optContainer.getAttribute('data-auto-proceed') === 'true';
        var cards = optContainer.querySelectorAll('.option-card');

        if (!isMultiple) {
          // Single-select
          for (var c = 0; c < cards.length; c++) {
            (function (card) {
              card.addEventListener('click', function () {
                // Remove previous selection
                var siblings = optContainer.querySelectorAll('.option-card');
                for (var s = 0; s < siblings.length; s++) {
                  siblings[s].classList.remove('selected');
                }
                card.classList.add('selected');

                var optionId = card.getAttribute('data-option-id');
                quizState.answers[stepIndex] = optionId;

                // ---- Tracking: resposta (1 evento por etapa + resposta) ----
                if (window.SJTrack) {
                  var _stp = QUIZ_DATA.steps[stepIndex];
                  var _txtEl = card.querySelector('.option-text');
                  var _ans = _txtEl ? _txtEl.textContent : optionId;
                  window.SJTrack.answer(stepIndex, _stp && _stp.title, _stp && _stp.title, _ans);
                }

                if (isAutoProceed) {
                  // Visual feedback then navigate
                  setTimeout(function () {
                    var dest = card.getAttribute('data-destination');
                    if (dest !== '' && dest !== null && dest !== undefined) {
                      goToStep(parseInt(dest, 10));
                    } else {
                      goToNextStep();
                    }
                  }, 300);
                }
              });
            })(cards[c]);
          }
        } else {
          // Multiple-select
          quizState.selectedOptions[stepIndex] = {};

          // Disable the step's external continue button until a selection is made
          var stepBtns = container.querySelectorAll('.quiz-button');
          function syncStepBtnState() {
            var hasSelection = Object.keys(quizState.selectedOptions[stepIndex]).length > 0;
            for (var k = 0; k < stepBtns.length; k++) {
              stepBtns[k].disabled = !hasSelection;
            }
          }
          syncStepBtnState();

          for (var m = 0; m < cards.length; m++) {
            (function (card) {
              card.addEventListener('click', function () {
                var optionId = card.getAttribute('data-option-id');
                card.classList.toggle('selected');

                if (card.classList.contains('selected')) {
                  quizState.selectedOptions[stepIndex][optionId] = true;
                } else {
                  delete quizState.selectedOptions[stepIndex][optionId];
                }

                syncStepBtnState();
              });
            })(cards[m]);
          }
        }
      })(optionContainers[oc]);
    }
  }

  /** Attach click handlers for buttons */
  function bindButtonEvents(container) {
    var buttons = container.querySelectorAll('.quiz-button');

    for (var b = 0; b < buttons.length; b++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          var action = btn.getAttribute('data-action');
          var url = btn.getAttribute('data-url');

          // ---- Tracking: resposta de múltipla escolha (no clique de continuar) ----
          if (window.SJTrack) {
            var _cur = quizState.currentStep;
            var _sel = quizState.selectedOptions[_cur];
            var _ids = _sel ? Object.keys(_sel) : [];
            quizState._answeredMulti = quizState._answeredMulti || {};
            if (_ids.length && !quizState._answeredMulti[_cur]) {
              quizState._answeredMulti[_cur] = true;
              var _stpM = QUIZ_DATA.steps[_cur];
              window.SJTrack.answer(_cur, _stpM && _stpM.title, _stpM && _stpM.title,
                                    getStepOptionLabels(_cur, _ids));
            }
          }

          // ---- Tracking: respostas de campos digitados (altura/peso/idade) ----
          if (window.SJTrack) {
            var _curI = quizState.currentStep;
            var _inputs = container.querySelectorAll('.quiz-input');
            quizState._answeredInput = quizState._answeredInput || {};
            if (_inputs.length && !quizState._answeredInput[_curI]) {
              var _vals = [];
              for (var _ii = 0; _ii < _inputs.length; _ii++) {
                var _v = (_inputs[_ii].value || '').trim();
                if (!_v) continue;
                var _lblEl = container.querySelector('label[for="' + _inputs[_ii].id + '"]');
                var _lbl = _lblEl ? _lblEl.textContent : '';
                _vals.push(_lbl ? (_lbl + ': ' + _v) : _v);
              }
              if (_vals.length) {
                quizState._answeredInput[_curI] = true;
                var _stpI = QUIZ_DATA.steps[_curI];
                window.SJTrack.answer(_curI, _stpI && _stpI.title, _stpI && _stpI.title, _vals.join(' | '));
              }
            }
          }

          switch (action) {
            case 'nextStep':
              goToNextStep();
              break;
            case 'specificStep':
              if (url !== null && url !== '') {
                goToStep(parseInt(url, 10));
              }
              break;
            case 'checkout':
              var checkoutUrl = QUIZ_DATA.settings && QUIZ_DATA.settings.checkoutUrl;
              if (checkoutUrl) {
                var fbExtra = window.SJTrack ? window.SJTrack.getFbParams() : null;
                if (window.SJTrack) window.SJTrack.initiateCheckout();
                window.location.href = buildCheckoutUrl(checkoutUrl, fbExtra);
              }
              break;
            case 'redirect':
              if (url) {
                window.location.href = buildCheckoutUrl(url);
              }
              break;
            default:
              goToNextStep();
              break;
          }
        });
      })(buttons[b]);
    }
  }

  /** Attach input validation and store values */
  function bindInputEvents(container, stepIndex) {
    var inputs = container.querySelectorAll('.quiz-input');
    if (inputs.length === 0) return;

    var btns = container.querySelectorAll('.quiz-button');

    function validateAll() {
      var allValid = true;
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var val = input.value.trim();
        var isValid = val.length > 0;
        if (input.type === 'number') {
          isValid = val.length > 0 && !isNaN(parseFloat(val)) && parseFloat(val) > 0;
        }
        if (!isValid) { allValid = false; }
        quizState.inputValues[input.id] = val;
      }
      for (var b = 0; b < btns.length; b++) {
        btns[b].disabled = !allValid;
      }
    }

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', validateAll);
      inputs[i].addEventListener('change', validateAll);
    }
    validateAll();
  }

  /** Start loader animation */
  function bindLoaderEvents(container) {
    var loaders = container.querySelectorAll('.loader-container');

    for (var l = 0; l < loaders.length; l++) {
      (function (loader) {
        var duration = parseFloat(loader.getAttribute('data-duration')) || 7;
        var target = parseInt(loader.getAttribute('data-target'), 10) || 100;
        var fill = loader.querySelector('.loader-fill');
        var pctEl = loader.querySelector('.loader-percentage');
        var progress = 0;
        var intervalMs = (duration * 1000) / target;

        var interval = setInterval(function () {
          progress += 1;
          if (fill) fill.style.width = progress + '%';
          if (pctEl) pctEl.textContent = progress + '%';

          if (progress >= target) {
            clearInterval(interval);
            setTimeout(function () {
              goToNextStep();
            }, 500);
          }
        }, intervalMs);
      })(loaders[l]);
    }
  }

  /** Start carousel auto-play and touch support */
  function bindCarouselEvents(container) {
    var carousels = container.querySelectorAll('.carousel-container');

    for (var ci = 0; ci < carousels.length; ci++) {
      (function (carousel) {
        var slides = carousel.querySelectorAll('.carousel-slide');
        var dots = carousel.querySelectorAll('.carousel-dot');
        var totalSlides = slides.length;
        if (totalSlides === 0) return;

        var currentSlide = 0;
        var autoplayDelay = parseInt(carousel.getAttribute('data-autoplay'), 10) || 2000;
        var autoplayTimer = null;

        function showSlide(index) {
          if (index < 0) index = totalSlides - 1;
          if (index >= totalSlides) index = 0;
          currentSlide = index;

          for (var s = 0; s < slides.length; s++) {
            slides[s].classList.remove('active');
            if (dots[s]) dots[s].classList.remove('active');
          }
          slides[currentSlide].classList.add('active');
          if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
          showSlide(currentSlide + 1);
        }

        function startAutoplay() {
          stopAutoplay();
          autoplayTimer = setInterval(nextSlide, autoplayDelay);
        }

        function stopAutoplay() {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        }

        // Arrow clicks
        var prevBtn = carousel.querySelector('.carousel-arrow.prev');
        var nextBtn = carousel.querySelector('.carousel-arrow.next');
        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            showSlide(currentSlide - 1);
            startAutoplay();
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            showSlide(currentSlide + 1);
            startAutoplay();
          });
        }

        // Dot clicks
        for (var d = 0; d < dots.length; d++) {
          (function (dot, idx) {
            dot.addEventListener('click', function () {
              showSlide(idx);
              startAutoplay();
            });
          })(dots[d], d);
        }

        // Touch / swipe support
        var touchStartX = 0;
        var touchEndX = 0;
        var touchThreshold = 50;

        carousel.addEventListener('touchstart', function (e) {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', function (e) {
          touchEndX = e.changedTouches[0].screenX;
          var diff = touchStartX - touchEndX;

          if (Math.abs(diff) > touchThreshold) {
            if (diff > 0) {
              // Swipe left -> next
              showSlide(currentSlide + 1);
            } else {
              // Swipe right -> prev
              showSlide(currentSlide - 1);
            }
          }
          startAutoplay();
        }, { passive: true });

        // Start autoplay
        startAutoplay();
      })(carousels[ci]);
    }
  }

  /** Animate line chart: draw line left-to-right, then reveal area + dots */
  function bindLineChartEvents(container) {
    var svgs = container.querySelectorAll('.linechart-svg');
    for (var i = 0; i < svgs.length; i++) {
      (function (svg) {
        var line = svg.querySelector('.lc-line');
        var area = svg.querySelector('.lc-area');
        var dots = svg.querySelectorAll('.lc-dot');
        if (!line) return;

        requestAnimationFrame(function () {
          var len = line.getTotalLength ? line.getTotalLength() : 900;
          line.style.strokeDasharray = len;
          line.style.strokeDashoffset = len;

          setTimeout(function () {
            line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
            line.style.strokeDashoffset = '0';

            if (area) {
              setTimeout(function () {
                area.style.transition = 'opacity 0.7s ease';
                area.style.opacity = '1';
              }, 1400);
            }

            for (var d = 0; d < dots.length; d++) {
              (function (dot, idx) {
                setTimeout(function () { dot.style.opacity = '1'; }, 800 + idx * 250);
              })(dots[d], d);
            }
          }, 150);
        });
      })(svgs[i]);
    }
  }

  /** Bind click toggle for FAQ accordion items */
  function bindFaqEvents(container) {
    var questions = container.querySelectorAll('.faq-question');
    for (var i = 0; i < questions.length; i++) {
      (function (question) {
        question.addEventListener('click', function () {
          var item = question.parentElement;
          var answer = item.querySelector('.faq-answer');
          var arrow = item.querySelector('.faq-arrow');
          var isOpen = item.classList.contains('open');

          if (isOpen) {
            item.classList.remove('open');
            answer.style.display = 'none';
            if (arrow) arrow.innerHTML = '&#9660;';
          } else {
            item.classList.add('open');
            answer.style.display = 'block';
            if (arrow) arrow.innerHTML = '&#9650;';
          }
        });
      })(questions[i]);
    }
  }

  /** Bind tooltip show/hide for cartesian bars */
  function bindCartesianEvents(container) {
    var bars = container.querySelectorAll('.cartesian-bar');

    for (var b = 0; b < bars.length; b++) {
      (function (bar) {
        var tooltip = bar.parentElement.querySelector('.cartesian-tooltip');
        if (!tooltip) return;

        function show() { tooltip.classList.add('visible'); }
        function hide() { tooltip.classList.remove('visible'); }

        bar.addEventListener('mouseenter', show);
        bar.addEventListener('mouseleave', hide);
        bar.addEventListener('touchstart', function () {
          show();
          setTimeout(hide, 2000);
        }, { passive: true });
      })(bars[b]);
    }
  }

  // ----------------------------------------------------------
  // 9. Step rendering
  // ----------------------------------------------------------

  function renderStep(stepIndex) {
    stepIndex = clampStep(stepIndex);
    var step = QUIZ_DATA.steps[stepIndex];
    if (!step) return;

    var container = document.getElementById('quiz-content');
    if (!container) return;

    var components = step.components || [];
    var html = '';

    for (var i = 0; i < components.length; i++) {
      html += renderComponent(components[i], stepIndex);
    }

    container.innerHTML = html;

    // Post-render event binding
    bindOptionEvents(container, stepIndex);
    bindButtonEvents(container);
    bindInputEvents(container, stepIndex);
    bindLoaderEvents(container);
    bindCarouselEvents(container);
    bindLineChartEvents(container);
    bindFaqEvents(container);
    bindCartesianEvents(container);
  }

  // ----------------------------------------------------------
  // 10. Header & progress bar scaffold
  // ----------------------------------------------------------

  function buildHeader() {
    var header = document.getElementById('quiz-header');
    if (!header) return;

    var logo = '';
    var logoUrl = (QUIZ_DATA.designSettings && QUIZ_DATA.designSettings.header && QUIZ_DATA.designSettings.header.logoUrl) ||
                  (QUIZ_DATA.settings && QUIZ_DATA.settings.logo);
    if (logoUrl) {
      logo = '<img src="' + logoUrl + '" alt="Logo" class="quiz-logo" />';
    }

    var backBtn = '<button type="button" id="back-button" class="back-button hidden" aria-label="Voltar">&#8592;</button>';

    header.innerHTML = '<div class="header-inner">' + backBtn + logo + '</div>' +
      '<div class="progress-bar"><div id="progress-fill" class="progress-fill"></div></div>';

    var btnEl = document.getElementById('back-button');
    if (btnEl) {
      btnEl.addEventListener('click', goBack);
    }
  }

  // ----------------------------------------------------------
  // 11. Initialization
  // ----------------------------------------------------------

  function initQuiz() {
    if (typeof QUIZ_DATA === 'undefined' || !QUIZ_DATA || !QUIZ_DATA.steps) {
      console.error('QUIZ_DATA is not defined. Make sure data.js is loaded before quiz.js.');
      return;
    }

    buildHeader();
    quizState.currentStep = 0;
    renderStep(0);
    updateProgress(0);
    preloadUpcoming(0);

    if (window.SJTrack) {
      window.SJTrack.quizStart();
      window.SJTrack.stepReached(0, QUIZ_DATA.steps[0] && QUIZ_DATA.steps[0].title);
    }
  }

  // ----------------------------------------------------------
  // 12. Disable context menu
  // ----------------------------------------------------------

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Prevent horizontal scroll
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';

  // ----------------------------------------------------------
  // 13. Entry point
  // ----------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    setupBackRedirect();
    initQuiz();
  });

})();
