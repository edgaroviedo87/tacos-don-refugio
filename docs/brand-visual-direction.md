# Tacos Don Refugio — Brand Visual Language & Art Direction

**"El Placer del Sabor" — Taquería in Villa de Álvarez, Colima**
Visual direction for the web experience, UI design system, and WebGL hero.
This document feeds the `senior-web-designer` (tokens, components) and the WebGL/3D team.

---

## 0. Brand Personality (the anchor for every decision)

Five adjectives. Every visual choice below is defensible against these.

1. **Sabroso / Crave-worthy ("Antojo")** — the visuals exist to make you hungry. Warmth, saturation, steam, freshness. Appetite is the north star.
2. **Orgullo local (Local pride)** — rooted in Villa de Álvarez, Colima. Authentic, not touristy "Tex-Mex." Specificity over generic "Mexico."
3. **Tradición con calidez (Warm tradition)** — many years of trade, family/team-driven. Hospitable, human, hand-made — not corporate, not fast-food.
4. **Festivo pero con criterio (Festive but tasteful)** — the logo is retro and playful; we keep that joy but apply restraint. Energy, not chaos.
5. **Moderno y confiable (Modern & trustworthy)** — the modernization story. Clean layout, strong type, real photography, premium finish. Signals quality and hygiene.

**The tension to manage:** retro-festive identity (logo) vs. clean-modern execution (interior, web). The resolution: **a clean, confident, modern stage — and the brand's festive heat lives in color, photography, the script signature, and the hero.** Structure is calm; content is hot.

---

## 1. Color System

The logo palette is correct and ownable. We refine it into a working web palette with accessible variants, neutrals, and warm wood-toned darks for an immersive hero. All decisions verified against WCAG AA.

### 1.1 Brand primitives (the logo colors)

| Token | Hex | Role |
|---|---|---|
| `green-500` (Verde Don Refugio) | `#1E8A3C` | Brand primary. Large fills, brand moments, illustrative marks. **Display/large only — fails AA for body text.** |
| `red-500` (Rojo Chile) | `#E8431F` | Accent / energy / appetite. Hero glow, highlights, primary CTA fills (large/bold labels only). |
| `gold-500` (Oro Maíz) | `#F2B705` | Secondary accent. Decorative only — borders, dividers, glow, star ratings, "neon" warmth. **Never as text on light.** |
| `brown-900` (Café) | `#2B2118` | Brand ink. Primary body text on light. Base for warm darks. |
| `cream-50` | `#FBF7F0` | Warm page background (light sections). |
| `white` | `#FFFFFF` | Pure card/surface on light. |

### 1.2 Accessible action variants (use these for text, links, small UI)

The raw brand colors are vivid but most fail AA at body sizes. These tuned variants preserve the hue and pass.

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| `green-700` (Verde tinta) | `#15692C` | **6.8:1** ✓ AA all sizes | Green text, links, icons on light |
| `red-600` (Rojo profundo) | `#C2371A` | **5.4:1** ✓ AA all sizes | CTA labels, red text, links on light; primary button fill with white text (5.4:1) |
| `green-500` `#1E8A3C` | — | 4.4:1 | Large text / UI ≥24px or ≥18.66px bold only |
| `red-500` `#E8431F` | — | 4.0:1 | Large/bold (≥18.66px bold) only; hover/glow accent |
| `gold-500` `#F2B705` | — | 1.8:1 ✗ | Decoration only — never text on light. On `brown-900` it reaches **8.7:1** ✓ |

### 1.3 Neutral / warm-grey ramp (warm-tinted, never cold pure grey)

| Token | Hex | Use |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Cards, top surface |
| `neutral-50` | `#FBF7F0` | Page background (cream) |
| `neutral-100` | `#F5EDE0` | Subtle section tint, alternating bands |
| `neutral-200` | `#E7DCCB` | Borders, dividers, input outlines |
| `neutral-400` | `#A89A86` | Muted text (meets AA on white at ~3.0 — use for large/secondary only; for small muted text use `neutral-600`) |
| `neutral-600` | `#6B5E4E` | Secondary body text (~6.2:1 ✓) |
| `neutral-900` | `#2B2118` | Primary text (15.7:1 ✓) |

