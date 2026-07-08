/**
 * Gallery domain schema — single source of truth for the gallery contract.
 *
 * The gallery's purpose is event/catering proof: photos of Tacos Don Refugio
 * serving events ("eventos") lead, with food ("comida") and atmosphere
 * ("ambiente") as support. Zod is the contract: it validates the static
 * content file today and will be reused to validate DB rows and admin uploads
 * later (same seam pattern as the menu domain).
 *
 * This module lives in the domain layer and MUST stay framework-free: Zod only,
 * no next/react imports. Keys/identifiers are English (code); user-facing `alt`
 * and `caption` are Spanish (es-MX).
 */

import { z } from "zod";

/**
 * Gallery categories that drive filtering/sectioning in the UI. `eventos` is
 * the marketing focus (event catering), so it is also the schema default.
 */
export const GalleryCategory = z.enum(["eventos", "comida", "ambiente"]);

/**
 * A single gallery image.
 *
 * `alt` is REQUIRED and non-empty: it is both an accessibility contract and an
 * SEO signal, so an image without descriptive alt text is a content bug, not a
 * valid state. `width`/`height` are the image's intrinsic pixel dimensions —
 * next/image needs them to reserve space and avoid layout shift (CLS).
 */
export const GalleryImage = z.object({
  // Stable slug-style id; becomes the DB PK later — e.g. "evento-jardin-01".
  id: z.string(),
  src: z.string(), // /images/gallery/... (served by next/image)
  alt: z.string().min(1), // required, non-empty — SEO + a11y, Spanish
  width: z.number().int().positive(), // intrinsic px — prevents CLS
  height: z.number().int().positive(), // intrinsic px — prevents CLS
  category: GalleryCategory.default("eventos"),
  caption: z.string().optional(), // Spanish, optional display text
  credit: z.string().optional(), // licensing/attribution tracking
  sortOrder: z.number().int().default(0),
});

/**
 * The full gallery document: a flat list of images. An empty `images` array is
 * a valid document — the empty-state presentation is a UI concern (M3), the
 * data layer only needs to not reject it.
 */
export const Gallery = z.object({ images: z.array(GalleryImage) });
