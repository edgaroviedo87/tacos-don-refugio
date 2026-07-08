import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Static background layers (plan M5.2, tiers 3–4). Server component so the
 * LCP `<Image priority>` is emitted in the initial HTML with no JS round-trip.
 *
 * - Tier 4 (always): warm wood CSS gradient — the absolute floor, never blank.
 * - Tier 3 (when asset exists): `next/image` with `priority` — the LCP element.
 *   Reads the public directory at build time. `hero-poster.jpg` is a CC0
 *   Picsum Photos demo placeholder (picsum.photos/seed/warmwood-interior),
 *   not a real photo of any business — same pattern as Gallery.
 *
 * The client-side tiers (2 = video, 1 = R3F canvas) are injected by HeroMedia
 * as absolute layers stacked on top of this component.
 */

const POSTER_CANDIDATES = [
  "/images/hero-poster.webp",
  "/images/hero-poster.jpg",
  "/images/hero-poster.png",
];

function findHeroPoster(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const candidate of POSTER_CANDIDATES) {
    if (existsSync(path.join(publicDir, candidate))) return candidate;
  }
  return null;
}

export function HeroBackground() {
  const poster = findHeroPoster();

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {/* Tier 4: warm wood gradient — always present. */}
      <div className="absolute inset-0 bg-gradient-to-b from-wood-950 via-wood-900 to-wood-800" />

      {/* Warm golden glow — placeholder for the M5.3 pendant-light bokeh. */}
      <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-gold-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-[40vmin] w-[80vmin] -translate-x-1/2 translate-y-1/3 rounded-pill bg-red-500/10 blur-3xl" />

      {/* Tier 3: hero background image (LCP element). Self-heals when file lands. */}
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
      )}
    </div>
  );
}
