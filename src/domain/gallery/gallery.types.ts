/**
 * Inferred TypeScript types for the gallery domain.
 *
 * These are derived from the Zod schemas so the static types and the runtime
 * contract can never drift. Import these for typing; import the schemas only
 * when you need to parse/validate.
 */

import type { z } from "zod";

import type { Gallery, GalleryCategory, GalleryImage } from "./gallery.schema";

export type GalleryCategory = z.infer<typeof GalleryCategory>;
export type GalleryImage = z.infer<typeof GalleryImage>;
export type Gallery = z.infer<typeof Gallery>;
