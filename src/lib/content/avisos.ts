/**
 * Avisos access seam.
 *
 * This is the ONLY module the UI imports to read avisos. Today it returns the
 * statically-parsed content; in Phase 2 the body swaps to a Drizzle query with
 * an identical return type, leaving every caller untouched (spec §5.5).
 *
 * `getVisibleAvisos(now)` applies the date-based show/hide rule via the pure
 * domain helper, so the UI never re-implements visibility logic.
 */

import { avisos } from "@/content/avisos.data";
import { selectVisibleAvisos } from "@/domain/avisos/selectVisibleAvisos";
import type { Aviso } from "@/domain/avisos/aviso.types";

/** Return every authored aviso (no date/active filtering). */
export function getAvisos(): Aviso[] {
  return avisos.items;
}

/** Return only the avisos visible at `now` (active + within window), ordered. */
export function getVisibleAvisos(now: Date | string): Aviso[] {
  return selectVisibleAvisos(avisos.items, now);
}
