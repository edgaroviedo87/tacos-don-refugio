"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether `target` is visible in the viewport using IntersectionObserver
 * (plan M5.4). Returns `true` while the element is intersecting, `false` when
 * it scrolls fully out of view.
 *
 * Use this to pause the R3F frameloop when the hero is off-screen:
 *
 *   const inView = useInView(containerRef.current);
 *   <Canvas frameloop={inView ? "always" : "demand"} />
 *
 * `rootMargin` extends the trigger zone slightly above/below the viewport so
 * the scene is already running when the user reaches the hero (avoids a
 * one-frame pop on scroll-in).
 */
export function useInView(
  target: Element | null,
  rootMargin = "200px 0px",
): boolean {
  const [inView, setInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [target, rootMargin]);

  return inView;
}
