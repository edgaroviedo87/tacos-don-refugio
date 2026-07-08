# Rebrand: Tacos Valente → Tacos Don Refugio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every trace of the former client brand ("Tacos Valente", Ciudad Guzmán/Zapotlán el Grande, Jalisco) from this repo and re-theme it as a fictional demo brand ("Tacos Don Refugio", Villa de Álvarez, Colima) for the user's `rigid-code` portfolio, including a hand-built logo, a relicensed gallery image set, and (as the final, explicitly-gated step) a repo/folder rename.

**Architecture:** This is a content/asset migration, not new behavior — no new components or logic. Tasks touch one file (or one tightly-related group) at a time so no two edits collide. Two categories of task: (a) structural data/code edits with exact before/after content, and (b) a scripted bulk find-and-replace for prose docs, followed by a short manual pass for the handful of sentences that need real rewriting (not just noun-swapping).

**Tech Stack:** Next.js 16 / TypeScript / Zod content schemas / Vitest. New one-off devDependencies: `sharp` (SVG→PNG rasterization) and `to-ico` (PNG→ICO packing), used only by a build-time asset script.

**Reference:** `docs/superpowers/specs/2026-07-07-rebrand-tacos-don-refugio-design.md`

---

## Locked-in replacement data

| Field | Old | New |
|---|---|---|
| Brand name | Tacos Valente | Tacos Don Refugio |
| Tagline | El Placer del Sabor | El Placer del Sabor (unchanged) |
| City | Ciudad Guzmán | Villa de Álvarez |
| Region | Jalisco | Colima |
| Region nickname (flavor text) | Zapotlán el Grande | el Valle de Colima |
| Phone (primary/display) | 341 410 6627 | 312 145 9820 |
| WhatsApp (site-level, wa.me digits) | 523414106627 | 523121459820 |
| Matriz branch WhatsApp (display) | +52 1 341 134 6334 | +52 1 312 198 4471 |
| Facebook | https://www.facebook.com/ (unconfirmed) | https://www.facebook.com/tacosdonrefugio |
| Instagram | https://www.instagram.com/tacosvalente_/ | https://www.instagram.com/tacosdonrefugio/ |
| Twitter/X handle | @tacosvalente_ | @tacosdonrefugio |
| Domain (docs mentions) | tacosvalente.com | tacosdonrefugio.com |
| npm scope (docs/spec.md future-monorepo mentions) | @tacosvalente/core, @tacosvalente/api-client | @tacos-don-refugio/core, @tacos-don-refugio/api-client |
| package.json name | tacos-valente | tacos-don-refugio |
| GitHub Pages basePath | /tacosvalente | /tacos-don-refugio |
| Local folder | C:\Repos\tacosvalente | C:\Repos\tacos-don-refugio |
| GitHub repo | edgaroviedo87/tacosvalente | edgaroviedo87/tacos-don-refugio |

Branches (ids unchanged — `matriz`, `portal-centro`, `de-pasadita` — only display name/address/phone/mapsUrl change; `avisos.data.ts` and the test suite reference these ids and must keep working unmodified):

| id | name | address |
|---|---|---|
| `matriz` | Matriz — Av. Constitución de 1917 | Av. Constitución de 1917 s/n, Centro, Villa de Álvarez, Colima, México |
| `portal-centro` | Portal del Centro | Portal del Centro s/n, Colonia Jardines, Villa de Álvarez, Colima, México |
| `de-pasadita` | De Pasadita | Centro, Villa de Álvarez, Colima, México |

Test/demo geo coordinate for Villa de Álvarez (used only in `branch.schema.test.ts`): `{ lat: 19.26, lng: -103.73 }`.

---

### Task 1: Logo — SVG source + rasterized assets

**Files:**
- Create: `public/brand/logo-mark.svg`
- Create: `public/brand/logo-lockup.svg`
- Create: `scripts/generate-logo-assets.cjs`
- Modify: `package.json` (add devDependencies)
- Generates (overwrites): `public/images/logo.png`, `public/images/logo-icon.png`, `public/images/logo_bg.png`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`

Two SVG masters are hand-authored (not text-in-brand-font, to avoid depending on Anton/Oswald/Pacifico being installed as system fonts at rasterization time — `sharp`/librsvg only resolve fonts that are actually installed on the machine running the script, and these are self-hosted web fonts, not system fonts). Text uses a generic bold sans-serif fallback so it always rasterizes correctly; all brand identity color/shape stays exact.

- [ ] **Step 1: Author the square badge mark**

Create `public/brand/logo-mark.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="248" fill="#FBF7F0" stroke="#2B2118" stroke-width="12"/>
  <circle cx="256" cy="256" r="222" fill="none" stroke="#F2B705" stroke-width="4" stroke-dasharray="10 8"/>
  <path d="M 150 175 C 150 140, 362 140, 362 175 C 362 205, 320 205, 256 205 C 192 205, 150 205, 150 175 Z"
        fill="#1E8A3C"/>
  <text x="256" y="330" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="900"
        font-size="220" fill="#E8431F">R</text>
</svg>
```

- [ ] **Step 2: Author the wide lockup (icon + wordmark)**

Create `public/brand/logo-lockup.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 492">
  <g transform="translate(6,6) scale(0.95)">
    <circle cx="246" cy="246" r="238" fill="#FBF7F0" stroke="#2B2118" stroke-width="10"/>
    <circle cx="246" cy="246" r="214" fill="none" stroke="#F2B705" stroke-width="4" stroke-dasharray="9 7"/>
    <path d="M 145 168 C 145 135, 347 135, 347 168 C 347 197, 307 197, 246 197 C 185 197, 145 197, 145 168 Z"
          fill="#1E8A3C"/>
    <text x="246" y="318" text-anchor="middle"
          font-family="Arial, Helvetica, sans-serif" font-weight="900"
          font-size="210" fill="#E8431F">R</text>
  </g>
  <text x="540" y="205" font-family="Arial, Helvetica, sans-serif" font-weight="900"
        font-size="88" letter-spacing="4" fill="#2B2118">TACOS</text>
  <text x="540" y="300" font-family="Arial, Helvetica, sans-serif" font-weight="900"
        font-size="76" letter-spacing="2" fill="#E8431F">DON REFUGIO</text>
  <text x="540" y="360" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="40" fill="#2B2118">el placer del sabor</text>
