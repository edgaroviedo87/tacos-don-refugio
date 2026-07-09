/**
 * Branch content for Tacos Don Refugio — the 3 sucursales in Villa de Álvarez,
 * Colima.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - All addresses, phones, hours, and map URLs below are fictional demo data.
 * - `geo` is intentionally OMITTED on every branch: we have no confirmed
 *   coordinates and never emit fake ones. JSON-LD drops `geo` when absent
 *   (spec §5.6, plan M2.4). This is the correct state, not a gap.
 *
 * The literal is validated through `Branches.parse(...)` at module load, so an
 * invalid edit (bad slug id, non-URL mapsUrl, malformed hours) fails the build
 * rather than reaching production. Consumers must read branches via
 * `getBranches()` in `@/lib/content/branches`, never import this file directly.
 */

import { Branches } from "@/domain/branches/branch.schema";
import type { Branches as BranchesType } from "@/domain/branches/branch.types";

const branchesData = [
  {
    id: "matriz",
    name: "Matriz — Av. Constitución de 1917",
    address: "Av. Constitución de 1917 s/n, Centro, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+Av.+Constituci%C3%B3n+de+1917+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    whatsapp: "+52 1 312 198 4471",
    hours: [{ days: "Lunes a Domingo", open: "08:30", close: "22:30" }],
    restDay: "Martes",
    isDelivery: true,
  },
  {
    id: "portal-centro",
    name: "Portal del Centro",
    address: "Portal del Centro s/n, Colonia Jardines, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+Portal+del+Centro+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    hours: [{ days: "Lunes a Domingo", open: "08:30", close: "22:30" }],
    restDay: "Martes",
    isDelivery: false,
  },
  {
    id: "de-pasadita",
    name: "Camino Real",
    address: "Centro, Villa de Álvarez, Colima, México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tacos+Don+Refugio+Camino+Real+Villa+de+%C3%81lvarez+Colima",
    phone: "312 145 9820",
    hours: [{ days: "Lunes a Domingo", open: "08:00", close: "22:00" }],
    restDay: "Martes",
    isDelivery: false,
  },
];

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Branches.parse` is what actually guarantees it.
 */
export const branches: BranchesType = Branches.parse(branchesData);
