/**
 * JSON-LD structured data builders (plan M4.3, M4.4).
 *
 * Geography contract: addressLocality ALWAYS "Villa de Álvarez",
 * addressRegion ALWAYS "Colima", addressCountry "MX". NEVER the retired
 * brand's Jalisco/Ciudad Guzmán.
 * `geo` is only emitted when real coordinates are present (no fake data).
 */

import { site } from "@/content/site.data";
import type { Branch } from "@/domain/branches/branch.types";
import type { Menu } from "@/domain/menu/menu.types";

const ADDRESS_LOCALITY = "Villa de Álvarez";
const ADDRESS_REGION = "Colima";
const ADDRESS_COUNTRY = "MX";
const SERVES_CUISINE = "Mexicana";

// ---- Day mapping (Spanish "Lunes a Domingo" → schema.org openingHours) -----

const ES_TO_SCHEMA: Record<string, string> = {
  Lunes: "Mo",
  Martes: "Tu",
  "Miércoles": "We",
  Jueves: "Th",
  Viernes: "Fr",
  "Sábado": "Sa",
  Domingo: "Su",
};

const ES_ORDER = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function parseDayRange(label: string): string[] {
  const match = /^(.+?) a (.+)$/.exec(label.trim());
  if (!match) {
    const single = ES_TO_SCHEMA[label.trim()];
    return single ? [single] : [];
  }
  const [, from, to] = match;
  const start = ES_ORDER.indexOf(from.trim());
  const end = ES_ORDER.indexOf(to.trim());
  if (start === -1 || end === -1) return [];
  return ES_ORDER.slice(start, end + 1).map((d) => ES_TO_SCHEMA[d]);
}

function buildOpeningHours(branch: Branch): string[] {
  const restSchema = branch.restDay ? ES_TO_SCHEMA[branch.restDay.trim()] : undefined;

  return branch.hours.flatMap((slot) => {
    const days = parseDayRange(slot.days).filter((d) => d !== restSchema);
    if (days.length === 0) return [];
    return [`${days.join(",")} ${slot.open}-${slot.close}`];
  });
}

// ---- Organization (brand-level, used on home) --------------------------------

export function buildOrganizationJsonLd(siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    sameAs: [site.social.facebook, site.social.instagram].filter(Boolean),
  };
}

// ---- Restaurant (per-branch, used on /sucursales/[id]) -----------------------

export function buildRestaurantJsonLd(branch: Branch, siteUrl: string): object {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${site.name} — ${branch.name}`,
    description: `Taquería ${site.name} en ${ADDRESS_LOCALITY}. Tacos, tortas y órdenes artesanales.`,
    url: `${siteUrl}/sucursales/${branch.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address.split(",")[0]?.trim() ?? branch.address,
      addressLocality: ADDRESS_LOCALITY,
      addressRegion: ADDRESS_REGION,
      addressCountry: ADDRESS_COUNTRY,
    },
    servesCuisine: SERVES_CUISINE,
    hasMenu: `${siteUrl}/menu`,
    sameAs: [site.social.facebook, site.social.instagram].filter(Boolean),
    priceRange: "$",
  };

  if (branch.phone) base.telephone = branch.phone;
  if (branch.geo) {
    base.geo = {
      "@type": "GeoCoordinates",
      latitude: branch.geo.lat,
      longitude: branch.geo.lng,
    };
  }

  const openingHours = buildOpeningHours(branch);
  if (openingHours.length > 0) base.openingHours = openingHours;

  return base;
}

// ---- ItemList (all branches, used on /sucursales) ----------------------------

export function buildBranchListJsonLd(branches: Branch[], siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Sucursales de ${site.name}`,
    itemListElement: branches.map((branch, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `${site.name} — ${branch.name}`,
      url: `${siteUrl}/sucursales/${branch.id}`,
    })),
  };
}

// ---- Menu + MenuItem (used on /menu and home preview) -----------------------

export function buildMenuJsonLd(menu: Menu, siteUrl: string): object {
  const CATEGORY_LABELS: Record<string, string> = {
    tacos: "Tacos",
    tortas: "Tortas",
    ordenes: "Órdenes",
    bebidas: "Bebidas",
    extras: "Extras",
  };

  const sections = Object.entries(CATEGORY_LABELS)
    .map(([key, label]) => {
      const items = menu.items.filter((item) => item.category === key && item.available);
      if (items.length === 0) return null;

      return {
        "@type": "MenuSection",
        name: label,
        hasMenuItem: items.map((item) => {
          const price =
            item.priceCents != null
              ? item.priceCents / 100
              : item.variants?.[0]?.priceCents != null
                ? item.variants[0].priceCents / 100
                : undefined;

          const menuItem: Record<string, unknown> = {
            "@type": "MenuItem",
            name: item.name,
          };
          if (item.description) menuItem.description = item.description;
          if (price != null) {
            menuItem.offers = {
              "@type": "Offer",
              price: price.toFixed(2),
              priceCurrency: menu.currency,
            };
          }
          return menuItem;
        }),
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Menú — ${site.name}`,
    url: `${siteUrl}/menu`,
    hasMenuSection: sections,
  };
}

// ---- Home aggregate (Organization + all-branch summary) --------------------

export function buildHomeJsonLd(branches: Branch[], siteUrl: string): object[] {
  return [
    buildOrganizationJsonLd(siteUrl),
    buildBranchListJsonLd(branches, siteUrl),
  ];
}