</svg>
```

- [ ] **Step 3: Add rasterization dependencies**

```bash
pnpm add -D sharp to-ico
```

- [ ] **Step 4: Write the asset-generation script**

Create `scripts/generate-logo-assets.cjs`:

```js
/**
 * Rasterizes the two brand SVG masters into every PNG/ICO asset the app
 * references. Run once whenever public/brand/logo-*.svg changes.
 *
 * Usage: node scripts/generate-logo-assets.cjs
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const toIco = require('to-ico');

const ROOT = path.join(__dirname, '..');
const MARK = path.join(ROOT, 'public/brand/logo-mark.svg');
const LOCKUP = path.join(ROOT, 'public/brand/logo-lockup.svg');

async function renderPng(svgPath, width, height, outPath) {
  await sharp(svgPath).resize(width, height).png().toFile(outPath);
  console.log('wrote', path.relative(ROOT, outPath));
}

async function run() {
  // Wide lockup — used by Header/Footer/LogoIntro (aspect ratio 960:492 == 480:246).
  await renderPng(LOCKUP, 960, 492, path.join(ROOT, 'public/images/logo.png'));

  // Square mark — general-purpose icon assets.
  await renderPng(MARK, 512, 512, path.join(ROOT, 'public/images/logo-icon.png'));
  await renderPng(MARK, 512, 512, path.join(ROOT, 'public/images/logo_bg.png'));
  await renderPng(MARK, 256, 256, path.join(ROOT, 'src/app/icon.png'));
  await renderPng(MARK, 180, 180, path.join(ROOT, 'src/app/apple-icon.png'));

  // favicon.ico — pack 16/32/48 px PNGs into one multi-resolution ICO.
  const sizes = [16, 32, 48];
  const tmpFiles = [];
  for (const size of sizes) {
    const tmp = path.join(ROOT, `.tmp-favicon-${size}.png`);
    await sharp(MARK).resize(size, size).png().toFile(tmp);
    tmpFiles.push(tmp);
  }
  const buffers = tmpFiles.map((f) => fs.readFileSync(f));
  const icoBuffer = await toIco(buffers);
  fs.writeFileSync(path.join(ROOT, 'src/app/favicon.ico'), icoBuffer);
  tmpFiles.forEach((f) => fs.unlinkSync(f));
  console.log('wrote src/app/favicon.ico');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 5: Run it and verify outputs**

```bash
node scripts/generate-logo-assets.cjs
```

Expected: six "wrote ..." log lines, no errors, and `git status` shows the five PNG/ICO files as modified plus the two new SVGs untracked. **Font-fallback rendering can fail silently** (a missing font doesn't throw, it just renders blank text) — open `public/images/logo.png` and `public/images/logo-icon.png` in an image viewer and visually confirm the "R" glyph and "TACOS DON REFUGIO" wordmark actually render, not just that the file exists.

- [ ] **Step 6: Commit**

```bash
git add public/brand/ scripts/generate-logo-assets.cjs public/images/logo.png public/images/logo-icon.png public/images/logo_bg.png src/app/icon.png src/app/apple-icon.png src/app/favicon.ico package.json pnpm-lock.yaml
git commit -m "feat(brand): replace Tacos Valente logo with Tacos Don Refugio mark"
```

---

### Task 2: `site.data.ts` — brand identity & contact

**Files:**
- Modify: `src/content/site.data.ts`

- [ ] **Step 1: Replace the file contents**

```ts
/**
 * Site-level configuration: brand identity, contact channels, social, and nav.
 * Contact values are fictional demo data (portfolio piece, not a real business).
 * Geography: Villa de Álvarez, Colima.
 */
export const site = {
  name: "Tacos Don Refugio",
  tagline: "El Placer del Sabor",
  city: "Villa de Álvarez",
  region: "Colima",
  country: "México",

  phonePrimary: "3121459820", // national digits, no country code
  phoneDisplay: "312 145 9820",
  whatsapp: "523121459820", // wa.me format: country code (52) + number
  whatsappMessage: "¡Hola! Quiero hacer un pedido de Tacos Don Refugio.",

  social: {
    facebook: "https://www.facebook.com/tacosdonrefugio",
    instagram: "https://www.instagram.com/tacosdonrefugio/",
  },

  // Nav mixes real route links (/menu, /sucursales — indexable SEO pages) with
  // home-scoped anchors (/#avisos, … — work from any route via the home path).
  // All are driven through Next <Link> for soft, flash-free navigation.
  nav: [
    { label: "Menú", href: "/menu" },
    { label: "Sucursales", href: "/sucursales" },
    { label: "Avisos", href: "/#avisos" },
    { label: "Galería", href: "/#galeria" },
    { label: "Contacto", href: "/#contacto" },
  ],
} as const;

export const telUrl = `tel:+52${site.phonePrimary}`;
export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: no new errors from this file (downstream consumers still compile since the shape is unchanged).

- [ ] **Step 3: Commit**

```bash
git add src/content/site.data.ts
git commit -m "feat(brand): rename site identity to Tacos Don Refugio, Villa de Álvarez"
```

---

### Task 3: `branches.data.ts` — 3 sucursales

**Files:**
- Modify: `src/content/branches.data.ts`

- [ ] **Step 1: Replace the file contents**

```ts
/**
 * Branch content for Tacos Don Refugio — the 3 sucursales in Villa de Álvarez,
 * Colima.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - All addresses, phones, hours, and map URLs below are fictional demo data.
 * - `geo` is intentionally OMITTED on every branch: we have no confirmed
 *   coordinates and never emit fake ones. JSON-LD drops `geo` when absent
 *   (spec §5.6, plan M2.4). This is the correct state, not a gap.
 *
 * The literal is validated through `Branches.parse(...)` at module load, so an
 * invalid edit (bad slug id, non-URL mapsUrl, malformed hours) fails the build
 * rather than reaching production. Consumers must read branches via
 * `getBranches()` in `@/lib/content/branches`, never import this file directly.
 */

import { Branches } from "@/domain/branches/branch.schema";
import type { Branches as BranchesType } from "@/domain/branches/branch.types";

const branchesData = [
  {
    id: "matriz",
    name: "Matriz — Av. Constitución de 1917",
    address: "Av. Constitución de 1917 s/n, Centro, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+Av.+Constituci%C3%B3n+de+1917+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    whatsapp: "+52 1 312 198 4471",
    hours: [{ days: "Lunes a Domingo", open: "08:30", close: "22:30" }],
    restDay: "Martes",
    isDelivery: true,
  },
  {
    id: "portal-centro",
    name: "Portal del Centro",
    address: "Portal del Centro s/n, Colonia Jardines, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+Portal+del+Centro+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    hours: [{ days: "Lunes a Domingo", open: "08:30", close: "22:30" }],
    restDay: "Martes",
    isDelivery: false,
  },
  {
    id: "de-pasadita",
    name: "De Pasadita",
    address: "Centro, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+De+Pasadita+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    hours: [{ days: "Lunes a Domingo", open: "08:00", close: "22:00" }],
    restDay: "Martes",
    isDelivery: false,
  },
];

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Branches.parse` is what actually guarantees it.
 */
export const branches: BranchesType = Branches.parse(branchesData);
```

- [ ] **Step 2: Run the domain test suite**

```bash
pnpm vitest run src/domain/branches
```

Expected: PASS — ids (`matriz`, `portal-centro`, `de-pasadita`) and the `isDelivery` flags are unchanged, so `branch.schema.test.ts` (not yet edited — Task 4) still passes against this file.

- [ ] **Step 3: Commit**

```bash
git add src/content/branches.data.ts
git commit -m "feat(brand): relocate sucursales content to Villa de Álvarez, Colima"
```

---

### Task 4: `branch.schema.test.ts` — fixture data

**Files:**
- Modify: `src/domain/branches/branch.schema.test.ts:20-21,43`

- [ ] **Step 1: Update the address/mapsUrl fixture**

```diff
-    address: "Av. 1° de Mayo s/n, Centro, Ciudad Guzmán, Jalisco, México",
-    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tacos+Valente",
+    address: "Av. Constitución de 1917 s/n, Centro, Villa de Álvarez, Colima, México",
+    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio",
```

- [ ] **Step 2: Update the demo geo coordinate**

```diff
     const result = Branch.parse({
       ...baseBranch,
-      geo: { lat: 19.7, lng: -103.46 },
+      geo: { lat: 19.26, lng: -103.73 },
     });

