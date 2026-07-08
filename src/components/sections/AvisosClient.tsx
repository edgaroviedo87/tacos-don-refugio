"use client";

import * as React from "react";
import { selectVisibleAvisos } from "@/domain/avisos/selectVisibleAvisos";
import type { Aviso } from "@/domain/avisos/aviso.types";
import { AvisoCard } from "./AvisoCard";

/**
 * Client-side date-aware rendering of the avisos list (plan M2.5 / M3.6).
 *
 * Freshness strategy = SSG/ISR + client re-check. The first render (server and
 * hydration) uses `buildNowIso` so server and client markup match exactly (no
 * hydration mismatch). `useSyncExternalStore` flips `isClient` to true only
 * after hydration, at which point the window is re-evaluated against the real
 * current time — keeping date-based show/hide correct between rebuilds without a
 * server, and without a setState-in-effect. Avisos are below the fold, non-LCP.
 */
const subscribe = () => () => {};

export function AvisosClient({
  avisos,
  branchNames,
  buildNowIso,
}: {
  avisos: Aviso[];
  branchNames: Record<string, string>;
  buildNowIso: string;
}) {
  const isClient = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const nowIso = isClient ? new Date().toISOString() : buildNowIso;

  const visible = selectVisibleAvisos(avisos, nowIso);

  if (visible.length === 0) {
    return (
      <p className="mt-8 text-center type-body text-text-muted">
        Por ahora no hay avisos. ¡Síguenos en redes para enterarte de todo!
      </p>
    );
  }

  return (
    <div className="mx-auto mt-8 grid max-w-3xl gap-4">
      {visible.map((aviso) => (
        <AvisoCard
          key={aviso.id}
          aviso={aviso}
          branchName={aviso.branchId ? branchNames[aviso.branchId] : undefined}
        />
      ))}
    </div>
  );
}