### 1.4 Warm dark / wood surfaces (for the immersive hero & dark sections)

Channels the real interior: stained vertical wood slats, espresso shadows, warm filament light. **Warm-brown blacks, never blue-black.**

| Token | Hex | Use |
|---|---|---|
| `wood-950` (Espresso) | `#160F09` | Deepest hero background, vignette edges |
| `wood-900` | `#241910` | Hero base surface, dark section background |
| `wood-800` | `#3A2A1C` | Wood slat mid-tone, elevated dark cards |
| `wood-700` | `#5A4127` | Wood highlight, warm separators on dark |
| `text-on-dark` | `#FBF1E2` | Warm cream text on dark (15:1+ ✓) |
| `text-on-dark-muted` | `#C9B79E` | Secondary text on dark (~7:1 ✓) |

On dark, the accents sing: `gold-500` (8.7:1), `red-500`/`#E8431F` as warm glow, `green-500` for brand marks. This is where the festive heat is allowed to be loud.

### 1.5 Semantic colors (functional — kept distinct from brand)

Brand red is too close to "error" and brand green to "success," which is a real conflict. We **shift the hue and desaturate** the semantic set so functional meaning never collides with brand expression. Use semantic colors *only* in functional UI (forms, alerts, order status), never decoratively.

| Token | Hex | On-color text |
|---|---|---|
| `success` | `#2E7D32` (cooler, deeper than brand green) | white |
| `warning` | `#B8860B` (amber, distinct from gold accent) | white |
| `error` | `#B3261E` (true crimson, bluer than chile red) | white |
| `info` | `#1F6FB2` (a calm blue — the only cool color in the system, reserved strictly for info states) | white |

Rule for the dev team: if a green/red appears in a *form or status* context it is semantic; everywhere else it is brand. Keep the two scales in separate token groups.

### 1.6 Suggested token mapping (handoff to `senior-web-designer`)

- `color-primary` → `green-700` (interactive) / `green-500` (brand fill)
- `color-accent` / `color-cta` → `red-600` (label-safe) with `red-500` for glow/hover
- `color-highlight` → `gold-500` (decorative, dark contexts)
- `color-surface` (light) → `neutral-0` on `neutral-50` page
- `color-surface-inverse` (hero/dark) → `wood-900` on `wood-950`
- `color-on-primary` → `white`; `color-on-dark` → `text-on-dark`
- `color-text` → `neutral-900`; `color-text-muted` → `neutral-600`

---

## 2. Typography System

The logo's script is a brand **signature**, not a UI font — it should be delivered as the logo asset, not retyped. The web type system supports it with one decisive, characterful stack. Four roles, all Google Fonts (fast, free, reliable, good Latin/Spanish coverage incl. accents and ¡¿).

| Role | Font | Why it fits |
|---|---|---|
| **Mega display / poster** | **Anton** (single weight, 400) | The web echo of the black block "TACOS." Ultra-bold condensed, poster energy, brilliant for all-caps Spanish ("ANTOJOS QUE VALEN LA PENA"). Reserve for hero H1, big numbers, poster moments. |
| **Headings / labels** | **Oswald** (300–700, variable) | Same condensed lineage as Anton but flexible. H2–H4, eyebrows, buttons, menu item names, prices. Carries the "letrero / mercado sign" feel without shouting. |
| **Body / UI** | **Nunito** (400/600/700) | Warm, rounded sans. Its rounded terminals rhyme with the script and Anton's softness, reads friendlier than Inter (corporate) or Poppins (cold geometric). Highly legible at small sizes. Paragraphs, descriptions, forms, captions. |
| **Decorative script accent** | **Pacifico** (400) | Used *very* sparingly to echo the cursive neon "Bienvenidos." Section eyebrows like *¡Bienvenidos!*, a tagline flourish, the neon in the hero. **Never for sentences, never for body, never small.** Max ~2 instances per screen. |