-    expect(result.geo).toEqual({ lat: 19.7, lng: -103.46 });
+    expect(result.geo).toEqual({ lat: 19.26, lng: -103.73 });
```

- [ ] **Step 3: Run the test file**

```bash
pnpm vitest run src/domain/branches/branch.schema.test.ts
```

Expected: PASS, all 9 tests green.

- [ ] **Step 4: Commit**

```bash
git add src/domain/branches/branch.schema.test.ts
git commit -m "test(branches): update fixture to Villa de Álvarez, Colima"
```

---

### Task 5: Gallery images — replace the licensed-uncertain set with CC0 Picsum images

**Files:**
- Delete: `public/images/gallery/comida-desayuno.jpg`, `comida-tacos-1.jpg`, `comida-tacos-2.jpg`, `comida-tacos-3.jpg`, `comida-tacos-4.jpg`, `comida-torta-1.jpg`, `comida-torta-2.jpg`
- Create: `public/images/gallery/demo-01.jpg` … `demo-09.jpg`
- Modify: `src/content/gallery.data.ts`

Picsum Photos (picsum.photos) is CC0 — free to use, no attribution required — and lets you request a stable photo by numeric id at any pixel size via `/id/{id}/{width}/{height}`. The set below is chosen with deliberately different aspect ratios (portrait/landscape/square) so the existing CSS-columns masonry in `GalleryGrid.tsx` visibly staggers.

- [ ] **Step 1: Delete the old, licensing-uncertain photos**

```bash
git rm public/images/gallery/comida-desayuno.jpg public/images/gallery/comida-tacos-1.jpg public/images/gallery/comida-tacos-2.jpg public/images/gallery/comida-tacos-3.jpg public/images/gallery/comida-tacos-4.jpg public/images/gallery/comida-torta-1.jpg public/images/gallery/comida-torta-2.jpg
```

- [ ] **Step 2: Download the new set**

Picsum redirects every request to its CDN host (`fastly.picsum.photos`) with an HTTP 302 — **`-L` is required** or `curl -f` reports success while writing an empty 0-byte file (verified directly: without `-L` the command exits 0 but downloads nothing, because curl's `-f` only treats 4xx/5xx as failures, not 3xx redirects it wasn't told to follow).

```bash
curl -f -L -o public/images/gallery/demo-01.jpg "https://picsum.photos/id/1015/1200/1600"
curl -f -L -o public/images/gallery/demo-02.jpg "https://picsum.photos/id/1025/1600/1067"
curl -f -L -o public/images/gallery/demo-03.jpg "https://picsum.photos/id/1035/1200/1200"
curl -f -L -o public/images/gallery/demo-04.jpg "https://picsum.photos/id/1040/1067/1600"
curl -f -L -o public/images/gallery/demo-05.jpg "https://picsum.photos/id/1050/1600/900"
curl -f -L -o public/images/gallery/demo-06.jpg "https://picsum.photos/id/1060/1200/1500"
curl -f -L -o public/images/gallery/demo-07.jpg "https://picsum.photos/id/1074/1400/1400"
curl -f -L -o public/images/gallery/demo-08.jpg "https://picsum.photos/id/1080/1600/1067"
curl -f -L -o public/images/gallery/demo-09.jpg "https://picsum.photos/id/1084/1080/1620"
```

Expected: 9 files written, **none 0 bytes** (`ls -la public/images/gallery/demo-*.jpg` — every size must be nonzero, in practice 100KB–500KB each), each a valid JPEG matching its requested dimensions (`file public/images/gallery/demo-01.jpg` should report `1200x1600`, etc.). If the execution environment has no outbound network access, these commands will fail (timeout or connection error, not a silent empty file) — if so, stop and ask the user how to proceed (e.g. running this one task outside the sandboxed environment) rather than substituting placeholder content.

- [ ] **Step 3: Replace `gallery.data.ts`**

```ts
/**
 * Gallery content for Tacos Don Refugio.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - Images are CC0 (Picsum Photos, picsum.photos) demo placeholders chosen for
 *   varied aspect ratios so the masonry layout is visibly demonstrated; they do
 *   not depict food, and alt text describes the actual photo content — never
 *   claim these are real dishes/events.
 * - The geography is Villa de Álvarez, Colima.
 *
 * The literal is validated through `Gallery.parse(...)` at module load, so an
 * invalid edit (empty alt, non-positive dimension, etc.) fails the build rather
 * than reaching production. Consumers must read the gallery via `getGallery()`
 * in `@/lib/content/gallery`, never import this file directly.
 */

import { Gallery } from "@/domain/gallery/gallery.schema";
import type { Gallery as GalleryType } from "@/domain/gallery/gallery.types";

const galleryData = {
  images: [
    {
      id: "demo-01",
      src: "/images/gallery/demo-01.jpg",
      alt: "Río serpenteando entre montañas al atardecer",
      width: 1200,
      height: 1600,
      category: "ambiente",
      caption: "Paisaje natural",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1015",
      sortOrder: 10,
    },
    {
      id: "demo-02",
      src: "/images/gallery/demo-02.jpg",
      alt: "Perro sentado mirando a la cámara",
      width: 1600,
      height: 1067,
      category: "ambiente",
      caption: "Retrato",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1025",
      sortOrder: 20,
    },
    {
      id: "demo-03",
      src: "/images/gallery/demo-03.jpg",
      alt: "Sendero entre árboles en un bosque",
      width: 1200,
      height: 1200,
      category: "ambiente",
      caption: "Naturaleza",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1035",
      sortOrder: 30,
    },
    {
      id: "demo-04",
      src: "/images/gallery/demo-04.jpg",
      alt: "Formación rocosa en un cañón árido",
      width: 1067,
      height: 1600,
      category: "ambiente",
      caption: "Paisaje",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1040",
      sortOrder: 40,
    },
    {
      id: "demo-05",
      src: "/images/gallery/demo-05.jpg",
      alt: "Cadena montañosa bajo un cielo despejado",
      width: 1600,
      height: 900,
      category: "ambiente",
      caption: "Panorámica",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1050",
      sortOrder: 50,
    },
    {
      id: "demo-06",
      src: "/images/gallery/demo-06.jpg",
      alt: "Textura oscura abstracta con reflejos de luz",
      width: 1200,
      height: 1500,
      category: "ambiente",
      caption: "Textura",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1060",
      sortOrder: 60,
    },
    {
      id: "demo-07",
      src: "/images/gallery/demo-07.jpg",
      alt: "Zorro mirando de frente entre la vegetación",
      width: 1400,
      height: 1400,
      category: "ambiente",
      caption: "Fauna",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1074",
      sortOrder: 70,
    },
    {
      id: "demo-08",
      src: "/images/gallery/demo-08.jpg",
      alt: "Bosque cubierto de niebla matutina",
      width: 1600,
      height: 1067,
      category: "ambiente",
      caption: "Ambiente",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1080",
      sortOrder: 80,
    },
    {
      id: "demo-09",
      src: "/images/gallery/demo-09.jpg",
      alt: "Primer plano de un perro con la lengua afuera",
      width: 1080,
      height: 1620,
      category: "ambiente",
      caption: "Retrato",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1084",
      sortOrder: 90,
    },
  ],
};

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Gallery.parse` is what actually guarantees it.
 */
export const gallery: GalleryType = Gallery.parse(galleryData);
```

- [ ] **Step 4: Run the gallery test suite**

```bash
pnpm vitest run src/domain/gallery
```

Expected: PASS (Task 6 updates the one test whose assertion direction needs to flip — run this again after Task 6 to confirm both pass together).

- [ ] **Step 5: Commit**

```bash
git add public/images/gallery src/content/gallery.data.ts
git commit -m "feat(gallery): replace licensing-uncertain photos with CC0 varied-aspect demo set"
```

---

### Task 6: `gallery.schema.test.ts` — flip the geography guard

**Files:**
- Modify: `src/domain/gallery/gallery.schema.test.ts:1-8,87-92`

The old test asserted the gallery must never mention "Colima" (the wrong state for the real client). Now that Colima is correct, the regression to guard against is the *old* brand's geography leaking back in.

- [ ] **Step 1: Update the file header comment**

```diff
- * staying valid — including the geography rule (never "Colima").
+ * staying valid — including the geography rule (never the retired brand's
+ * "Jalisco" / "Ciudad Guzmán").
```

- [ ] **Step 2: Replace the guard test**

```diff
-  it("never references 'Colima' in alt or caption (geography rule)", () => {
-    for (const image of galleryData.images) {
-      expect(image.alt.toLowerCase()).not.toContain("colima");
-      expect((image.caption ?? "").toLowerCase()).not.toContain("colima");
-    }
-  });
+  it("never references the retired brand's geography in alt or caption", () => {
+    for (const image of galleryData.images) {
+      const alt = image.alt.toLowerCase();
+      const caption = (image.caption ?? "").toLowerCase();
+      expect(alt).not.toContain("jalisco");
+      expect(alt).not.toContain("ciudad guzmán");
+      expect(caption).not.toContain("jalisco");
+      expect(caption).not.toContain("ciudad guzmán");
+    }
+  });
```

- [ ] **Step 3: Run the test file**

```bash
pnpm vitest run src/domain/gallery/gallery.schema.test.ts
```

