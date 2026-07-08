/**
 * WebGL detection — pure function, no React deps, testable with a mock canvas
 * (plan M5.1). Must only be called client-side (window + document must exist).
 *
 * Returns a discriminated status so callers can decide exactly what to render:
 *   ok          — WebGL2 or WebGL1 available, render the 3D scene
 *   reduced     — user/OS prefers less motion or is on data-saver; show static
 *   unsupported — no WebGL context at all, or slow connection; show video/image
 *   error       — context creation threw; show video/image
 */

export type WebGLStatus = "ok" | "unsupported" | "reduced" | "error";

export type WebGLSupport = {
  status: WebGLStatus;
  reason?: string;
};

/**
 * Run detection synchronously and return the result. Pass an optional `canvas`
 * for unit tests (avoids creating a real DOM element in the test environment).
 */
export function detectWebGL(canvas?: HTMLCanvasElement): WebGLSupport {
  // Reduced motion: skip anything that animates heavily.
  // Use globalThis.matchMedia so this is callable from the test environment
  // (Node.js) where `window` is undefined but globalThis.matchMedia can be
  // stubbed via vi.stubGlobal.
  if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return { status: "reduced", reason: "prefers-reduced-motion" };
  }

  // Network conditions via Network Information API (not universally supported).
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (conn?.saveData) return { status: "reduced", reason: "save-data" };
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
    return { status: "unsupported", reason: "slow-connection" };
  }

  // WebGL context probe.
  const probe = canvas ?? document.createElement("canvas");
  try {
    const ctx =
      probe.getContext("webgl2") ??
      probe.getContext("webgl") ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (probe.getContext as any)("experimental-webgl");

    if (!ctx) return { status: "unsupported", reason: "no-context" };

    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}
