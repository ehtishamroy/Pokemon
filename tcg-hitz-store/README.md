# TCG Hitz — storefront (Tailwind HTML → Shopify Liquid)

Open `index.html` in a browser. Everything is static HTML + Tailwind (CDN) + one small JS file.

## Files
```
index.html              Home — hero (3D tilt featured card), this week's pulls, 3 categories, trust, sell/shows, newsletter
collection.html         Shop — filters, sort, product grid, pagination, category banners
product.html            Single card — tilt gallery + real-photo thumbs, printing/condition selector, qty, cart, details, condition guide, other versions, Q&A
assets/tailwind.config.js   Brand tokens (colors, fonts, shadows) — loads after the Tailwind CDN
assets/app.css          Felt background, glowing sign, holographic tilt card, tiles, drawer, focus, reduced-motion
assets/app.js           Tilt effect, cart drawer (in-memory demo), mobile nav, variant/qty picker, collection filters
assets/logo.png         Client logo (transparent, cleaned)
assets/*.jpg            Client's in-store photos
assets/card-back.svg    Branded placeholder for cards that don't have a real photo yet
```

## Design tokens (from the physical store)
| Token | Hex | Where it's used |
|---|---|---|
| felt / felt-2 / felt-3 | #0E1530 / #141C3A / #1B2448 | page, panels, hover |
| glow | #3EC1FF | LED sign glow, links, focus rings, filters |
| hit | #FFC72C | prices and the buy CTA only |
| chase | #E8402C | destructive / remove |
| paper / paper-dim / slate | #F3F5FA / #C5CCE0 / #8A96B8 | text hierarchy |
| mint | #3DD68C | in-stock |

Fonts: **Titan One** (display) + **Manrope** (UI). Loaded from Google Fonts.

## The 3D tilt card (the reference-store effect)
```html
<div class="holo" data-tilt="14">
  <div class="holo__card">
    <img src="{{ product.featured_image | image_url: width: 900 }}" alt="{{ product.title }}">
    <span class="holo__glare"></span>
    <span class="holo__rainbow"></span>
  </div>
</div>
```
`data-tilt` = max degrees. JS sets `--rx/--ry` (rotation) and `--mx/--my` (glare position). Idle float runs until first hover. Fully disabled under `prefers-reduced-motion`.

## Liquid conversion map
Every HTML block is labelled with an HTML comment naming its Shopify home. Summary:

| HTML block | Shopify file |
|---|---|
| announcement bar | `sections/announcement-bar.liquid` |
| header / nav / search / cart icon | `sections/header.liquid` |
| hero | `sections/hero-featured-pull.liquid` (add a `product` picker setting for the featured card) |
| product tile | `snippets/product-tile.liquid` — loop `{% for product in collection.products %}` |
| this week's pulls | `sections/featured-collection.liquid` |
| three categories | `sections/collection-list.liquid` |
| trust / sell / shows / newsletter | one section each, or blocks in a `sections/home-blocks.liquid` |
| collection filters | Shopify Search & Discovery app filters; keep `data-filter` names as the filter handles |
| product page | `sections/main-product.liquid` (`product.variants` → the printing/condition rows; `product.media` → thumbnails) |
| card details | `product.metafields.card.set / number / rarity / language` |
| condition guide | `snippets/condition-guide.liquid` |
| other versions | `sections/related-products.liquid` (Search & Discovery recommendations) |
| cart drawer | `snippets/cart-drawer.liquid`; replace `Cart.add()` with `fetch('/cart/add.js')` and `Cart.render()` with `fetch('/cart.js')` |

## Three things Matt still needs to supply
1. A **vending-machine photo** (the home tile currently shows a placeholder icon).
2. **Real card photos** — SortSwift adds these at listing time; `card-back.svg` is only a stand-in.
3. **Card-show dates** and the buylist link for the "Sell to us" / "Find us" blocks.


## V2 update — full Pokémon store (machine skin)
New direction from Matt (liked ZardoCards / Poke-Collect; keep logo; background takes the shape of his machines).
- **Machine "cabinet" skin**: deep black + ornate gold frame (`.cabinet`), warm gold glow, neon holo accents. Tokens added: `ink`, `gold`/`gold-deep`. See the V2 block in `app.css`.
- **New home structure**: marquee bar, mega-menu (Cards), category grid, product **rails** (horizontal carousels), **Mystery packs** feature, **Vending Machines** feature (real machine photo) → dedicated page, **Merchandise** (renamed from 3D prints), reviews wall, sell-to-us, newsletter.
- **New page**: `vending-machines.html` (hero, features, real-photo gallery, enquiry form).
- **Renames**: "3D prints" → "Merchandise" everywhere; vending nav now links to its own page.
- **Machine photos**: `machine-graffiti.jpg` (real machine at a show), `machine-booth.jpg`, `machine-premium.jpg` (gold "Chase the Rare" render) — from Matt's own photos.

Liquid mapping is unchanged in shape: sections/announcement-bar, header (with mega-menu block), featured-collection (rails), collection-list (categories), plus a new `sections/vending-feature.liquid` and a `page.vending.liquid` template.


