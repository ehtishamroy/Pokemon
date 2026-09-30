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
        // Palette follows the logo + vending-machine wrap: electric-blue lightning on
        // one side, orange/red fire on the other, purple where they collide.
        felt:   { DEFAULT: '#05060D', 2: '#0C0E18', 3: '#161926' },   // blue-black surfaces
        volt:   { DEFAULT: '#4DA8FF', glow: '#3EC1FF', deep: '#1446D9' }, // accents, prices, borders, focus
        blaze:  { DEFAULT: '#FF6A1A', hot: '#FF9A2E', deep: '#E8292C' },  // fire: CTAs, stars, hot badges
        arc:    { DEFAULT: '#8B3DFF', magenta: '#C13CFF' },           // collision colour (gradients/glows)
        glow:   { DEFAULT: '#3EC1FF', dim: '#1446D9' },
        chase:  { DEFAULT: '#E8402C' },                               // logo red
        paper:  { DEFAULT: '#F3F5FA', dim: '#C5CCE0' },
        slate:  { DEFAULT: '#8A96B8' },
        mint:   { DEFAULT: '#3DD68C' },                               // in-stock
        ink:    { DEFAULT: '#06070F' },
      },
      fontFamily: {
        display: ['"Titan One"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(77,168,255,.35), 0 0 32px rgba(62,193,255,.35)',
        lift: '0 18px 40px -18px rgba(77,168,255,.45)',
        fire: '0 10px 28px -8px rgba(255,90,26,.6), 0 0 24px rgba(255,106,26,.35)',
        card: '0 30px 60px -20px rgba(0,0,0,.75)',
      },
      borderRadius: { card: '14px' },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
}
