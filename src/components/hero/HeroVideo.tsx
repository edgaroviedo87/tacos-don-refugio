"use client";

import { useEffect, useRef } from "react";

/**
 * Hero looping video — tier 2 of the fallback chain (plan M5.2).
 *
 * Mounted only when not reduced/save-data. Autoplay is attempted via the
 * `.play()` Promise and silently dropped on failure (autoplay policy, e.g.
 * iOS before user gesture). The `poster` attribute shows the static hero frame
 * while the video buffers — the tier-3 image behind this element also ensures
 * the fallback is never blank.
 *
 * TODO(owner): provide /public/video/hero-loop.{mp4,webm} (see data-todo.md).
 * Until those files exist this component is not mounted (checked by HeroMedia).
 */
export function HeroVideo({ poster }: { poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Attempt autoplay; swallow the DOMException on policy-blocked browsers.
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      playsInline
      loop
      autoPlay
      poster={poster}
      aria-hidden="true"
    >
      {/* Prefer WebM (smaller), fall back to MP4. */}
      <source src="/video/hero-loop.webm" type="video/webm" />
      <source src="/video/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
