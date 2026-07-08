"use client";

import { useEffect, useCallback } from "react";

/**
 * Listens for `webglcontextlost` on the given canvas and calls `onLost` when
 * it fires (plan M5.4). Calling `event.preventDefault()` inside the handler
 * allows the browser to restore the context later (via `webglcontextrestored`),
 * but we also call `onLost` so the Hero can switch to the static fallback
 * immediately — a lost context that never restores looks broken otherwise.
 *
 * Usage:
 *   useContextLoss(canvasRef.current, () => setFallback(true));
 */
export function useContextLoss(
  canvas: HTMLCanvasElement | null,
  onLost: () => void,
): void {
  const handleLost = useCallback(
    (e: Event) => {
      e.preventDefault();
      onLost();
    },
    [onLost],
  );

  useEffect(() => {
    if (!canvas) return;
    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [canvas, handleLost]);
}
