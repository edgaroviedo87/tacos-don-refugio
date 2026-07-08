import type { NextConfig } from "next";

// Set GITHUB_PAGES=true at build time to produce a static export for GitHub Pages.
// Production Vercel deploy leaves this unset (server-side image optimization stays on).
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages; undefined keeps default (Vercel SSR).
  output: isGithubPages ? "export" : undefined,

  // Sub-path on GitHub Pages: https://edgaroviedo87.github.io/tacos-don-refugio
  basePath: isGithubPages ? "/tacos-don-refugio" : "",

  // GitHub Pages serves /route/index.html — trailing slashes map cleanly.
  trailingSlash: isGithubPages ? true : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
    // GitHub Pages has no image optimization server; serve originals directly.
    unoptimized: isGithubPages,
  },

  // M6.3b — View Transitions: progressive enhancement for Chromium 111+.
  // Other browsers get the same instant soft-nav via Next.js Link.
  // prefers-reduced-motion disables animations globally (see globals.css).
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
