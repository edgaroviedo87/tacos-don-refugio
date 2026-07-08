"use client";

import { useSyncExternalStore } from "react";
import { detectWebGL, type WebGLSupport } from "./detectWebGL";

/**
 * Conservative default for the server render and for the initial hydration
 * pass. Returning `reduced` means no 3D scene is rendered in the first HTML
 * response, so the static image (tier 3) is the only background — correct both
 * for bots and for the LCP budget (plan M5.1).
 */
const SERVER_DEFAULT: WebGLSupport = { status: "reduced", reason: "ssr" };

/**
 * Cached detection result. WebGL availability is a property of the device/
 * browser session, not of any component state, so we detect once and reuse.
 * The `null` guard means the probe canvas is created at most once per page load.
 */
let cached: WebGLSupport | null = null;

function getClientSnapshot(): WebGLSupport {
  if (!cached) cached = detectWebGL();
  return cached;
}

// No-op subscribe: the detection result never changes within a session.
const subscribe = () => () => {};

/**
 * Returns the WebGL support state for the current device. On the server and
 * during hydration returns `{ status: "reduced" }` so the page is never
 * blank. After hydration, returns the real detection result and triggers a
 * re-render if the 3D tier should be activated.
 */
export function useWebGLSupport(): WebGLSupport {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_DEFAULT);
}
