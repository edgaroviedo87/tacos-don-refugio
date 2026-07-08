# Smoke Intro Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the persistent R3F canvas hero effect with a one-shot CSS steam-column intro that unmounts after ~3 seconds.

**Architecture:** A client component (`SmokeIntro`) renders 6 blurry blobs via a CSS Module. The component is added to `Hero.tsx` between `HeroMedia` and `HeroContent`. A `setTimeout` at 3200ms calls `setVisible(false)` and the component unmounts. The old R3F files (HeroCanvas, scene/) are deleted and HeroMedia is simplified to video-only.

**Tech Stack:** Next.js App Router, React `"use client"`, CSS Modules, Vitest (for typecheck only — no component runtime test since env is `node` and the effect is purely visual).

---

### Task 1: Create the CSS Module

**Files:**
- Create: `src/components/hero/SmokeIntro.module.css`

- [ ] **Create the file with the following content exactly:**

```css
/* One-shot steam intro overlay — sits above hero content, pointer-events-none */
.root {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}

/* Skip the whole animation for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .root {
    display: none;
  }
}

/*
 * Each steam wisp is a blurry blob that rises from the bottom.
 * Left, width, height, --wisp-opacity, animationDelay, animationDuration
 * are all set via inline style on the element so each column is independent.
 */
.wisp {
  position: absolute;
  bottom: -5%;
  border-radius: 50%;
  filter: blur(32px);
  background: radial-gradient(
    ellipse at 50% 65%,
    rgba(240, 225, 200, var(--wisp-opacity, 0.5)) 0%,
    rgba(210, 185, 155, calc(var(--wisp-opacity, 0.5) * 0.35)) 45%,
    transparent 70%
  );
  animation-name: steam-up;
  animation-timing-function: ease-in;
  animation-fill-mode: both;
  will-change: transform, opacity;
}

@keyframes steam-up {
  0%   { transform: translateY(0) scaleX(1);         opacity: 0; }
  8%   { opacity: var(--wisp-opacity, 0.5); }
  100% { transform: translateY(-120vh) scaleX(1.7);  opacity: 0; }
}
```

- [ ] **Verify the file exists:**

```powershell
Test-Path "src/components/hero/SmokeIntro.module.css"
# Expected: True
```

---

### Task 2: Create the SmokeIntro component

**Files:**
- Create: `src/components/hero/SmokeIntro.tsx`

- [ ] **Create the file with the following content exactly:**

```tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./SmokeIntro.module.css";

const UNMOUNT_MS = 3200;

// 6 steam columns spread across the hero width.
// opacity sets --wisp-opacity CSS custom property used in the keyframe.
const WISPS = [
  { left: "5%",  width: "68px",  height: "120px", opacity: 0.65, delay: "0ms",   duration: "2.5s" },
  { left: "20%", width: "88px",  height: "150px", opacity: 0.55, delay: "220ms", duration: "2.8s" },
  { left: "38%", width: "74px",  height: "130px", opacity: 0.50, delay: "100ms", duration: "2.6s" },
  { left: "56%", width: "92px",  height: "160px", opacity: 0.60, delay: "300ms", duration: "2.9s" },
  { left: "74%", width: "62px",  height: "108px", opacity: 0.45, delay: "60ms",  duration: "2.4s" },
  { left: "87%", width: "54px",  height: "94px",  opacity: 0.40, delay: "150ms", duration: "2.5s" },
] as const;

export function SmokeIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), UNMOUNT_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      {WISPS.map((w, i) => (
        <div
          key={i}
          className={styles.wisp}
          style={{
            left: w.left,
            width: w.width,
            height: w.height,
            "--wisp-opacity": w.opacity,
            animationDelay: w.delay,
            animationDuration: w.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
```

- [ ] **Run typecheck — must pass with no new errors:**

```powershell
npm run typecheck
# Expected: no output (clean exit)
```

- [ ] **Commit:**

```powershell
git add src/components/hero/SmokeIntro.tsx src/components/hero/SmokeIntro.module.css
git commit -m "feat(hero): add SmokeIntro CSS steam-column one-shot animation"
```

