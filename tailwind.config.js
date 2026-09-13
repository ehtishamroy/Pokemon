/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    extend: {
      colors: {
        felt:   { DEFAULT: '#0E1530', 2: '#141C3A', 3: '#1B2448' },   // black-felt backdrop tones
        glow:   { DEFAULT: '#3EC1FF', dim: '#1E7FB3' },               // LED edge-lit acrylic blue
        hit:    { DEFAULT: '#FFC72C', deep: '#E0A600' },              // logo gold — price & buy CTA only
        chase:  { DEFAULT: '#E8402C' },                               // logo red
        paper:  { DEFAULT: '#F3F5FA', dim: '#C5CCE0' },
        slate:  { DEFAULT: '#8A96B8' },
        mint:   { DEFAULT: '#3DD68C' },                               // in-stock
        gold:   { DEFAULT: '#FFC72C', deep: '#C8860D' },
        ink:    { DEFAULT: '#09090F' },
      },
      fontFamily: {
        display: ['"Titan One"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(62,193,255,.35), 0 0 32px rgba(62,193,255,.35)',
        lift: '0 18px 40px -18px rgba(62,193,255,.45)',
        card: '0 30px 60px -20px rgba(0,0,0,.75)',
      },
      borderRadius: { card: '14px' },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
}
