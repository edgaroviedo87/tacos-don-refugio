# Tacos Don Refugio — Phase 1 Implementation Plan

**Project:** Tacos Don Refugio ("El Placer del Sabor") — informational marketing website.
**Location of business:** Villa de Álvarez, Colima, Mexico. (Historical note: earlier revisions of
this plan were written for a different, real prospective client in Ciudad Guzmán, Jalisco; that
geography is retired.)
**Document type:** Task-by-task implementation plan (executes `docs/spec.md` + `docs/brand-visual-direction.md` + `.agents/product-marketing.md`).
**Owner:** RigidCode / Edgar Oviedo
**Date:** 2026-06-26
**Status:** Draft for owner approval

> This plan does not introduce decisions that contradict the approved spec. Where the spec is silent
> (the new **Avisos** content type, the **Gallery** content type), it extends the spec's existing
> patterns (typed data file + Zod schema + `get*()` seam, integer-money discipline). Everything in
> code and docs is in English; only user-facing copy examples are in Spanish.

---

## 1. Overview & Guardrails

### 1.1 Goal

Ship a fast, flashy, mobile-first **informational** website that showcases the brand (WebGL hero with
a bulletproof fallback chain), presents an easy-to-edit menu, posts dated announcements (avisos),
shows an event-catering gallery, lists the 3 branches, drives phone/WhatsApp/maps conversions, and
**dominates local search** for Villa de Álvarez.

### 1.2 Scope (Phase 1 — what we build)

Three editable content blocks, each behind the typed-data-file + `get*()` seam so Phase 2 swaps the
implementation, not the callers:

1. **Menu** — tacos, tortas, órdenes (+ bebidas/extras). Frequently-changing prices, integer centavos,
   `pricesDisclaimer` ("Precios sujetos a cambio") + `updatedAt`.
2. **Avisos (announcements)** — dated notices with `startsAt`/`endsAt` so they auto show/hide. New
   content type; Zod model designed analogous to the menu model. New `getAvisos()` seam.
3. **Gallery** — photos focused on **event catering** ("eventos").

Plus: hero, sobre nosotros, sucursales (3 branches), contacto/footer, full technical + content SEO,
sitemap/robots, structured data, analytics, deploy to Vercel.

### 1.3 Non-goals (explicit — protect scope)

- **NO** online ordering, cart, checkout, or payments.
- **NO** auth / user accounts / login.
- **NO** database, backend, CMS, or admin UI.
- **NO** server-side contact form (conversions are `tel:`, `wa.me`, social, maps link-outs).
- **NO** multi-language (Spanish-only UI; i18n not designed now but content structure does not block it).
- **NO** e-commerce legal/tax/CFDI work (Phase 3 concern).
- **NEVER** target or mention the retired brand's "Jalisco"/"Ciudad Guzmán" anywhere (keywords, copy, metadata, schema, alt text).

### 1.4 Success criteria (from spec §1.4)

- Lighthouse mobile: **Performance ≥ 90, Accessibility ≥ 95, SEO 100, Best Practices ≥ 95**.
- **LCP < 2.5s** on mid-range Android over 4G; **CLS < 0.1**; **INP < 200ms**.
- Hero renders something high-quality on **every** device/browser, including **WebGL-disabled Chrome**,
  with zero UX-affecting console errors. The static hero frame is the LCP element; 3D never blocks LCP.
- Owner hands a developer a price change and it ships in minutes via **one typed file**.
- All NAP data (name/address/phone) consistent across site, JSON-LD, and the owner's Google Business Profiles.

### 1.5 Information Architecture & Routing (multi-page for crawlers, single-page feel for humans)

**Decision:** a **multi-page App Router architecture with real, indexable routes** where they add SEO
value, made to **feel like one continuous single-page site** for humans. This extends the spec §6
direction (single-page-first + a few real routes for SEO depth) into a fuller multi-page IA — consistent
with, not a departure from, the approved spec.

**Real, indexable routes (each with its own metadata, canonical, and structured data):**

| Route | Purpose | Per-route metadata | Structured data |
|---|---|---|---|
| `/` (home) | Hero → Sobre Nosotros → **Menú preview** → Sucursales → Avisos → Galería → Contacto → Footer; all sections are anchor targets (`#menu`, `#sucursales`, …) | Home title/description targeting "tacos Villa de Álvarez" | Organization + all-branches summary |
| `/menu` | Full menu page (categorized), shareable, SEO | "menú / tortas / tacos Villa de Álvarez" | **Menu / MenuItem** JSON-LD |
| `/sucursales` | All 3 branches overview | "sucursales / taquería Villa de Álvarez" | `ItemList` of branches |
| `/sucursales/[id]` | Per-branch page (strongest local SEO, shareable) | per-branch name + locality | **per-branch LocalBusiness/Restaurant** JSON-LD |
| `/avisos` | Dated announcements archive — **build as a route only if it adds indexable value** (price-update / event notices worth crawling); otherwise avisos stay a home section only | "avisos / promociones" | Optional |
| `/galeria` | Event-catering gallery — **build as a route only if it adds indexable value** (catering is a real discovery query); otherwise home section only | "eventos / catering Villa de Álvarez" | Optional `ImageGallery` |

**Single-page impression (required UX):**
- **Soft navigation** via App Router `<Link>` (client-side, no full reloads).
- **View Transitions API** for smooth animated route transitions (Next.js `experimental.viewTransition` /
  the `<ViewTransition>` boundary, with the CSS `@view-transition` path where supported). This is
  **progressive enhancement** — navigation must work fully if View Transitions are unsupported.
- **Persistent sticky header/nav + shared `layout.tsx`** so chrome never re-mounts; navigation feels seamless.
- Home presents the key sections with **anchor scrolling**; dedicated routes provide SEO depth + shareable URLs.
- **No visual page-reload flash**; preserve scroll/transition continuity.

> Net: real multi-page for crawlers, single-page impression for humans. `/avisos` and `/galeria` become
> routes only if they earn indexable SEO value; if not, they remain home sections. The content domain
> layer is identical either way, so the decision is cheap and reversible.

---

## 2. Prerequisites / Open Data Dependencies

Development is **not blocked** by missing real data. Every unknown ships behind a clearly-marked
placeholder in the content/data files (Zod-validated), flagged with `// TODO(owner): confirm …` and a
central `docs/data-todo.md` checklist. We swap placeholders for real values when the owner delivers them.

