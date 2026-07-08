import { describe, expect, it } from "vitest";

import { formatDate, formatPrice } from "@/lib/utils/format";

describe("formatPrice", () => {
  it("formats whole-peso amounts from integer centavos", () => {
    expect(formatPrice(1700)).toBe("$17.00");
    expect(formatPrice(8000)).toBe("$80.00");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("renders centavos (sub-peso) precision", () => {
    expect(formatPrice(1750)).toBe("$17.50");
    expect(formatPrice(9)).toBe("$0.09");
  });

  it("rounds non-integer centavos defensively instead of leaking fractional cents", () => {
    // Money must be integer centavos; a fractional input is a defect upstream.
    // We round to the nearest centavo so display never shows impossible amounts.
    expect(formatPrice(1700.4)).toBe("$17.00");
    expect(formatPrice(1700.5)).toBe("$17.01");
  });

  it("uses the es-MX locale grouping for large amounts", () => {
    // 1,234.56 pesos -> grouped thousands, es-MX style.
    expect(formatPrice(123456)).toBe("$1,234.56");
  });
});

describe("formatDate", () => {
  it("formats a date-only ISO string in es-MX long form", () => {
    expect(formatDate("2026-06-27")).toBe("27 de junio de 2026");
  });

  it("does not shift the day for a date-only ISO string (no UTC off-by-one)", () => {
    // "2026-06-27" must render as the 27th, never the 26th, regardless of the
    // host timezone. This is the regression we explicitly guard against.
    expect(formatDate("2026-06-27")).toContain("27");
    expect(formatDate("2026-01-01")).toBe("1 de enero de 2026");
  });

  it("formats a full ISO datetime using its calendar date", () => {
    expect(formatDate("2026-12-31T23:59:00.000Z")).toBe(
      "31 de diciembre de 2026",
    );
  });
});
