/**
 * Contract tests for the branches domain schema and the authored content.
 *
 * These guard the things most likely to break silently: the authored branch
 * data staying valid as it is edited, the `mapsUrl` URL invariant, the slug id
 * invariant, and the deliberate rule that a missing `geo` is allowed (we never
 * fabricate coordinates).
 */

import { describe, expect, it } from "vitest";

import { getBranches } from "@/lib/content/branches";

import { Branch, Branches } from "./branch.schema";

describe("Branch", () => {
  const baseBranch = {
    id: "matriz",
    name: "Matriz — Av. Constitución de 1917",
    address: "Av. Constitución de 1917 s/n, Centro, Villa de Álvarez, Colima, México",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio",
    hours: [{ days: "Lunes a Domingo", open: "18:00", close: "23:00" }],
  };

  it("parses a valid branch and applies the isDelivery default", () => {
    const result = Branch.parse(baseBranch);

    expect(result.id).toBe("matriz");
    expect(result.isDelivery).toBe(false); // default applied on parse
    expect(result.geo).toBeUndefined(); // omitting geo is allowed
  });

  it("parses a branch with no geo (missing coordinates are allowed)", () => {
    expect(() => Branch.parse(baseBranch)).not.toThrow();
  });

  it("parses a branch that does provide geo", () => {
    const result = Branch.parse({
      ...baseBranch,
      geo: { lat: 19.26, lng: -103.73 },
    });

    expect(result.geo).toEqual({ lat: 19.26, lng: -103.73 });
  });

  it("rejects a mapsUrl that is not a URL", () => {
    expect(() =>
      Branch.parse({ ...baseBranch, mapsUrl: "not-a-url" }),
    ).toThrow();
  });

  it("rejects an id that is not a slug", () => {
    expect(() =>
      Branch.parse({ ...baseBranch, id: "Portal del Centro" }),
    ).toThrow();
  });

  it("rejects malformed opening hours", () => {
    expect(() =>
      Branch.parse({
        ...baseBranch,
        hours: [{ days: "Lunes a Domingo", open: "6pm", close: "11pm" }],
      }),
    ).toThrow();
  });
});

describe("branches.data via getBranches()", () => {
  it("returns exactly the 3 authored branches", () => {
    expect(getBranches()).toHaveLength(3);
  });

  it("parses cleanly through the Branches schema", () => {
    // Already parsed at module load; re-parsing must also succeed.
    expect(() => Branches.parse(getBranches())).not.toThrow();
  });

  it("authors the expected branch ids", () => {
    const ids = getBranches().map((branch) => branch.id);

    expect(ids).toEqual(["matriz", "portal-centro", "de-pasadita"]);
  });

  it("marks only 'Matriz' as delivery", () => {
    const byId = new Map(
      getBranches().map((branch) => [branch.id, branch]),
    );

    expect(byId.get("matriz")?.isDelivery).toBe(true);
    expect(byId.get("portal-centro")?.isDelivery).toBe(false);
    expect(byId.get("de-pasadita")?.isDelivery).toBe(false);
  });

  it("omits geo on every branch (no fabricated coordinates yet)", () => {
    for (const branch of getBranches()) {
      expect(branch.geo).toBeUndefined();
    }
  });
});