| # | Needed from owner | Blocks (hard?) | Placeholder strategy until delivered |
|---|---|---|---|
| 1 | **Authoritative current price list** per category + who signs off changes | Menu accuracy (soft) | Use spec reference prices (taco $17, orden de 5 $80, quesadilla $80, mulita $100, torta $95) as `priceCents` placeholders; show `updatedAt` + `pricesDisclaimer`. |
| 2 | **Exact branch data** ×3 (Matriz Av. 1° de Mayo, Portal del Centro, "De Pasadita"): full address, hours, rest day, phone, WhatsApp, **Google Maps URL + lat/lng coords** | JSON-LD `geo`, "Cómo llegar" (soft) | Placeholder addresses/coords for Villa de Álvarez center, marked TODO. JSON-LD omits `geo` if coords absent (no fake coords). |
| 3 | **Contact channels:** order phones (312 145 9820 / +52 1 312 198 4471), WhatsApp number(s), Facebook page URL, confirm Instagram `@tacosdonrefugio` | CTAs (soft) | Use the two phone numbers from product-marketing.md; mark WhatsApp/FB as TODO. |
| 4 | **Photo licensing + pro shoot** (food, interior, event-catering gallery, hero source) — current FB photos have uncertain licensing and harsh quality | **Gallery + hero video/3D quality (HARD)** | Gallery ships with a small set of confirmed-owned/placeholder images behind a "próximamente" empty state if none cleared. Hero uses a CSS-gradient + branded static placeholder until a licensed hero frame exists. |
| 5 | **Hi-res / vector logo (SVG preferred)** + hi-res hero source | Hero/print quality (soft→hard for premium) | Use existing `logo.png`; mark TODO to replace with SVG. |
| 6 | **Domain** (`tacosdonrefugio.com` / `.com.mx`) | Canonical URLs, OG, DNS (soft) | Use the Vercel preview URL as `SITE_URL` env var; single change swaps to the real domain. |
| 7 | **3D hero creative direction + asset budget** (the floating-antojo scene, neon, model) | Full 3D tier (soft — fallback covers it) | Ship tier-2 (video) or tier-3 (static) first; 3D is additive and swap-free (see §6, M5, Risks). |

**Action:** Send the owner this list (items 1–6) at kickoff. Items 4 and 5 are the only true premium
blockers and should be commissioned in parallel with the build.

---

## 3. Task-by-Task Breakdown

