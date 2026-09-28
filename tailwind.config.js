/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './blocks/*.liquid',
    './assets/tcg.js',
  ],
  // Preflight is Tailwind's global reset. Loaded site-wide it strips Shopify's
  // native buttons, lists, headings and form controls, breaking the cart drawer,
  // product form and checkout UI. We disable it and re-add only the resets the
  // custom TCG sections need, scoped under `.tcg-scope` (see tailwind-input.css).
  // Shopify's native base.css (kept for checkout/account/search pages) defines its own
  // .grid/.flex/.hidden/.relative/.text-* classes and a higher-specificity input rule;
  // on desktop its 14-track page-grid .grid rule overrides grid-cols-*. Making every
  // utility !important lets the design's utilities win regardless of order/specificity.
  // @layer components (the app.css port) is unaffected, matching the reference cascade.
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        felt:   { DEFAULT: '#000000', 2: '#0D0D11', 3: '#18181D' },   // pure black & dark charcoal surfaces
        glow:   { DEFAULT: '#FFC72C', dim: '#C8860D' },               // gold accent (replaces cyan blue)
        hit:    { DEFAULT: '#FFC72C', deep: '#E0A600' },              // logo gold — price & buy CTA only
        chase:  { DEFAULT: '#E8402C' },                               // logo red
        paper:  { DEFAULT: '#F3F5FA', dim: '#C5CCE0' },
        slate:  { DEFAULT: '#8A96B8' },
        mint:   { DEFAULT: '#3DD68C' },                               // in-stock
        gold:   { DEFAULT: '#FFC72C', deep: '#C8860D' },
        ink:    { DEFAULT: '#000000' },
      },
      fontFamily: {
        display: ['"Titan One"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,199,44,.35), 0 0 32px rgba(255,199,44,.35)',
        lift: '0 18px 40px -18px rgba(255,199,44,.45)',
        card: '0 30px 60px -20px rgba(0,0,0,.75)',
      },
      borderRadius: { card: '14px' },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
}
