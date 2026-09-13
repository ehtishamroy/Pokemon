/* ==========================================================================
   TCG Hitz — shared behaviour (Shopify theme)

   IMPORTANT: This file must NOT re-implement cart, search, navigation, product
   variants or collection filtering. Those are handled by Shopify's native
   Web Components (cart-drawer, predictive-search, menu-drawer, product-form,
   variant-selects, results-list). The static-prototype demo versions that
   used to live here were removed because their global click/keydown listeners
   (e.g. preventDefault on `[data-add]`) fought the native behaviour.

   Only purely-visual, non-conflicting enhancements belong here.
   ========================================================================== */

/* ---------- 3D holographic tilt (the reference-store effect) ----------
   Opt-in per element via `data-tilt`; drives the --rx/--ry/--mx/--my custom
   properties consumed by the .holo styles in tcg.css. No effect on any native
   component. */
(function initTilt() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 16; // max degrees
    const card = el.querySelector('.holo__card');
    let raf = null;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', ((px - 0.5) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
    };
    const enter = () => { el.classList.add('is-active', 'was-active'); };
    const leave = () => {
      el.classList.remove('is-active');
      el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--mx', '50%');  el.style.setProperty('--my', '50%');
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('touchstart', enter, { passive: true });
    el.addEventListener('touchend', leave);
    if (card) card.setAttribute('aria-hidden', 'false');
  });
})();
