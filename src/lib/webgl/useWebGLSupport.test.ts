/**
 * Unit tests for `detectWebGL` (plan M5.1). Tests the pure detection function
 * directly so they remain fast and env-agnostic. The hook itself is a thin
 * useSyncExternalStore wrapper over the function, tested implicitly via
 * component integration tests if needed later.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { detectWebGL } from "./detectWebGL";

/* ---- helpers ---------------------------------------------------------- */

function mockMatchMedia(prefersReducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: prefersReducedMotion }),
  );
}

function mockCanvas(ctx: WebGLRenderingContext | null) {
  const canvas = {
    getContext: vi.fn().mockReturnValue(ctx),
  } as unknown as HTMLCanvasElement;
  return canvas;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/* ---- prefers-reduced-motion ------------------------------------------- */

describe("detectWebGL — prefers-reduced-motion", () => {
  it("returns reduced when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const canvas = mockCanvas({} as WebGLRenderingContext);
    expect(detectWebGL(canvas)).toEqual({
      status: "reduced",
      reason: "prefers-reduced-motion",
    });
    // Never reached canvas because we returned early.
    expect(canvas.getContext).not.toHaveBeenCalled();
  });
});

/* ---- Network Information API ------------------------------------------ */

describe("detectWebGL — network conditions", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("returns reduced when saveData is true", () => {
    vi.stubGlobal("navigator", { connection: { saveData: true } });
    expect(detectWebGL(mockCanvas({} as WebGLRenderingContext))).toEqual({
      status: "reduced",
      reason: "save-data",
    });
  });

  it("returns unsupported on slow-2g connection", () => {
    vi.stubGlobal("navigator", {
      connection: { saveData: false, effectiveType: "slow-2g" },
    });
    expect(detectWebGL(mockCanvas({} as WebGLRenderingContext))).toEqual({
      status: "unsupported",
      reason: "slow-connection",
    });
  });

  it("returns unsupported on 2g connection", () => {
    vi.stubGlobal("navigator", {
      connection: { saveData: false, effectiveType: "2g" },
    });
    expect(detectWebGL(mockCanvas({} as WebGLRenderingContext))).toEqual({
      status: "unsupported",
      reason: "slow-connection",
    });
  });
});

/* ---- WebGL context probe ----------------------------------------------- */

describe("detectWebGL — context probe", () => {
  beforeEach(() => {
    mockMatchMedia(false);
    vi.stubGlobal("navigator", { connection: undefined });
  });

  it("returns ok when a WebGL context is created", () => {
    const fakeCtx = {} as WebGLRenderingContext;
    expect(detectWebGL(mockCanvas(fakeCtx))).toEqual({ status: "ok" });
  });

  it("returns unsupported when getContext returns null", () => {
    expect(detectWebGL(mockCanvas(null))).toEqual({
      status: "unsupported",
      reason: "no-context",
    });
  });

  it("returns error when getContext throws", () => {
    const canvas = {
      getContext: vi.fn().mockImplementation(() => {
        throw new Error("WebGL creation failed");
      }),
    } as unknown as HTMLCanvasElement;
    expect(detectWebGL(canvas)).toEqual({
      status: "error",
      reason: "WebGL creation failed",
    });
  });
});