---

### Task 3: Wire SmokeIntro into Hero.tsx

**Files:**
- Modify: `src/components/hero/Hero.tsx`

- [ ] **Add the import and the `<SmokeIntro />` element. Full file after change:**

```tsx
import { existsSync } from "node:fs";
import path from "node:path";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroMedia } from "./HeroMedia";
import { SmokeIntro } from "./SmokeIntro";

function findAsset(...candidates: string[]): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const c of candidates) {
    if (existsSync(path.join(publicDir, c))) return `/${c}`;
  }
  return null;
}

const HAS_VIDEO =
  existsSync(path.join(process.cwd(), "public/video/hero-loop.mp4")) ||
  existsSync(path.join(process.cwd(), "public/video/hero-loop.webm"));

const POSTER = findAsset(
  "images/hero-poster.webp",
  "images/hero-poster.jpg",
  "images/hero-poster.png",
);

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[88svh] items-center overflow-hidden text-on-dark"
    >
      <HeroBackground />
      <HeroMedia hasVideo={HAS_VIDEO} poster={POSTER ?? undefined} />
      <SmokeIntro />
      <HeroContent />
    </section>
  );
}
```

- [ ] **Run typecheck:**

```powershell
npm run typecheck
# Expected: clean exit
```

- [ ] **Commit:**

```powershell
git add src/components/hero/Hero.tsx
git commit -m "feat(hero): wire SmokeIntro into Hero section"
```

---

### Task 4: Simplify HeroMedia and delete R3F canvas files

**Files:**
- Modify: `src/components/hero/HeroMedia.tsx`
- Delete: `src/components/hero/HeroCanvas.tsx`
- Delete: `src/components/hero/scene/Scene.tsx`
- Delete: `src/components/hero/scene/BokehOrbs.tsx`
- Delete: `src/components/hero/scene/SteamParticles.tsx`

- [ ] **Overwrite HeroMedia.tsx — remove the webgl import and canvas branch, keep video stub for future:**

```tsx
"use client";

import { HeroVideo } from "./HeroVideo";

type Props = {
  hasVideo: boolean;
  poster?: string;
};

export function HeroMedia({ hasVideo, poster }: Props) {
  if (!hasVideo) return null;
  return <HeroVideo poster={poster} />;
}
```

- [ ] **Remove the R3F scene files from git tracking:**

```powershell
git rm src/components/hero/HeroCanvas.tsx `
       src/components/hero/scene/Scene.tsx `
       src/components/hero/scene/BokehOrbs.tsx `
       src/components/hero/scene/SteamParticles.tsx
# Expected: 4 lines starting with "rm 'src/components/hero/..."
```

- [ ] **Run typecheck:**

```powershell
npm run typecheck
# Expected: clean exit
```

- [ ] **Commit:**

```powershell
git add src/components/hero/HeroMedia.tsx
git commit -m "refactor(hero): remove R3F canvas, simplify HeroMedia to video-only stub"
```

---

### Task 5: Build verification and visual check

**Files:** none (verification only)

- [ ] **Run the full test suite:**

```powershell
npm test
# Expected: all existing tests pass (no new tests needed — visual-only component)
```

- [ ] **Start the dev server and open the homepage:**

```powershell
npm run dev
# Open http://localhost:3000 in a browser
```

- [ ] **Manually verify the following in the browser:**

  1. On first load: 6 blurry cream/sand steam columns rise from the bottom of the hero
  2. Each column fades in at the start, rises, spreads horizontally, fades out before exiting the top
  3. Columns are slightly staggered — they don't all start at the same time
  4. After ~3 seconds: all columns gone, hero is clean with no animation remaining
  5. Logo, title, tagline and CTAs are always clickable (pointer-events not blocked)
  6. Refreshing the page replays the intro (one-shot per page load, not per session)

- [ ] **Check reduced-motion:** In browser DevTools → Rendering tab → enable "Emulate CSS media feature prefers-reduced-motion: reduce". Reload — the intro must not appear at all.

- [ ] **Stop dev server (Ctrl+C). No additional commit needed.**
