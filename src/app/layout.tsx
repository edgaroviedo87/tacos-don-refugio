import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { site } from "@/content/site.data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#15692c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline} | Tacos en ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: `${site.name}, toda una tradición en el Valle de Colima. Tacos y tortas en ${site.city}, ${site.region}. ${site.tagline}.`,
  applicationName: site.name,
  keywords: [
    "tacos Villa de Álvarez",
    "taquería Villa de Álvarez",
    "tortas Villa de Álvarez",
    "tacos a domicilio Villa de Álvarez",
    "catering taquería Villa de Álvarez",
    "Tacos Don Refugio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    site: "@tacosdonrefugio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* M6.2 — Skip link for keyboard / screen reader users. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-green-700 focus:px-4 focus:py-2 focus:text-on-dark focus:outline-none"
        >
          Saltar al contenido
        </a>

        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ScrollToTop />

        {/* M6.5 — Privacy-friendly Vercel analytics. No cookie banner needed. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
