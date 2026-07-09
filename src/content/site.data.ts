/**
 * Site-level configuration: brand identity, contact channels, social, and nav.
 * Contact values are fictional demo data (portfolio piece, not a real business).
 * Geography: Villa de Álvarez, Colima.
 */
export const site = {
  name: "Tacos Don Refugio",
  tagline: "El Sabor de Siempre",
  city: "Villa de Álvarez",
  region: "Colima",
  country: "México",

  phonePrimary: "3121459820", // national digits, no country code
  phoneDisplay: "312 145 9820",
  whatsapp: "523121459820", // wa.me format: country code (52) + number
  whatsappMessage: "¡Hola! Quiero hacer un pedido de Tacos Don Refugio.",

  social: {
    facebook: "https://www.facebook.com/tacosdonrefugio",
    instagram: "https://www.instagram.com/tacosdonrefugio/",
  },

  // Nav mixes real route links (/menu, /sucursales — indexable SEO pages) with
  // home-scoped anchors (/#avisos, … — work from any route via the home path).
  // All are driven through Next <Link> for soft, flash-free navigation.
  nav: [
    { label: "Menú", href: "/menu" },
    { label: "Sucursales", href: "/sucursales" },
    { label: "Avisos", href: "/#avisos" },
    { label: "Galería", href: "/#galeria" },
    { label: "Contacto", href: "/#contacto" },
  ],
} as const;

export const telUrl = `tel:+52${site.phonePrimary}`;
export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;
