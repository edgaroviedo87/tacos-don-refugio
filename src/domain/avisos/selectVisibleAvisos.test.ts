/**
 * Unit tests for the pure `selectVisibleAvisos` selector.
 *
 * These pin the visibility rule (active + within `startsAt`/`endsAt` window) and
 * the deterministic ordering, using fixed `now` values so the tests never depend
 * on the wall clock. Dates are compared as instants, so timezone-offset ISO
 * strings must be honored.
 */

import { describe, expect, it } from "vitest";

import type { Aviso } from "./aviso.types";
import { selectVisibleAvisos } from "./selectVisibleAvisos";

/** Build a valid Aviso with sane defaults; override per test. */
function makeAviso(overrides: Partial<Aviso>): Aviso {
  return {
    id: "aviso",
    title: "Título",
    body: "Cuerpo del aviso.",
    type: "info",
    startsAt: "2026-06-01T00:00:00-06:00",
    active: true,
    sortOrder: 0,
    ...overrides,
  };
}

const NOW = "2026-06-27T12:00:00-06:00";

describe("selectVisibleAvisos", () => {
  it("hides an aviso whose window has not started yet", () => {
    const aviso = makeAviso({
      id: "future",
      startsAt: "2026-07-01T00:00:00-06:00",
    });

    expect(selectVisibleAvisos([aviso], NOW)).toEqual([]);
  });

  it("shows an aviso whose window is currently open", () => {
    const aviso = makeAviso({
      id: "in-window",
      startsAt: "2026-06-20T00:00:00-06:00",
      endsAt: "2026-06-30T23:59:59-06:00",
    });

    expect(selectVisibleAvisos([aviso], NOW)).toEqual([aviso]);
  });

  it("hides an aviso whose window has already ended", () => {
    const aviso = makeAviso({
      id: "past",
      startsAt: "2026-06-01T00:00:00-06:00",
      endsAt: "2026-06-10T23:59:59-06:00",
    });

    expect(selectVisibleAvisos([aviso], NOW)).toEqual([]);
  });

  it("shows an open-ended aviso (endsAt omitted) once it has started", () => {
    const aviso = makeAviso({
      id: "open-ended",
      startsAt: "2026-06-20T00:00:00-06:00",
    });

    expect(selectVisibleAvisos([aviso], NOW)).toEqual([aviso]);
  });

  it("hides an inactive aviso even when it is within the window", () => {
    const aviso = makeAviso({
      id: "killed",
      startsAt: "2026-06-20T00:00:00-06:00",
      endsAt: "2026-06-30T23:59:59-06:00",
      active: false,
    });

    expect(selectVisibleAvisos([aviso], NOW)).toEqual([]);
  });

  it("retains branchId on a branch-specific aviso", () => {
    const aviso = makeAviso({
      id: "cierre-portal-centro",
      type: "closure",
      branchId: "portal-centro",
      startsAt: "2026-06-25T00:00:00-06:00",
    });

    const [visible] = selectVisibleAvisos([aviso], NOW);

    expect(visible.branchId).toBe("portal-centro");
  });

  it("orders by ascending sortOrder", () => {
    const first = makeAviso({ id: "first", sortOrder: 10 });
    const second = makeAviso({ id: "second", sortOrder: 20 });
    const third = makeAviso({ id: "third", sortOrder: 30 });

    // Pass them out of order to prove the sort, not insertion order.
    const ids = selectVisibleAvisos([third, first, second], NOW).map(
      (aviso) => aviso.id,
    );

    expect(ids).toEqual(["first", "second", "third"]);
  });

  it("breaks sortOrder ties by newest startsAt first, then id", () => {
    const older = makeAviso({
      id: "older",
      sortOrder: 10,
      startsAt: "2026-06-10T00:00:00-06:00",
    });
    const newer = makeAviso({
      id: "newer",
      sortOrder: 10,
      startsAt: "2026-06-25T00:00:00-06:00",
    });

    const ids = selectVisibleAvisos([older, newer], NOW).map(
      (aviso) => aviso.id,
    );

    expect(ids).toEqual(["newer", "older"]);
  });

  it("does not mutate the input array", () => {
    const input = [
      makeAviso({ id: "b", sortOrder: 20 }),
      makeAviso({ id: "a", sortOrder: 10 }),
    ];
    const snapshot = input.map((aviso) => aviso.id);

    selectVisibleAvisos(input, NOW);

    expect(input.map((aviso) => aviso.id)).toEqual(snapshot);
  });

  it("accepts a Date instance for now, equivalent to its ISO string", () => {
    const aviso = makeAviso({
      id: "in-window",
      startsAt: "2026-06-20T00:00:00-06:00",
      endsAt: "2026-06-30T23:59:59-06:00",
    });

    expect(selectVisibleAvisos([aviso], new Date(NOW))).toEqual([aviso]);
  });
});