**Pairing logic:** condensed display (Anton/Oswald) = the loud market-sign voice; rounded body (Nunito) = the warm human voice; script (Pacifico) = the festive flourish. Three voices, clear hierarchy, no ambiguity about which is which.

### Type scale (modular, 1.250 Major Third, 16px base)

| Step | px / rem | Font | Use |
|---|---|---|---|
| Display | 64–96 / 4–6rem (clamp) | Anton, uppercase, tight tracking (-0.5px) | Hero H1 |
| H1 | 49 / 3.05rem | Oswald 600 | Page titles |
| H2 | 39 / 2.44rem | Oswald 600 | Section titles |
| H3 | 31 / 1.95rem | Oswald 500 | Subsections, dish groups |
| H4 | 25 / 1.56rem | Oswald 500 | Card titles, dish names |
| Body-L | 20 / 1.25rem | Nunito 400 | Lead paragraphs |
| Body | 16 / 1rem | Nunito 400 | Default text (line-height 1.6) |
| Small / caption | 14 / 0.875rem | Nunito 600 | Labels, meta |
| Eyebrow | 13 / 0.81rem | Oswald 500, uppercase, +1.5px tracking | Section kickers |
| Price tag | contextual | Oswald 600 | Menu prices |

**Rules:** Anton always uppercase. Oswald headings sentence- or upper-case (upper for short punchy lines only). Nunito never uppercase for paragraphs. Spanish punctuation (¡ ¿ á é í ó ú ñ) must render in all four — verified. Loading budget: subset to `latin` + `latin-ext`, `font-display: swap`, preload Anton + Nunito (the two always-visible faces); lazy-load Pacifico.

---

## 3. Iconography & UI Motif Style

### Icon style — one decision, applied everywhere

