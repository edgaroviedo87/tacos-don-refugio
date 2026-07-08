/**
 * Avisos (announcements) content for Tacos Don Refugio.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - Dates are ISO strings. `startsAt`/`endsAt` drive automatic show/hide via
 *   `selectVisibleAvisos`; `active` is a manual kill switch independent of dates.
 * - Every `branchId` MUST reference a real id from `branches.data.ts`
 *   (`matriz`, `portal-centro`, `de-pasadita`). There is no FK at rest, so this
 *   is an authoring invariant — see `docs/data-todo.md`.
 * - The notices below are PLACEHOLDERS marked `// TODO(owner): confirm ...`.
 *   Replace once the owner confirms the real announcements.
 *
 * The literal is validated through `Avisos.parse(...)` at module load, so an
 * invalid edit (bad slug id, missing title/body, bad type) fails the build
 * rather than reaching production. Consumers must read avisos via `getAvisos()`
 * / `getVisibleAvisos()` in `@/lib/content/avisos`, never import this file
 * directly.
 */

import { Avisos } from "@/domain/avisos/aviso.schema";
import type { Avisos as AvisosType } from "@/domain/avisos/aviso.types";

const avisosData = {
  items: [
    {
      // TODO(owner): confirm the real price change and effective date.
      id: "actualizacion-precios-2026",
      title: "Actualización de precios",
      body: "Algunos precios cambiaron a partir de junio. Consulta el menú actualizado y los precios sujetos a cambio sin previo aviso.",
      type: "price-update",
      startsAt: "2026-06-20T00:00:00-06:00",
      // Open-ended: no endsAt — stays visible until the owner deactivates it.
      sortOrder: 10,
    },
    {
      // TODO(owner): confirm closure dates for Portal del Centro.
      id: "cierre-portal-centro",
      title: "Cierre temporal — Portal del Centro",
      body: "La sucursal Portal del Centro permanecerá cerrada por mantenimiento. Te esperamos en nuestras otras sucursales.",
      type: "closure",
      branchId: "portal-centro",
      startsAt: "2026-06-25T00:00:00-06:00",
      endsAt: "2026-06-30T23:59:59-06:00",
      sortOrder: 20,
    },
    {
      // TODO(owner): confirm the event details and dates.
      id: "catering-eventos-verano",
      title: "Servicio de eventos y catering",
      body: "¿Tienes un evento? Llevamos los tacos a tu fiesta. Aparta tu fecha de verano con nosotros.",
      type: "event",
      startsAt: "2026-06-15T00:00:00-06:00",
      endsAt: "2026-08-31T23:59:59-06:00",
      sortOrder: 30,
    },
  ],
};

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Avisos.parse` is what actually guarantees it.
 */
export const avisos: AvisosType = Avisos.parse(avisosData);
