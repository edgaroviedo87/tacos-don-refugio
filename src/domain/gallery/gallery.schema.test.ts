/**
 * Contract tests for the gallery domain schema and the authored content.
 *
 * These guard the contract details most likely to break silently: the required
 * non-empty `alt` (SEO + a11y), the positive-integer intrinsic dimensions (CLS
 * protection), the graceful empty gallery, and the authored `gallery.data`
 * staying valid — including the geography rule (never the retired brand's
 * "Jalisco" / "Ciudad Guzmán").
 */

import { describe, expect, it } from "vitest";

import { gallery as galleryData } from "@/content/gallery.data";

import { Gallery, GalleryCategory, GalleryImage } from "./gallery.schema";

describe("GalleryImage", () => {
  const baseImage = {
    id: "evento-taquiza-jardin",
    src: "/images/gallery/evento-taquiza-jardin.jpg",
    alt: "Taquiza servida en un evento al aire libre",
    width: 1600,
    height: 1067,
  };

  it("parses a valid image and defaults category to 'eventos'", () => {
    const result = GalleryImage.parse(baseImage);

    expect(result.category).toBe("eventos");
    // Defaults are applied on parse.
    expect(result.sortOrder).toBe(0);
  });

  it("rejects an empty alt (a11y + SEO contract)", () => {
    expect(() => GalleryImage.parse({ ...baseImage, alt: "" })).toThrow();
  });

  it("rejects a non-positive width", () => {
    expect(() => GalleryImage.parse({ ...baseImage, width: 0 })).toThrow();
  });

  it("rejects a non-integer height", () => {
    expect(() =>
      GalleryImage.parse({ ...baseImage, height: 1067.5 }),
    ).toThrow();
  });
});

describe("GalleryCategory", () => {
  it("enumerates exactly the spec categories", () => {
    expect(GalleryCategory.options).toEqual(["eventos", "comida", "ambiente"]);
  });
});

describe("Gallery", () => {
  it("parses an empty images list (graceful empty state)", () => {
    const result = Gallery.parse({ images: [] });

    expect(result.images).toEqual([]);
  });
});

describe("gallery.data", () => {
  it("parses cleanly through the Gallery schema", () => {
    // galleryData is already parsed at module load; re-parsing must also
    // succeed and round-trip identically.
    expect(() => Gallery.parse(galleryData)).not.toThrow();
  });

  it("uses only known categories", () => {
    const categories = new Set(
      galleryData.images.map((image) => image.category),
    );

    for (const category of categories) {
      expect(GalleryCategory.options).toContain(category);
    }
  });

  it("gives every image non-empty alt text and positive dimensions", () => {
    for (const image of galleryData.images) {
      expect(image.alt.length).toBeGreaterThan(0);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });

  it("never references the retired brand's geography in alt or caption", () => {
    for (const image of galleryData.images) {
      const alt = image.alt.toLowerCase();
      const caption = (image.caption ?? "").toLowerCase();
      expect(alt).not.toContain("jalisco");
      expect(alt).not.toContain("ciudad guzmán");
      expect(caption).not.toContain("jalisco");
      expect(caption).not.toContain("ciudad guzmán");
    }
  });
});
