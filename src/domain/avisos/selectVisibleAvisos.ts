/**
 * Pure selector for the avisos currently worth showing.
 *
 * Framework-free (domain layer): no next/react imports, no I/O, no mutation of
 * the input. Given the authored avisos and a reference instant `now`, it returns
 * a NEW array containing only the avisos that should be visible, ordered for the
 * UI.
 *
 * Visibility rule (plan M2.5): an aviso is shown when
 *   `active && startsAt <= now && (endsAt == null || now <= endsAt)`.
 * Dates are ISO strings compared as instants via `Date` parsing — never as raw
 * string compares, which would break across timezone offsets and formats.
 *
 * Ordering: ascending `sortOrder`, then a stable tiebreak of newest-first by
 * `startsAt` (a fresher notice outranks an older one at the same priority), then
 * `id` so the result is fully deterministic.
 */

import type { Aviso } from "./aviso.types";

/** Parse an ISO string or Date to an epoch-millis instant. */
function toInstant(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

export function selectVisibleAvisos(
  avisos: Aviso[],
  now: Date | string,
): Aviso[] {
  const nowMs = toInstant(now);

  return avisos
    .filter((aviso) => {
      if (!aviso.active) return false;
      if (toInstant(aviso.startsAt) > nowMs) return false;
      if (aviso.endsAt != null && toInstant(aviso.endsAt) < nowMs) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      const startDelta = toInstant(b.startsAt) - toInstant(a.startsAt);
      if (startDelta !== 0) return startDelta;
      return a.id.localeCompare(b.id);
    });
}