Expected: PASS, all tests green (including "uses only known categories" — `"ambiente"` is already a valid `GalleryCategory` option).

- [ ] **Step 4: Commit**

```bash
git add src/domain/gallery/gallery.schema.test.ts
git commit -m "test(gallery): guard against the retired brand's geography instead of Colima"
```

---

### Task 7: Components — Footer, Contact, Gallery, LogoIntro, About, Branches, BranchDetail, contact.ts

**Files:**
- Modify: `src/components/layout/Footer.tsx:28,73,82`
- Modify: `src/components/sections/Contact.tsx:58,67`
- Modify: `src/components/sections/Gallery.tsx:1-7,9-17,39`
- Modify: `src/components/hero/LogoIntro.tsx:156`
- Modify: `src/components/sections/About.tsx:7-18,25,27`
- Modify: `src/components/sections/Branches.tsx:21`
- Modify: `src/components/sections/BranchDetail.tsx:11`
- Modify: `src/lib/utils/contact.ts:4-5,28`

- [ ] **Step 1: Footer.tsx — tradition line + social aria-labels**

```diff
           <p className="type-script text-xl text-gold-500">{site.tagline}</p>
           <p className="type-body text-on-dark-muted">
-            Toda una tradición en Zapotlán el Grande, {site.city}, {site.region}.
+            Toda una tradición en el Valle de Colima, {site.city}, {site.region}.
           </p>
```

```diff
-              aria-label="Facebook de Tacos Valente"
+              aria-label={`Facebook de ${site.name}`}
```

```diff
-              aria-label="Instagram de Tacos Valente"
+              aria-label={`Instagram de ${site.name}`}
```

- [ ] **Step 2: Contact.tsx — social aria-labels**

```diff
-            aria-label="Facebook de Tacos Valente"
+            aria-label={`Facebook de ${site.name}`}
```

```diff
-            aria-label="Instagram @tacosvalente_"
+            aria-label={`Instagram de ${site.name}`}
```

- [ ] **Step 3: Gallery.tsx — import `site`, template the copy line, and fix the now-stale doc comment**

```diff
 import { existsSync } from "node:fs";
 import path from "node:path";
 import { Camera } from "lucide-react";
 import { getGallery } from "@/lib/content/gallery";
+import { site } from "@/content/site.data";
 import type { GalleryImage } from "@/domain/gallery/gallery.types";
```

The doc comment above `withExistingAssets` describes the old state (photos "blocked on licensing... not on disk yet"). Task 5 makes that false — the new Picsum files exist immediately — so update it to describe what the function actually guards now:

```diff
 /**
  * Keep only images whose file actually exists under `public/` at build time.
  *
- * The gallery photos are blocked on licensing (see gallery.data.ts), so the
- * authored entries point at files that are not on disk yet. Rendering broken
- * <img> tags would be worse than nothing, so we filter to present assets. This
- * is self-healing: the day the owner drops the licensed files in, they appear
- * with zero code change — and `width`/`height` already reserve correct space.
+ * Defensive filter: if a future edit to `gallery.data.ts` adds an entry before
+ * its image file exists on disk, this drops it instead of rendering a broken
+ * <img> tag. Self-healing — the entry appears with zero code change the moment
+ * its file lands, and `width`/`height` already reserve correct space.
  */
```

```diff
         <p className="type-body mt-3 text-text-muted">
-          Llevamos el sabor de Tacos Valente a tus fiestas y eventos en Ciudad Guzmán.
+          Llevamos el sabor de {site.name} a tus fiestas y eventos en {site.city}.
         </p>
```

- [ ] **Step 4: LogoIntro.tsx — alt text**

```diff
-            alt="Tacos Valente — El Placer del Sabor"
+            alt="Tacos Don Refugio — El Placer del Sabor"
```

- [ ] **Step 5: About.tsx — doc comment + heading + body copy**

```diff
 /**
- * Sobre Nosotros (plan M3.3). Brand story rooted in Zapotlán el Grande with
- * trust/proof points. On-brand, warm voice. Geography is Ciudad Guzmán,
- * Jalisco — never Colima.
+ * Sobre Nosotros (plan M3.3). Brand story rooted in Villa de Álvarez with
+ * trust/proof points. On-brand, warm voice. Geography is Villa de Álvarez,
+ * Colima — never the retired brand's Jalisco/Ciudad Guzmán.
  */
```

```diff
-        <h2 className="type-h2 mt-2">Toda una tradición en Zapotlán el Grande</h2>
+        <h2 className="type-h2 mt-2">Toda una tradición en Villa de Álvarez</h2>
         <p className="type-body-l mt-5 text-text-muted">
-          Nacimos en el corazón de Ciudad Guzmán y crecimos sirviendo el sabor que une a las
+          Nacimos en el corazón de Villa de Álvarez y crecimos sirviendo el sabor que une a las
           familias de la región. Cada taco, cada torta y cada orden lleva la misma sazón de
```

- [ ] **Step 6: Branches.tsx — intro copy**

```diff
           <p className="type-body mt-3 text-text-muted">
-            Tres puntos en Ciudad Guzmán para disfrutar el sabor de siempre.
+            Tres puntos en Villa de Álvarez para disfrutar el sabor de siempre.
           </p>
```

- [ ] **Step 7: BranchDetail.tsx — doc comment**

```diff
- * the conversion CTAs. Geography is Ciudad Guzmán, Jalisco — never Colima.
+ * the conversion CTAs. Geography is Villa de Álvarez, Colima — never the
+ * retired brand's Jalisco/Ciudad Guzmán.
```

- [ ] **Step 8: contact.ts — replace the old phone numbers used as doc-comment examples**

These are just illustrative examples in comments, but they're the *real* former client's real phone number, sitting in a repo about to become a public portfolio demo — fix them alongside everything else touching contact data.

```diff
 /**
  * Conversion-link helpers for per-branch `tel:` and `wa.me` targets.
  *
- * Branch contact values are authored as human strings (e.g. "341 410 6627" or
- * "+52 1 341 134 6334"). These helpers normalize them to dialable/clickable
+ * Branch contact values are authored as human strings (e.g. "312 145 9820" or
+ * "+52 1 312 198 4471"). These helpers normalize them to dialable/clickable
  * URLs without mutating the source data. Mexico (country code 52) is assumed for
  * bare national numbers; numbers that already carry a country code pass through.
  */
```

```diff
 /**
  * Build a `https://wa.me/...` URL with an optional prefilled message. A bare
  * 10-digit national number is prefixed with 52; longer numbers (already carrying
- * a country code, e.g. "5213411346334") pass through unchanged.
+ * a country code, e.g. "5213121984471") pass through unchanged.
  */
```

- [ ] **Step 9: Run the component/unit test suite and build**

```bash
pnpm typecheck && pnpm lint && pnpm test
```

Expected: all pass, no unused-import or type errors (Gallery.tsx's new `site` import is used).

- [ ] **Step 10: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/sections/Contact.tsx src/components/sections/Gallery.tsx src/components/hero/LogoIntro.tsx src/components/sections/About.tsx src/components/sections/Branches.tsx src/components/sections/BranchDetail.tsx src/lib/utils/contact.ts
git commit -m "feat(brand): update component copy, aria-labels, and contact.ts examples to Tacos Don Refugio"
```

---

### Task 8: App metadata — layout.tsx, opengraph-image.tsx, sitemap.ts, globals.css

**Files:**
- Modify: `src/app/layout.tsx:26,29-34,45`
- Modify: `src/app/opengraph-image.tsx:4,59,93`
- Modify: `src/app/sitemap.ts:8`
- Modify: `src/app/globals.css:4,11`

- [ ] **Step 1: layout.tsx — description flavor text, keywords, twitter handle**

