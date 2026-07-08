import Image from "next/image";
import type { GalleryImage } from "@/domain/gallery/gallery.types";

/**
 * Masonry gallery (CSS columns). Each image keeps its natural aspect ratio
 * so heights vary per column — the classic masonry look. `break-inside-avoid`
 * prevents an image from splitting across columns. No JS required.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((image) => (
        <li key={image.id} className="mb-4 break-inside-avoid overflow-hidden rounded-image shadow-warm-sm">
          <figure className="m-0">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-auto"
            />
            {image.caption && (
              <figcaption className="bg-neutral-0 px-4 py-3 type-small text-text-muted">
                {image.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}
