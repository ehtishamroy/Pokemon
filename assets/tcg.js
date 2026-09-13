/* ==========================================================================
   TCG Hitz — shared behaviour
   Shopify note: drop into assets/tcg.js.
   ========================================================================== */

/* ---------- Inline search bar injection (desktop only) ----------
   Matches index.html: <form class="hidden md:flex flex-1 max-w-md ml-auto" …>
   We inject it into the header column between the nav and action icons.
   ----------------------------------------------------------------------- */
(function injectInlineSearch() {
  function inject() {
    if (document.getElementById('tcg-inline-search')) return;

    // Find the header-actions element (right column)
    const actions = document.querySelector('header-actions');
    if (!actions) return;

    const form = document.createElement('form');
    form.id = 'tcg-inline-search';
    form.setAttribute('role', 'search');
    form.action = '/search';
    form.method = 'get';
    form.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <path stroke-linecap="round" d="m20 20-3.5-3.5"/>
      </svg>
      <label class="visually-hidden" for="tcg-search-input">Search cards</label>
      <input id="tcg-search-input" type="search" name="q" placeholder="Search a card, set or number…" autocomplete="off">
    `;
    // Insert before the actions element so it sits in the middle of the header
    actions.parentNode.insertBefore(form, actions);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

/* ---------- 3D holographic tilt (the reference-store effect) ---------- */
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
    // touch: follow finger, release resets
    el.addEventListener('touchstart', enter, { passive: true });
    el.addEventListener('touchend', leave);
    if (card) card.setAttribute('aria-hidden', 'false');
  });
})();

/* ---------- Cart (in-memory demo; replace with Shopify AJAX cart) ---------- */
const Cart = {
  items: [],
  add(item) {
    const found = this.items.find((i) => i.id === item.id);
    if (found) found.qty += item.qty; else this.items.push({ ...item });
    this.render(); this.open();
  },
  remove(id) { this.items = this.items.filter((i) => i.id !== id); this.render(); },
  setQty(id, qty) { const it = this.items.find((i) => i.id === id); if (!it) return; it.qty = Math.max(1, qty); this.render(); },
  count() { return this.items.reduce((n, i) => n + i.qty, 0); },
  total() { return this.items.reduce((n, i) => n + i.qty * i.price, 0); },
  money(n) { return '$' + n.toFixed(2); },
  render() {
    document.querySelectorAll('[data-cart-count]').forEach((b) => { b.textContent = this.count(); b.classList.toggle('hidden', this.count() === 0); });
    const list = document.querySelector('[data-cart-items]'); if (!list) return;
    if (!this.items.length) {
      list.innerHTML = `<div class="py-16 text-center">
        <p class="font-display text-2xl text-paper">Your cart is empty</p>
        <p class="mt-2 text-slate">Find a pull worth chasing.</p>
        <a href="collection.html" class="mt-6 inline-flex rounded-full bg-hit px-5 py-2.5 font-semibold text-felt hover:bg-hit-deep">Shop singles</a></div>`;
    } else {
      list.innerHTML = this.items.map((i) => `
        <div class="flex gap-4 py-4 border-b border-white/5">
          <img src="${i.img}" alt="" class="w-16 h-[90px] object-cover rounded-md bg-felt-3">
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">${i.title}</p>
            <p class="text-sm text-slate">${i.meta || ''}</p>
            <div class="mt-2 flex items-center gap-3">
              <div class="qty inline-flex items-center rounded-full bg-felt-3 text-sm">
                <button aria-label="Decrease" onclick="Cart.setQty('${i.id}', ${i.qty - 1})" class="rounded-full">−</button>
                <span class="w-6 text-center">${i.qty}</span>
                <button aria-label="Increase" onclick="Cart.setQty('${i.id}', ${i.qty + 1})" class="rounded-full">+</button>
              </div>
              <button onclick="Cart.remove('${i.id}')" class="text-sm text-slate hover:text-chase">Remove</button>
            </div>
          </div>
          <p class="font-semibold text-hit">${this.money(i.qty * i.price)}</p>
        </div>`).join('');
    }
    const t = document.querySelector('[data-cart-total]'); if (t) t.textContent = this.money(this.total());
    const foot = document.querySelector('[data-cart-foot]'); if (foot) foot.classList.toggle('hidden', !this.items.length);
  },
  open()  { document.querySelector('[data-drawer]')?.classList.add('is-open'); document.querySelector('[data-scrim]')?.classList.add('is-open'); document.body.style.overflow = 'hidden'; },
  close() { document.querySelector('[data-drawer]')?.classList.remove('is-open'); document.querySelector('[data-scrim]')?.classList.remove('is-open'); document.body.style.overflow = ''; },
};
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (btn) {
    e.preventDefault();
    const d = btn.dataset;
    Cart.add({ id: d.id, title: d.title, meta: d.meta, price: parseFloat(d.price), img: d.img, qty: parseInt(d.qty || document.querySelector('[data-qty-value]')?.textContent || '1', 10) });
  }
  if (e.target.closest('[data-cart-open]'))  { e.preventDefault(); Cart.open(); }
  if (e.target.closest('[data-cart-close]')) { e.preventDefault(); Cart.close(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { Cart.close(); closeNav(); } });
Cart.render();

/* ---------- Mobile nav ---------- */
function closeNav() { document.querySelector('[data-nav]')?.classList.add('hidden'); document.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false'); }
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
  const gallery = document.querySelector('[data-main-img]');
  const select = (el) => {
    opts.forEach((o) => { o.classList.remove('ring-2', 'ring-glow', 'bg-felt-3'); o.setAttribute('aria-checked', 'false'); });
    el.classList.add('ring-2', 'ring-glow', 'bg-felt-3'); el.setAttribute('aria-checked', 'true');
    const d = el.dataset;
    price.textContent = '$' + parseFloat(d.price).toFixed(2);
    stock.textContent = d.stock;
    label.textContent = `${d.printing} · ${d.condition} · ${d.lang}`;
    addBtn.dataset.price = d.price; addBtn.dataset.meta = `${d.printing} · ${d.condition} · ${d.lang}`; addBtn.dataset.id = d.id;
  };
  opts.forEach((o) => o.addEventListener('click', () => select(o)));
  select(opts[0]);

  // quantity
  const q = document.querySelector('[data-qty-value]');
  document.querySelector('[data-qty-dec]')?.addEventListener('click', () => { q.textContent = Math.max(1, parseInt(q.textContent, 10) - 1); });
  document.querySelector('[data-qty-inc]')?.addEventListener('click', () => { q.textContent = parseInt(q.textContent, 10) + 1; });

  // thumbnails swap the main (tilting) image
  document.querySelectorAll('[data-thumb]').forEach((t) => t.addEventListener('click', () => {
    gallery.src = t.dataset.thumb;
    document.querySelectorAll('[data-thumb]').forEach((x) => x.classList.remove('ring-2', 'ring-glow'));
    t.classList.add('ring-2', 'ring-glow');
  }));
})();

/* ---------- Collection page: filter panel + sort (client-side demo) ---------- */
(function initCollection() {
  const grid = document.querySelector('[data-grid]'); if (!grid) return;
  document.querySelector('[data-filters-toggle]')?.addEventListener('click', () => {
    document.querySelector('[data-filters]').classList.toggle('hidden');
  });
  const sort = document.querySelector('[data-sort]');
  sort?.addEventListener('change', () => {
    const tiles = Array.from(grid.children);
    const key = sort.value;
    tiles.sort((a, b) => {
      const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
      if (key === 'low')  return pa - pb;
      if (key === 'high') return pb - pa;
      return 0;
    });
    tiles.forEach((t) => grid.appendChild(t));
  });
  // checkbox filters by data-attrs
  const boxes = document.querySelectorAll('[data-filter]');
  const apply = () => {
    const active = {};
    boxes.forEach((b) => { if (b.checked) (active[b.dataset.filter] ||= []).push(b.value); });
    let shown = 0;
    Array.from(grid.children).forEach((t) => {
      const ok = Object.entries(active).every(([k, vals]) => vals.includes(t.dataset[k]));
      t.classList.toggle('hidden', !ok); if (ok) shown++;
    });
    const c = document.querySelector('[data-result-count]'); if (c) c.textContent = shown;
  };
  boxes.forEach((b) => b.addEventListener('change', apply));
  document.querySelector('[data-filters-clear]')?.addEventListener('click', () => { boxes.forEach((b) => (b.checked = false)); apply(); });
})();
