/**
 * Inferred TypeScript types for the branches domain.
 *
 * These are derived from the Zod schemas so the static types and the runtime
 * contract can never drift. Import these for typing; import the schemas only
 * when you need to parse/validate.
 */

import type { z } from "zod";

import type { Branch, Branches, Geo, OpeningHours } from "./branch.schema";

export type OpeningHours = z.infer<typeof OpeningHours>;
export type Geo = z.infer<typeof Geo>;
export type Branch = z.infer<typeof Branch>;
export type Branches = z.infer<typeof Branches>;
