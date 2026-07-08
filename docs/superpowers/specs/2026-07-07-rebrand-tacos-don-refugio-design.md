# Rebrand: Tacos Valente → Tacos Don Refugio — Design Spec

**Date:** 2026-07-07
**Status:** Approved

## Why

The prospective client ("Tacos Valente") did not accept the project proposal. This codebase becomes a **portfolio demo** under the user's `rigid-code` GitHub org/portfolio instead of a client deliverable. All traces of the former client's real brand and real contact information must be removed, and the site re-themed as a fictional taquería so it can be shown publicly without exposing anyone's real business data.

## Brand identity

| | Old | New |
|---|---|---|
| Name | Tacos Valente | **Tacos Don Refugio** |
| Tagline | "El Placer del Sabor" | "El Placer del Sabor" (kept) |
| City | Ciudad Guzmán | **Villa de Álvarez** |
| Region | Jalisco (Zapotlán el Grande) | **Colima** |
| Business type | Taquería, 3 sucursales, catering/eventos | Unchanged — same concept, new name/place |
| Color palette | Verde/Rojo/Oro/Café (brand-visual-direction.md §1) | Unchanged |
| Typography | Anton/Oswald/Nunito/Pacifico | Unchanged |

Local-pride cultural anchors in `brand-visual-direction.md` shift from Jalisco-specific (agave, "orgullo de Zapotlán el Grande") to Colima-specific: **Volcán de Colima** silhouette as the equivalent abstracted line-art motif, palm/coconut, and the state's coastal-tropical identity — same anti-kitsch rules apply (no mascots, no "tuba" gimmicks). Everything else in that document (photography direction, WebGL hero concept, type scale, iconography rules) stays as-is; it's the taquería's home-state anchor that changes.

## Logo

No image-generation tool is available in this environment, so the logo is built as **hand-coded SVG**, following the existing lockup style described in `brand-visual-direction.md` §3 (the "white circle" brand shape primitive):

- Circular retro seal/badge, white/cream circle base.
- Condensed display type (Anton/Oswald) for "TACOS DON REFUGIO" set on a circular baseline (text-on-path or stacked arc).
- Script accent (Pacifico) for a small flourish, echoing the "Bienvenidos" neon motif already established.
- Brand colors: `green-500 #1E8A3C`, `red-500 #E8431F`, `gold-500 #F2B705`, `brown-900 #2B2118`.

**Deliverables** (all derived from one master SVG source, kept in `src/` or `public/` as appropriate):

- `public/images/logo.png` (~480×246, matches current lockup aspect ratio used by `Header.tsx`, `Footer.tsx`, `LogoIntro.tsx`)
- `public/images/logo-icon.png`, `public/images/logo_bg.png` (regenerated square/icon variants — currently unused in code but kept for parity; safe to delete instead if the plan phase finds no consumer)
- `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` (Next.js App Router icon convention)
- Rasterization via a small Node script (e.g. `sharp` or `resvg`) run once during implementation — not a runtime dependency.

No component logic changes: `Header.tsx`, `Footer.tsx`, `LogoIntro.tsx` keep referencing `/images/logo.png` at their existing dimensions; only the asset and `alt` text (`Tacos Don Refugio — El Placer del Sabor`) change.

## Gallery images (masonry)

Current `public/images/gallery/comida-*.jpg` (7 files) are Facebook-sourced photos of the former client's real food with uncertain licensing — all get **deleted**.

Replacement: a varied set of freely-licensed images (**Picsum Photos**, CC0, no attribution required) chosen with **deliberately different aspect ratios** (portrait, square, wide landscape) so the existing CSS-columns masonry layout in `GalleryGrid.tsx` (already correct, no code change needed) visibly demonstrates the effect. Images do not need to depict food specifically — variety of composition is the point for this demo.

`src/content/gallery.data.ts` changes:
- Same schema/shape (`id`, `src`, `alt`, `width`, `height`, `category`, `caption`, `sortOrder`).
- New generic `alt`/`caption` text (no longer literally "tacos de Tacos Valente ... en Ciudad Guzmán"); can stay loosely themed to the gallery's original intent (events/food showcase) without over-claiming realism.
- Keep the two `eventos` placeholder entries pattern (self-healing via `existsSync` in `Gallery.tsx`) or resolve them with real placeholder files — plan phase decides based on how many total images are wanted for a good masonry demo (recommend 8–10 total).

## Content data files

All Spanish-facing copy keeps its structure; only brand/geography strings change:

- **`site.data.ts`**: `name`, `city`, `region`; `whatsappMessage`; `phonePrimary`/`phoneDisplay`/`whatsapp` become fictional Colima-area numbers (area code **312**); `social.facebook`/`social.instagram` become fictional handles (not the real `@tacosvalente_`).
- **`branches.data.ts`**: 3 sucursales re-sited to real Villa de Álvarez streets/colonias (e.g. Av. Constitución de 1917, Colonia Jardines, Camino Real) with fictional exact addresses — same `TODO(owner)` placeholder convention already in the file. `mapsUrl` query strings rebuilt around the new name/address. Existing `geo` omission rule (no fake coordinates) stays.
- **`menu.data.ts`**: swap the file header comment; the `// Tacos de ollita, estilo Ciudad Guzmán` code comment → `estilo Villa de Álvarez` (or generalized).
- **`avisos.data.ts`**: swap file header comment only (content is generic announcements, not brand-specific).
- **`gallery.schema.ts`** doc comment: swap brand name reference.

## Components & app metadata

- `Header.tsx`, `Footer.tsx`, `Contact.tsx`: hardcoded `aria-label="Facebook/Instagram de Tacos Valente"` → template literals using `site.name` (fixes a latent bug where these don't already follow `site.name` like the rest of the file).
- `Gallery.tsx`: copy string "Llevamos el sabor de Tacos Valente a tus fiestas y eventos en Ciudad Guzmán" → new name + Villa de Álvarez.
- `LogoIntro.tsx`: `alt` text update only.
- `layout.tsx`: `keywords` array entry `"Tacos Valente"` → `"Tacos Don Refugio"`; `twitter.site: "@tacosvalente_"` → new fictional handle; SEO strings already derive from `site.*` so city/region propagate automatically once `site.data.ts` changes.
- `opengraph-image.tsx`: hardcoded `alt` export, "Tacos Valente" text node, "El Placer del Sabor" stays, "Ciudad Guzmán, Jalisco" → "Villa de Álvarez, Colima". Generated via `ImageResponse` (code-only, no static asset dependency) so this is a pure text/string edit.
- `globals.css`: comment header + `Verde Valente` token comment label → generic or renamed comment (token hex values unchanged).
- `branch.schema.test.ts`: test fixture address/mapsUrl strings updated to match new fictional Villa de Álvarez data (values just need to stay schema-valid, not match production data exactly).

## Documentation rewrite

`README.md`, `docs/spec.md`, `docs/plan.md`, `docs/data-todo.md`, `docs/brand-visual-direction.md`, `docs/marketing-strategy.md`, `.agents/product-marketing.md`:

- Brand name and geography (Ciudad Guzmán/Zapotlán/Jalisco → Villa de Álvarez/Colima) replaced throughout.
- `README.md`'s explicit "the business is in Jalisco, not Colima" guard note gets **inverted**: this demo is explicitly Colima now.
- Narrative/strategy content (the marketing strategy reasoning, personas, phased plan structure) is **not** rewritten from scratch — only the brand/place nouns are swapped, since the conceptual playbook is still valid demo material for a taquería of this size.
- Real contact specifics quoted in these docs (phone numbers, `@tacosvalente_`) are replaced with the same fictional values used in `site.data.ts`, not left as real leftover data.

## Repository & infra rename

Highest-risk part of this change — touches shared/external state:

1. `package.json`: `"name": "tacos-valente"` → `"tacos-don-refugio"`.
2. `next.config.ts`: GitHub Pages `basePath`/comment `/tacosvalente` → `/tacos-don-refugio`.
3. Local folder: `C:\Repos\tacosvalente` → `C:\Repos\tacos-don-refugio`.
4. GitHub remote: `gh repo rename` on `edgaroviedo87/tacosvalente` → `edgaroviedo87/tacos-don-refugio`.

Step 4 affects Vercel's GitHub integration (auto-deploy webhook noted in project memory). GitHub's rename leaves a redirect on the old URL and Vercel's GitHub App typically follows renames automatically, but this must be **verified after the rename** (check that a push to `master` still triggers a Vercel deployment) before considering this step done. This is executed as its own explicit, confirmed step during implementation — not bundled silently with the content edits.

## Out of scope

- `public/images/hero-poster.png` and `public/video/*` — not brand-specific (generic warm background asset per `HeroBackground.tsx` fallback pattern), left untouched.
- No deep rewrite of the marketing strategy's reasoning/structure, only noun substitution (see above).
- No changes to unrelated recent work (LogoIntro steam animation logic, menu/branches domain schemas, routing).

## Verification criteria

- `grep -ri "valente" --include=*.{ts,tsx,css,md,json}` (excluding `node_modules`, `.git`) returns **zero matches**.
- `grep -ri "ciudad guzmán\|zapotlán\|jalisco"` (same scope) returns zero matches, except where intentionally contrasting old vs. new in this spec/history.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.
- Visual check: homepage loads with new logo (Header, Footer, LogoIntro steam reveal), Gallery section renders the new varied-aspect-ratio masonry set, Footer/Contact social links point to fictional handles.
- After the GitHub repo rename: a test push to `master` still produces a Vercel deployment.
