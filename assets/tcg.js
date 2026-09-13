/* ==========================================================================
   TCG Hitz — shared behaviour (Shopify port of tcg-hitz-store/assets/app.js)

   Identical UX to the reference site, but the cart is the real Shopify cart:
   `Cart.add()` → POST /cart/add.js, quantity/remove → POST /cart/change.js,
   and the drawer (sections/tcg-cart-drawer.liquid) is re-rendered through the
   Section Rendering API after every change.
   ========================================================================== */

/* ---------- 3D holographic tilt ---------- */
(function initTilt() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    if (reduce) return;
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

/* ---------- Cart (real Shopify cart, same drawer UX as the reference) ---------- */
const Cart = {
  root: (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/',
  busy: false,
  lastCount: null,

  /* Replay the badge pop animation (CSS: [data-cart-count].is-bumping) */
  bump(el) {
    el.classList.remove('is-bumping');
    void el.offsetWidth; // restart the animation
    el.classList.add('is-bumping');
    el.addEventListener('animationend', () => el.classList.remove('is-bumping'), { once: true });
  },

  async request(path, body) {
    const res = await fetch(this.root + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let msg = 'Something went wrong.';
      try { const j = await res.json(); msg = j.description || j.message || msg; } catch (e) {}
      throw new Error(msg);
    }
    return res.json();
  },

  async add(variantId, qty) {
    if (!variantId) return;
    await this.request('cart/add.js', { items: [{ id: Number(variantId), quantity: Math.max(1, qty || 1) }] });
    await this.refresh();
    this.open();
  },

  async change(line, qty) {
    await this.request('cart/change.js', { line: Number(line), quantity: Math.max(0, qty) });
    await this.refresh();
  },

  async clear() {
    await this.request('cart/clear.js', {});
    await this.refresh();
  },

  /* Re-render the drawer via the Section Rendering API and sync the count badge.
     The cart page renders server-side, so it simply reloads after a change. */
  async refresh() {
    const wrap = document.getElementById('shopify-section-tcg-cart-drawer');
    if (wrap) {
      const res = await fetch(this.root + '?section_id=tcg-cart-drawer');
      if (res.ok) {
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const fresh = doc.getElementById('shopify-section-tcg-cart-drawer');
        if (fresh) {
          const wasOpen = wrap.querySelector('[data-drawer]')?.classList.contains('is-open');
          wrap.innerHTML = fresh.innerHTML;
          if (wasOpen) this.open(false);
        }
      }
    }
    const src = document.querySelector('[data-cart-count-src]');
    const count = src ? parseInt(src.dataset.cartCountSrc, 10) || 0 : null;
    if (count !== null) {
      const changed = this.lastCount !== null && count !== this.lastCount;
      this.lastCount = count;
      document.querySelectorAll('[data-cart-count]').forEach((b) => {
        b.textContent = count;
        b.classList.toggle('hidden', count === 0);
        if (changed && count > 0) this.bump(b);
      });
    }
    if (document.querySelector('[data-cart-page]')) window.location.reload();
  },

  open(lockScroll = true) {
    document.querySelector('[data-drawer]')?.classList.add('is-open');
    document.querySelector('[data-scrim]')?.classList.add('is-open');
    if (lockScroll) document.body.style.overflow = 'hidden';
  },
  close() {
    document.querySelector('[data-drawer]')?.classList.remove('is-open');
    document.querySelector('[data-scrim]')?.classList.remove('is-open');
    document.body.style.overflow = '';
  },
};

document.addEventListener('click', async (e) => {
  const add = e.target.closest('[data-add]');
  if (add) {
    e.preventDefault();
    if (add.disabled || Cart.busy) return;
    const qtyEl = add.hasAttribute('data-add-main') ? document.querySelector('[data-qty-value]') : null;
    const qty = parseInt(add.dataset.qty || (qtyEl && qtyEl.textContent) || '1', 10);
    const label = add.textContent;
    Cart.busy = true;
    try {
      await Cart.add(add.dataset.variantId, qty);
      add.textContent = 'ADDED ✓';
      setTimeout(() => { add.textContent = label; }, 1200);
    } catch (err) {
      add.textContent = 'TRY AGAIN';
      setTimeout(() => { add.textContent = label; }, 1600);
      console.error(err);
    } finally { Cart.busy = false; }
    return;
  }

  const lineBtn = e.target.closest('[data-line-qty]');
  if (lineBtn) {
    e.preventDefault();
    if (Cart.busy) return;
    Cart.busy = true;
    try { await Cart.change(lineBtn.dataset.line, parseInt(lineBtn.dataset.qty, 10)); }
    catch (err) { console.error(err); }
    finally { Cart.busy = false; }
    return;
  }

  if (e.target.closest('[data-cart-open]'))  { e.preventDefault(); Cart.open(); }
  if (e.target.closest('[data-cart-close]')) { e.preventDefault(); Cart.close(); }
  if (e.target.closest('[data-cart-clear]')) {
    e.preventDefault();
    if (Cart.busy) return;
    Cart.busy = true;
    try { await Cart.clear(); } catch (err) { console.error(err); } finally { Cart.busy = false; }
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { Cart.close(); closeNav(); } });

/* Seed the badge count from the server-rendered drawer so the first cart
   change animates rather than silently jumping. */
(function seedCartCount() {
  const src = document.querySelector('[data-cart-count-src]');
  if (src) Cart.lastCount = parseInt(src.dataset.cartCountSrc, 10) || 0;
})();

/* ---------- Mobile nav ---------- */
function closeNav() {
  document.querySelector('[data-nav]')?.classList.add('hidden');
  document.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false');
}
document.querySelector('[data-nav-toggle]')?.addEventListener('click', (e) => {
  const nav = document.querySelector('[data-nav]'); const open = nav.classList.toggle('hidden');
  e.currentTarget.setAttribute('aria-expanded', String(!open));
});

/* ---------- Product page: printing/condition + quantity ---------- */
(function initProduct() {
  const opts = document.querySelectorAll('[data-variant]');
  if (!opts.length) return;
  const price = document.querySelector('[data-price]');
  const stock = document.querySelector('[data-stock]');
  const label = document.querySelector('[data-selected]');
  const addBtn = document.querySelector('[data-add-main]');
  const input = document.querySelector('[data-variant-input]');
  const gallery = document.querySelector('[data-main-img]');

  const select = (el, updateUrl) => {
    opts.forEach((o) => { o.classList.remove('ring-2', 'ring-gold', 'bg-felt-3'); o.setAttribute('aria-checked', 'false'); });
    el.classList.add('ring-2', 'ring-gold', 'bg-felt-3'); el.setAttribute('aria-checked', 'true');
    const d = el.dataset;
    if (price) price.textContent = d.price;
    if (stock) {
      stock.textContent = d.stock;
      stock.className = d.available === 'true'
        ? 'rounded-full bg-mint/15 text-mint px-3 py-1 text-sm font-bold'
        : 'rounded-full bg-chase/15 text-chase px-3 py-1 text-sm font-bold';
    }
    if (label) label.textContent = d.label;
    if (input) input.value = d.id;
    if (addBtn) {
      addBtn.dataset.variantId = d.id;
      addBtn.disabled = d.available !== 'true';
      addBtn.textContent = d.available === 'true' ? 'ADD TO CART' : 'SOLD OUT';
      addBtn.classList.toggle('opacity-60', d.available !== 'true');
    }
    if (d.image && gallery) gallery.src = d.image;
    if (updateUrl && window.history && d.id) {
      const url = new URL(window.location.href); url.searchParams.set('variant', d.id);
      window.history.replaceState({}, '', url);
    }
  };
  opts.forEach((o) => o.addEventListener('click', () => select(o, true)));
  select(document.querySelector('[data-variant][aria-checked="true"]') || opts[0], false);

  // quantity
  const q = document.querySelector('[data-qty-value]');
  document.querySelector('[data-qty-dec]')?.addEventListener('click', () => { q.textContent = Math.max(1, parseInt(q.textContent, 10) - 1); });
  document.querySelector('[data-qty-inc]')?.addEventListener('click', () => { q.textContent = parseInt(q.textContent, 10) + 1; });

  // thumbnails swap the main (tilting) image
  document.querySelectorAll('[data-thumb]').forEach((t) => t.addEventListener('click', () => {
    if (gallery) gallery.src = t.dataset.thumb;
    document.querySelectorAll('[data-thumb]').forEach((x) => x.classList.remove('ring-2', 'ring-gold'));
    t.classList.add('ring-2', 'ring-gold');
  }));
})();

/* ---------- Collection page: filter panel toggle + server-side sort ---------- */
(function initCollection() {
  document.querySelector('[data-filters-toggle]')?.addEventListener('click', () => {
    document.querySelector('[data-filters]')?.classList.toggle('hidden');
  });
  const sort = document.querySelector('[data-sort]');
  sort?.addEventListener('change', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', sort.value);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  });
  // Filter checkboxes / price inputs submit their form (Shopify filters are server-side)
  document.querySelectorAll('[data-filter-form] input').forEach((inp) => {
    inp.addEventListener('change', () => inp.form.submit());
  });
})();

/* ---------- Carousel arrows ---------- */
document.querySelectorAll('.carousel').forEach((c) => {
  const rail = c.querySelector('.rail');
  if (!rail) return;
  const step = () => Math.max(rail.clientWidth * 0.8, 200);
  c.querySelector('.prev')?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  c.querySelector('.next')?.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));
});
