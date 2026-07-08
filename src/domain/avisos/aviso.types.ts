/**
 * Inferred TypeScript types for the avisos domain.
 *
 * These are derived from the Zod schemas so the static types and the runtime
 * contract can never drift. Import these for typing; import the schemas only
 * when you need to parse/validate.
 */

import type { z } from "zod";

import type { Aviso, Avisos, AvisoType } from "./aviso.schema";

export type AvisoType = z.infer<typeof AvisoType>;
export type Aviso = z.infer<typeof Aviso>;
export type Avisos = z.infer<typeof Avisos>;
