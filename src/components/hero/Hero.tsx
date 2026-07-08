import { existsSync } from "node:fs";
import path from "node:path";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroMedia } from "./HeroMedia";
import { LogoIntro } from "./LogoIntro";

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
      <LogoIntro />
      <HeroContent />
    </section>
  );
}