## V3 update — Zardo-style cinematic (client picked the black/gold reference)
Matt shared ZardoCards + Poke-Collect screenshots and said "I like the black one."
- **Gold-smoke hero** (`.smoke`) — atmospheric gold haze fading to black, big "CHASE THE RARE" display headline, star rating line, dual CTAs, centered search below, and brand tiles (Pokémon / Magic / One Piece — the three games on his machines).
- **Big centered section titles** (`.stitle`) with white→gold gradient + gold diamond divider (`.rule-gold`).
- **Carousels with edge arrows** (`.carousel` + `.rail`, arrows wired in app.js) for Bestsellers.
- **Product cells** (`.cell`) — card image floats on black with drop shadow, centered name/set/price, ADD pill. Card-shaped 5:7 frame, badge support ("Only 1 left", "PSA 10").
- **Most Popular** wide category cards with darkened photos (`.wcat`).
- **New sections**: Just Landed grid + LOAD MORE, Why collectors trust us (3 boxes), #HitzFamily social rail, FAQ accordion (`.faq`), centered newsletter in a cabinet.
- `html, body { overflow-x:hidden }` added so the off-canvas cart drawer can't cause horizontal scroll.


## V4 — complete site, every link works
**Pages** (9): `index` · `collection` · `product` · `merchandise` · `vending-machines` · `sell` · `cart` · `checkout` · `policies`

New in this pass:
- **cart.html** — full cart page: line items with thumbnails, qty steppers, remove, empty-cart state, sticky order summary (subtotal / shipping / taxes / total), Continue shopping, Empty cart, Checkout, plus a "You might also chase" row.
- **checkout.html** — stub that carries the total; on the live store replace with Shopify `/checkout`.
- **merchandise.html** — its own page (was only a home section): category tiles + *Printed by TCG Hitz* (3D prints), *Plush & figures*, *Supplies & storage*, and a custom-print CTA.
- **sell.html** — hero, 4-step "How it works", What we buy / what we don't, full offer form (name, email, type, details, payment preference), and an in-person CTA.
- **policies.html** — Shipping, Refunds, Condition guide and a working Contact form, all anchor-linked from the footer.

Plumbing:
- **Cart persists across pages** via `sessionStorage` (`Cart.load()/save()`). Swap for `fetch('/cart.js')` + `fetch('/cart/add.js')` in Liquid.
- **Shared chrome** — identical header/mega-menu/footer/drawer on all 9 pages, generated by `build_pages.py`.
- **Collection filtering by URL**: `collection.html?f=mystery|slabs|sealed` filters tiles via `data-cat` and updates the heading.
- **Link audit passes**: 0 dead links, 0 broken anchors, 0 bare `#` placeholders.
- Legacy `hit`/`glow` classes unified to the `gold` token.


## V5 — product page restyled to match the home page
Rebuilt `product.html` in the same machine/gold skin (it was still on the earlier blue "felt" styling):
- Gallery sits in a **gold `.cabinet`** with the 3D tilt card and gold-ringed thumbnails.
- Price is a **gold display number**; rarity shown as a gold eyebrow with a dot.
- **Variant rows** are full-width cabinet-style buttons showing printing · condition · language, stock underneath, price on the right; the selected one gets a gold ring.
- Trust items, card-detail metafields and the condition guide all use `.cabinet` / `.rule-gold`.
- "Other versions" uses the same **`.cell`** component as the home carousels, under a centered **`.stitle`**.
- Q&A moved into a cabinet panel.
- Fixed: `app.js` was still applying the old blue `ring-glow` to the selected variant — now `ring-gold`.

Verified in-browser: variant switching updates price/stock/label and the add-to-cart payload, quantity feeds the cart (3 × $109 = $327), thumbnails swap the tilting image, no JS errors.


## V6 — collection page restyled (all pages now consistent)
Rebuilt `collection.html` in the machine/gold skin:
- Smoke header band with breadcrumb, display title, live result count and a gold filter-note ("← All cards") when a URL filter is active.
- **Filter sidebar in a gold `.cabinet`** — RARITY / CONDITION / SET / PRICE facets with gold legends, separated by `.rule-gold`, sticky on desktop, toggled by a Filters button on mobile.
- Grid uses the shared **`.cell`** component (card floats on black, badges for "Only 1 left" / "PSA 10" / "PSA 9" / "Hot").
- Catalogue expanded to **14 products across 4 categories** so the `?f=` filters return real results: 8 singles, 3 mystery, 2 slabs, 2 sealed (one item counts in two facets).
- Gold pagination and a "Shop the rest of the store" `.wcat` row linking mystery, slabs, merchandise and vending machines.

Verified: facet filtering (condition=graded → 3), clear-all restores 14, sort low→high starts at $0.75 and high→low at $1,450, `?f=` filters return 3/2/2 with correct headings, add-to-cart works, no JS errors.

**Design system is now consistent across all 9 pages** — `.cabinet`, `.cell`, `.stitle`, `.rule-gold`, `.wcat`, `.smoke`, `.holo` on the gold-on-ink palette.