- **Library/base:** Lucide-style **line icons**, **2px stroke** (slightly heavier than Lucide's 1.5px default — sturdier, warmer, reads at small sizes), **rounded caps & joins, rounded corners**. Rounded geometry rhymes with Nunito and the script. No sharp/technical corners.
- **Filled/duotone:** use sparingly for *active states* and key feature icons — duotone with `green-500`/`gold-500` fill at low opacity behind the line. Never mix random filled and line icons in the same cluster.
- **Sizing:** 20px inline, 24px default UI, 32–48px feature. Stroke stays optically ~2px (scale the stroke, not just the box).

### Mexican / taquería motifs — authentic, not kitsch

Build a **small custom motif set** in the same line style, used as accents (never wallpaper):

- **Allowed, abstracted, single-color:** lime wedge, chile (de árbol — local & real to their salsa), diced onion, cilantro sprig, pickled carrot round + jalapeño (these literally appear in their tacos — use *their* real garnish as the icon language), the **comal/tortilla**, **Volcán de Colima** silhouette (the state's defining landmark — Colima pride, the equivalent local-pride anchor the agave motif served in the retired Jalisco identity), steam wisps, a simple **papel picado** strip *abstracted to one color* as a section divider.
- **The snake plant** from the interior photo can become a subtle brand greenery motif — modern, real to the space, avoids cliché.

### Hard "no" list (anti-kitsch)

Sombrero, cactus-with-face, mariachi/maracas, dancing chili mascot, rainbow papel picado, "Día de Muertos" calaveras (wrong occasion/meaning), distressed "wanted poster" Western fonts, Tex-Mex yellow-cheese palette, fake "handwritten napkin" gimmicks.

### Corner radii & shape language

- **Radii:** soft but not bubbly. Buttons/inputs `8px`, cards `16px`, images `12px`, pills/tags `999px`. Consistency over variety.
- One brand shape primitive: the **white circle** from the logo lockup — reuse as a containing device for the logo, badges ("Desde hace años"), and seals.

### Texture (warmth without noise)

- **Subtle paper grain** (2–4% opacity) on cream sections — artisanal, hand-made feel.
- **Fine film grain** over the dark hero (3–5%) — cinematic warmth, hides banding in gradients.
- **Wood grain** appears as *real photographic/3D texture in the hero and dark sections only* — never as a tiled CSS background everywhere (that reads cheap). Optionally **kraft/butcher paper** texture for menu cards.
- Keep light UI sections clean and airy; reserve richness/texture for hero and "ambiance" moments. **Texture is a guest, not the host.**

---

## 4. Photography & Food Art Direction

> **Critical flag:** the current food photos (`tacos_*.jpg`, `torta_*.jpg`) are Facebook-sourced — harsh overhead flash, cold stainless-steel backgrounds, intrusive baked-in logo watermark, inconsistent crops, and **uncertain licensing**. They are unusable for a premium site beyond temporary placeholders. **A professional photoshoot is required** — and it is the single highest-leverage investment for this brand. The good news: the food itself and the real interior are genuinely photogenic.

### The "Antojo" look (direction)

- **Lighting:** warm, directional, single-source side/45° light (window or softbox) to rake across texture and catch **steam** — backlight or rim-light the steam so it glows. Golden-warm white balance (~3800–4500K). **No on-camera flash, no flat overhead.**
- **Mood:** dark, warm, moody backgrounds (the real wood wall, espresso surfaces, cream plates) — food pops as the hero. Echo the interior's ambiance.
- **Styling cues = freshness & abundance:** fresh-cut lime, diced white onion, cilantro, the pickled carrot+jalapeño they actually serve, a glistening salsa drip, a just-pressed tortilla. "Buenas porciones" = generous, honest plating (not over-styled/fake). Real, slightly imperfect, hand-made.
- **Crops:** a mix of (a) **3/4 hero angle** with shallow depth of field and bokeh, (b) **top-down flat-lays** for menu grids and structure, (c) **macro detail** (steam, cheese pull, salsa drip) for texture moments.
- **Backgrounds:** warm wood, cream plates, kraft paper, dark slate-warm. **Never stainless steel, never fluorescent kitchen.**
- **Post:** warm grade, rich shadows, controlled highlights, vibrant but believable reds/greens. **Never** burn the logo into the photo — the brand frames the image, it doesn't deface it.

### Recommended shot list (pro shoot)

1. **Hero taco trio** — 3/4 angle, steam, shallow DoF, dark wood bg (for WebGL hero plate + landing).
2. **Signature tacos**, each variety — clean top-down on cream plate (menu cards).
3. **Tortas ahogadas / tortas** — 3/4, salsa drip, generous (a clear specialty in their photos).
4. **Desayunos** ("¿Qué desayunar?") — warm morning-light table scene.
5. **Salsas & garnish bar** — the carrots/jalapeños/onion/lime, macro, color-rich.
6. **The making** — hands on the comal, tortilla press, plancha sizzle (humanizes "tradición," shows hygiene & craft).
7. **The team / family** — warm portraits in the wood-and-neon interior (local pride, trust).
8. **Interior ambiance** — the wood wall, pendants, **the "Bienvenidos" neon** at dusk (hero fallback + about section).
9. **Texture/detail library** — steam, cheese pull, lime squeeze, salsa pour (for WebGL & accents).
10. **Flat-lay "spread"** — full table overhead for an abundance moment ("buenas porciones").

Deliver: high-res, both **3/4 and top-down**, several with negative space for text overlay, and a few **on transparent/dark for cut-outs** (floating ingredients in the WebGL hero).

---

## 5. WebGL Hero Visual Concept

**Concept: "Entra a la taquería" — you arrive inside the warm, glowing room, and the antojo floats toward you.** A premium, immersive recreation of the real interior's ambiance, not a generic 3D gimmick.

### The scene

- **Backdrop:** a deep, warm volumetric gradient from `wood-950` → `wood-800`, suggesting the out-of-focus wood-slat wall. Soft, large **warm bokeh orbs** echo the black globe pendant lights with filament glow. Gentle vignette. Fine film grain over everything.
- **The neon:** a **cursive neon sign** glowing in warm cream/gold (`gold-500` → `#FBF1E2` core), echoing the real "Bienvenidos." It reads the tagline or *¡Bienvenidos!* — soft bloom, faint flicker, subtle reflection on an implied surface. This is the emotional centerpiece and the strongest tie to the real space.
- **Floating antojo:** 2–4 hero elements drifting with slow parallax — a cut-out **hero taco** (from the pro shoot), a **lime wedge**, **chile de árbol**, a **cilantro sprig**. Gentle bob/rotation, depth layering. Premium, not cartoonish.
- **Steam & particles:** fine, soft **steam wisps** rising from the taco, plus a few slow dust-mote light particles catching the warm light. Restrained — atmosphere, not a snow globe.
- **Logo treatment:** the actual logo, **crisp and flat on top** (not 3D-extruded — keep it legible and authentic), in its white circle or knocked-out clean, with a subtle warm glow to seat it in the scene. Tagline in Pacifico/neon beneath.
- **Color discipline:** the hero is where festive heat is loud — warm woods, glowing gold/cream neon, chile-red accents, green from the logo and cilantro. But composition stays calm and premium.

### Interaction & performance

- **Subtle motion only:** slow parallax on pointer/scroll, gentle float, soft bloom pulse. No aggressive spin, no flashing. Tasteful = premium.
- **Performance:** cap particle/steam counts; bake lighting and use cheap bloom; instance repeated geometry; pause render when offscreen (IntersectionObserver); reduce particle density and DPR on mobile; target 60fps desktop / smooth 30fps+ mobile; lazy-init below a viewport-size threshold.
- **Reduced motion:** respect `prefers-reduced-motion` — freeze to a beautiful static composed frame, neon glow held, no movement.
- **Graceful degradation (required):** if WebGL is unavailable/slow, render a **beautiful baked static fallback** — a warm-graded interior/hero photo (the real wood + neon, or the hero taco plate) with the logo, neon-glow tagline, and CTA. The fallback must look intentional and premium on its own, not "broken." Ship the static frame as the LCP image and mount WebGL progressively on top.

---

## 6. Mood, Do's & Don'ts

**Mood in one sentence:**
*A warm, glowing taquería at golden hour — modern and clean in its bones, festive and crave-worthy in its heart — where honest tradition from Villa de Álvarez is served on a confident, contemporary stage.*

### Do
- Let **food and warmth** carry the emotion; keep layout calm and structured.
- Use the **script as a rare signature**, the condensed type as the loud market voice, rounded sans for everything readable.
- Keep darks **warm and wood-toned**, lights **cream**, never cold/blue-grey.
- Reserve **richness and texture for the hero and ambiance** sections; keep functional UI airy and clean.
- Ground motifs in the taquería's **real ingredients and real space** (chile de árbol, pickled carrots, the snake plant, the neon, the wood).
- Prioritize the **professional photoshoot** and resolve photo **licensing** before launch.
- Honor accessibility: use the tuned `green-700` / `red-600` for text, verified AA contrast everywhere.

### Don't
- Don't go **generic "fiesta"**: no sombreros, cactus mascots, maracas, rainbow papel picado, fake-Western "wanted" fonts.
- Don't use **Tex-Mex / fast-food** cues (cheesy yellows, neon clip-art, greasy flash photography).
- Don't burn the **logo watermark** onto food photos.
- Don't set **script or all-caps Anton for body/paragraphs** — legibility first.
- Don't tile **wood/grain textures** across the whole site — it reads cheap; keep wood in hero/dark zones.
- Don't let **brand red/green collide with semantic states** — keep the two color groups separate.
- Don't make the **WebGL hero flashy or hyperactive** — premium = restrained motion, and it must degrade to a gorgeous static frame.

---

## Handoff notes

- **To `senior-web-designer`:** Sections 1.6 (token mapping), 2 (type scale), and 3 (radii/icons/texture rules) are ready to translate directly into semantic tokens, the type scale, shadow/radius scales, and component aesthetics. The shadow scale should be **warm-tinted** (brown-based, not grey) and soft.
- **To the WebGL/3D team:** Section 5 — build the static fallback first as the LCP asset, then layer WebGL.
- **To the producer:** the pro photoshoot (Section 4) and photo licensing are blocking dependencies for a premium launch; the interior and food are strong assets to work with.
