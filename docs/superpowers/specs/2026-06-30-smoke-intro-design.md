# Smoke Intro Animation — Design Spec

**Date:** 2026-06-30  
**Status:** Approved

## What we're building

A one-shot CSS vapor intro that plays when the homepage loads. Steam columns (blurry warm-cream blobs) rise from the bottom of the hero section and dissolve as they exit the top. After ~3 seconds the effect ends completely — no looping, no residual animation.

This replaces the existing R3F (Three.js) canvas scene (BokehOrbs + SteamParticles), which was a persistent overlay the user did not want.

## Visual design

- **Style:** 6 blurry blobs arranged across the hero width, rising from bottom to top
- **Color:** warm cream / sand (`rgba(240,225,200,…)`) — evokes a taquería steamer (vaporera)
- **Blur:** ~32px per wisp, giving soft unfocused steam
- **Motion:** `translateY(0) → translateY(-120vh)` + `scaleX(1) → scaleX(1.7)` (steam spreads as it rises)
- **Opacity arc:** fade in quickly (first 8% of duration), hold, then fade to 0 before top edge
- **Stagger:** 0–300ms delay between columns so they don't move in sync
- **Duration:** ~2.5–2.9s per column (medium/fluid feel)
- **Total lifetime:** component unmounts at 3200ms via `setTimeout`

## Architecture

```
Hero (server)
  ├── HeroBackground   z=-10  static photo + gradient
  ├── HeroMedia               video fallback only (no canvas)
  ├── SmokeIntro       z=10   one-shot CSS client component
  └── HeroContent             logo, h1, CTAs
```

`SmokeIntro` sits above HeroContent in the stacking order during the 3s intro, then disappears entirely. `pointer-events: none` at all times so CTAs remain clickable even during the animation.

## Component contract

```tsx
// SmokeIntro.tsx — "use client"
// Mounts with visible=true. useEffect schedules setVisible(false) at 3200ms.
// Returns null when visible=false.
// No props.
```

No props, no external state, no context. Purely self-contained.

## CSS approach

CSS Module (`SmokeIntro.module.css`):

- `.root` — `position: absolute; inset: 0; z-index: 10; pointer-events: none; overflow: hidden`
- `.wisp` — each blob, positioned `absolute; bottom: -5%`, animated with `@keyframes steam-up`
- `@keyframes steam-up` — translateY + scaleX + opacity as described above
- `animation-fill-mode: forwards` so final state (opacity 0) is held until unmount

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .root { display: none; }
}
```

Users who prefer reduced motion see the hero immediately with no animation.

## SSR behavior

`SmokeIntro` is a `"use client"` component. It SSRs with `visible=true`, meaning the overlay HTML is in the initial document. CSS animations start as soon as the stylesheet loads — no JS needed for the animation itself. `useEffect` / `setTimeout` handle the DOM cleanup after 3.2s.

## Files changed

| Action | File |
|--------|------|
| Create | `src/components/hero/SmokeIntro.tsx` |
| Create | `src/components/hero/SmokeIntro.module.css` |
| Modify | `src/components/hero/Hero.tsx` — add `<SmokeIntro />` |
| Modify | `src/components/hero/HeroMedia.tsx` — remove Canvas branch, remove webgl imports |
| Delete | `src/components/hero/HeroCanvas.tsx` |
| Delete | `src/components/hero/scene/Scene.tsx` |
| Delete | `src/components/hero/scene/BokehOrbs.tsx` |
| Delete | `src/components/hero/scene/SteamParticles.tsx` |

The `src/lib/webgl/` utilities become dead code but are left in place (no build errors, no breaking changes). Can be cleaned up separately.

## Out of scope

- Video hero fallback (no video asset exists yet; HeroMedia stub preserved)
- Any future persistent WebGL effect on the hero
- Scroll-triggered or repeating animations
