import { existsSync } from "node:fs";
import path from "node:path";
import { Camera } from "lucide-react";
import { getGallery } from "@/lib/content/gallery";
import { site } from "@/content/site.data";
import type { GalleryImage } from "@/domain/gallery/gallery.types";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GalleryGrid } from "./GalleryGrid";

/**
 * Keep only images whose file actually exists under `public/` at build time.
 *
 * Defensive filter: if a future edit to `gallery.data.ts` adds an entry before
 * its image file exists on disk, this drops it instead of rendering a broken
 * <img> tag. Self-healing — the entry appears with zero code change the moment
 * its file lands, and `width`/`height` already reserve correct space.
 */
function withExistingAssets(images: GalleryImage[]): GalleryImage[] {
  const publicDir = path.join(process.cwd(), "public");
  return images.filter((image) => existsSync(path.join(publicDir, image.src)));
}

/**
 * Galería (plan M3.7) — event-catering focus. Renders the grid when licensed
 * photos exist, otherwise a graceful "próximamente" empty state (no CLS, no
 * broken images). The caller supplies the surrounding `<Section>`.
 */
export function Gallery() {
  const images = withExistingAssets(getGallery().images).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <>
      <div className="text-center">
        <Eyebrow>Galería</Eyebrow>
        <h2 className="type-h2 mt-2">Eventos y antojos</h2>
        <p className="type-body mt-3 text-text-muted">
          Llevamos el sabor de {site.name} a tus fiestas y eventos en {site.city}.
        </p>
      </div>

      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : (
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-card border border-dashed border-neutral-200 bg-neutral-0 px-6 py-14 text-center">
          <Camera className="h-10 w-10 text-neutral-400" strokeWidth={1.5} aria-hidden="true" />
          <p className="type-h4 mt-4 text-brown-900">Próximamente</p>
          <p className="type-body mt-2 text-text-muted">
            Estamos preparando la galería de nuestros eventos y taquizas. ¿Tienes una fiesta?
            Escríbenos por WhatsApp y llevamos los tacos.
          </p>
        </div>
      )}
    </>
  );
}
