/**
 * Gallery access seam.
 *
 * This is the ONLY module the UI imports to read the gallery. Today it returns
 * the statically-parsed content; in Phase 2 the body swaps to a Drizzle query
 * with an identical `Gallery` return type, leaving every caller untouched (same
 * pattern as `getMenu()`).
 */

import { gallery } from "@/content/gallery.data";
import type { Gallery } from "@/domain/gallery/gallery.types";

/** Return the validated gallery document. */
export function getGallery(): Gallery {
  return gallery;
}
