@echo off
cd /d "%~dp0"
if not exist assets mkdir assets
echo Downloading TCG HITZ images from Figma...

curl -L -f -s -o "assets\icon-truck.svg" "https://www.figma.com/api/mcp/asset/2a56ff41-19b8-470f-b651-9fa12fefc023/a1432.svg" && echo   ok  icon-truck.svg || echo   FAILED  icon-truck.svg
curl -L -f -s -o "assets\divider-line.svg" "https://www.figma.com/api/mcp/asset/2a56ff41-19b8-470f-b651-9fa12fefc023/929ca.svg" && echo   ok  divider-line.svg || echo   FAILED  divider-line.svg
curl -L -f -s -o "assets\logo.png" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/41460.png" && echo   ok  logo.png || echo   FAILED  logo.png
curl -L -f -s -o "assets\chevron-down.svg" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/d5f0b.svg" && echo   ok  chevron-down.svg || echo   FAILED  chevron-down.svg
curl -L -f -s -o "assets\icon-search.svg" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/a8617.svg" && echo   ok  icon-search.svg || echo   FAILED  icon-search.svg
curl -L -f -s -o "assets\icon-user-mask.svg" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/51437.svg" && echo   ok  icon-user-mask.svg || echo   FAILED  icon-user-mask.svg
curl -L -f -s -o "assets\icon-user.svg" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/09840.svg" && echo   ok  icon-user.svg || echo   FAILED  icon-user.svg
curl -L -f -s -o "assets\icon-cart.svg" "https://www.figma.com/api/mcp/asset/b6b052d9-b917-431e-bfed-a5b04a1c9992/3d10c.svg" && echo   ok  icon-cart.svg || echo   FAILED  icon-cart.svg
curl -L -f -s -o "assets\hero-bg.png" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/cb0e7.png" && echo   ok  hero-bg.png || echo   FAILED  hero-bg.png
curl -L -f -s -o "assets\hero-logo.png" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/b6fa4.png" && echo   ok  hero-logo.png || echo   FAILED  hero-logo.png
curl -L -f -s -o "assets\hero-character.png" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/84dd8.png" && echo   ok  hero-character.png || echo   FAILED  hero-character.png
curl -L -f -s -o "assets\hero-pattern-1.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/d8279.svg" && echo   ok  hero-pattern-1.svg || echo   FAILED  hero-pattern-1.svg
curl -L -f -s -o "assets\hero-pattern-2.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/f96a9.svg" && echo   ok  hero-pattern-2.svg || echo   FAILED  hero-pattern-2.svg
curl -L -f -s -o "assets\dot.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/ad64c.svg" && echo   ok  dot.svg || echo   FAILED  dot.svg
curl -L -f -s -o "assets\arrow-up-right.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/ac6b8.svg" && echo   ok  arrow-up-right.svg || echo   FAILED  arrow-up-right.svg
curl -L -f -s -o "assets\arrow-up-right-outline.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/0bbf3.svg" && echo   ok  arrow-up-right-outline.svg || echo   FAILED  arrow-up-right-outline.svg
curl -L -f -s -o "assets\stars.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/a6eeb.svg" && echo   ok  stars.svg || echo   FAILED  stars.svg
curl -L -f -s -o "assets\hero-glow-1.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/4d319.svg" && echo   ok  hero-glow-1.svg || echo   FAILED  hero-glow-1.svg
curl -L -f -s -o "assets\hero-glow-2.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/6bb37.svg" && echo   ok  hero-glow-2.svg || echo   FAILED  hero-glow-2.svg
curl -L -f -s -o "assets\strip-dot.svg" "https://www.figma.com/api/mcp/asset/b4067f5b-b70b-42a5-9161-e5840694ac9f/ee70d.svg" && echo   ok  strip-dot.svg || echo   FAILED  strip-dot.svg
curl -L -f -s -o "assets\cat-pokemon.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/34e0e.png" && echo   ok  cat-pokemon.png || echo   FAILED  cat-pokemon.png
curl -L -f -s -o "assets\cat-mystery.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/52ba3.png" && echo   ok  cat-mystery.png || echo   FAILED  cat-mystery.png
curl -L -f -s -o "assets\cat-graded.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/08ab1.png" && echo   ok  cat-graded.png || echo   FAILED  cat-graded.png
curl -L -f -s -o "assets\cat-trading.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/c42a2.png" && echo   ok  cat-trading.png || echo   FAILED  cat-trading.png
curl -L -f -s -o "assets\cat-merch.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/e24f7.png" && echo   ok  cat-merch.png || echo   FAILED  cat-merch.png
curl -L -f -s -o "assets\cat-vending.png" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/2654a.png" && echo   ok  cat-vending.png || echo   FAILED  cat-vending.png
curl -L -f -s -o "assets\arrow-up-right-sm.svg" "https://www.figma.com/api/mcp/asset/8872603e-734b-493a-80c2-8a11f04f5f39/535cd.svg" && echo   ok  arrow-up-right-sm.svg || echo   FAILED  arrow-up-right-sm.svg
curl -L -f -s -o "assets\banner-mystery.png" "https://www.figma.com/api/mcp/asset/7795bdaf-b251-4999-ba20-6296be7c7294/0d27c.png" && echo   ok  banner-mystery.png || echo   FAILED  banner-mystery.png
curl -L -f -s -o "assets\glow-a.svg" "https://www.figma.com/api/mcp/asset/2f13bc13-8cef-4bd6-9b21-fed8a755aca0/5b855.svg" && echo   ok  glow-a.svg || echo   FAILED  glow-a.svg
curl -L -f -s -o "assets\glow-b.svg" "https://www.figma.com/api/mcp/asset/3ff7a196-d773-4f21-87e8-a8aab8d7c652/bdf06.svg" && echo   ok  glow-b.svg || echo   FAILED  glow-b.svg
curl -L -f -s -o "assets\glow-c.svg" "https://www.figma.com/api/mcp/asset/d048a1f2-7cab-4eee-aa58-13d410c85f97/def15.svg" && echo   ok  glow-c.svg || echo   FAILED  glow-c.svg
curl -L -f -s -o "assets\glow-d.svg" "https://www.figma.com/api/mcp/asset/7c585812-bd3a-42b7-a576-af26b998334c/be9f1.svg" && echo   ok  glow-d.svg || echo   FAILED  glow-d.svg
curl -L -f -s -o "assets\heart-mask.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/42eae.png" && echo   ok  heart-mask.png || echo   FAILED  heart-mask.png
curl -L -f -s -o "assets\p-umbreon.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/6cd67.png" && echo   ok  p-umbreon.png || echo   FAILED  p-umbreon.png
curl -L -f -s -o "assets\p-booster.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/32c3e.png" && echo   ok  p-booster.png || echo   FAILED  p-booster.png
curl -L -f -s -o "assets\p-charizard.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/2004f.png" && echo   ok  p-charizard.png || echo   FAILED  p-charizard.png
curl -L -f -s -o "assets\p-mystery.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/46815.png" && echo   ok  p-mystery.png || echo   FAILED  p-mystery.png
curl -L -f -s -o "assets\p-etb.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/3c7e1.png" && echo   ok  p-etb.png || echo   FAILED  p-etb.png
curl -L -f -s -o "assets\p-promo.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/7166f.png" && echo   ok  p-promo.png || echo   FAILED  p-promo.png
curl -L -f -s -o "assets\p-onepiece.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/76b93.png" && echo   ok  p-onepiece.png || echo   FAILED  p-onepiece.png
curl -L -f -s -o "assets\p-sleeves.png" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/36a15.png" && echo   ok  p-sleeves.png || echo   FAILED  p-sleeves.png
curl -L -f -s -o "assets\arrow-up-right-xs.svg" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/133ba.svg" && echo   ok  arrow-up-right-xs.svg || echo   FAILED  arrow-up-right-xs.svg
curl -L -f -s -o "assets\icon-cart-sm.svg" "https://www.figma.com/api/mcp/asset/2619bc89-e86d-40b1-9207-3a2545e24237/7c474.svg" && echo   ok  icon-cart-sm.svg || echo   FAILED  icon-cart-sm.svg
curl -L -f -s -o "assets\vending.png" "https://www.figma.com/api/mcp/asset/8b0fa5ed-d7bd-4b83-ab0e-699d08d764ca/e53d9.png" && echo   ok  vending.png || echo   FAILED  vending.png
curl -L -f -s -o "assets\play-mask.png" "https://www.figma.com/api/mcp/asset/8b0fa5ed-d7bd-4b83-ab0e-699d08d764ca/e2b55.png" && echo   ok  play-mask.png || echo   FAILED  play-mask.png
curl -L -f -s -o "assets\icon-machine.svg" "https://www.figma.com/api/mcp/asset/8b0fa5ed-d7bd-4b83-ab0e-699d08d764ca/a6cea.svg" && echo   ok  icon-machine.svg || echo   FAILED  icon-machine.svg
curl -L -f -s -o "assets\icon-customize.svg" "https://www.figma.com/api/mcp/asset/8b0fa5ed-d7bd-4b83-ab0e-699d08d764ca/ce517.svg" && echo   ok  icon-customize.svg || echo   FAILED  icon-customize.svg
curl -L -f -s -o "assets\icon-payment.svg" "https://www.figma.com/api/mcp/asset/8b0fa5ed-d7bd-4b83-ab0e-699d08d764ca/ed9b8.svg" && echo   ok  icon-payment.svg || echo   FAILED  icon-payment.svg
curl -L -f -s -o "assets\merch-figures.png" "https://www.figma.com/api/mcp/asset/915916f0-a6bb-4a5d-b1ef-458e350562c6/c1e90.png" && echo   ok  merch-figures.png || echo   FAILED  merch-figures.png
curl -L -f -s -o "assets\merch-glow-1.svg" "https://www.figma.com/api/mcp/asset/915916f0-a6bb-4a5d-b1ef-458e350562c6/9f53c.svg" && echo   ok  merch-glow-1.svg || echo   FAILED  merch-glow-1.svg
curl -L -f -s -o "assets\merch-glow-2.svg" "https://www.figma.com/api/mcp/asset/915916f0-a6bb-4a5d-b1ef-458e350562c6/398b7.svg" && echo   ok  merch-glow-2.svg || echo   FAILED  merch-glow-2.svg
curl -L -f -s -o "assets\merch-glow-3.svg" "https://www.figma.com/api/mcp/asset/915916f0-a6bb-4a5d-b1ef-458e350562c6/f5e60.svg" && echo   ok  merch-glow-3.svg || echo   FAILED  merch-glow-3.svg
curl -L -f -s -o "assets\merch-glow-4.svg" "https://www.figma.com/api/mcp/asset/915916f0-a6bb-4a5d-b1ef-458e350562c6/580de.svg" && echo   ok  merch-glow-4.svg || echo   FAILED  merch-glow-4.svg
curl -L -f -s -o "assets\icon-world.svg" "https://www.figma.com/api/mcp/asset/17345ac9-5051-4e17-a229-5f5fe8a11903/38cb6.svg" && echo   ok  icon-world.svg || echo   FAILED  icon-world.svg
curl -L -f -s -o "assets\icon-discover.svg" "https://www.figma.com/api/mcp/asset/17345ac9-5051-4e17-a229-5f5fe8a11903/459c8.svg" && echo   ok  icon-discover.svg || echo   FAILED  icon-discover.svg
curl -L -f -s -o "assets\icon-beyond.svg" "https://www.figma.com/api/mcp/asset/17345ac9-5051-4e17-a229-5f5fe8a11903/d293c.svg" && echo   ok  icon-beyond.svg || echo   FAILED  icon-beyond.svg
curl -L -f -s -o "assets\banner-cta.png" "https://www.figma.com/api/mcp/asset/c3e8f382-3eeb-4c51-b68c-4f15d1dbb03c/3cba2.png" && echo   ok  banner-cta.png || echo   FAILED  banner-cta.png
curl -L -f -s -o "assets\gallery-1.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/16aeb.png" && echo   ok  gallery-1.png || echo   FAILED  gallery-1.png
curl -L -f -s -o "assets\gallery-2.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/39538.png" && echo   ok  gallery-2.png || echo   FAILED  gallery-2.png
curl -L -f -s -o "assets\gallery-3.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/e53d9.png" && echo   ok  gallery-3.png || echo   FAILED  gallery-3.png
curl -L -f -s -o "assets\gallery-4.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/df4af.png" && echo   ok  gallery-4.png || echo   FAILED  gallery-4.png
curl -L -f -s -o "assets\gallery-5.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/21696.png" && echo   ok  gallery-5.png || echo   FAILED  gallery-5.png
curl -L -f -s -o "assets\gallery-6.png" "https://www.figma.com/api/mcp/asset/0f62040d-5a0b-4c81-a664-8a31f2efe25c/00bbe.png" && echo   ok  gallery-6.png || echo   FAILED  gallery-6.png
curl -L -f -s -o "assets\community.png" "https://www.figma.com/api/mcp/asset/a38bc98a-98b7-48a2-b599-14ee112920d5/606f0.png" && echo   ok  community.png || echo   FAILED  community.png
curl -L -f -s -o "assets\social-facebook.png" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/47c3f.png" && echo   ok  social-facebook.png || echo   FAILED  social-facebook.png
curl -L -f -s -o "assets\social-x.png" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/d02a3.png" && echo   ok  social-x.png || echo   FAILED  social-x.png
curl -L -f -s -o "assets\social-instagram.png" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/5c1de.png" && echo   ok  social-instagram.png || echo   FAILED  social-instagram.png
curl -L -f -s -o "assets\social-linkedin.png" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/0b671.png" && echo   ok  social-linkedin.png || echo   FAILED  social-linkedin.png
curl -L -f -s -o "assets\icon-phone.svg" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/76ce3.svg" && echo   ok  icon-phone.svg || echo   FAILED  icon-phone.svg
curl -L -f -s -o "assets\icon-mail.svg" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/c4c08.svg" && echo   ok  icon-mail.svg || echo   FAILED  icon-mail.svg
curl -L -f -s -o "assets\icon-location.svg" "https://www.figma.com/api/mcp/asset/80eca6dd-36c8-4099-a56f-6775ecfd9eea/4b263.svg" && echo   ok  icon-location.svg || echo   FAILED  icon-location.svg

echo.
echo Done. Open index.html in your browser.
pause
