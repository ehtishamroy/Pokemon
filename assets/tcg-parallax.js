/* TCG Hitz — parallax background image (layout/theme.liquid, Theme settings → TCG Hitz — background & images).
   Adds one background layer to every section of the page and the footer. Each layer is a fixed, full-screen
   picture clipped to its own section, so all sections together look like one picture behind the page that
   drifts slowly while the content scrolls over it. A section that outputs [data-hz-px-off] ("Hide parallax
   background" in its settings) gets no layer, so the normal animated site background shows there instead.
   The drift follows scroll progress through the whole page; it is turned off for reduced motion. */
(function () {
  'use strict';

  var body = document.body;
  var mode = body && body.getAttribute('data-tcg-px');
  if (!mode) return;

  var SECTIONS = '#MainContent > .shopify-section, .shopify-section-group-footer-group';
  var FACTOR = { fixed: 0, subtle: 0.1, medium: 0.2, strong: 0.35 };
  var factor = FACTOR.hasOwnProperty(mode) ? FACTOR[mode] : FACTOR.medium;
  var root = document.documentElement;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var range = 0;
  var ticking = false;

  function apply(sec) {
    if (!sec || !sec.classList || !sec.classList.contains('shopify-section')) return;
    var layer = null;
    for (var i = 0; i < sec.children.length; i++) {
      if (sec.children[i].classList.contains('tcg-px')) { layer = sec.children[i]; break; }
    }
    if (sec.querySelector('[data-hz-px-off]')) {
      if (layer) layer.remove();
      sec.classList.remove('tcg-px-on');
      return;
    }
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'tcg-px';
      layer.setAttribute('aria-hidden', 'true');
      layer.innerHTML = '<div class="tcg-px__img"></div>';
      sec.insertBefore(layer, sec.firstChild);
    }
    sec.classList.add('tcg-px-on');
  }

  function applyAll() {
    Array.prototype.forEach.call(document.querySelectorAll(SECTIONS), apply);
  }

  function update() {
    ticking = false;
    var max = Math.max(1, root.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset) / max));
    root.style.setProperty('--tcg-px-y', (-p * range).toFixed(1) + 'px');
  }

  function measure() {
    range = reduce.matches ? 0 : Math.round(window.innerHeight * factor);
    root.style.setProperty('--tcg-px-range', range + 'px');
    update();
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', measure);
  if (reduce.addEventListener) reduce.addEventListener('change', measure);

  /* Theme editor: sections are re-rendered when their settings change. */
  document.addEventListener('shopify:section:load', function (e) {
    apply(e.target);
    measure();
  });

  applyAll();
  measure();
})();
