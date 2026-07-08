# Owner Data TODO — confirm before production launch

Placeholder data is used during development and is clearly marked in the content files with
`// TODO(owner): confirm ...`. Each item below must be delivered (or explicitly accepted as a
placeholder) before the production launch (plan M7.2). **Geography rule: Villa de Álvarez, Colima.
This is a portfolio demo (fictional brand), not the original client's real business — do not
reintroduce the retired brand's Jalisco/Ciudad Guzmán geography.**

## Hard blockers (premium quality)
- [ ] **Photo licensing + pro shoot** — food, interior, event-catering gallery, hero source.
      Current Facebook photos have uncertain licensing and harsh quality. Blocks the gallery and a
      quality hero video/3D source. (plan Prereq #4)
- [ ] **Hi-res / vector logo (SVG preferred)** + hi-res hero source image. (plan Prereq #5)

## Content data
- [ ] **Authoritative current price list** per category (tacos, tortas, órdenes, bebidas, extras)
      + who signs off on changes. Placeholder = spec reference prices. (Prereq #1)
- [ ] **Branch data ×3** (Matriz Av. 1° de Mayo, Portal del Centro, "De Pasadita"): exact address,
      hours, rest day, phone, WhatsApp, Google Maps URL + **lat/lng coords** (needed for JSON-LD
      `geo`; no fake coordinates are emitted until provided). (Prereq #2)
- [ ] **Contact channels:** confirm order phones (312 145 9820 / +52 1 312 198 4471), WhatsApp
      number(s), Facebook page URL, Instagram `@tacosdonrefugio`. (Prereq #3)
- [ ] **Avisos** — confirm any current real announcements; verify each `branchId` matches a real
      branch id.
- [ ] **Domain** (`tacosdonrefugio.com` / `.com.mx`?) — sets `NEXT_PUBLIC_SITE_URL`, canonical, OG. (Prereq #6)

## Creative (optional / fast-follow)
- [ ] **3D hero creative direction + asset budget** — the floating-antojo scene, neon, model.
      Not required for launch: ship the tier-2 video / tier-3 static hero first. (Prereq #7)

## QA records
- [ ] **WebGL-disabled Chrome test** (plan M5.5) — record steps + result here.
