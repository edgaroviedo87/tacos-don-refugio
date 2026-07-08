/**
 * Menu content for Tacos Don Refugio.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - Money is integer centavos (1700 === $17.00). See spec §5.2.
 * - Tacos, órdenes, and tortas carry owner-confirmed prices (2026-07-01).
 *   Remaining items (bebidas, extras) are still PLACEHOLDERS marked with
 *   `// TODO(owner): confirm price`. Replace once the owner confirms them.
 *
 * The literal is validated through `Menu.parse(...)` at module load, so an
 * invalid edit (bad category, missing price/variant, etc.) fails the build
 * rather than reaching production. Consumers must read the menu via
 * `getMenu()` in `@/lib/content/menu`, never import this file directly.
 */

import { Menu } from "@/domain/menu/menu.schema";
import type { Menu as MenuType } from "@/domain/menu/menu.types";

const menuData = {
  currency: "MXN",
  pricesDisclaimer: "Precios sujetos a cambio sin previo aviso",
  updatedAt: "2026-06-27",
  items: [
    // --- Tacos ---------------------------------------------------------
    // Tacos de ollita, estilo Villa de Álvarez: precio único, se elige la carne.
    {
      id: "taco-ollita",
      name: "Taco de Ollita",
      description: "Elige tu carne: Res, Chicharrón, Frijol, Cerdo, Lengua o Hígado.",
      category: "tacos",
      priceCents: 2000,
      tags: ["popular"],
      sortOrder: 10,
    },
    // --- Órdenes ---------------------------------------------------------
    // Plato de carne por tamaño: mismo precio para cualquiera de las 6 carnes.
    {
      id: "orden",
      name: "Orden",
      description: "Elige tu carne: Res, Chicharrón, Frijol, Cerdo, Lengua o Hígado.",
      category: "ordenes",
      variants: [
        { label: "Mini", priceCents: 9000 },
        { label: "Chica", priceCents: 16000 },
        { label: "Grande", priceCents: 25000 },
      ],
      tags: ["popular"],
      sortOrder: 10,
    },
    {
      id: "quesadilla",
      name: "Quesadilla",
      description: "Tortilla con queso y guiso a elegir.",
      category: "ordenes",
      priceCents: 8000, // TODO(owner): confirm price
      sortOrder: 20,
    },
    {
      id: "mulita",
      name: "Mulita",
      description: "Doble tortilla con carne y queso gratinado.",
      category: "ordenes",
      priceCents: 10000, // TODO(owner): confirm price
      sortOrder: 30,
    },
    // --- Tortas ------------------------------------------------------------
    {
      id: "torta",
      name: "Torta",
      description: "Pan telera con aguacate y los acompañantes. Elige tu carne: Res, Chicharrón, Frijol, Cerdo, Lengua o Hígado.",
      category: "tortas",
      priceCents: 7000,
      sortOrder: 10,
    },
    // --- Bebidas -----------------------------------------------------------
    {
      id: "agua-fresca",
      name: "Agua Fresca",
      description: "Sabores del día: horchata, jamaica, limón.",
      category: "bebidas",
      variants: [
        { label: "Chico", priceCents: 2000 }, // TODO(owner): confirm price
        { label: "Grande", priceCents: 3000 }, // TODO(owner): confirm price
      ],
      sortOrder: 10,
    },
    {
      id: "refresco",
      name: "Refresco",
      description: "Refresco embotellado.",
      category: "bebidas",
      priceCents: 2500, // TODO(owner): confirm price
      sortOrder: 20,
    },
    // --- Extras ------------------------------------------------------------
    {
      id: "extra-queso",
      name: "Queso Extra",
      category: "extras",
      priceCents: 1500, // TODO(owner): confirm price
      sortOrder: 10,
    },
  ],
};

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Menu.parse` is what actually guarantees it.
 */
export const menu: MenuType = Menu.parse(menuData);
