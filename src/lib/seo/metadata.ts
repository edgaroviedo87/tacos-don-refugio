/**
 * Shared metadata builders for the Next.js Metadata API (plan M4.1).
 *
 * Each page imports one of these builders to derive its per-route metadata.
 * The root `metadataBase` + `lang` live in layout.tsx; these build on top.
 * Geography is Villa de Álvarez, Colima — NEVER the retired brand's
 * Jalisco/Ciudad Guzmán.
 */

import type { Metadata } from "next";
import { site } from "@/content/site.data";
import type { Branch } from "@/domain/branches/branch.types";

const SITE_NAME = site.name;
const CITY = "Villa de Álvarez";
const REGION = "Colima";
const REGION_NICKNAME = "el Valle de Colima";

/** Base OG tags shared by all routes. Extended/overridden per-route. */
const baseOpenGraph = {
  siteName: SITE_NAME,
  locale: "es_MX",
  type: "website" as const,
};

const baseTwitter = {
  card: "summary_large_image" as const,
};

export function homeMetadata(): Metadata {
  const title = `${SITE_NAME} — ${site.tagline} | Tacos en ${CITY}`;
  const description = `Taquería ${SITE_NAME} — toda una tradición en ${REGION_NICKNAME}, ${CITY}, ${REGION}. Tacos y tortas con el sabor de siempre. Servicio de eventos y catering.`;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url: "/",
    },
    twitter: { ...baseTwitter, title, description },
  };
}

export function menuMetadata(): Metadata {
  const title = "Menú completo";
  const description = `Menú de ${SITE_NAME} en ${CITY}: tacos, tortas, bebidas. Precios actualizados. ${site.tagline}.`;

  return {
    title,
    description,
    alternates: { canonical: "/menu" },
    openGraph: {
      ...baseOpenGraph,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: "/menu",
    },
    twitter: { ...baseTwitter, title: `${title} | ${SITE_NAME}`, description },
  };
}

export function sucursalesMetadata(): Metadata {
  const title = "Sucursales";
  const description = `Tres sucursales de ${SITE_NAME} en ${CITY}, ${REGION} (${REGION_NICKNAME}). Horarios, direcciones y cómo llegar.`;

  return {
    title,
    description,
    alternates: { canonical: "/sucursales" },
    openGraph: {
      ...baseOpenGraph,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: "/sucursales",
    },
    twitter: { ...baseTwitter, title: `${title} | ${SITE_NAME}`, description },
  };
}

export function branchMetadata(branch: Branch): Metadata {
  const title = branch.name;
  const description = `${branch.name} de ${SITE_NAME} en ${CITY}, ${REGION}. ${branch.address}. Horarios, teléfono y cómo llegar. ${site.tagline}.`;
  const canonical = `/sucursales/${branch.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      ...baseOpenGraph,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
    },
    twitter: { ...baseTwitter, title: `${title} | ${SITE_NAME}`, description },
  };
}
