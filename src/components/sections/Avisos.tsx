import { getAvisos } from "@/lib/content/avisos";
import { getBranches } from "@/lib/content/branches";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AvisosClient } from "./AvisosClient";

/**
 * Avisos (plan M3.6). Server wrapper: reads every authored aviso and a branch
 * id→name map, then hands off to `AvisosClient` for date-aware show/hide. The
 * caller supplies the surrounding `<Section>` (id/tone).
 */
export function Avisos() {
  const avisos = getAvisos();
  const branchNames = Object.fromEntries(getBranches().map((b) => [b.id, b.name]));

  return (
    <>
      <div className="text-center">
        <Eyebrow>Avisos</Eyebrow>
        <h2 className="type-h2 mt-2">Novedades y anuncios</h2>
      </div>

      <AvisosClient
        avisos={avisos}
        branchNames={branchNames}
        buildNowIso={new Date().toISOString()}
      />
    </>
  );
}
