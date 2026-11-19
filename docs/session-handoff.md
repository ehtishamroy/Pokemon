# TCG HITZ Shopify theme: session handoff

Last updated: 2026-11-19. Paste the "Message for the new session" section into a new Claude Code session to continue.

## Message for the new session

I'm continuing work on the TCG HITZ Shopify theme (Horizon-based) for client Matt. Repo `ehtishamroy/Pokemon`, branch `claude/funny-rubin-bykpre`. Read `docs/session-handoff.md` first.

**How we work**
- Push only to `claude/funny-rubin-bykpre`. No PRs unless I ask. I pull in GitHub Desktop and run `shopify theme push --store=pokemon-emg5m3ur.myshopify.com`.
- I also commit theme-editor changes straight to the branch. ALWAYS `git fetch` and fast-forward before editing, and preserve editor changes in JSON templates. (A past merge left conflict markers and caused "Invalid JSON".)
- Explain first when I ask "explain / is it possible"; build only when I say so.
- Every page uses the homepage style: dark navy, Titan One headings, blue→purple→pink gradients, `tcg-gb` gradient borders, hover lift, `data-hz-reveal` fade-ins.
- Tailwind v3 (`important: true`, `.tcg-scope`, `hz-*` colours). Component CSS goes into `@layer components` in `assets/tailwind-input.css`, then `npm run build:css` → `assets/tcg.css`. The base rule `:where(.tcg-scope) .grid{grid-template-columns:none!important}` means custom grid CSS needs `!important`. Tailwind needs spaces around class names inside Liquid conditionals.
- Commit trailers: `Co-Authored-By: Claude <noreply@anthropic.com>` and `Claude-Session: <session url>`.

**Where we are now (latest pushed commit `4a33277`)**
- Built and live on the branch: homepage, shop/collections, product page (SortSwift description design, full card image), mystery packs, FAQ, Contact, Sell page, Vending Machines page and single machine page (50% profit calculator, 5–6 week lead time, journey), Locations page (Leaflet map) with a "Live Locations" LIVE badge in the header and a teaser on the vending page.
- Just done: the vending machine list is now **2 per row** with bigger cards. The product grid section has a new "Cards per row on desktop" setting (4 / 3 / 2); the vending page uses 2, the homepage stays at 4.
- My commit `d877980 "fixes"` removed the "operator program" section (`sections/tcg-vm-program.liquid`) and its template entries. It still exists in commit `7387783` if I want it back. Ask me before restoring it.
- Matt's 4 requests: (1) hide sold-out products: I was given Shopify Flow steps to do myself (unpublish at 0 stock, republish when back, skip products tagged `always-show`, turn off "Track quantity" on vending machines), no theme code; (2) show the SortSwift "remarks" / SKU; (3) filters "don't work very well"; (4) bigger vending machines: DONE.

**What I'm working on next: SortSwift "remarks" / SKU**
- Matt wants the SortSwift Remarks box (his storage-location code) to show on the website, TCGplayer and eBay, because "that's our SKU number, how we find our cards".
- I sent a screenshot of a column of 7-digit SKUs (e.g. 5595381, 4635460). They look like TCGplayer SKU IDs, but I haven't confirmed which screen it came from (Shopify or SortSwift).
- Still to find out: (a) is that SKU column in Shopify; (b) does the Remarks text reach Shopify at all (SKU field, note, metafield); (c) is the SKU Matt means the TCGplayer number or his own code.
- If it is already in Shopify's SKU field, add an optional "Show SKU" setting (default off) in `sections/tcg_main_product.liquid` showing "SKU: …" and updating with the variant. If the Remarks don't reach Shopify, only SortSwift can fix it. Message to send them: "Can the Remarks field sync to the SKU field (or a note field) on Shopify, eBay and TCGplayer?"
- This cloud session cannot reach my computer or my logged-in SortSwift. To work on SortSwift directly I would need a session on my own computer (Claude Desktop with the built-in browser or Claude in Chrome). I never paste passwords into chat.
- Filters: I still need to know which page and which filter is wrong. Filter values come from the Shopify Search & Discovery app; the panel is `sections/tcg-shop-catalog.liquid`.

**Other open items (do not start unless I ask)**
- Locations map shows "API KEY REQUIRED" with the CARTO dark tiles. Quick fix: theme editor → Map style → "Standard (OpenStreetMap)". A code fix (OSM tiles plus a dark filter) was planned but I did not approve it.
- Confirm the Skate Plaza address and coordinates in the Locations page (approximate now) and remove duplicate Skate Plaza cards.
- Add-on prices, real machine products in Shopify, replacing Pokémon IP imagery, homepage mobile spacing, hiding the conditions accordion for slabs, replacing the merchandise sample cards, real-time stock on the locations map (later, bigger job).
- Domain tcghitz.com is connected. Store publish and SortSwift login checks are pending on Matt's side.

**Technical reference**
- SortSwift data: Type is `<Game> Singles/Sealed`; Vendor is the set; tags carry game, set, rarity; variants are Condition / Language / Printing. Card details live in the description as `<ul><li><strong>Label:</strong> <p>value</p></li>`. Slabs have variant titles like "Grade 10 - CGC 6109439086". Collections are automated rules ("contains", and "Variant's title contains Grade/CGC/PSA/BGS/SGC" for slabs). Mystery packs use the tag `mystery`.
- "Sold out" always showing is a Shopify location setting: the location must "Fulfill online orders".
- Test harness lives in the session scratchpad and is wiped on restart. Rebuild: install `liquidjs` in a scratch folder, render a section's Liquid with the settings from a JSON template, screenshot with Playwright (`require('playwright')` works; Chromium is preinstalled). Theme check via `@shopify/theme-check-node`; baseline is 32 offenses, none from my files.
- Known pre-existing test failures: "all images load" (pikachu avif blocked in the sandbox plus the hero image) and mobile spacing on the homepage.
