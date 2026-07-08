# Tacos Don Refugio — Marketing Website Spec

**Project:** Tacos Don Refugio ("El Placer del Sabor") — traditional taquería, Villa de Álvarez, Colima, Mexico.
**Document type:** Design spec (Phase 1 = marketing site; future phases scoped, not built).
**Owner:** RigidCode / Edgar Oviedo
**Status:** Draft for owner approval
**Date:** 2026-06-26

---

## 1. Goals & Non-Goals

### 1.1 Phase 1 goals (what we build now)

A fast, flashy, mobile-first marketing website that:

- Showcases the brand with a **WebGL hero** that **never breaks the page** — robust feature detection plus a high-quality fallback chain (this is the owner's top concern from a past project).
- Presents the **menu** (tacos, tortas, órdenes) with **prices that are trivial to edit** by a developer today and migratable to a DB/CMS later without rework.
- Drives real-world conversions the business already has: phone call, WhatsApp, "how to get there" (maps), follow on social.
- Lists the **3 branches** with address, hours, rest day, phone, and map link.
- Ranks for **local SEO** ("tacos en Villa de Álvarez", "taquería Villa de Álvarez").
- Works perfectly on desktop, tablet, Android and iOS; is accessible (WCAG 2.1 AA target) and performant (Core Web Vitals "good").

### 1.2 Future goals (planned for, NOT built now)

- **Phase 2:** Menu moves to a database + a lightweight admin so the owner edits prices/items without a developer.
- **Phase 3:** Online ordering / cart / checkout / payments (Mexico context), order management — bypassing Didi Food / Uber Eats.
- **Phase 4:** A **React Native / Expo mobile app** sharing the same backend/API and types as the web.

### 1.3 Non-goals (explicit, to protect scope)

- No backend, database, auth, cart, payments, or admin in Phase 1.
- No user accounts or login in Phase 1.
- No CMS in Phase 1 (data lives in a typed file — see §5).
- No multi-language in Phase 1 (Spanish only; copy is in Spanish, code/docs in English). i18n is not designed in now but the content structure does not block it.
- No e-commerce legal/tax/invoicing (CFDI) work in Phase 1 — that is a Phase 3 concern flagged early in §3 and §8.

### 1.4 Success criteria (Phase 1)

- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100, Best Practices ≥ 95.
- LCP < 2.5s on a mid-range Android over 4G; CLS < 0.1; INP < 200ms.
- Hero renders something high quality on **every** device/browser, including WebGL-disabled Chrome, with zero console errors that affect UX.
- Owner can hand a developer a price change and it ships in minutes via one typed file.

---

## 2. Recommended Tech Stack (decisive)

| Concern | Recommendation | Why |
|---|---|---|
| Framework | **Next.js (App Router), Node 24** | Owner targets Vercel; best-in-class SSG/ISR, image optimization, metadata API for SEO, and it is the natural host for the future API (Route Handlers / Server Actions) so Phases 2–4 reuse the same app. |
| Language | **TypeScript (strict)** | Typed menu data is a core requirement; shared types pay off massively in Phases 3–4. |
| Rendering | **Static (SSG) for all Phase 1 pages** | Marketing content is static. Fastest, cheapest, most reliable. ISR available later if data goes to a DB. |
| Styling | **Tailwind CSS v4 + CSS variables for brand tokens** | Fast to build, tiny shipped CSS, mobile-first by default. Brand palette/fonts encoded as design tokens (CSS vars) so a future design-system swap is cheap. |
| UI primitives | **shadcn/ui (Radix under the hood), used sparingly** | Accessible primitives (dialog, accordion for menu, navigation) without a heavy component framework. Copy-in, not a dependency lock-in. |
| 3D / WebGL | **Three.js via React Three Fiber (R3F) + @react-three/drei**, code-split and lazy | R3F is the standard React-idiomatic wrapper; drei gives loaders/perf helpers. See §4 for the full strategy. The 3D bundle is isolated so it never affects the rest of the page. |
| Animation (non-WebGL) | **Framer Motion** for section reveals/micro-interactions; CSS where possible | "Flashy" without forcing WebGL everywhere; the fallback hero can still feel premium. |
| Fonts | **next/font (self-hosted Google Fonts)** — Pacifico (display "Don Refugio"), Anton or Oswald (condensed accents), Inter or Poppins (body) | Self-hosting avoids layout shift and third-party requests; good CWV. |
| Content/data | **Typed TS data file(s) + Zod schema** (see §5) | Meets "easy to edit now," gives runtime validation, and the Zod schema becomes the contract for the future DB/API. |
| Maps | **Static map link-outs (Google Maps URLs) + optional embed** | No API key, no cost, no JS weight. Embedding the interactive map is optional and lazy. |
| Icons | **lucide-react** | Lightweight, tree-shakeable, matches shadcn. |
| Forms (contact) | **None server-side in Phase 1** — direct `tel:`, `https://wa.me/...`, and social links | The business converts via phone/WhatsApp today. A server-handled form is a Phase 3 add. |
| Analytics | **Vercel Web Analytics + Speed Insights** | Privacy-friendly, zero-config on Vercel, no cookie banner needed. |
| Hosting | **Vercel** | Owner standard. CDN, image optimization, preview deploys, edge. |
| Package manager | **pnpm** | Fast, disk-efficient, first-class workspace support for the future monorepo (§7). |

**Decisions deliberately deferred** (and why that's safe): DB engine, auth provider, payment provider, monorepo split. None of these are needed in Phase 1, and §3 shows each can be added without rewriting Phase 1 code. The one thing we commit to now to keep them cheap: **a typed domain layer (Zod-validated menu/branch models) that is framework- and storage-agnostic.**

---

## 3. Phased Architecture Roadmap

The guiding principle: **the domain model (menu, branches, eventually orders) is the long-lived asset; storage, transport, and UI are replaceable.** Phase 1 puts the domain behind a thin data-access seam so later phases swap the implementation, not the callers.

### Phase 1 — Marketing site (now)

- Pure Next.js App Router app on Vercel, statically generated.
- Menu and branch data in typed TS files validated by Zod (§5).
- **Critical seam:** all UI reads menu/branch data through a small module, e.g. `getMenu()` / `getBranches()` in `src/lib/content/`. UI never imports the raw data file directly. Today these functions return the static data; in Phase 2 they become async DB reads with the **same return types**.
- Conversions: `tel:`, WhatsApp deep links, social links, map links.

**How this keeps the future cheap:** every consumer already awaits a typed accessor returning domain objects. Making it async + DB-backed later is an internal change, not an API change to the rest of the app.

### Phase 2 — Menu in DB/CMS + admin

- **DB:** **Neon (Serverless Postgres) via Vercel Marketplace.** Rationale: relational fits the menu/branch/price domain and the eventual orders domain (foreign keys, transactions, money correctness); Postgres scales to Phases 3–4 without a second datastore. (Note: Vercel Postgres/KV are discontinued — provision via Marketplace.) Supabase is the alternative if we also want its built-in auth/storage; see auth note below.
- **ORM/data layer:** **Drizzle ORM** — TypeScript-first, schema as code, the Zod menu schema from Phase 1 maps almost 1:1 to Drizzle tables.
- **Admin:** the lowest-cost option that fits the owner: either (a) a minimal protected `/admin` in the same Next.js app (CRUD on menu items/prices) or (b) a headless CMS (Sanity/Payload) if the owner wants richer editing. Recommendation: **start with a tiny in-app `/admin`** — fewer moving parts, no new vendor, reuses our schema.
- **Caching:** ISR / `revalidateTag` so menu pages stay static-fast but update when the owner edits a price.

**How Phase 1 keeps this cheap:** `getMenu()` becomes a Drizzle query returning the same `MenuItem[]`. Pages don't change. The Zod schema is reused for admin form validation and DB-row validation.

### Phase 3 — Online ordering + payments

- **API home:** same Next.js app — **Route Handlers** (`/api/*`) and/or Server Actions for cart/checkout; webhooks as Route Handlers. No separate backend service needed at this scale. (If load ever demands it, the domain layer can be lifted into a standalone service because it has no Next.js dependencies — but we don't pay that cost now.)
- **New domains:** `Cart`, `Order`, `OrderItem`, `Customer`, `Payment`, plus order status lifecycle. Postgres handles this naturally (transactions for order placement; this is where relational integrity earns its keep).
- **Auth:** customers need accounts. Recommendation: **Clerk (Vercel Marketplace native)** for fast, secure auth with phone/OTP (well-suited to Mexican mobile-first customers) — or Supabase Auth if we chose Supabase in Phase 2. Decide at Phase 2 based on the DB choice.
- **Payments (Mexico):** **Mercado Pago as primary** (dominant in Mexico, supports OXXO cash vouchers, SPEI bank transfer, local cards, MSI installments) with **Stripe as a secondary/card option** if needed. Payment provider is abstracted behind a `PaymentProvider` interface so we are not locked in. **Hard flag:** online sales trigger **CFDI/tax invoicing (SAT)** obligations and consumer-protection rules — legal/accounting input required before launch (see §8).
- **Order management:** an extension of `/admin` (kitchen view, status updates) and order notifications (WhatsApp Business API or SMS to the branch).

**How Phase 1 keeps this cheap:** the API lives in the app we already deploy; auth and payments are isolated behind interfaces; the money type and price handling decided in §5 prevent float-rounding bugs that are expensive to retrofit.

### Phase 4 — Expo mobile app sharing the backend

- **App:** React Native + **Expo** (managed workflow, EAS Build/Submit for both stores).
- **Shared backend:** the Phase 3 Next.js API is consumed by the app over HTTPS/JSON. The app is just another client.
- **Shared types/contract:** this is the moment the **monorepo earns its place** (see §7). The web and the app share `@tacos-don-refugio/core` (domain types + Zod schemas) and `@tacos-don-refugio/api-client` (typed fetchers). Recommended contract layer: **tRPC or a typed REST client generated from Zod** so the app gets end-to-end type safety against the same API the web uses.
- **Auth:** same provider as web (Clerk/Supabase both have RN SDKs) — pick one with a first-class Expo SDK in Phase 3 to avoid rework.

**How Phase 1 keeps this cheap:** we keep domain types in a single, dependency-light place from day one (even before the monorepo split) so extracting `@tacos-don-refugio/core` is a move, not a rewrite. See §7 for the pragmatic "single repo now, monorepo-ready" decision.

### Roadmap summary

| | API home | Storage | Auth | Payments | New clients |
|---|---|---|---|---|---|
| **P1** | none | typed TS file (Zod) | none | none | web |
| **P2** | none / `/admin` | Neon Postgres + Drizzle | admin-only | none | web + admin |
| **P3** | Next.js Route Handlers | Neon Postgres | Clerk/Supabase | Mercado Pago (+Stripe) | web |
| **P4** | same Next.js API | Neon Postgres | same provider | same | web + Expo app |

---

## 4. WebGL Hero Strategy (top client concern)

**Principle: WebGL is a progressive enhancement, never a dependency.** The page must be fully usable, beautiful, and conversion-ready even if the 3D never loads. The past Chrome failure (almost certainly WebGL/hardware acceleration disabled or context-creation failure) is treated as an expected runtime state, not an error.

### 4.1 Library

- **React Three Fiber (Three.js) + @react-three/drei**, dynamically imported and **code-split** so the 3D bundle (~Three.js core) is never in the main/critical bundle and never loads on devices that won't use it.

### 4.2 The fallback chain (degrade in this order)

1. **Capable device + WebGL OK** → full R3F hero (e.g. floating taco/ingredients, subtle parallax, brand-lit scene).
2. **WebGL unavailable / context fails / user prefers reduced motion / low-power / save-data** → **high-quality looping `<video>` poster** (the hero rendered once, exported to MP4/WebM) with a static poster image as its own poster.
3. **Video can't/shouldn't play (autoplay blocked, data saver)** → **static high-resolution image** (optimized via next/image, AVIF/WebP) with CSS gradient/parallax accents — still on-brand and "flashy."
4. **Worst case (image fails)** → CSS-only branded gradient background with the headline/CTA. The hero copy and primary CTAs are **always real DOM**, never inside the canvas, so they render regardless.

> Key rule: the headline, tagline ("El Placer del Sabor"), and CTAs are normal HTML/CSS overlaid on the hero. WebGL only ever provides the *background visual*. If it fails, we lose decoration, not content or conversions.

### 4.3 Feature detection (robust, before mounting the canvas)

Detection runs client-side and gates the canvas mount. We do **not** rely on `try`-around-render; we proactively test:

- Attempt to create a WebGL context on a throwaway canvas: try `webgl2` then `webgl`/`experimental-webgl`. If `getContext` returns null → fallback. Wrap in `try/catch` (some browsers throw).
- Listen for `webglcontextcreationerror` on the test canvas to capture the exact failure reason (useful for the owner's diagnostics).
- Respect `prefers-reduced-motion: reduce` → skip animated 3D, go to static.
- Respect `navigator.connection.saveData` and `effectiveType` (2g/3g) → skip heavy assets.
- Coarse capability heuristic for low-power: very low `devicePixelRatio`/old GPU strings via `WEBGL_debug_renderer_info` (best-effort) → reduce quality or fall back.
- Handle **runtime context loss**: listen for `webglcontextlost`, `preventDefault()`, and gracefully switch to the fallback (this also covers tab-backgrounding GPU reclaim).
- Optional, off by default: a tiny, dismissible, non-blocking note for users on WebGL-disabled Chrome ("For the full experience, enable hardware acceleration") — informational only, never a wall.

Detection is encapsulated in a `useWebGLSupport()` hook returning a discriminated state (`{ status: 'ok' | 'unsupported' | 'reduced' | 'error', reason? }`) so the hero component picks the right tier declaratively.

### 4.4 Loading & performance

- Canvas component loaded via `next/dynamic` with `ssr: false` and a fallback (the static image) shown immediately — so first paint is the static hero; the 3D **upgrades in** when ready.
- Use an `IntersectionObserver` / drei helpers to **pause rendering when the hero is offscreen** and cap the frame loop (`frameloop="demand"` where possible) to save battery.
- Clamp `dpr` (e.g. `dpr={[1, 1.5]}`) on mobile to avoid retina overdraw.
- Compress GPU assets: glTF + Draco/meshopt; KTX2/Basis textures; keep total 3D payload within budget below.
- Preload only the static poster as a priority image (LCP candidate); never block LCP on the 3D bundle.

### 4.5 Performance budget (hero)

| Item | Budget |
|---|---|
| Static hero image (LCP) | ≤ ~150 KB (AVIF/WebP, responsive `sizes`) |
| Hero `<video>` (if used) | ≤ ~1.5 MB, ≤ 8s loop, muted, `playsinline`, lazy |
| 3D JS bundle (separate chunk) | ≤ ~250 KB gz, loaded only when WebGL ok and hero in view |
| 3D model + textures | ≤ ~1.5 MB total, Draco/KTX2 compressed |
| LCP impact of 3D | **zero** (static image is the LCP element) |

### 4.6 Mobile / low-power

- Mobile default can be tier-2 (video) or a lighter 3D scene depending on testing — decided during build by measuring on a real mid-range Android.
- Always `playsinline`, `muted`, `autoplay`, `loop` for video; honor reduced-motion by showing the static frame.

**Net:** the owner's "Chrome had no service enabled" scenario maps exactly to tier-2/3 here and is fully handled, with optional diagnostics captured via `webglcontextcreationerror`.

---

## 5. Menu Data Model

### 5.1 Requirements

- Tacos (main), tortas, órdenes/combos — extensible categories.
- Prices change **frequently**; editing must be trivial and safe.
- "Prices subject to change" must be representable and shown to users.
- Must validate at build/runtime and migrate cleanly to a DB.

### 5.2 Money handling (decided early to avoid retrofit pain)

- Store prices as **integer centavos** (`priceCents: number`), currency `MXN`. No floats for money. A `formatPrice()` helper renders `$17.00`. This rule carries straight into Phase 3 payments and prevents rounding bugs.

### 5.3 Schema (Zod — single source of truth, English keys, Spanish display values)

```ts
// src/lib/content/menu.schema.ts (illustrative)
import { z } from "zod";

export const MenuCategory = z.enum(["tacos", "tortas", "ordenes", "bebidas", "extras"]);

export const PriceVariant = z.object({
  label: z.string(),          // e.g. "Orden de 5", "Sencillo", "Grande" (display, Spanish)
  priceCents: z.number().int().nonnegative(),
});

export const MenuItem = z.object({
  id: z.string(),             // stable slug, becomes DB PK later — e.g. "taco-pastor"
  name: z.string(),           // "Taco al Pastor"
  description: z.string().optional(),
  category: MenuCategory,
  // Either a single price or named variants (orden de 5, etc.)
  priceCents: z.number().int().nonnegative().optional(),
  variants: z.array(PriceVariant).optional(),
  image: z.string().optional(),       // /public path or remote URL later
  tags: z.array(z.string()).optional(),   // "picante", "popular", "nuevo"
  available: z.boolean().default(true),   // toggle off without deleting
  sortOrder: z.number().int().default(0),
}).refine(i => i.priceCents != null || (i.variants && i.variants.length > 0), {
  message: "Item needs a price or at least one variant",
});

export const Menu = z.object({
  currency: z.literal("MXN").default("MXN"),
  pricesDisclaimer: z.string(),   // "Precios sujetos a cambio sin previo aviso"
  updatedAt: z.string(),          // ISO date — show "Actualizado: ..."
  items: z.array(MenuItem),
});
```

### 5.4 Data file + access seam

- Data lives in `src/content/menu.data.ts` (typed, imports the schema) and is **parsed through `Menu.parse(...)` at module load** so an invalid edit fails the build, not production.
- All pages call **`getMenu()`** from `src/lib/content/menu.ts` — never import `menu.data.ts` directly. This is the seam that becomes a DB query in Phase 2 with identical return types.
- "Prices subject to change": `pricesDisclaimer` is rendered near the menu, and `updatedAt` shows last update — managing customer expectations and reducing complaints.

### 5.5 Migration path to DB

- The Zod schema → Drizzle tables nearly 1:1 (`menu_items`, `price_variants`). `id` slug becomes PK.
- `getMenu()` swaps from file-read to Drizzle query; callers unchanged.
- Admin forms (Phase 2) reuse the same Zod schema for validation — one contract, three uses (file, DB row, form).

### 5.6 Branches model (same pattern)

```ts
export const Branch = z.object({
  id: z.string(),                 // "matriz", "portal-centro", "de-pasadita"
  name: z.string(),               // "Matriz — Av. 1° de Mayo"
  address: z.string(),
  mapsUrl: z.string().url(),      // Google Maps link-out
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  hours: z.array(z.object({ days: z.string(), open: z.string(), close: z.string() })),
  restDay: z.string().optional(), // "Martes"
  isDelivery: z.boolean().default(false),
});
```

---

## 6. Information Architecture / Sections & Routes

Single-page-first with anchor navigation (best for a small business, great for sharing and SEO), with a few real routes for SEO depth.

| Route | Purpose | Notes |
|---|---|---|
| `/` (home) | Hero → Sobre Nosotros → Menú → Sucursales → Galería → Pedidos/Contacto → Footer | All sections are anchors (`#menu`, `#sucursales`, etc.) for the sticky nav. |
| `/menu` | Full menu page | Optional dedicated page for SEO and direct sharing; same `getMenu()` data. Can launch as just the `#menu` anchor and add later. |
| `/sucursales` | Branches detail | Optional; per-branch SEO. |
| `/sucursales/[id]` (future) | Per-branch page | Strong local SEO; trivial later via the branches model. |

**Sections (home):**
1. **Hero** — WebGL/fallback background, logo, tagline "El Placer del Sabor", primary CTAs (Ver Menú, WhatsApp/Llamar, Cómo llegar).
2. **Sobre Nosotros** — story, "Toda una tradición en Villa de Álvarez", trust/heritage, slogan copys.
3. **Menú** — categorized (tacos/tortas/órdenes/bebidas), prices, disclaimer + updatedAt; accordion or tabbed categories (accessible).
4. **Sucursales** — 3 cards (address, hours, rest day, phone, "Cómo llegar" map link).
5. **Galería** — food/ambiance photos (pending licensing — see §8).
6. **Pedidos / Contacto** — phones (`tel:`), WhatsApp (`wa.me`), Facebook, Instagram @tacosdonrefugio. Phase-3 placeholder hook for "Ordena en línea".
7. **Footer** — branches summary, social, hours, legal line, "Precios sujetos a cambio".

**Global UX:** sticky header with logo + anchor nav + prominent WhatsApp/Phone CTA; mobile hamburger; "scroll to top"; floating WhatsApp button (common, high-converting for Mexican SMBs).

### SEO

- next/font, semantic HTML, per-section headings.
- **LocalBusiness / Restaurant JSON-LD** (schema.org) with all 3 branches (`hasMenu`, `address`, `openingHours`, `telephone`, `geo`), and **Menu/MenuItem structured data** — strong for local + rich results.
- `metadata` API: title/description targeting "tacos en Villa de Álvarez", "taquería Villa de Álvarez"; Open Graph + Twitter cards using the logo/hero.
- `sitemap.ts`, `robots.ts`, canonical URLs.
- Google Business Profile alignment (NAP consistency) — flag to owner (§8).

---

## 7. Repo Structure

### Decision: single Next.js repo now, structured to become a monorepo later.

Rationale (pragmatic): a monorepo today adds tooling overhead (workspaces, build orchestration) for **one** deployable with **one** team member — over-engineering for Phase 1. But we pay a tiny upfront cost to keep the split cheap: **isolate domain types/schemas in a self-contained folder with no Next.js imports**, so extracting it into `packages/core` when the Expo app arrives (Phase 4) is a `git mv`, not a refactor. We adopt **pnpm** now (workspace-ready) and Turborepo only when the second app exists.

### Phase 1 layout (single app)

```
tacosvalente/
├─ docs/
│  └─ spec.md
├─ public/
│  ├─ images/ (hero poster, food, gallery — optimized)
│  ├─ video/  (hero loop fallback)
│  └─ models/ (glTF, Draco/KTX2 assets)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # fonts, metadata, JSON-LD
│  │  ├─ page.tsx            # home (all sections)
│  │  ├─ menu/page.tsx       # optional dedicated menu
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ globals.css         # Tailwind + brand tokens (CSS vars)
│  ├─ components/
│  │  ├─ hero/               # Hero, Canvas (dynamic), fallbacks
│  │  ├─ sections/           # About, Menu, Branches, Gallery, Contact
│  │  └─ ui/                 # shadcn primitives
│  ├─ content/
│  │  ├─ menu.data.ts        # editable typed menu (prices here)
│  │  └─ branches.data.ts
│  ├─ lib/
│  │  ├─ content/            # getMenu(), getBranches() — the seam
│  │  ├─ webgl/              # useWebGLSupport(), detection
│  │  └─ utils/              # formatPrice(), etc.
│  └─ domain/                # ← future packages/core: Zod schemas + types ONLY, no framework imports
├─ package.json (pnpm)
├─ tailwind.config / postcss
├─ tsconfig.json (strict, path aliases)
└─ next.config.ts
```

### Future monorepo shape (Phase 4, for reference)

```
tacosvalente/
├─ apps/
│  ├─ web/      (this Next.js app)
│  └─ mobile/   (Expo app)
├─ packages/
│  ├─ core/        (domain types + Zod — moved from src/domain)
│  ├─ api-client/  (typed fetchers / tRPC client)
│  └─ ui/          (shared design tokens, optional)
├─ pnpm-workspace.yaml
└─ turbo.json
```

The `src/domain/` → `packages/core/` move is the whole reason we keep that folder framework-free from day one.

---

## 8. Key Risks & Open Questions (confirm with owner)

### Must confirm before/at build

1. **Photo licensing** — food/ambiance photos were taken from Facebook; **copyright is uncertain**. Risk: legal exposure + DMCA/takedown + poor quality. **Recommendation:** commission a short fresh photo/video shoot (also needed for a quality hero video fallback). Until cleared, gallery uses only confirmed-owned assets. **Blocking for Galería + hero video.**
2. **Hi-res assets** — current `logo.png` and `bg-fb.png` resolution/transparency may be insufficient for hero/print. Need: vector/SVG logo if possible, hi-res hero source. **Blocking for WebGL/hero quality.**
3. **Prices** — confirm the **current** full price list per category (menu reference prices will change). Need an authoritative starting list + who signs off on changes.
4. **Exact branch data** — confirmed addresses, hours, rest day, and phone **per branch** (Matriz Av. 1° de Mayo, Portal del Centro, "De Pasadita"). Need precise Google Maps links / coordinates for JSON-LD and "Cómo llegar."
5. **Contact channels** — exact delivery/order phone numbers, the WhatsApp number(s) (for `wa.me` and floating button), confirm Instagram `@tacosdonrefugio` and the Facebook page URL.
6. **Domain** — does the owner own a domain (e.g. `tacosdonrefugio.com` / `.mx`)? Need it for SEO, OG, and DNS on Vercel. **Recommendation:** secure `.com` + `.com.mx`.

### Plan-ahead risks (future phases, flag now)

7. **Tax/legal for online sales (Phase 3)** — selling online in Mexico triggers **CFDI/SAT invoicing**, consumer-protection (PROFECO) and data-privacy (LFPDPPP) obligations. Requires accounting/legal input before Phase 3 launch. Not a Phase 1 task, but it shapes the `Order`/`Payment` model — flagged early.
8. **Payments (Phase 3)** — confirm the owner's bank/Mercado Pago setup; Mercado Pago vs Stripe decision depends on payout/fees and OXXO/SPEI demand. Abstract behind `PaymentProvider` regardless.
9. **Operational readiness for delivery (Phase 3/4)** — bypassing Didi/Uber means the business owns delivery logistics, order-time SLAs, and refunds. This is an **operational**, not just technical, commitment — worth a candid conversation before investing in Phase 3.
10. **Menu editing ownership (Phase 2)** — confirm who will edit prices (owner vs staff vs developer). Drives whether the in-app `/admin` is enough or a friendlier CMS is justified.
11. **WebGL content scope** — the 3D concept (what the hero shows) needs creative direction + an asset budget; if assets/time are tight, we ship tier-2 (premium video hero) first and add 3D later. The fallback architecture makes this swap free.
12. **Brand assets/design system** — palette and fonts are provisional from the logo; recommend a short brand/design pass (senior-graphic-designer / senior-web-designer) before final UI to lock tokens.

---

## Appendix A — Brand tokens (provisional, from brief)

```css
:root {
  --color-primary: #1E8A3C;     /* green */
  --color-accent:  #E8431F;     /* orange-red */
  --color-gold:    #F2B705;     /* yellow/gold */
  --color-bg:      #FFFFFF;
  --color-bg-warm: #FBF7F0;
  --color-text:    #2B2118;     /* dark brown */
}
/* Fonts: Pacifico (display "Don Refugio"), Anton/Oswald (condensed accents), Inter/Poppins (body) */
```

Copys available: "Antojos que valen la pena", "Buen sabor, buenas porciones", "Pide, disfruta y regresa", "Sabores que hablan por sí mismos", "Toda una tradición en Villa de Álvarez".

---

## Appendix B — One-paragraph summary

Build a statically-generated **Next.js (App Router) + TypeScript + Tailwind** marketing site on **Vercel**, with a **React Three Fiber** WebGL hero that is a pure progressive enhancement behind robust feature detection and a video→image→CSS fallback chain so it can never break the page. Keep the menu in a **Zod-validated typed data file** read through a `getMenu()` seam and prices in **integer centavos**, so moving to **Neon Postgres + Drizzle** (Phase 2), adding **Route-Handler APIs + Clerk auth + Mercado Pago** (Phase 3), and an **Expo app sharing a `packages/core`** (Phase 4) are additive moves, not rewrites. Stay a single repo now, but keep domain types framework-free so the monorepo split is a move, not a refactor.
```