```diff
-  description: `${site.name}, toda una tradición en Zapotlán el Grande. Tacos, tortas y órdenes en ${site.city}, ${site.region}. ${site.tagline}.`,
+  description: `${site.name}, toda una tradición en el Valle de Colima. Tacos, tortas y órdenes en ${site.city}, ${site.region}. ${site.tagline}.`,
   applicationName: site.name,
   keywords: [
-    "tacos Ciudad Guzmán",
-    "taquería Zapotlán el Grande",
-    "tortas Ciudad Guzmán",
-    "tacos a domicilio Ciudad Guzmán",
-    "catering taquería Ciudad Guzmán",
-    "Tacos Valente",
+    "tacos Villa de Álvarez",
+    "taquería Villa de Álvarez",
+    "tortas Villa de Álvarez",
+    "tacos a domicilio Villa de Álvarez",
+    "catering taquería Villa de Álvarez",
+    "Tacos Don Refugio",
   ],
```

```diff
   twitter: {
     card: "summary_large_image",
-    site: "@tacosvalente_",
+    site: "@tacosdonrefugio",
   },
```

- [ ] **Step 2: opengraph-image.tsx — alt export, brand text, location line**

```diff
-export const alt = "Tacos Valente — El Placer del Sabor | Ciudad Guzmán, Jalisco";
+export const alt = "Tacos Don Refugio — El Placer del Sabor | Villa de Álvarez, Colima";
```

```diff
-          Tacos Valente
+          Tacos Don Refugio
```

```diff
-          Ciudad Guzmán, Jalisco · Tacos · Tortas · Eventos
+          Villa de Álvarez, Colima · Tacos · Tortas · Eventos
```

- [ ] **Step 3: sitemap.ts — comment**

```diff
- * Sitemap (plan M4.5). Enumerates every indexable route.
- * Geography: all routes target Ciudad Guzmán / Zapotlán el Grande.
+ * Sitemap (plan M4.5). Enumerates every indexable route.
+ * Geography: all routes target Villa de Álvarez, Colima.
```

- [ ] **Step 4: globals.css — header comment + Verde token label**

```diff
 /*
- * Tacos Valente — design tokens (brand-visual-direction.md §1).
+ * Tacos Don Refugio — design tokens (brand-visual-direction.md §1).
```

```diff
-  --color-green-500: #1e8a3c; /* Verde Valente — brand primary, large/display only */
+  --color-green-500: #1e8a3c; /* Verde Refugio — brand primary, large/display only */
```

- [ ] **Step 5: Verify the OG image renders**

```bash
pnpm dev
```

Visit `http://localhost:3000/opengraph-image` in a browser — confirm "Tacos Don Refugio" / "El Placer del Sabor" / "Villa de Álvarez, Colima · Tacos · Tortas · Eventos" render inside the 1200×630 frame without clipping. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/opengraph-image.tsx src/app/sitemap.ts src/app/globals.css
git commit -m "feat(brand): update app metadata, OG image, and design-token comments"
```

---

### Task 9: SEO lib — jsonld.ts, metadata.ts

**Files:**
- Modify: `src/lib/seo/jsonld.ts:1-16`
- Modify: `src/lib/seo/metadata.ts:1-16,30-31,49,67,85`

These two files hardcode their own copies of city/region (a pre-existing duplication with `site.data.ts`) — out of scope to refactor away in this rebrand, but the literal values must move in lockstep with `site.data.ts`.

- [ ] **Step 1: jsonld.ts — comment + consts**

```diff
 /**
  * JSON-LD structured data builders (plan M4.3, M4.4).
  *
- * Geography contract: addressLocality ALWAYS "Ciudad Guzmán",
- * addressRegion ALWAYS "Jalisco", addressCountry "MX". NEVER Colima.
+ * Geography contract: addressLocality ALWAYS "Villa de Álvarez",
+ * addressRegion ALWAYS "Colima", addressCountry "MX". NEVER the retired
+ * brand's Jalisco/Ciudad Guzmán.
  * `geo` is only emitted when real coordinates are present (no fake data).
  */
```

```diff
-const ADDRESS_LOCALITY = "Ciudad Guzmán";
-const ADDRESS_REGION = "Jalisco";
+const ADDRESS_LOCALITY = "Villa de Álvarez";
+const ADDRESS_REGION = "Colima";
```

- [ ] **Step 2: metadata.ts — comment + consts (rename `ZAPOTLAN` → `REGION_NICKNAME`)**

```diff
 /**
  * Shared metadata builders for the Next.js Metadata API (plan M4.1).
  *
  * Each page imports one of these builders to derive its per-route metadata.
  * The root `metadataBase` + `lang` live in layout.tsx; these build on top.
- * Geography is Ciudad Guzmán, Jalisco — NEVER Colima.
+ * Geography is Villa de Álvarez, Colima — NEVER the retired brand's
+ * Jalisco/Ciudad Guzmán.
  */

 import type { Metadata } from "next";
 import { site } from "@/content/site.data";
 import type { Branch } from "@/domain/branches/branch.types";

 const SITE_NAME = site.name;
-const CITY = "Ciudad Guzmán";
-const REGION = "Jalisco";
-const ZAPOTLAN = "Zapotlán el Grande";
+const CITY = "Villa de Álvarez";
+const REGION = "Colima";
+const REGION_NICKNAME = "el Valle de Colima";
```

Then update the three remaining `ZAPOTLAN` usages to `REGION_NICKNAME`:

```diff
   const title = `${SITE_NAME} — ${site.tagline} | Tacos en ${CITY}`;
-  const description = `Taquería ${SITE_NAME} — toda una tradición en ${ZAPOTLAN}, ${CITY}, ${REGION}. Tacos, tortas y órdenes con el sabor de siempre. Servicio de eventos y catering.`;
+  const description = `Taquería ${SITE_NAME} — toda una tradición en ${REGION_NICKNAME}, ${CITY}, ${REGION}. Tacos, tortas y órdenes con el sabor de siempre. Servicio de eventos y catering.`;
```

```diff
-  const description = `Tres sucursales de ${SITE_NAME} en ${CITY}, ${REGION} (${ZAPOTLAN}). Horarios, direcciones y cómo llegar.`;
+  const description = `Tres sucursales de ${SITE_NAME} en ${CITY}, ${REGION} (${REGION_NICKNAME}). Horarios, direcciones y cómo llegar.`;
```

(The `menuMetadata`/`branchMetadata` functions use `CITY`/`REGION` only, not `ZAPOTLAN` — no change needed there beyond the const values already updated above.)

- [ ] **Step 3: Typecheck (catches any missed `ZAPOTLAN` reference as an undefined-name error)**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo/jsonld.ts src/lib/seo/metadata.ts
git commit -m "feat(seo): update hardcoded geography in JSON-LD and metadata builders"
```

---

### Task 10: Comment-only content files — menu.data.ts, avisos.data.ts, gallery.schema.ts

**Files:**
- Modify: `src/content/menu.data.ts:2,26`
- Modify: `src/content/avisos.data.ts:2`
- Modify: `src/domain/gallery/gallery.schema.ts:4`

- [ ] **Step 1: menu.data.ts**

```diff
 /**
- * Menu content for Tacos Valente.
+ * Menu content for Tacos Don Refugio.
```

```diff
-    // Tacos de ollita, estilo Ciudad Guzmán: precio único, se elige la carne.
+    // Tacos de ollita, estilo Villa de Álvarez: precio único, se elige la carne.
```

- [ ] **Step 2: avisos.data.ts**

```diff
 /**
- * Avisos (announcements) content for Tacos Valente.
+ * Avisos (announcements) content for Tacos Don Refugio.
```

- [ ] **Step 3: gallery.schema.ts**

```diff
 /**
  * Gallery domain schema — single source of truth for the gallery contract.
  *
- * The gallery's purpose is event/catering proof: photos of Tacos Valente
+ * The gallery's purpose is event/catering proof: photos of Tacos Don Refugio
  * serving events ("eventos") lead, with food ("comida") and atmosphere
```

