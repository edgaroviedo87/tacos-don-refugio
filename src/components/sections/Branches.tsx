import { getBranches } from "@/lib/content/branches";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BranchCard } from "./BranchCard";

/**
 * Sucursales (plan M3.5). Renders the 3 branches as cards. The caller supplies
 * the surrounding `<Section>` so this works on the home page and the dedicated
 * `/sucursales` route unchanged. On the route, `showHeading={false}` lets the
 * page own the `<h1>`; on home it renders its own `<h2>`.
 */
export function Branches({ showHeading = true }: { showHeading?: boolean }) {
  const branches = getBranches();

  return (
    <>
      {showHeading && (
        <div className="text-center">
          <Eyebrow>Visítanos</Eyebrow>
          <h2 className="type-h2 mt-2">Nuestras sucursales</h2>
          <p className="type-body mt-3 text-text-muted">
            Tres puntos en Villa de Álvarez para disfrutar el sabor de siempre.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>
    </>
  );
}