Checkboxes track progress. Each task lists a description, the concrete **file map** (paths under the
spec's `src/` structure), and **verification criteria**. File paths are repo-relative to
`C:\Repos\tacosvalente`.

> Conventions used throughout: TypeScript **strict**; pnpm; path alias `@/*` → `src/*`; one
> class/interface per file where applicable; domain layer (`src/domain/`) has **zero** framework
> imports so it can become `packages/core` later (spec §7).

---

### M0 — Scaffold & Tooling

- [x] **M0.1 — Initialize Next.js App Router app (pnpm, TS strict, Tailwind v4)**
  - Description: Scaffold the Next.js (App Router) app on Node 24 with pnpm, TypeScript strict,
    ESLint, and Tailwind CSS v4. Confirm Turbopack dev. No `src/` clutter beyond the spec layout.
  - Files: `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json` (strict + `@/*` alias),
    `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`,
    `src/app/globals.css`, `.nvmrc` (Node 24).
  - Verify: `pnpm install` clean; `pnpm dev` serves `/`; `pnpm build` passes; `pnpm tsc --noEmit` clean;
    `tsconfig.json` has `"strict": true`.

- [x] **M0.2 — Tailwind v4 setup (CSS-first config)**
  - Description: Tailwind v4 is configured via CSS (`@import "tailwindcss"` + `@theme`) rather than a
    JS config. Wire the brand tokens here in M1; this task only establishes the v4 plumbing and confirms
    utilities compile. (Tailwind v4 specific — see Risks.)
  - Files: `src/app/globals.css` (`@import "tailwindcss"`), `postcss.config.mjs` (`@tailwindcss/postcss`).
  - Verify: a test utility class (e.g. `bg-red-500`) renders; production CSS is small; no `tailwind.config.js`
    needed unless a plugin requires it.

- [x] **M0.3 — Project conventions, scripts, env, and docs**
  - Description: Add npm scripts (`dev`, `build`, `start`, `lint`, `typecheck`, `format`), Prettier,
    an `.env.example` with `NEXT_PUBLIC_SITE_URL`, and `docs/data-todo.md` for owner placeholders.
  - Files: `package.json` (scripts), `.prettierrc`, `.env.example`, `docs/data-todo.md`, `README.md`.
  - Verify: `pnpm lint`, `pnpm typecheck`, `pnpm format --check` all run; `.env.example` documents `NEXT_PUBLIC_SITE_URL`.

- [x] **M0.4 — Directory skeleton matching spec §7**
  - Description: Create the empty folder structure so later tasks drop into place: `src/app`,
    `src/components/{hero,sections,ui}`, `src/content`, `src/lib/{content,webgl,utils,seo}`,
    `src/domain`, `public/{images,video,models}`.
  - Files: the folders above (with `.gitkeep` where empty).
  - Verify: tree matches spec §7; `src/domain` has no imports from `next`/`react` (enforced by an ESLint
    `no-restricted-imports` rule scoped to `src/domain/**`).

---

### M1 — Design Tokens, Fonts & Layout Shell

- [x] **M1.1 — Brand design tokens as CSS variables (from brand-visual-direction §1)**
  - Description: Encode the full color system as CSS custom properties in `@theme` / `:root`: brand
    primitives (`green-500 #1E8A3C`, `red-500 #E8431F`, `gold-500 #F2B705`, `brown-900 #2B2118`,
    `cream-50 #FBF7F0`), **accessible action variants** (`green-700 #15692C`, `red-600 #C2371A`), warm
    neutral ramp, warm-dark wood ramp (`wood-950…wood-700`, `text-on-dark`), and **separate** semantic
    tokens (`success/warning/error/info`). Map semantic aliases per §1.6 (`color-primary`, `color-cta`,
    `color-surface-inverse`, etc.). Add warm-tinted (brown-based) shadow scale and radii (buttons 8px,
    cards 16px, images 12px, pills 999px).
  - Files: `src/app/globals.css` (token layer), `src/lib/utils/tokens.ts` (optional typed token names).
  - Verify: tokens render; spot-check contrast: body text uses `neutral-900`/`green-700`/`red-600`
    (all ≥ AA); `gold-500` never used as text on light. Brand and semantic color groups are visually
    distinct in code (separate `@theme` blocks/comments).

- [x] **M1.2 — Fonts via next/font (Anton, Oswald, Nunito, Pacifico)**
  - Description: Self-host the four Google Fonts with `next/font/google`. Subset `latin` + `latin-ext`
    (Spanish accents + ¡¿), `display: "swap"`. **Preload Anton + Nunito** (always-visible); lazy-load
    Pacifico and Oswald as needed. Expose via CSS variables (`--font-display`, `--font-heading`,
    `--font-body`, `--font-script`) wired into the type scale.
  - Files: `src/app/fonts.ts` (or inline in `layout.tsx`), `src/app/layout.tsx`, `src/app/globals.css`
    (type-scale utilities: Display/H1–H4/Body-L/Body/Small/Eyebrow/Price per brand §2).
  - Verify: Network panel shows self-hosted woff2, no requests to fonts.googleapis.com; Spanish glyphs
    (á é í ó ú ñ ¡ ¿) render in all four; **CLS contribution from fonts ≈ 0** (check in Lighthouse).

- [x] **M1.3 — Persistent layout shell: sticky header, mobile nav, footer, floating WhatsApp**
  - Description: Build the global chrome in the **shared root `layout.tsx`** so it persists across every
    route and never re-mounts on navigation (key to the single-page feel). Sticky header (logo + nav that
    mixes **route links** (`/menu`, `/sucursales`) and **home anchors** (`#avisos`, `#galeria`,
    `#contacto`) + prominent WhatsApp/Llamar CTA), accessible mobile hamburger (Radix/shadcn primitive),
    "scroll to top", floating WhatsApp button. Nav uses App Router `<Link>` (soft nav, no full reload)
    with active-route highlighting. Semantic landmarks (`<header>`, `<main>`, `<nav aria-label>`, `<footer>`).
  - Files: `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/NavLinks.tsx`,
    `src/components/layout/MobileNav.tsx`, `src/components/layout/Footer.tsx`,
    `src/components/layout/FloatingWhatsApp.tsx`, `src/components/layout/ScrollToTop.tsx`,
    `src/components/ui/` (shadcn primitives as needed).
  - Verify: keyboard-only navigation works (focus visible, hamburger trap + Escape closes); navigating to
    `/menu` and back is a **soft client navigation** (no full reload, header does not flash/re-mount);
    anchors scroll to sections; header `position: sticky` with no CLS; floating button has `aria-label`.

- [x] **M1.4 — Soft navigation + View Transitions (single-page impression)**
  - Description: Enable smooth, flash-free route transitions. Turn on Next.js View Transitions
    (`experimental.viewTransition` in `next.config.ts`) and wrap shared/animated regions with a
    `<ViewTransition>` boundary (and/or CSS `@view-transition` for cross-document where applicable). Define
    restrained transition styling (fade/slide consistent with brand motion; honor `prefers-reduced-motion`
    → no animation). **Progressive enhancement:** if View Transitions are unsupported, navigation still
    works as plain soft-nav with no errors. Coordinate scroll restoration so transitions feel continuous.
  - Files: `next.config.ts` (experimental flag), `src/app/layout.tsx` (transition boundary),
    `src/app/globals.css` (`::view-transition-*` / `@view-transition` rules),
    `src/components/layout/RouteTransition.tsx` (optional wrapper).
  - Verify: navigating `/` ↔ `/menu` ↔ `/sucursales/[id]` animates smoothly with **no white/reload flash**;
    in a browser without View Transitions support it still navigates cleanly (no console errors);
    reduced-motion users get instant, non-animated nav; no CLS introduced by transitions.

- [x] **M1.5 — shadcn/ui primitives (sparingly) + base UI components**
  - Description: Install only the primitives we need (Accordion for menu categories, Dialog/Sheet for
    mobile nav, Button). Theme them to brand tokens. Add a `Section`, `Container`, `Eyebrow`, and
    `Button` wrapper to enforce consistent spacing/voice.
  - Files: `src/components/ui/{accordion,button,sheet,dialog}.tsx`, `src/components/ui/Section.tsx`,
    `src/components/ui/Container.tsx`, `src/components/ui/Eyebrow.tsx`.
  - Verify: components render with brand radii/colors; Accordion is keyboard-operable and ARIA-correct.

---

### M2 — Content Domain Layer (Menu / Avisos / Gallery + Branches)

> Pattern for all four: **Zod schema in `src/domain/` (framework-free)** → **typed data file in
> `src/content/` parsed via `Schema.parse()` at module load** → **`get*()` accessor in
> `src/lib/content/` is the only thing UI imports.** Money is integer centavos. This makes Phase 2
> (Neon + Drizzle) a swap behind the accessor, not a rewrite (spec §3, §5).

- [x] **M2.1 — Shared money + format utilities**
  - Description: `formatPrice(priceCents, currency="MXN")` → `"$17.00"`; never floats for money. A
    `centavos` brand helper if useful. ISO-date display helper `formatDate()` for `updatedAt`/avisos.
  - Files: `src/lib/utils/format.ts`, `src/lib/utils/format.test.ts`.
  - Verify: unit tests: `formatPrice(1700)==="$17.00"`, `formatPrice(8000)==="$80.00"`; locale `es-MX`.

- [x] **M2.2 — Menu domain: Zod schema (spec §5.3)**
  - Description: Implement `MenuCategory`, `PriceVariant`, `MenuItem` (id slug, name, description?,
    category, `priceCents`? or `variants`?, image?, tags?, `available` default true, `sortOrder`), and
    `Menu` (currency `MXN`, `pricesDisclaimer`, `updatedAt`, items) — exactly as the spec, with the
    refine that an item needs a price or ≥1 variant. Export inferred TS types.
  - Files: `src/domain/menu/menu.schema.ts`, `src/domain/menu/menu.types.ts` (or `z.infer` re-exports).
  - Verify: `pnpm tsc` clean; a deliberately invalid item (no price, no variants) fails `parse()` in a test.

- [x] **M2.3 — Menu data file + `getMenu()` seam (placeholder prices)**
  - Description: Author `menu.data.ts` with real categories and **spec reference prices as placeholders**
    (taco $17 = 1700, orden de 5 $80 via a variant, quesadilla $80, mulita $100, torta $95, aguas
    frescas). Parse through `Menu.parse(...)` at load. `getMenu()` returns the parsed `Menu`; UI never
    imports the data file. `pricesDisclaimer = "Precios sujetos a cambio sin previo aviso"`,
    `updatedAt` = today (ISO). Spanish names/labels, English keys.
  - Files: `src/content/menu.data.ts`, `src/lib/content/menu.ts` (`getMenu()`), `docs/data-todo.md` (price TODO).
  - Verify: `getMenu()` returns validated data; invalid edit fails `pnpm build`; grep confirms no component
    imports `menu.data.ts` directly (only `@/lib/content/menu`).

- [x] **M2.4 — Branches domain: Zod schema + data + `getBranches()` (spec §5.6)**
  - Description: `Branch` schema (id, name, address, `mapsUrl`, phone?, whatsapp?, hours[], restDay?,
    `isDelivery`) **plus** optional `geo: { lat, lng }` (needed for JSON-LD `geo`; omit when unknown — no
    fake coords). Author the 3 branches with placeholder addresses/hours marked TODO. `getBranches()` seam.
  - Files: `src/domain/branches/branch.schema.ts`, `src/content/branches.data.ts`,
    `src/lib/content/branches.ts`.
  - Verify: parse succeeds; 3 branches returned; `mapsUrl` validated as URL; missing `geo` is allowed.

- [x] **M2.5 — Avisos domain: NEW Zod model (designed analogous to menu)**
  - Description: Design the announcements model. Schema:
    ```ts
    // src/domain/avisos/aviso.schema.ts
    export const AvisoType = z.enum(["info", "warning", "closure", "price-update", "event"]);
    export const Aviso = z.object({
      id: z.string(),                 // stable slug → DB PK later
      title: z.string(),              // "Cierre temporal sucursal Portal del Centro"
      body: z.string(),               // short Spanish notice
      type: AvisoType,                // drives icon/severity styling
      branchId: z.string().optional(),// references Branch.id when branch-specific
      startsAt: z.string(),           // ISO — show from
      endsAt: z.string().optional(),  // ISO — hide after (open-ended if omitted)
      active: z.boolean().default(true), // manual kill switch independent of dates
      sortOrder: z.number().int().default(0),
    });
    export const Avisos = z.object({ items: z.array(Aviso) });
    ```
    Plus a pure helper `selectVisibleAvisos(avisos, now)` (framework-free, in domain or lib) that returns
    only avisos where `active && startsAt <= now && (endsAt == null || now <= endsAt)`, sorted.
  - Files: `src/domain/avisos/aviso.schema.ts`, `src/domain/avisos/aviso.types.ts`,
    `src/domain/avisos/selectVisibleAvisos.ts`, `src/domain/avisos/selectVisibleAvisos.test.ts`.
  - Verify: unit tests cover before-window (hidden), in-window (shown), after-window (hidden),
    open-ended (shown), `active:false` (hidden), branch-specific tagging. `branchId` referential note in
    `data-todo.md` (must match a `Branch.id`).
  - Note on static rendering: because the site is SSG, "now" is build-time. To keep date-based show/hide
    fresh without a server, set page `revalidate` (e.g. daily ISR) **or** evaluate `selectVisibleAvisos`
    on the client with the real current time after hydration (avisos are non-LCP). Decide in M3.6;
    default = ISR daily + client re-check. Document the choice.

- [x] **M2.6 — Avisos data file + `getAvisos()` seam (placeholder notices)**
  - Description: Author `avisos.data.ts` parsed via `Avisos.parse(...)`. Add 2–3 placeholder avisos
    (e.g. a price-update notice, a branch-closure example) with realistic dates. `getAvisos()` seam.
  - Files: `src/content/avisos.data.ts`, `src/lib/content/avisos.ts` (`getAvisos()` returning all, plus
    `getVisibleAvisos(now)` using the domain helper).
  - Verify: `getVisibleAvisos()` returns only in-window items; invalid edit fails build.

- [x] **M2.7 — Gallery domain: Zod model (event-catering focus) + data + `getGallery()`**
  - Description: Model the event-catering gallery. Schema:
    ```ts
    // src/domain/gallery/gallery.schema.ts
    export const GalleryCategory = z.enum(["eventos", "comida", "ambiente"]); // eventos is the focus
    export const GalleryImage = z.object({
      id: z.string(),
      src: z.string(),               // /images/gallery/... (next/image)
      alt: z.string(),               // required — SEO + a11y, Spanish, NO "Jalisco"/"Ciudad Guzmán"
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      category: GalleryCategory.default("eventos"),
      caption: z.string().optional(),
      credit: z.string().optional(), // licensing/attribution tracking
      sortOrder: z.number().int().default(0),
    });
    export const Gallery = z.object({ images: z.array(GalleryImage) });
    ```
  - Files: `src/domain/gallery/gallery.schema.ts`, `src/content/gallery.data.ts`,
    `src/lib/content/gallery.ts` (`getGallery()`), `docs/data-todo.md` (licensing TODO).
  - Verify: `alt` is required (empty `alt` fails parse); intrinsic `width`/`height` present (prevents CLS);
    empty gallery handled gracefully downstream.

---

### M3 — Sections & Routes (home sections + dedicated SEO pages)

> Each section is a **reusable server component** that calls the relevant `get*()` seam and is consumed
> **both** on the home page (as a section / preview) **and** on its dedicated route (full version). This is
> what makes "multi-page for crawlers, single-page feel for humans" cheap: one component, two mount points.
> Client interactivity is isolated to leaf components. Copy uses the approved Spanish copys
> (product-marketing.md §Customer Language). Routing/transition behavior is delivered by M1.3–M1.4.

- [x] **M3.1 — Home page composition + section anchors (with menú preview)**
  - Description: Assemble `/` as Hero → Sobre Nosotros → **Menú preview** → Sucursales → Avisos →
    Galería → Contacto → Footer, each with a stable `id` anchor and one `<h2>` (Hero owns the single
    `<h1>`). The Menú block on home is a **preview** (popular/featured items) with a "Ver menú completo"
    `<Link href="/menu">`; Sucursales links each card to its `/sucursales/[id]` page. Anchors handle
    in-page scroll; route links handle SEO-depth pages.
  - Files: `src/app/page.tsx`.
  - Verify: heading outline correct (one h1, logical h2s); anchor nav scrolls; "Ver menú completo" soft-navs
    to `/menu`; no layout shift.

- [x] **M3.2 — Hero (DOM/content layer only; visual tiers added in M5)**
  - Description: Build the hero's **always-real DOM**: logo, `<h1>` tagline "El Placer del Sabor"
    (Anton/Pacifico per brand), supporting copy, and primary CTAs (Ver Menú, WhatsApp/Llamar, Cómo
    llegar). Background is a placeholder (static image + CSS gradient) wired so M5 can layer WebGL/video
    on top without touching content. Headline/CTAs live **outside** any future canvas.
  - Files: `src/components/hero/Hero.tsx`, `src/components/hero/HeroContent.tsx`,
    `src/components/hero/HeroBackground.tsx` (static-tier placeholder).
  - Verify: hero copy + CTAs render and convert with zero JS (works with JS disabled); CTAs use correct
    `tel:`/`wa.me`/maps targets from data; the static frame is set up as the LCP candidate (M4/M5 confirm).

- [x] **M3.3 — Sobre Nosotros section**
  - Description: Brand story — "Toda una tradición en Villa de Álvarez", heritage/trust, proof points
    (decades operating, 90% recommendation, ~10k followers), warm photography slot. On-brand voice.
  - Files: `src/components/sections/About.tsx`.
  - Verify: semantic content, AA contrast, responsive; copy matches approved customer language; no Jalisco/Ciudad Guzmán.

- [x] **M3.4 — Menú component (categorized, accessible accordion/tabs) — preview + full**
  - Description: Render `getMenu()` grouped by category (tacos/tortas/órdenes/bebidas/extras) using the
    accessible Accordion, with item name (Oswald), description (Nunito), price (`formatPrice`, Oswald
    600), variants, tags, and `available` toggling. Show `pricesDisclaimer` + "Actualizado: {updatedAt}".
    Build with a `variant: "preview" | "full"` prop so the **home preview** and the **dedicated `/menu`
    page** share one component (the route page is built in M3.9).
  - Files: `src/components/sections/Menu.tsx`, `src/components/sections/MenuCategory.tsx`,
    `src/components/sections/MenuItem.tsx`.
  - Verify: prices match data; disclaimer + updatedAt visible; accordion keyboard-accessible; unavailable
    items visually de-emphasized (not deleted); preview vs full render correctly; MenuItem JSON-LD wired in M4.

- [x] **M3.5 — Sucursales component (3 branch cards) — overview + per-branch reuse**
  - Description: Render `getBranches()` as 3 cards: name, address, hours, rest day, phone (`tel:`),
    WhatsApp (`wa.me`), "Cómo llegar" (mapsUrl link-out), and a `<Link href="/sucursales/[id]">` "Ver
    sucursal". Factor a `BranchDetail` block reusable by the `/sucursales/[id]` page (M3.9). White-circle
    brand device optional. Per-branch LocalBusiness JSON-LD wired in M4.
  - Files: `src/components/sections/Branches.tsx`, `src/components/sections/BranchCard.tsx`,
    `src/components/sections/BranchDetail.tsx`.
  - Verify: 3 cards render from data; all links correct; "Cómo llegar" opens Google Maps; per-branch link
    soft-navs to `/sucursales/[id]`; responsive grid.

- [x] **M3.6 — Avisos section (date-aware show/hide)**
  - Description: Render `getVisibleAvisos(now)` as styled notices keyed by `type` (icon + severity color
    from the **brand** ramp, not semantic-by-accident — but use `info/warning` semantic tokens where it is
    genuinely a functional alert). Show nothing (or a quiet empty state) when none are active. Implement
    the freshness decision from M2.5 (default: ISR daily + client-side re-check of the window).
  - Files: `src/components/sections/Avisos.tsx`, `src/components/sections/AvisoCard.tsx`.
  - Verify: an aviso dated in the past/future is correctly hidden; an in-window one shows; branch-specific
    aviso displays the branch name; empty state is graceful; no CLS when section is empty.

- [x] **M3.7 — Galería section (event-catering focus)**
  - Description: Render `getGallery()` (default category "eventos") as a responsive `next/image` grid
    with explicit `width`/`height` (no CLS), lazy loading, descriptive Spanish `alt`. Optional lightbox
    (Dialog) — keep lightweight. Graceful "próximamente" empty state if licensing not cleared.
  - Files: `src/components/sections/Gallery.tsx`, `src/components/sections/GalleryGrid.tsx`,
    `src/components/sections/GalleryLightbox.tsx` (optional).
  - Verify: images optimized (AVIF/WebP via next/image), lazy, no CLS; empty state renders when 0 images;
    every image has non-empty alt; lightbox keyboard-accessible if included.

- [x] **M3.8 — Contacto / Pedidos + Footer**
  - Description: Contacto section: phones (`tel:`), WhatsApp (`wa.me`), Facebook, Instagram
    `@tacosdonrefugio`, hours summary, and a disabled/"próximamente" "Ordena en línea" placeholder hook
    (Phase 3, no behavior). Footer: branches summary, social, hours, legal line, "Precios sujetos a
    cambio". NAP consistent with branch data.
  - Files: `src/components/sections/Contact.tsx`, `src/components/layout/Footer.tsx` (finalize).
  - Verify: all conversion links work on mobile (tap `tel:`/`wa.me`); NAP matches JSON-LD; no dead/active
    ordering UI.

- [x] **M3.9 — Dedicated indexable route pages (`/menu`, `/sucursales`, `/sucursales/[id]`; optional `/avisos`, `/galeria`)**
  > Decision gate outcome: built `/menu`, `/sucursales`, `/sucursales/[id]` (core local-SEO routes).
  > Deferred `/avisos` (low indexable value) and `/galeria` (blocked on photo licensing — a thin
  > placeholder page would hurt SEO); both remain home sections with identical components/seams, so
  > promoting them to routes later is zero-rework.
  - Description: Build the real, shareable, indexable routes that reuse the M3 components, all under the
    persistent shared layout (M1.3) with soft-nav + View Transitions (M1.4):
    - `/menu` → full Menú (`variant="full"`) + Menu/MenuItem JSON-LD (M4.4).
    - `/sucursales` → all-branches overview (+ `ItemList` structured data).
    - `/sucursales/[id]` → per-branch page via `generateStaticParams()` over `getBranches()` (404 on
      unknown id), reusing `BranchDetail`; per-branch LocalBusiness/Restaurant JSON-LD (M4.3).
    - **Decision gate** (per §1.5): build `/avisos` and `/galeria` as routes **only if** they add indexable
      SEO value (catering = a real query → `/galeria` likely worth it; `/avisos` optional). If skipped, they
      remain home sections — no rework, same components/seams.
  - Files: `src/app/menu/page.tsx`, `src/app/sucursales/page.tsx`, `src/app/sucursales/[id]/page.tsx`,
    (optional) `src/app/avisos/page.tsx`, `src/app/galeria/page.tsx`.
  - Verify: each route is statically generated (`generateStaticParams` produces 3 branch pages), renders
    the reused component, returns 404 for unknown branch id; navigating between routes is soft (no reload
    flash, header persists, View Transition animates); each route has its own metadata + canonical (M4.1)
    and structured data (M4.3/M4.4).

---

### M4 — SEO, Structured Data, Sitemap & Robots (TOP priority)

> Geography rule enforced everywhere: `addressLocality: "Villa de Álvarez"`,
> `addressRegion: "Colima"`, `addressCountry: "MX"`. **NEVER the retired brand's Jalisco/Ciudad
> Guzmán.** Target queries: "tacos Villa de Álvarez", "taquería Villa de Álvarez", "tortas Villa de Álvarez", "tacos a domicilio Villa de Álvarez".

- [x] **M4.1 — Metadata API: per-route metadata + canonical (local-query targeting)**
  - Description: Root `metadata` (title template, `metadataBase` from `NEXT_PUBLIC_SITE_URL`,
    `lang="es-MX"`, theme-color) plus **distinct per-route metadata** for every indexable route from §1.5:
    `/` (home), `/menu`, `/sucursales`, `/sucursales/[id]` (via `generateMetadata` per branch), and
    `/avisos`/`/galeria` if built. Each sets its own title, locally-targeted description, **`alternates.canonical`**,
    and OG fields. Targets: "tacos Villa de Álvarez", "taquería Villa de Álvarez", "tortas Villa de Álvarez".
  - Files: `src/app/layout.tsx` (root metadata), `src/app/page.tsx`, `src/app/menu/page.tsx`,
    `src/app/sucursales/page.tsx`, `src/app/sucursales/[id]/page.tsx`, `src/lib/seo/metadata.ts` (shared builders).
  - Verify: each route's View Source shows a unique correct `<title>`, description with "Villa de Álvarez",
    a self-referential canonical, and `lang="es-MX"`; **no occurrence of "Jalisco" or "Ciudad Guzmán"** anywhere (grep the built HTML).

- [x] **M4.2 — Open Graph + Twitter cards + OG image**
  - Description: OG/Twitter tags using the logo/hero; a static or dynamic OG image (`opengraph-image`).
    Ensure `og:locale = es_MX`.
  - Files: `src/app/opengraph-image.tsx` (or static `public/images/og.*`), metadata in `src/lib/seo/metadata.ts`.
  - Verify: OG validator / link preview shows correct image, title, description; image ≤ recommended size.

- [x] **M4.3 — Structured data: per-branch LocalBusiness/Restaurant JSON-LD**
  - Description: Generate one `Restaurant`/`LocalBusiness` JSON-LD per branch from `getBranches()`:
    `name`, `address` (PostalAddress with `addressLocality: "Villa de Álvarez"`, `addressRegion: "Colima"`,
    `addressCountry: "MX"`), `geo` (only when coords present), `openingHoursSpecification` (from
    `hours`/`restDay`), `telephone`, `servesCuisine: "Mexicana"`, `hasMenu` (link to `/menu`), `url`,
    `sameAs` (FB/IG). Inject as `<script type="application/ld+json">`.
  - Files: `src/lib/seo/jsonld.ts` (builders), `src/components/seo/JsonLd.tsx` (renderer). Render the
    **single most relevant** LocalBusiness per branch on its `/sucursales/[id]` page; an all-branches
    summary on `/` and `/sucursales`.
  - Verify: Google Rich Results Test passes for each branch page; `addressLocality` is "Villa de Álvarez" in all;
    no `geo` emitted when coords absent (no fake data); **no "Jalisco"/"Ciudad Guzmán"**.

- [x] **M4.4 — Structured data: Menu / MenuItem (on `/menu` + home)**
  - Description: Generate `Menu` + `MenuItem` JSON-LD from `getMenu()` (name, description, `offers` with
    `price`/`priceCurrency: "MXN"`, derived from `priceCents`). Render on the `/menu` route (full) and the
    home menú preview; link from each branch `hasMenu` → `/menu`.
  - Files: `src/lib/seo/jsonld.ts` (extend), rendered on `/` and `/menu`.
  - Verify: Rich Results Test validates Menu on `/menu`; prices match `formatPrice` output; currency MXN.

- [x] **M4.5 — sitemap.ts, robots.ts, semantic HTML pass (all routes)**
  - Description: `sitemap.ts` enumerating **every indexable route** (`/`, `/menu`, `/sucursales`, each
    `/sucursales/[id]` from `getBranches()`, and `/avisos`/`/galeria` if built) and `robots.ts` (allow all,
    point to sitemap), using `NEXT_PUBLIC_SITE_URL`. Audit semantic HTML across all pages (landmarks,
    single h1 per route, ordered headings, `lang`, descriptive link text).
  - Files: `src/app/sitemap.ts`, `src/app/robots.ts`; edits across section/page components as needed.
  - Verify: `/sitemap.xml` lists all routes with absolute URLs; `/robots.txt` resolves; Lighthouse SEO = 100
    on `/` and `/menu` and a branch page; headings audit passes per route.

---

### M5 — WebGL Hero + Fallback Chain (owner's top past pain point)

> Implement strictly as **progressive enhancement**. The static frame ships as the **LCP image**; 3D
> upgrades in on top and can **never** block LCP or break the page. Build tiers bottom-up: tier-4 → tier-3
> → tier-2 → tier-1, so the page is always shippable.

- [x] **M5.1 — `useWebGLSupport()` hook (robust detection)**
  - Description: Client hook returning a discriminated state
    `{ status: 'ok' | 'unsupported' | 'reduced' | 'error', reason? }`. Logic: try `webgl2` → `webgl` →
    `experimental-webgl` on a throwaway canvas inside `try/catch`; listen for `webglcontextcreationerror`
    to capture the failure reason; respect `prefers-reduced-motion: reduce` (→ `reduced`); respect
    `navigator.connection.saveData` and `effectiveType` 2g/3g (→ `unsupported`/`reduced`); best-effort
    low-power heuristic via `WEBGL_debug_renderer_info`. SSR-safe (returns a stable default until mounted).
  - Files: `src/lib/webgl/useWebGLSupport.ts`, `src/lib/webgl/detectWebGL.ts`,
    `src/lib/webgl/useWebGLSupport.test.ts` (mock canvas/context).
  - Verify: unit tests for each branch (context null → unsupported, throw → error, reduced-motion →
    reduced, save-data → reduced); hook never throws; no hydration mismatch.

- [x] **M5.2 — Fallback chain wiring in Hero (tiers 4→3→2)**
  - Description: Drive `HeroBackground` from `useWebGLSupport()`:
    - **Tier 4 (worst case):** CSS-only warm branded gradient (`wood-950→wood-800`) — always present
      behind everything.
    - **Tier 3:** static hi-res image via `next/image` (`priority`, AVIF/WebP, responsive `sizes`) — the
      **LCP element**. Used for `reduced`, `unsupported`, and as the immediate first paint before any 3D.
    - **Tier 2:** looping `<video>` (`muted`, `playsinline`, `autoplay`, `loop`, with the static image as
      `poster`), mounted only when not reduced/save-data and autoplay is permitted; falls back to tier-3
      if autoplay is blocked.
  - Files: `src/components/hero/HeroBackground.tsx`, `src/components/hero/HeroVideo.tsx`,
    `public/images/hero-poster.*`, `public/video/hero-loop.{mp4,webm}` (placeholder until licensed asset).
  - Verify: with WebGL off, hero shows video (or image) and looks intentional; autoplay-blocked → image;
    reduced-motion → static image; gradient always behind; **LCP element is the static image** (confirm in
    Lighthouse/WebPageTest).

- [x] **M5.3 — Tier-1 R3F scene, code-split (`next/dynamic`, `ssr:false`)**
  > Scaffolded: `HeroCanvas.tsx` has a stable zero-prop interface and returns null until R3F
  > packages + 3D assets from the owner arrive. The scaffold comment includes exact install
  > and wiring instructions. Activating the scene requires zero caller changes (see M5.3 note).
  - Description: The 3D scene per brand §5 ("Entra a la taquería": warm wood gradient, bokeh pendant
    glow, cursive neon, floating antojo cut-outs, soft steam/particles, flat crisp logo). Loaded via
    `next/dynamic` with `ssr:false` and the static image as the `loading` fallback, mounted **only** when
    `status === 'ok'` and the hero is in view. Restrained motion (slow parallax/bob, soft bloom). Reduced
    particle/DPR on mobile.
  - Files: `src/components/hero/HeroCanvas.tsx` (dynamic boundary), `src/components/hero/scene/Scene.tsx`,
    `src/components/hero/scene/*` (Neon, FloatingAntojo, Steam, Bokeh), `public/models/*` (glTF + Draco/KTX2 — placeholder/low-poly until creative direction).
  - Verify: 3D chunk is a **separate** bundle, not in the main chunk (check build output); it loads only
    when WebGL ok + in view; main bundle size unaffected; copy/CTAs always real DOM over the canvas.

- [x] **M5.4 — Runtime robustness: context loss, frameloop, IntersectionObserver, dpr**
  - Description: Listen for `webglcontextlost` → `preventDefault()` → switch to the static fallback
    gracefully (covers tab-backgrounding GPU reclaim). Pause rendering offscreen via IntersectionObserver
    and `frameloop="demand"` where possible. Clamp `dpr={[1, 1.5]}` on mobile. Optional, off-by-default,
    dismissible non-blocking note for WebGL-disabled users.
  - Files: `src/components/hero/HeroCanvas.tsx`, `src/lib/webgl/useContextLoss.ts`,
    `src/lib/webgl/useInViewFrameloop.ts`.
  - Verify: simulate context loss (DevTools / `loseContext()` extension) → page stays intact, falls back;
    scrolling hero offscreen pauses the loop (CPU/GPU drops); no console errors affecting UX.

- [x] **M5.5 — Verify fallback in WebGL-disabled Chrome (acceptance gate)**
  - Description: Explicitly validate the owner's past failure scenario. Disable WebGL/hardware
    acceleration in Chrome (`chrome://flags` / `chrome://settings` hardware acceleration off, or
    `--disable-gpu`, or `webgl.disabled`) and load the site. The hero must show tier-2/3, the page must be
    fully usable, conversions intact, and no UX-breaking console errors (a captured
    `webglcontextcreationerror` reason for diagnostics is acceptable, not user-facing).
  - Files: none (QA task); record steps + result in `docs/data-todo.md` or a QA note.
  - Verify: documented pass: WebGL-disabled Chrome renders a premium static/video hero, LCP still the
    image, zero broken layout, all CTAs work.

---

### M6 — Performance, Accessibility, QA & Analytics

- [x] **M6.1 — Image & asset optimization pass**
  > `next.config.ts` updated: `images.formats: ['image/avif', 'image/webp']`. All next/image
  > usages have explicit dimensions or `fill+sizes`. Budget enforcement (hero ≤150 KB, video
  > ≤1.5 MB) requires browser testing after licensed assets arrive.
  - Description: All images via `next/image` with correct `sizes`, AVIF/WebP, explicit dimensions; hero
    poster ≤ ~150 KB; hero video (if used) ≤ ~1.5 MB / ≤ 8s / muted / lazy; 3D JS chunk ≤ ~250 KB gz; 3D
    model+textures ≤ ~1.5 MB (Draco/KTX2). Enforce the spec §4.5 budget.
  - Files: across components; `next.config.ts` (image formats/remotePatterns if needed).
  - Verify: bundle analyzer confirms 3D chunk isolated + within budget; image weights checked; LCP image ≤ budget.

- [x] **M6.2 — Accessibility audit (WCAG 2.1 AA)**
  > Code pass complete: skip-to-main link (`href="#main-content"`, sr-only until focused),
  > `aria-current="page"` on active nav links via NavLink.tsx (uses usePathname; hash anchors
  > excluded), `id="main-content"` on `<main>`. Pre-existing: aria-labels on all icon buttons,
  > native `<details>` accordion (WCAG-native), `lang="es-MX"`, reduced-motion global CSS.
  > Browser verification (axe, Lighthouse, NVDA) deferred to after deploy.
  - Description: Full pass against the §4 cross-cutting checklist: contrast (use `green-700`/`red-600`/
    `neutral-900`), visible focus, keyboard operability (nav, accordion, lightbox), reduced-motion honored
    everywhere (not just hero), alt text on all images, form-free landmarks, `aria-label`s on icon buttons.
  - Files: edits across components as findings dictate.
  - Verify: axe DevTools = 0 serious/critical; Lighthouse Accessibility ≥ 95; manual keyboard + screen-reader
    spot check (NVDA/VoiceOver).

- [x] **M6.3 — Responsive QA (mobile/tablet/desktop, iOS + Android)**
  > Code-level: `100svh` in hero (not `100vh`), tap targets ≥ 44px in Button+FloatingWhatsApp,
  > `playsInline` on HeroVideo, responsive grid in Branches/Gallery. Full device testing
  > (real mid-range Android) deferred to after deploy.
  - Description: Validate breakpoints and real-device behavior: iOS Safari (video `playsinline`,
    `100svh` not `100vh`, tap targets ≥ 44px), Android Chrome (mid-range performance), tablet, desktop.
    Check sticky header, mobile nav, floating WhatsApp, menu accordion, gallery grid.
  - Files: responsive utility tweaks as needed.
  - Verify: no horizontal scroll, no overlap, no CLS at 360/768/1024/1440 widths; iOS hero video plays
    inline; tested on a real mid-range Android.

- [x] **M6.3b — Navigation & View Transitions cross-browser QA**
  > `experimental.viewTransition: true` in next.config.ts; `@view-transition { navigation: auto; }`
  > + `view-transition-name: page-root` in globals.css; prefers-reduced-motion collapses transitions
  > to instant cut (existing global CSS). Cross-browser verification deferred to after deploy.
  - Description: Verify the single-page impression across browsers: soft-nav between all routes is
    flash-free with persistent header; View Transitions animate where supported (Chromium); graceful
    plain soft-nav where unsupported (Firefox/older Safari) with **no errors**; reduced-motion users get
    instant nav. Confirm scroll position/transition continuity and that back/forward works.
  - Files: transition/scroll tweaks as needed.
  - Verify: `/` ↔ `/menu` ↔ `/sucursales/[id]` smooth on Chrome; clean (un-animated) on Firefox/Safari
    with zero console errors; reduced-motion = instant; browser back/forward restores correctly; no CLS.

- [x] **M6.4 — Core Web Vitals verification**
  > Code-level budget decisions in place: hero `<Image priority>` as LCP, `sizes="100vw"`,
  > AVIF/WebP formats, no layout-shifting elements (explicit dimensions everywhere). Actual LCP /
  > CLS / INP numbers require Lighthouse on a deployed URL — run post-M7.
  - Description: Measure against §1.4 targets on a throttled mid-range Android / 4G profile.
  - Files: none (measurement) — fixes routed to relevant tasks.
  - Verify: **LCP < 2.5s, CLS < 0.1, INP < 200ms**; Lighthouse mobile Perf ≥ 90, A11y ≥ 95, SEO 100,
    Best Practices ≥ 95.

- [x] **M6.5 — Analytics: Vercel Web Analytics + Speed Insights**
  - Description: Add `@vercel/analytics` and `@vercel/speed-insights`. Privacy-friendly, no cookie
    banner needed. Optionally track key conversion clicks (WhatsApp/Llamar/Cómo llegar) as custom events.
  - Files: `src/app/layout.tsx` (`<Analytics />`, `<SpeedInsights />`), small event wrappers on CTAs.
  - Verify: analytics beacon fires in production; Speed Insights collects CWV; no console/privacy issues.

---

### M7 — Deploy to Vercel

- [ ] **M7.1 — Vercel project + environment**
  - Description: Create/link the Vercel project (pnpm, Node 24). Set `NEXT_PUBLIC_SITE_URL` (preview =
    Vercel URL; production = real domain when delivered). Confirm SSG output.
  - Files: `vercel.json` (only if needed), env config in Vercel dashboard.
  - Verify: preview deploy builds clean; pages are static; env var resolves in metadata/sitemap.

- [ ] **M7.2 — Domain, canonical & launch checklist**
  - Description: When the owner provides the domain, attach it, update `NEXT_PUBLIC_SITE_URL`, verify
    canonical/OG/sitemap absolute URLs, submit sitemap to Google Search Console, confirm NAP matches the
    3 Google Business Profiles.
  - Files: env update; `docs/data-todo.md` checklist closure.
  - Verify: production loads on real domain; canonical correct; GSC accepts sitemap; Rich Results pass on
    production URLs; final Lighthouse run meets all §1.4 targets; **no "Jalisco"/"Ciudad Guzmán" anywhere**.

---

## 4. Cross-Cutting Checklists

### 4.1 Accessibility (WCAG 2.1 AA)

- [ ] Text contrast ≥ AA: body uses `neutral-900`/`neutral-600`, green text `green-700`, red text/CTA `red-600`; never `gold-500` as text on light.
- [ ] Single `<h1>` (hero), logical heading order, semantic landmarks (`header/main/nav/footer`).
- [ ] All interactive elements keyboard-operable; visible focus rings; mobile nav focus-trap + Escape.
- [ ] `prefers-reduced-motion` honored in hero **and** all Framer Motion / CSS animations (static frame, no parallax).
- [ ] Every image has meaningful Spanish `alt`; decorative images `alt=""`.
- [ ] Icon-only buttons (WhatsApp, hamburger, scroll-top) have `aria-label`.
- [ ] Tap targets ≥ 44×44px; `lang="es-MX"` on `<html>`.

### 4.2 Responsive breakpoints

- [ ] Mobile-first; verify at 360 / 768 / 1024 / 1440 px.
- [ ] iOS Safari: `100svh`/`100dvh` (not `100vh`), `playsinline` video, no rubber-band overlap.
- [ ] Android Chrome (mid-range): smooth scroll, hero performs (tier chosen by measurement).
- [ ] No horizontal overflow; images responsive with `sizes`; grids reflow (gallery, branches, menu).

### 4.3 Performance budget (spec §4.5 + §1.4)

- [ ] Static hero image (LCP) ≤ ~150 KB (AVIF/WebP, responsive).
- [ ] Hero video (if used) ≤ ~1.5 MB, ≤ 8s, muted, `playsinline`, lazy.
- [ ] 3D JS bundle ≤ ~250 KB gz, **separate chunk**, loaded only when WebGL ok + in view.
- [ ] 3D model + textures ≤ ~1.5 MB total (Draco/KTX2).
- [ ] LCP impact of 3D = **zero** (static image is LCP).
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms; Lighthouse Perf ≥ 90 / A11y ≥ 95 / SEO 100 / BP ≥ 95.
- [ ] Fonts: subset latin+latin-ext, `display: swap`, preload Anton + Nunito, lazy Pacifico; ~0 font CLS.

### 4.4 SEO checklist (geography-locked)

- [ ] `addressLocality: "Villa de Álvarez"`, `addressRegion: "Colima"`, `addressCountry: "MX"` everywhere.
- [ ] **Zero** occurrences of "Jalisco"/"Ciudad Guzmán" in code, copy, metadata, JSON-LD, alt text (grep the build).
- [ ] Per-branch LocalBusiness/Restaurant JSON-LD (on `/sucursales/[id]`) + Menu/MenuItem JSON-LD (on `/menu`) validate in Rich Results Test.
- [ ] Every indexable route has **its own** title, description, and self-referential canonical; OG/Twitter cards; `es-MX` locale.
- [ ] `sitemap.xml` lists all routes (`/`, `/menu`, `/sucursales`, each `/sucursales/[id]`, + `/avisos`/`/galeria` if built) with absolute URLs; `robots.txt` resolves; NAP consistent with Google Business Profiles.
- [ ] Soft-nav + View Transitions deliver a single-page impression without harming crawlability (routes are real, statically generated, individually indexable).

---

## 5. Risks & Mitigations (implementation standpoint)

| # | Risk / effort trap | Impact | Mitigation | Cut-scope-first move |
|---|---|---|---|---|
| 1 | **WebGL 3D asset production** (model, neon, textures, the "Entra a la taquería" scene) is real creative + technical work, easy to underestimate | High effort; can slip the whole hero | Build tiers bottom-up; fallback chain makes 3D additive and swap-free | **Ship tier-2 (premium looping video) hero first**; add 3D later with zero page change |
| 2 | **Photo licensing / pro shoot** blocks the gallery and a quality hero video/3D source | Blocks premium gallery + hero asset | Gallery has a graceful "próximamente" empty state; hero uses CSS-gradient + branded static placeholder; commission shoot in parallel | Launch gallery empty/minimal; backfill when licensed assets land |
| 3 | **Tailwind v4 specifics** (CSS-first `@theme` config, no JS config by default, PostCSS plugin change, some v3 plugins/patterns differ) | Setup friction, token mismatch | Do the v4 plumbing in M0.2 before building UI; encode tokens in `@theme`; avoid v3-only assumptions | n/a (foundational) |
| 4 | **Font loading / CLS** (4 families incl. display + script) | CLS regression, perf hit | next/font self-host, subset, `swap`, preload only the 2 always-visible faces, lazy Pacifico; verify font CLS ≈ 0 | Drop Pacifico to a single decorative instance if it costs budget |
| 5 | **Static rendering vs date-based avisos** ("now" is build time on SSG) | Avisos could show/hide stale | ISR daily revalidate + client-side re-check of the window after hydration (avisos are non-LCP) | Client-only date filter is acceptable for Phase 1 |
| 6 | **iOS Safari hero quirks** (autoplay/inline video, `100vh`) | Broken hero on iPhone | `playsinline`+`muted`+`autoplay`, `100svh`, autoplay-blocked → image tier; test on real iOS | Image tier on iOS if video misbehaves |
| 7 | **Geography mistake (the retired brand's Jalisco/Ciudad Guzmán)** creeping into copy/schema | SEO damage, brand error | Hard rule in code review + a build-time grep check for "Jalisco"/"Ciudad Guzmán" in M4.5/M7.2 | n/a (non-negotiable) |
| 8 | **Placeholder data shipped to prod** (fake prices/addresses/coords) | Customer trust / wrong NAP | `docs/data-todo.md` gating checklist; never emit fake `geo`; `updatedAt` + disclaimer visible; close all TODOs before M7.2 | n/a |
| 9 | **Over-engineering** (CMS-like abstractions, premature DB seams beyond the spec) | Wasted effort | Stick to the spec's thin `get*()` seam + typed files; nothing more | Keep it boring |
| 10 | **View Transitions browser support / Next.js experimental flag churn** (partial support; API still maturing) | Inconsistent transition polish | Treat as pure progressive enhancement — soft-nav works without it; feature-detect; honor reduced-motion | Ship plain soft-nav (no animated transition) first; layer transitions later |
| 11 | **Multi-page reusing one component** (preview vs full, branch overview vs detail) — risk of subtle divergence/duplication | Maintenance / inconsistency | One component with a `variant` prop + shared `BranchDetail`; single `get*()` source of truth | Collapse `/avisos`,`/galeria` back to home sections |

**Where to cut first if time-constrained:** (1) ship the **video hero** instead of full 3D; (2) launch
the **gallery minimal/empty** pending photos; (3) skip the **optional `/avisos` and `/galeria` routes**
(keep them as home sections — `/menu` and `/sucursales[/id]` stay, as they carry the core local-SEO
value); (4) ship **plain soft-nav** and add View Transitions polish later. None of these compromise the
core informational value, conversions, or local SEO.

---

## 6. Definition of Done — Phase 1

Phase 1 is complete when **all** of the following hold:

- [ ] Site is deployed to Vercel (production on the real domain when delivered) and statically generated.
- [ ] Home page renders all sections: Hero, Sobre Nosotros, Menú (preview), Sucursales, Avisos, Galería, Contacto, Footer.
- [ ] **Multi-page architecture is live**: real indexable routes `/`, `/menu`, `/sucursales`, `/sucursales/[id]`
      (+ `/avisos`/`/galeria` if they earned SEO value), each statically generated with its own metadata,
      canonical, and structured data — yet navigation **feels single-page**: persistent sticky header,
      App Router soft-nav (no full reloads), View Transitions where supported (graceful plain nav where not),
      reduced-motion respected, no reload flash. Verified cross-browser (M6.3b).
- [ ] **Menu**, **Avisos**, and **Gallery** each live in a Zod-validated typed data file read **only** through
      `getMenu()` / `getAvisos()` / `getGallery()` seams (verified: no component imports a `*.data.ts` directly);
      prices are integer centavos with `formatPrice`, plus `pricesDisclaimer` + `updatedAt` shown.
- [ ] Avisos correctly auto show/hide by `startsAt`/`endsAt`/`active` (unit-tested helper + verified in UI).
- [ ] Gallery is event-catering-focused with required alt text and no CLS (or a graceful empty state if photos pending).
- [ ] 3 branches render from `getBranches()` with working `tel:`/`wa.me`/"Cómo llegar" conversions.
- [ ] **WebGL hero** is pure progressive enhancement: `useWebGLSupport()` hook, full fallback chain
      (R3F → video → static image → CSS gradient), static frame is the LCP image, R3F code-split
      (`next/dynamic`, `ssr:false`), frameloop/IntersectionObserver pausing, dpr clamping, `webglcontextlost`
      handled. **Verified in WebGL-disabled Chrome**: page intact, hero premium, conversions working, no
      UX-breaking console errors.
- [ ] **SEO**: per-branch LocalBusiness/Restaurant JSON-LD (`addressLocality: "Villa de Álvarez"`,
      `addressRegion: "Colima"`, geo when known, openingHours, telephone, `hasMenu`) + Menu/MenuItem JSON-LD,
      all passing Rich Results Test; metadata targets local queries; `sitemap.ts` + `robots.ts`; canonical URLs;
      OG/Twitter cards; semantic HTML; alt text. **Zero "Jalisco"/"Ciudad Guzmán" anywhere.**
- [ ] **Performance/A11y**: Lighthouse mobile Perf ≥ 90, A11y ≥ 95, SEO 100, Best Practices ≥ 95; LCP < 2.5s,
      CLS < 0.1, INP < 200ms on a mid-range Android/4G; performance budget (§4.3) met.
- [ ] Responsive and correct on mobile/tablet/desktop, iOS Safari + Android Chrome.
- [ ] Vercel Web Analytics + Speed Insights live.
- [ ] All owner-data TODOs (`docs/data-todo.md`) either delivered or explicitly accepted as placeholders by the owner.
- [ ] `pnpm build`, `pnpm typecheck`, `pnpm lint` all pass clean.