- [ ] **Step 4: Run the full test suite**

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/menu.data.ts src/content/avisos.data.ts src/domain/gallery/gallery.schema.ts
git commit -m "docs(content): update brand/geography comments in menu, avisos, gallery schema"
```

---

### Task 11: Bulk prose-doc substitution script

**Files:**
- Create: `scripts/rebrand-docs.mjs` (temporary, deleted at the end of this task)
- Modify: `README.md`, `docs/spec.md`, `docs/plan.md`, `docs/data-todo.md`, `docs/brand-visual-direction.md`, `docs/marketing-strategy.md`, `docs/plan-validation.md`, `.agents/product-marketing.md`

These 8 prose docs share the same mechanical substitutions (brand name, geography, phone numbers, handles, domain, npm scope). A script guarantees every occurrence is caught consistently; Task 12 then makes the handful of context-sensitive edits (sentences that need real rewriting, not noun-swapping) that this script deliberately does not attempt.

- [ ] **Step 1: Write the script**

Create `scripts/rebrand-docs.mjs`:

```js
/**
 * One-off bulk find-and-replace for the Tacos Valente → Tacos Don Refugio
 * rebrand. Ordered pairs: longer/compound patterns first so they consume
 * their text before a shorter, more general pattern would partially match it.
 * Run once, then delete this script (see plan Task 11, step 4).
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "README.md",
  "docs/spec.md",
  "docs/plan.md",
  "docs/data-todo.md",
  "docs/brand-visual-direction.md",
  "docs/marketing-strategy.md",
  "docs/plan-validation.md",
  ".agents/product-marketing.md",
];

const replacements = [
  ["Ciudad Guzmán (Zapotlán el Grande), Jalisco, Mexico", "Villa de Álvarez, Colima, Mexico"],
  ["Ciudad Guzmán (Zapotlán el Grande), Jalisco", "Villa de Álvarez, Colima"],
  ["Zapotlán el Grande", "Villa de Álvarez"],
  ["Ciudad Guzmán, Jalisco", "Villa de Álvarez, Colima"],
  ["Ciudad Guzmán", "Villa de Álvarez"],
  ["Jalisco", "Colima"],
  ["@tacosvalente_", "@tacosdonrefugio"],
  ["instagram.com/tacosvalente_", "instagram.com/tacosdonrefugio"],
  ["tacosvalente.com", "tacosdonrefugio.com"],
  ["@tacosvalente/core", "@tacos-don-refugio/core"],
  ["@tacosvalente/api-client", "@tacos-don-refugio/api-client"],
  ["341 410 6627", "312 145 9820"],
  ["341 134 6334", "312 198 4471"],
  ["Valente", "Don Refugio"],
];

for (const file of files) {
  let text = readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  writeFileSync(file, text);
  console.log("rewrote", file);
}
```

- [ ] **Step 2: Run it**

```bash
node scripts/rebrand-docs.mjs
```

Expected: 8 "rewrote ..." lines.

- [ ] **Step 3: Spot-check the diff**

```bash
git diff --stat README.md docs/spec.md docs/plan.md docs/data-todo.md docs/brand-visual-direction.md docs/marketing-strategy.md docs/plan-validation.md .agents/product-marketing.md
```

Expected: all 8 files show changes. Skim `git diff docs/marketing-strategy.md` in particular — confirm "Club Valente" → "Club Don Refugio", "Equipo Valente" → "Equipo Don Refugio" all read grammatically (the single `"Valente" → "Don Refugio"` rule handles these compound phrases automatically since they contain "Valente" as a substring).

- [ ] **Step 4: Delete the one-off script**

```bash
rm scripts/rebrand-docs.mjs
```

- [ ] **Step 5: Commit**

```bash
git add README.md docs/spec.md docs/plan.md docs/data-todo.md docs/brand-visual-direction.md docs/marketing-strategy.md docs/plan-validation.md .agents/product-marketing.md
git commit -m "docs: bulk-rename brand and geography across prose documentation"
```

---

### Task 12: Manual doc fixups (context-sensitive rewrites the script can't do)

**Files:**
- Modify: `README.md` (full rewrite — small file)
- Modify: `docs/data-todo.md:1,5-6`
- Modify: `docs/brand-visual-direction.md` (§3 Mexican/taquería motifs section)
- Modify: `.agents/product-marketing.md:14,21`
- Modify: `docs/plan-validation.md:28`
- Modify: `docs/plan.md:4,48,308,357,433,445,463,631,667,685,724`

**Why this file list is longer than "the sentences with a Jalisco/Ciudad Guzmán word in them":** the bulk script in Task 11 does a blind `Jalisco → Colima` substitution. Most of the repo talks about the *correct* geography, so that's exactly right. But roughly a dozen sentences across these files are **guard clauses that assert "Colima" is wrong** (leftover QA rules from when the real business was in Jalisco and Colima was the neighboring state to never be confused with it). After the script runs, those sentences still say "never Colima" / "NOT in Colima" / "zero occurrences of Colima" — except now Colima is correct, so they've flipped into self-contradictions that no token-based grep can catch (the forbidden word they contain, "Colima", is now also the *correct* word appearing everywhere else on the same page). These have to be found by reading for meaning, not by pattern-matching, which is why this task enumerates them explicitly up front instead of leaving them to a final grep.

- [ ] **Step 1: Rewrite `README.md`**

The script already ran on this file (Task 11), so `site.tagline`/name text is already correct; this step replaces the intro paragraph, which had a Jalisco-specific guard sentence the script intentionally left alone (it doesn't match any of the ordered pairs as a coherent sentence).

```diff
-# Tacos Don Refugio — "El Placer del Sabor"
+# Tacos Don Refugio — "El Placer del Sabor"

-Marketing website for **Tacos Don Refugio**, a traditional taquería in **Villa de Álvarez
-, Colima, Mexico** — being modernized. Note: the business is in
-**Colima, not Colima**.
+Marketing website for **Tacos Don Refugio**, a fictional traditional taquería in
+**Villa de Álvarez, Colima, Mexico**. This is a portfolio demo — there is no real
+business behind this brand.
```

(The exact broken text you'll see before this edit — "the business is in **Colima, not Colima**" — is the script's literal output of the old guard sentence "the business is in **Jalisco, not Colima**"; both words were geography terms so the blanket `Jalisco → Colima` rule collided with itself here, confirming this sentence needed a manual pass.)

- [ ] **Step 2: Fix `docs/data-todo.md`'s geography guard line**

The script already flipped "Ciudad Guzmán, Jalisco" and the phone number in this file; this step rewrites the one sentence whose *meaning* (not just its nouns) needs to change — it was a guard against a wrong answer, and that guard is now backwards.

```diff
 Placeholder data is used during development and is clearly marked in the content files with
 `// TODO(owner): confirm ...`. Each item below must be delivered (or explicitly accepted as a
-placeholder) before the production launch (plan M7.2). **Geography rule: Villa de Álvarez, Colima —
-NEVER Colima.**
+placeholder) before the production launch (plan M7.2). **Geography rule: Villa de Álvarez, Colima.
+This is a portfolio demo (fictional brand), not the original client's real business — do not
+reintroduce the retired brand's Jalisco/Ciudad Guzmán geography.**
```

- [ ] **Step 3: Adapt `docs/brand-visual-direction.md` §3 motifs to Colima**

The script already renamed "Zapotlán el Grande" → "Villa de Álvarez" everywhere (including in the brand-personality section), but the *specific cultural icons* in the "Mexican / taquería motifs" section are Jalisco-specific and need real content changes, not noun-swapping.

```diff
 ### Mexican / taquería motifs — authentic, not kitsch

 Build a **small custom motif set** in the same line style, used as accents (never wallpaper):

-- **Allowed, abstracted, single-color:** lime wedge, chile (de árbol — local & real to their salsa), diced onion, cilantro sprig, pickled carrot round + jalapeño (these literally appear in their tacos — use *their* real garnish as the icon language), the **comal/tortilla**, **agave** silhouette (Colima pride), steam wisps, a simple **papel picado** strip *abstracted to one color* as a section divider.
+- **Allowed, abstracted, single-color:** lime wedge, chile (de árbol — local & real to their salsa), diced onion, cilantro sprig, pickled carrot round + jalapeño (these literally appear in their tacos — use *their* real garnish as the icon language), the **comal/tortilla**, **Volcán de Colima** silhouette (the state's defining landmark — Colima pride, the equivalent local-pride anchor the agave motif served in the retired Jalisco identity), steam wisps, a simple **papel picado** strip *abstracted to one color* as a section divider.
```

Also fix the one line the bulk script mangled in the same way as the README (a sentence that contained "Jalisco" purely as a contrast word, not paired with the old city name):

```bash
grep -n "Colima pride" docs/brand-visual-direction.md
```

Confirm only the line just edited above matches (the diff already fixed it — this greps to verify no second occurrence was missed).

- [ ] **Step 4: Fix the "never Colima" guard clauses — `.agents/product-marketing.md`**

```diff
-> **SEO geography — critical:** the business is in **Villa de Álvarez, municipality of Villa de Álvarez, Colima, Mexico**. It is **NOT in Colima** (despite proximity to the Colima state border and the Volcán de Colima). Never target "Colima" in keywords, copy, metadata, schema, or Google Business Profile. Always use Villa de Álvarez / Villa de Álvarez / Colima.
+> **SEO geography — critical:** the business is in **Villa de Álvarez, Colima, Mexico**. (This content was originally authored for a different, real prospective client located in Ciudad Guzmán, Jalisco; that geography is retired and must never reappear in copy, keywords, metadata, schema, or Google Business Profile.) Always use Villa de Álvarez / Colima.
```

```diff
-**Geography:** Villa de Álvarez / Villa de Álvarez (~100k+), word-of-mouth dominant market.
+**Geography:** Villa de Álvarez, Colima (~100k+ metro area), word-of-mouth dominant market.
```

- [ ] **Step 5: Fix the same pattern in `docs/plan-validation.md:28`**

```diff
-- No contradictions on geography (Ciudad Guzmán / Jalisco / never Colima), NAP, or no-backend
+- No contradictions on geography (Villa de Álvarez / Colima — this validation predates the
+  rebrand and originally checked Ciudad Guzmán / Jalisco / never Colima), NAP, or no-backend
   non-goals.
```

- [ ] **Step 6: Fix the ~11 "never/zero Colima" guard clauses in `docs/plan.md`**

```diff
-**Location of business:** Ciudad Guzmán (Zapotlán el Grande), Jalisco, Mexico. **NEVER Colima.**
+**Location of business:** Villa de Álvarez, Colima, Mexico. (Historical note: earlier revisions of
+this plan were written for a different, real prospective client in Ciudad Guzmán, Jalisco; that
+geography is retired.)
```

```diff
-- **NEVER** target or mention "Colima" anywhere (keywords, copy, metadata, schema, alt text).
+- **NEVER** target or mention the retired brand's "Jalisco"/"Ciudad Guzmán" anywhere (keywords, copy, metadata, schema, alt text).
```

```diff
-      alt: z.string(),               // required — SEO + a11y, Spanish, NO "Colima"
+      alt: z.string(),               // required — SEO + a11y, Spanish, NO "Jalisco"/"Ciudad Guzmán"
```

```diff
-  - Verify: semantic content, AA contrast, responsive; copy matches approved customer language; no Colima.
+  - Verify: semantic content, AA contrast, responsive; copy matches approved customer language; no Jalisco/Ciudad Guzmán.
```

```diff
-> Geography rule enforced everywhere: `addressLocality: "Villa de Álvarez"`,
-> `addressRegion: "Colima"`, `addressCountry: "MX"`. **NEVER Colima.** Target queries: "tacos Villa
+> Geography rule enforced everywhere: `addressLocality: "Villa de Álvarez"`,
+> `addressRegion: "Colima"`, `addressCountry: "MX"`. **NEVER the retired brand's Jalisco/Ciudad
+> Guzmán.** Target queries: "tacos Villa
 > de Álvarez", "taquería Villa de Álvarez", "tortas Villa de Álvarez", "tacos a domicilio Villa de Álvarez".
```

```diff
-  - Verify: each route's View Source shows a unique correct `<title>`, description with "Villa de Álvarez",
-    a self-referential canonical, and `lang="es-MX"`; **no occurrence of "Colima"** anywhere (grep the built HTML).
+  - Verify: each route's View Source shows a unique correct `<title>`, description with "Villa de Álvarez",
+    a self-referential canonical, and `lang="es-MX"`; **no occurrence of "Jalisco" or "Ciudad Guzmán"** anywhere (grep the built HTML).
```

```diff
-  - Verify: Google Rich Results Test passes for each branch page; `addressLocality` is "Villa de Álvarez" in all;
-    no `geo` emitted when coords absent (no fake data); **no "Colima"**.
+  - Verify: Google Rich Results Test passes for each branch page; `addressLocality` is "Villa de Álvarez" in all;
+    no `geo` emitted when coords absent (no fake data); **no "Jalisco"/"Ciudad Guzmán"**.
```

```diff
-  - Verify: production loads on real domain; canonical correct; GSC accepts sitemap; Rich Results pass on
-    production URLs; final Lighthouse run meets all §1.4 targets; **no "Colima" anywhere**.
+  - Verify: production loads on real domain; canonical correct; GSC accepts sitemap; Rich Results pass on
+    production URLs; final Lighthouse run meets all §1.4 targets; **no "Jalisco"/"Ciudad Guzmán" anywhere**.
```

```diff
-- [ ] **Zero** occurrences of "Colima" in code, copy, metadata, JSON-LD, alt text (grep the build).
+- [ ] **Zero** occurrences of "Jalisco"/"Ciudad Guzmán" in code, copy, metadata, JSON-LD, alt text (grep the build).
```

```diff
-| 7 | **Geography mistake (Colima)** creeping into copy/schema | SEO damage, brand error | Hard rule in code review + a build-time grep check for "Colima" in M4.5/M7.2 | n/a (non-negotiable) |
+| 7 | **Geography mistake (the retired brand's Jalisco/Ciudad Guzmán)** creeping into copy/schema | SEO damage, brand error | Hard rule in code review + a build-time grep check for "Jalisco"/"Ciudad Guzmán" in M4.5/M7.2 | n/a (non-negotiable) |
```

```diff
-      OG/Twitter cards; semantic HTML; alt text. **Zero "Colima" anywhere.**
+      OG/Twitter cards; semantic HTML; alt text. **Zero "Jalisco"/"Ciudad Guzmán" anywhere.**
```

- [ ] **Step 7: Systematic sweep for any remaining guard-clause you might have missed**

```bash
grep -in "not in colima\|never.*colima\|no colima\|zero.*colima\|colima.*never\|no \"colima\"" README.md docs/*.md .agents/*.md
```

Expected: **no output**. Anything this turns up is another instance of the same contradiction class — fix it the same way (invert which geography is the forbidden one).

- [ ] **Step 8: Full-text read-through for the original class of leftover (old geography tokens)**

```bash
grep -n -i "jalisco\|zapotlán\|ciudad guzmán" README.md docs/*.md .agents/*.md
```

Expected: **zero matches** outside of the deliberate historical-note sentences just written in steps 4–6 (those intentionally *name* the retired brand's geography as context for why it's retired — that's correct, not a leftover).

- [ ] **Step 9: Commit**

```bash
git add README.md docs/data-todo.md docs/brand-visual-direction.md .agents/product-marketing.md docs/plan-validation.md docs/plan.md
git commit -m "docs: fix context-sensitive geography sentences the bulk script couldn't rewrite"
```

---

### Task 13: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Confirm zero brand-name leftovers**

```bash
grep -rli "valente" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.md" --include="*.json" . | grep -v node_modules
```

Expected: **no output**.

- [ ] **Step 2: Confirm zero old-geography leftovers**

```bash
grep -rli "jalisco\|zapotlán\|ciudad guzmán" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.md" --include="*.json" . | grep -v node_modules
```

Expected: **no output** (except, if you inspect the matches by hand, the deliberate historical-note sentences added in Task 12 steps 4–6 that intentionally name the retired brand's geography as context — those are correct, not a leftover; the file list itself should still be limited to `README.md`, `docs/data-todo.md`, `.agents/product-marketing.md`, `docs/plan-validation.md`, `docs/plan.md`).

- [ ] **Step 3: Confirm zero leftover "never Colima" guard-clause contradictions**

```bash
grep -rin "not in colima\|never.*colima\|no colima\|zero.*colima\|colima.*never" --include="*.md" . | grep -v node_modules
```

Expected: **no output**. This catches the self-contradiction class from Task 12 (a sentence that still forbids the word "Colima" even though Colima is now the correct region) — a plain old-token grep can't find these because the forbidden word itself was never replaced, only its meaning flipped.

- [ ] **Step 4: Confirm zero leftover real phone numbers**

```bash
grep -rl "3414106627\|341 410 6627\|3411346334\|341 134 6334\|5213411346334" --include="*.ts" --include="*.tsx" --include="*.md" . | grep -v node_modules
```

Expected: **no output**. This is the former client's real phone number (`src/lib/utils/contact.ts`'s doc-comment examples were the one place it hid outside the obviously-brand-named content files) — worth its own explicit check since it won't contain "valente" or "jalisco" and so wouldn't be caught by Steps 1–2.

- [ ] **Step 5: Full toolchain check**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Expected: all four succeed. `pnpm build` is the strongest signal — it runs `opengraph-image.tsx` for real and would fail on any leftover reference to a removed asset.

- [ ] **Step 6: Manual browser check**

```bash
pnpm dev
```

Open `http://localhost:3000`:
- Header/Footer show the new circular-seal logo (not the old one).
- The one-time `LogoIntro` steam/reveal animation on first load shows the new logo.
- Gallery section renders 9 images in a 1/2/3-column masonry (resize the window to confirm the column count changes and image heights visibly stagger).
- Footer/Contact social icons point at `facebook.com/tacosdonrefugio` and `instagram.com/tacosdonrefugio` (inspect the `href`s).
- `/sucursales` lists the 3 branches with Villa de Álvarez addresses.

Stop the dev server when done.

- [ ] **Step 7: No commit this task** — it's verification-only. If any step surfaces something, fix it in the file it belongs to and commit there, then re-run this task's checks.

---

### Task 14: Infra naming — package.json, next.config.ts

**Files:**
- Modify: `package.json:2`
- Modify: `next.config.ts:11-12`

This is separated from Task 15 (the actual repo/folder rename) because it's a plain, safe file edit with no effect on the live shell session — the folder/remote rename in Task 15 is the risky part.

- [ ] **Step 1: package.json**

```diff
-  "name": "tacos-valente",
+  "name": "tacos-don-refugio",
```

- [ ] **Step 2: next.config.ts**

```diff
-  // Sub-path on GitHub Pages: https://edgaroviedo87.github.io/tacosvalente
-  basePath: isGithubPages ? "/tacosvalente" : "",
+  // Sub-path on GitHub Pages: https://edgaroviedo87.github.io/tacos-don-refugio
+  basePath: isGithubPages ? "/tacos-don-refugio" : "",
```

- [ ] **Step 3: Verify the build still works**

```bash
pnpm build
```

Expected: succeeds (this doesn't touch runtime behavior on Vercel, since `basePath` only activates when `GITHUB_PAGES=true`).

- [ ] **Step 4: Commit**

```bash
git add package.json next.config.ts
git commit -m "chore: rename package to tacos-don-refugio"
```

---

### Task 15: Repository rename (GitHub remote + local folder) — final, explicitly-gated step

**This step is different from every other task in this plan: it must be run by the user, not by an agent inside the current session.** The reason: the live shell's working directory is `C:\Repos\tacosvalente`. Renaming that directory out from under an active process's current-directory handle is undefined/unsafe on Windows — the running session could silently keep writing into a stale path, or start failing tool calls, mid-task. Every prior task in this plan is safe to run from inside the session; this one is not.

- [ ] **Step 1 (agent may run this from inside the session): rename the GitHub remote repo**

```bash
gh repo rename tacos-don-refugio --repo edgaroviedo87/tacosvalente
```

Expected output confirms the rename; GitHub automatically keeps the old URL (`github.com/edgaroviedo87/tacosvalente`) as a redirect to the new one.

- [ ] **Step 2 (agent may run this): point the local git remote at the new URL**

```bash
git remote set-url origin https://github.com/edgaroviedo87/tacos-don-refugio.git
git remote -v
```

Expected: both `fetch`/`push` lines show the new URL.

- [ ] **Step 3 (agent may run this): push and confirm Vercel still auto-deploys**

```bash
git push origin master
```

Then check the Vercel dashboard (or `vercel ls` / `vercel inspect` if the CLI is linked) for a new deployment triggered by this push. GitHub's rename redirect means the existing webhook Vercel's GitHub App registered typically keeps working, but this must be observed, not assumed — if no deployment appears within a couple of minutes, the Vercel project's Git integration needs to be reconnected to the renamed repo from the Vercel dashboard (Project Settings → Git).

- [ ] **Step 4 (user must run this themselves, outside this session):** rename the local folder.

```powershell
# Close Claude Code / any terminal with this folder as its current directory first.
Rename-Item -Path "C:\Repos\tacosvalente" -NewName "tacos-don-refugio"
```

Afterward, reopen Claude Code (or any terminal) at `C:\Repos\tacos-don-refugio` to continue working — the git history, remote, and all commits from Tasks 1–14 carry over unchanged since this is a plain folder rename, not a re-clone.

- [ ] **Step 5: No automated commit for this task** — steps 1–3 are pushed directly (rename + remote update aren't file edits to commit); step 4 is a manual filesystem operation with nothing to commit.

---

## Self-review notes

- **Spec coverage:** every section of the design spec has a task — brand identity (Tasks 2,3), logo (Task 1), gallery (Tasks 5,6), content data (Tasks 2,3,10), components/metadata (Tasks 7,8,9), docs (Tasks 11,12), infra rename (Tasks 14,15). Task 4, 7's About/Branches/BranchDetail edits, and Task 9's SEO-lib fix were discovered during file-level investigation (a broader `grep -i "jalisco|colima"` sweep found more affected files than the spec's illustrative list named) — they're squarely inside the spec's own verification criteria ("zero Jalisco/Ciudad Guzmán matches"), so they're in scope, not scope creep.
- **No placeholders:** every task has literal file contents/diffs, not descriptions of changes.
- **Type/name consistency:** `REGION_NICKNAME` (metadata.ts) and the "el Valle de Colima" string are used identically in Task 9 and Task 8 (layout.tsx uses the literal string directly, not the const, since it's a different module — confirmed both spellings match exactly). Branch `id`s are never changed anywhere (Tasks 3, 4), keeping `avisos.data.ts`'s `branchId` references and the branch-count/id assertions in `branch.schema.test.ts` valid without touching either.
- **Incorporated from `software-architect` review:** the rasterization approach in Task 1 was empirically verified (installed `sharp`/`to-ico` and ran the plan's exact SVG/script on this machine — the font-fallback text rendered correctly, the ICO packed valid multi-resolution output); a silent-failure risk was closed by adding a visual-confirmation sub-step to Task 1 Step 5. Task 7 gained `src/lib/utils/contact.ts` (the former client's real phone number was sitting in a doc-comment example, invisible to the "valente"/"jalisco" leftover checks). Tasks 11–12 gained explicit fixes for ~14 "never/zero Colima" guard-clause sentences across `docs/plan.md`, `.agents/product-marketing.md`, and `docs/plan-validation.md` — a self-contradiction class the blind bulk substitution creates whenever a sentence asserts the *old* wrong-geography word is forbidden, since that word literally becomes the new *correct* region and a plain token grep can't detect a preserved-but-now-false claim. Task 13 gained two more targeted verification greps (guard-clause contradictions; old phone digits) precisely because the standard leftover checks are blind to both failure classes by construction.
