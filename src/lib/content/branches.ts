/**
 * Branches access seam.
 *
 * This is the ONLY module the UI imports to read branches. Today it returns the
 * statically-parsed content; in Phase 2 the body swaps to a Drizzle query with
 * an identical `Branch[]` return type, leaving every caller untouched
 * (spec §5.5, §5.6).
 */

import { branches } from "@/content/branches.data";
import type { Branch } from "@/domain/branches/branch.types";

/** Return the validated list of branches. */
export function getBranches(): Branch[] {
  return branches;
}
