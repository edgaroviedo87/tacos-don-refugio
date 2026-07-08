/**
 * Menu domain schema — single source of truth for the menu contract.
 *
 * Zod is the contract: it validates the static content file today and will be
 * reused to validate DB rows and admin form input later (spec §5.5). Keys are
 * English (code), display values (name/label) are Spanish (es-MX).
 *
 * This module lives in the domain layer and MUST stay framework-free: Zod only,
 * no next/react imports. Money is integer centavos everywhere (spec §5.2).
 */

import { z } from "zod";

/**
 * Slug pattern for stable identifiers. The `id` becomes a DB primary key in
 * Phase 2, so we constrain it now to lowercase ASCII words joined by hyphens
 * (e.g. "taco-pastor") rather than accepting any string.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Menu categories that drive sectioning/tabbing in the UI. */
export const MenuCategory = z.enum([
  "tacos",
  "tortas",
  "ordenes",
  "bebidas",
  "extras",
]);

/**
 * A named price option for an item, e.g. "Orden de 5" or "Grande". Used when a
 * single `priceCents` cannot express the item (multiple sizes/portions).
 */
export const PriceVariant = z.object({
  // Display label, Spanish — e.g. "Orden de 5", "Sencillo", "Grande".
  label: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
});

/**
 * A single menu item. An item carries EITHER a flat `priceCents` OR a non-empty
 * list of `variants` (the refine below enforces "at least one of the two"). The
 * spec permits both to coexist, so we do not forbid that combination.
 */
export const MenuItem = z
  .object({
    // Stable slug; becomes the DB PK later — e.g. "taco-pastor".
    id: z.string().regex(SLUG_PATTERN, "id must be a lowercase slug"),
    name: z.string().min(1), // "Taco al Pastor"
    description: z.string().optional(),
    category: MenuCategory,
    // Either a single price or named variants (orden de 5, etc.).
    priceCents: z.number().int().nonnegative().optional(),
    variants: z.array(PriceVariant).optional(),
    image: z.string().optional(), // /public path or remote URL later
    tags: z.array(z.string()).optional(), // "picante", "popular", "nuevo"
    available: z.boolean().default(true), // toggle off without deleting
    sortOrder: z.number().int().default(0),
  })
  .refine(
    (item) =>
      item.priceCents != null ||
      (item.variants != null && item.variants.length > 0),
    { message: "Item needs a price or at least one variant" },
  );

/** The full menu document: metadata plus the flat list of items. */
export const Menu = z.object({
  currency: z.literal("MXN").default("MXN"),
  pricesDisclaimer: z.string(), // "Precios sujetos a cambio sin previo aviso"
  updatedAt: z.string(), // ISO date — show "Actualizado: ..."
  items: z.array(MenuItem),
});
