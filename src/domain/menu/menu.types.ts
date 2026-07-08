/**
 * Inferred TypeScript types for the menu domain.
 *
 * These are derived from the Zod schemas so the static types and the runtime
 * contract can never drift. Import these for typing; import the schemas only
 * when you need to parse/validate.
 */

import type { z } from "zod";

import type { Menu, MenuCategory, MenuItem, PriceVariant } from "./menu.schema";

export type MenuCategory = z.infer<typeof MenuCategory>;
export type PriceVariant = z.infer<typeof PriceVariant>;
export type MenuItem = z.infer<typeof MenuItem>;
export type Menu = z.infer<typeof Menu>;
