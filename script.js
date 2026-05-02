/* ==========================================================
   SCRIPT.JS — Dra. Silvia Neves Estética Avançada
   ========================================================== */

(function () {
  'use strict';


  /* ── 1. HEADER — SCROLL BLUR ─────────────────────────────── */
  const header = document.getElementById('header');

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ── 2. HAMBURGER MENU ────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  function openMenu() {
    hamburger.classList.add('is-open');
    navMobile.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (navMobile.classList.contains('is-open') && !header.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ── 3. SMOOTH SCROLL (âncoras do menu) ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── 4. WHATSAPP FLUTUANTE ────────────────────────────────── */
  var waFloat = document.querySelector('.whatsapp-float');
  var waShown = false;

  function showWa() {
    if (!waShown) {
      waShown = true;
      waFloat.classList.add('visible');
    }
  }

  // Aparece após 1 segundo OU no primeiro scroll
  setTimeout(function () {
    window.addEventListener('scroll', showWa, { once: true, passive: true });
  }, 1000);

  // Garante que aparece em até 3.5s mesmo sem scroll
  setTimeout(showWa, 3500);


  /* ── 5. INTERSECTION OBSERVER — FADE-IN ──────────────────── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setReveal(el, type, delay) {
    if (!el) return;
    el.classList.add('reveal');
    if (type) el.classList.add(type);
    if (delay) el.style.setProperty('--reveal-delay', delay + 's');
  }

  function setRevealGroup(selector, type, baseDelay, step) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      setReveal(el, type, baseDelay + (i * step));
    });
  }

  function prepareRevealAnimations() {
    setRevealGroup('.section-header', '', 0, 0);
    setRevealGroup('.section-divider', 'reveal-line', 0.12, 0);
    setRevealGroup('.proc-card', '', 0, 0.1);
    setRevealGroup('.diferencial-item', '', 0, 0.1);
    setRevealGroup('.dif-icon, .contato-icon', 'reveal-scale', 0.08, 0.04);
    setReveal(document.querySelector('.sobre-image'), 'reveal-photo', 0);
    setRevealGroup('.resultado-item', '', 0, 0.1);
    setRevealGroup('.depo-card', '', 0, 0.1);
    setRevealGroup('.contato-lista li', 'reveal-left', 0, 0.1);
    setReveal(document.querySelector('.contato-mapa'), '', 0);
    setReveal(document.querySelector('.contato-info'), '', 0.12);

    setReveal(document.querySelector('.hero-content .eyebrow'), '', 0.05);
    setReveal(document.querySelector('.hero-content h1'), '', 0.17);
    setReveal(document.querySelector('.hero-text'), '', 0.29);
    setReveal(document.querySelector('.hero-btns'), '', 0.43);
    setReveal(document.querySelector('.hero-image'), 'reveal-photo', 0.25);
  }

  prepareRevealAnimations();

  var fadeElements = document.querySelectorAll('.fade-up, .reveal');

  if (prefersReducedMotion) {
    fadeElements.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: exibe tudo em navegadores sem suporte
    fadeElements.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ── 6. CARROSSEL DE DEPOIMENTOS ─────────────────────────── */
  var track     = document.getElementById('carouselTrack');
  var cards     = track ? track.querySelectorAll('.depo-card') : [];
  var prevBtn   = document.getElementById('prevBtn');
  var nextBtn   = document.getElementById('nextBtn');
  var dots      = document.querySelectorAll('.dot');

  if (!track || cards.length === 0) return;

  var WRAPPER     = track.closest('.carousel-wrapper');
  var currentIndex  = 0;
  var autoTimer     = null;
  var INTERVAL_MS   = 6000;

  function isMobile() {
    return window.innerWidth <= 640;
  }

  function isTablet() {
    return window.innerWidth <= 1024;
  }

  function getGap() {
    if (isMobile()) return 16;
    if (isTablet()) return 20;
    return 24;
  }

  function getVisibleCount() {
    if (isMobile()) return 1;
    if (isTablet()) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  var controls = document.querySelector('.carousel-controls');
  var dotsWrap = document.querySelector('.carousel-dots');

  // Calcula e aplica largura real dos cards com base no wrapper
  function setCardWidths() {
    var visible   = getVisibleCount();
    var gap       = getGap();
    var available = WRAPPER.offsetWidth - gap * (visible - 1);
    var cardW     = Math.floor(available / visible);
    cards.forEach(function (card) {
      card.style.width = cardW + 'px';
    });
  }

  // Mostra/esconde controles conforme há slides para navegar
  function updateControls() {
    var max     = getMaxIndex();
    var visible = max > 0;
    if (controls) controls.style.display = visible ? 'flex'   : 'none';
    if (dotsWrap) dotsWrap.style.display  = visible ? 'flex'   : 'none';
  }

  function getCardWidth() {
    return cards[0].offsetWidth + getGap();
  }

  function goTo(index) {
    var max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));
    track.style.transform = 'translateX(-' + (currentIndex * getCardWidth()) + 'px)';

    dots.forEach(function (dot, i) {
      var active = i === currentIndex;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (prevBtn) prevBtn.style.opacity = '1';
    if (nextBtn) nextBtn.style.opacity = '1';
  }

  function nextSlide() {
    goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
  }

  function prevSlide() {
    goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
  }

  function startAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoplay() {
    clearInterval(autoTimer);
  }

  // Controles
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoplay(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
  });

  // Pausa ao passar o mouse
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Suporte a toque (swipe)
  var touchStartX = 0;
  var touchStartY = 0;
  var isDragging  = false;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = false;
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    var dx = Math.abs(e.touches[0].clientX - touchStartX);
    var dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > dy && dx > 8) isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) {
      delta > 0 ? nextSlide() : prevSlide();
      startAutoplay();
    }
  });

  // Suporte a teclado (setas) quando carousel está em foco
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
    if (e.key === 'ArrowLeft')  { prevSlide(); startAutoplay(); }
  });

  // Recalcula ao redimensionar: larguras, controles e posição
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      track.style.transition = 'none';
      setCardWidths();
      updateControls();
      goTo(0);
      requestAnimationFrame(function () {
        track.style.transition = '';
      });
    }, 150);
  });

  // Inicializa
  setCardWidths();
  updateControls();
  goTo(0);
  startAutoplay();


})();
