/**
 * Branches domain schema — single source of truth for the branch contract.
 *
 * Zod is the contract: it validates the static content file today and will be
 * reused to validate DB rows and admin form input later (spec §5.6). Keys are
 * English (code), display values (name/address/restDay) are Spanish (es-MX).
 *
 * This module lives in the domain layer and MUST stay framework-free: Zod only,
 * no next/react imports.
 */

import { z } from "zod";

/**
 * Slug pattern for stable identifiers. The `id` becomes a DB primary key in
 * Phase 2 and a route segment (`/sucursales/[id]`), so we constrain it now to
 * lowercase ASCII words joined by hyphens (e.g. "portal-centro") rather than
 * accepting any string.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * One opening-hours block, kept structured (not a free-text string) so the
 * JSON-LD `openingHoursSpecification` can be derived from it later (spec §5.6,
 * §8 structured data) without re-parsing prose.
 *
 * `days` is a human label in Spanish (e.g. "Lunes a Domingo", "Viernes y
 * Sábado"); `open`/`close` are 24h "HH:MM" strings the UI can format and the
 * JSON-LD generator can map to schema.org day enums.
 */
export const OpeningHours = z.object({
  // Display label, Spanish — e.g. "Lunes a Domingo", "Martes a Domingo".
  days: z.string().min(1),
  open: z.string().regex(/^\d{2}:\d{2}$/, "open must be HH:MM"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "close must be HH:MM"),
});

/**
 * Geographic coordinates for a branch.
 *
 * OPTIONAL on `Branch`: it is omitted whenever the real coordinates are not yet
 * confirmed. We NEVER emit fake coordinates — the JSON-LD `geo` block is simply
 * dropped when this is absent (spec §5.6, plan M2.4). Do not default these.
 */
export const Geo = z.object({
  lat: z.number(),
  lng: z.number(),
});

/** A single physical branch (sucursal). */
export const Branch = z.object({
  // Stable slug; becomes the DB PK and the `/sucursales/[id]` segment later.
  id: z.string().regex(SLUG_PATTERN, "id must be a lowercase slug"),
  name: z.string().min(1), // "Matriz — Av. Constitución de 1917"
  address: z.string().min(1),
  mapsUrl: z.url(), // Google Maps link-out ("Cómo llegar")
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  hours: z.array(OpeningHours),
  restDay: z.string().optional(), // "Martes"
  isDelivery: z.boolean().default(false),
  // Omitted until real coords are confirmed; never faked (see Geo above).
  geo: Geo.optional(),
});

/** The full set of branches. */
export const Branches = z.array(Branch);
