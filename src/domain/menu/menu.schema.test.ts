/**
 * Contract tests for the menu domain schema and the authored content.
 *
 * These guard the two things most likely to break silently: the
 * "price or variant" invariant on items, and the real `menu.data` staying
 * valid as it is edited over time.
 */

import { describe, expect, it } from "vitest";

import { menu as menuData } from "@/content/menu.data";

import { Menu, MenuCategory, MenuItem } from "./menu.schema";

describe("MenuItem", () => {
  const baseItem = {
    id: "taco-pastor",
    name: "Taco al Pastor",
    category: "tacos",
    priceCents: 1700,
  };

  it("parses a valid item with a flat price", () => {
    const result = MenuItem.parse(baseItem);

    expect(result.priceCents).toBe(1700);
    // Defaults are applied on parse.
    expect(result.available).toBe(true);
    expect(result.sortOrder).toBe(0);
  });

  it("parses a valid item priced via variants", () => {
    const result = MenuItem.parse({
      id: "orden-tacos",
      name: "Orden de Tacos",
      category: "ordenes",
      variants: [{ label: "Orden de 5", priceCents: 8000 }],
    });

    expect(result.variants?.[0]?.priceCents).toBe(8000);
  });

  it("rejects an item with neither priceCents nor variants", () => {
    expect(() =>
      MenuItem.parse({
        id: "sin-precio",
        name: "Sin Precio",
        category: "tacos",
      }),
    ).toThrow();
  });

  it("rejects an item whose variants array is empty", () => {
    expect(() =>
      MenuItem.parse({
        id: "variantes-vacias",
        name: "Variantes Vacías",
        category: "tacos",
        variants: [],
      }),
    ).toThrow();
  });

  it("rejects an unknown category", () => {
    expect(() =>
      MenuItem.parse({ ...baseItem, category: "postres" }),
    ).toThrow();
  });

  it("rejects an id that is not a slug", () => {
    expect(() =>
      MenuItem.parse({ ...baseItem, id: "Taco Pastor" }),
    ).toThrow();
  });
});

describe("MenuCategory", () => {
  it("enumerates exactly the spec categories", () => {
    expect(MenuCategory.options).toEqual([
      "tacos",
      "tortas",
      "ordenes",
      "bebidas",
      "extras",
    ]);
  });
});

describe("menu.data", () => {
  it("parses cleanly through the Menu schema", () => {
    // menuData is already parsed at module load; re-parsing must also succeed
    // and round-trip identically.
    expect(() => Menu.parse(menuData)).not.toThrow();
  });

  it("declares MXN currency and the prices disclaimer", () => {
    expect(menuData.currency).toBe("MXN");
    expect(menuData.pricesDisclaimer).toBe(
      "Precios sujetos a cambio sin previo aviso",
    );
    expect(menuData.updatedAt).toBe("2026-06-27");
  });

  it("uses only known categories", () => {
    const categories = new Set(menuData.items.map((item) => item.category));

    for (const category of categories) {
      expect(MenuCategory.options).toContain(category);
    }
  });

  it("carries the spec reference prices as centavos", () => {
    const byId = new Map(menuData.items.map((item) => [item.id, item]));

    expect(byId.get("taco-ollita")?.priceCents).toBe(2000);
    expect(byId.get("quesadilla")?.priceCents).toBe(8000);
    expect(byId.get("mulita")?.priceCents).toBe(10000);
    expect(byId.get("torta")?.priceCents).toBe(7000);
    expect(byId.get("orden")?.variants?.[0]?.priceCents).toBe(9000);
  });

  it("gives every item a usable price (flat or via variants)", () => {
    for (const item of menuData.items) {
      const hasPrice =
        item.priceCents != null ||
        (item.variants != null && item.variants.length > 0);
      expect(hasPrice).toBe(true);
    }
  });
});
