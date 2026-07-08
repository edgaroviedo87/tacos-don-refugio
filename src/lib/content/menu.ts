/**
 * Menu access seam.
 *
 * This is the ONLY module the UI imports to read the menu. Today it returns the
 * statically-parsed content; in Phase 2 the body swaps to a Drizzle query with
 * an identical `Menu` return type, leaving every caller untouched (spec §5.5).
 */

import { menu } from "@/content/menu.data";
import type { Menu } from "@/domain/menu/menu.types";

/** Return the validated menu document. */
export function getMenu(): Menu {
  return menu;
}
