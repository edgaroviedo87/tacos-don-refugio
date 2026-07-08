/**
 * Gallery content for Tacos Don Refugio.
 *
 * Authoring rules:
 * - English keys, Spanish display values (es-MX).
 * - Images are CC0 (Picsum Photos, picsum.photos) demo placeholders chosen for
 *   varied aspect ratios so the masonry layout is visibly demonstrated; they do
 *   not depict food, and alt text describes the actual photo content — never
 *   claim these are real dishes/events.
 * - The geography is Villa de Álvarez, Colima.
 *
 * The literal is validated through `Gallery.parse(...)` at module load, so an
 * invalid edit (empty alt, non-positive dimension, etc.) fails the build rather
 * than reaching production. Consumers must read the gallery via `getGallery()`
 * in `@/lib/content/gallery`, never import this file directly.
 */

import { Gallery } from "@/domain/gallery/gallery.schema";
import type { Gallery as GalleryType } from "@/domain/gallery/gallery.types";

const galleryData = {
  images: [
    {
      id: "demo-01",
      src: "/images/gallery/demo-01.jpg",
      alt: "Río serpenteando entre montañas al atardecer",
      width: 1200,
      height: 1600,
      category: "ambiente",
      caption: "Paisaje natural",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1015",
      sortOrder: 10,
    },
    {
      id: "demo-02",
      src: "/images/gallery/demo-02.jpg",
      alt: "Perro sentado mirando a la cámara",
      width: 1600,
      height: 1067,
      category: "ambiente",
      caption: "Retrato",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1025",
      sortOrder: 20,
    },
    {
      id: "demo-03",
      src: "/images/gallery/demo-03.jpg",
      alt: "Sendero entre árboles en un bosque",
      width: 1200,
      height: 1200,
      category: "ambiente",
      caption: "Naturaleza",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1035",
      sortOrder: 30,
    },
    {
      id: "demo-04",
      src: "/images/gallery/demo-04.jpg",
      alt: "Formación rocosa en un cañón árido",
      width: 1067,
      height: 1600,
      category: "ambiente",
      caption: "Paisaje",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1040",
      sortOrder: 40,
    },
    {
      id: "demo-05",
      src: "/images/gallery/demo-05.jpg",
      alt: "Cadena montañosa bajo un cielo despejado",
      width: 1600,
      height: 900,
      category: "ambiente",
      caption: "Panorámica",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1050",
      sortOrder: 50,
    },
    {
      id: "demo-06",
      src: "/images/gallery/demo-06.jpg",
      alt: "Textura oscura abstracta con reflejos de luz",
      width: 1200,
      height: 1500,
      category: "ambiente",
      caption: "Textura",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1060",
      sortOrder: 60,
    },
    {
      id: "demo-07",
      src: "/images/gallery/demo-07.jpg",
      alt: "Zorro mirando de frente entre la vegetación",
      width: 1400,
      height: 1400,
      category: "ambiente",
      caption: "Fauna",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1074",
      sortOrder: 70,
    },
    {
      id: "demo-08",
      src: "/images/gallery/demo-08.jpg",
      alt: "Bosque cubierto de niebla matutina",
      width: 1600,
      height: 1067,
      category: "ambiente",
      caption: "Ambiente",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1080",
      sortOrder: 80,
    },
    {
      id: "demo-09",
      src: "/images/gallery/demo-09.jpg",
      alt: "Primer plano de un perro con la lengua afuera",
      width: 1080,
      height: 1620,
      category: "ambiente",
      caption: "Retrato",
      credit: "Picsum Photos (CC0) — picsum.photos/id/1084",
      sortOrder: 90,
    },
  ],
};

/**
 * Parsed at module load: a bad edit throws here and fails the build. The cast
 * documents the resolved type; `Gallery.parse` is what actually guarantees it.
 */
export const gallery: GalleryType = Gallery.parse(galleryData);
