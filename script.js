(function () {
  "use strict";

  var TRIAL_KEY = "sp_trial_clicks";
  var TRIAL_EVENT = "sp:trial-inc";
  var BASE_TRADERS = 3400;
  var TRIAL_FILE = "assets/SINAISPOWER_TESTE.zip";

  // ---------- Year ----------
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Trial download ----------
  function getTrialClicks() {
    try { return Number(localStorage.getItem(TRIAL_KEY) || 0); } catch (e) { return 0; }
  }
  function triggerDownload() {
    var a = document.createElement("a");
    a.href = TRIAL_FILE;
    a.download = "SINAISPOWER_TESTE.zip";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 100);
  }
  function incrementTrial(e) {
    if (e) e.preventDefault();
    var n = getTrialClicks() + 1;
    try {
      localStorage.setItem(TRIAL_KEY, String(n));
    } catch (err) {}
    window.dispatchEvent(new CustomEvent(TRIAL_EVENT, { detail: n }));
    triggerDownload();
  }
  document.querySelectorAll("[data-trial]").forEach(function (el) {
    el.addEventListener("click", incrementTrial);
  });

  // ---------- Live traders in badge ----------
  function updateLive(n) {
    var el = document.getElementById("live-traders");
    if (el) el.textContent = (BASE_TRADERS + n).toLocaleString("pt-BR");
  }
  updateLive(getTrialClicks());
  window.addEventListener(TRIAL_EVENT, function (e) { updateLive(e.detail); });
  window.addEventListener("storage", function (e) {
    if (e.key === TRIAL_KEY) updateLive(Number(e.newValue || 0));
  });

  // ---------- Count-up stats ----------
  function formatValue(v, opts) {
    var prefix = opts.prefix || "";
    var suffix = opts.suffix || "";
    var str = opts.format === "thousands" ? v.toLocaleString("pt-BR") : String(v);
    return prefix + str + suffix;
  }
  function animateCount(el) {
    var target = Number(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var format = el.dataset.format || "";
    var live = el.dataset.live === "1";
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = Math.round(target * eased);
      if (live) v = Math.max(v, target + getTrialClicks());
      el.textContent = formatValue(v, { prefix: prefix, suffix: suffix, format: format });
      if (p < 1) requestAnimationFrame(tick);
      else if (live) el.textContent = formatValue(target + getTrialClicks(), { prefix: prefix, suffix: suffix, format: format });
    }
    requestAnimationFrame(tick);
  }
  var counted = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animateCount(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });

  window.addEventListener(TRIAL_EVENT, function () {
    document.querySelectorAll('[data-live="1"]').forEach(function (el) {
      var prefix = el.dataset.prefix || "";
      var suffix = el.dataset.suffix || "";
      var format = el.dataset.format || "";
      var target = Number(el.dataset.count) + getTrialClicks();
      el.textContent = formatValue(target, { prefix: prefix, suffix: suffix, format: format });
    });
  });

  // ---------- Benefits (rendered) ----------
  var BENEFITS = [
    { icon: "i-target", title: "Sinais Precisos", text: "Algoritmo com filtros para entradas de alta probabilidade." },
    { icon: "i-bell", title: "Sinais de Seta", text: "Sinais a todo momento com 90% de probabilidade." },
    { icon: "i-bars", title: "Multi-Ativos", text: "Funciona em qualquer par de moedas, nos timeframes M1 e M5." },
    { icon: "i-shield", title: "Automação", text: "Possue Buffers nas setas para automação nas melhores corretoras." },
    { icon: "i-zap", title: "Instalação em 2 min", text: "Arquivo .ex4 pronto. Copiou, colou, ativou. Sem configurações complicadas." },
    { icon: "i-trending-up", title: "Atualizações Grátis", text: "Melhorias contínuas do algoritmo incluídas na sua assinatura, para sempre." }
  ];
  var bg = document.getElementById("benefits-grid");
  if (bg) {
    BENEFITS.forEach(function (b) {
      var card = document.createElement("div");
      card.className = "benefit-card";
      card.innerHTML =
        '<div class="benefit-icon"><svg class="icon"><use href="#' + b.icon + '"/></svg></div>' +
        '<h3>' + b.title + '</h3>' +
        '<p>' + b.text + '</p>';
      bg.appendChild(card);
    });
  }

  // ---------- FAQ ----------
  var FAQS = [
    { q: "Como funciona o teste grátis de 3 dias?", a: "Você recebe acesso completo ao indicador por 72h, sem precisar cadastrar cartão. Se gostar, ativa a assinatura de R$ 30/mês. Se não, é só não continuar." },
    { q: "Preciso deixar o computador ligado?", a: "O indicador roda dentro do seu MetaTrader 4. Para receber sinais em tempo real, o MT4 precisa estar aberto — recomendamos usar um VPS de trading." },
    { q: "Funciona em conta demo?", a: "Sim. Você pode testar em conta demo à vontade, tanto no período grátis quanto durante a assinatura." },
    { q: "Posso cancelar quando quiser?", a: "Sim. Sem multa, sem fidelidade. Cancela pelo painel e mantém acesso até o fim do período pago." },
    { q: "Em quais corretoras funciona?", a: "Em qualquer corretora que ofereça a plataforma MetaTrader 4. XP, Clear, Exness, XM, IC Markets, Pepperstone e outras." },
    { q: "Recebo suporte se tiver dificuldade?", a: "Sim. Grupo exclusivo no Telegram com suporte técnico e atualizações do algoritmo." }
  ];
  var faqList = document.getElementById("faq-list");
  if (faqList) {
    FAQS.forEach(function (f, i) {
      var item = document.createElement("div");
      item.className = "faq-item" + (i === 0 ? " open" : "");
      item.innerHTML =
        '<button class="faq-q" type="button" aria-expanded="' + (i === 0 ? "true" : "false") + '">' +
          '<span>' + f.q + '</span>' +
          '<svg class="icon"><use href="#i-chevron-down"/></svg>' +
        '</button>' +
        '<div class="faq-a"><div><p>' + f.a + '</p></div></div>';
      item.querySelector(".faq-q").addEventListener("click", function () {
        var wasOpen = item.classList.contains("open");
        faqList.querySelectorAll(".faq-item").forEach(function (n) {
          n.classList.remove("open");
          var b = n.querySelector(".faq-q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("open");
          item.querySelector(".faq-q").setAttribute("aria-expanded", "true");
        }
      });
      faqList.appendChild(item);
    });
  }

  // ---------- Carousel ----------
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var slides = track.children;
    var total = slides.length;
    var idx = 0;
    var dotsWrap = carousel.querySelector(".carousel-dots");

    function render() {
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }
    function go(dir) { idx = (idx + dir + total) % total; render(); }

    for (var i = 0; i < total; i++) {
      (function (i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Ir para imagem " + (i + 1));
        b.addEventListener("click", function () { idx = i; render(); });
        dotsWrap.appendChild(b);
      })(i);
    }
    carousel.querySelector(".prev").addEventListener("click", function () { go(-1); });
    carousel.querySelector(".next").addEventListener("click", function () { go(1); });

    // touch swipe
    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      startX = null;
    });
    render();
  }

  // ---------- Video modal ----------
  var modal = document.getElementById("video-modal");
  var iframe = document.getElementById("video-iframe");
  var VIDEO_SRC = "https://www.youtube.com/embed/ddIa9X3pwLE?autoplay=1";
  function openVideo() {
  if (!modal) return;

  iframe.src = VIDEO_SRC;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  if (!modal) return;

  modal.hidden = true;
  iframe.src = ""; // para completamente o vídeo
  document.body.style.overflow = "";
}
  document.querySelectorAll("[data-open-video]").forEach(function (el) {
    el.addEventListener("click", openVideo);
  });
  document.querySelectorAll("[data-close-video]").forEach(function (el) {
    el.addEventListener("click", closeVideo);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeVideo();
  });
})();
