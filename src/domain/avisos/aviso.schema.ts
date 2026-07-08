/**
 * Avisos (announcements) domain schema — single source of truth for the aviso
 * contract.
 *
 * Zod is the contract: it validates the static content file today and will be
 * reused to validate DB rows and admin form input later (spec §5.5, plan M2.5).
 * Keys are English (code), display values (title/body) are Spanish (es-MX).
 *
 * This module lives in the domain layer and MUST stay framework-free: Zod only,
 * no next/react imports. Dates are ISO strings (`startsAt`/`endsAt`); date-based
 * show/hide is computed by `selectVisibleAvisos`, never inferred from prose.
 */

import { z } from "zod";

/**
 * Slug pattern for stable identifiers. The `id` becomes a DB primary key in
 * Phase 2, so we constrain it now to lowercase ASCII words joined by hyphens
 * (e.g. "cierre-portal-centro") rather than accepting any string.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * The kind of notice. Drives icon and severity styling in the UI. `info` and
 * `warning` map to genuine functional alerts; `closure`/`price-update`/`event`
 * are content categories the brand styling keys off (plan M3.6).
 */
export const AvisoType = z.enum([
  "info",
  "warning",
  "closure",
  "price-update",
  "event",
]);

/** A single dated announcement. */
export const Aviso = z.object({
  // Stable slug; becomes the DB PK later — e.g. "cierre-portal-centro".
  id: z.string().regex(SLUG_PATTERN, "id must be a lowercase slug"),
  title: z.string().min(1), // "Cierre temporal — Portal del Centro"
  body: z.string().min(1), // short Spanish notice
  type: AvisoType, // drives icon/severity styling
  // References Branch.id when branch-specific; omitted for site-wide notices.
  // Referential integrity (must match a real Branch.id) is enforced by the
  // content author + data-todo checklist, not by this schema (no FK at rest).
  branchId: z.string().optional(),
  startsAt: z.string(), // ISO — show from
  endsAt: z.string().optional(), // ISO — hide after (open-ended if omitted)
  active: z.boolean().default(true), // manual kill switch, independent of dates
  sortOrder: z.number().int().default(0),
});

/** The full avisos document: the flat list of items. */
export const Avisos = z.object({ items: z.array(Aviso) });
