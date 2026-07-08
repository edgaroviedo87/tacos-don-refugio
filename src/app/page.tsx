import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Menu } from "@/components/sections/Menu";
import { Branches } from "@/components/sections/Branches";
import { Avisos } from "@/components/sections/Avisos";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBranches } from "@/lib/content/branches";
import { homeMetadata } from "@/lib/seo/metadata";
import { buildHomeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = homeMetadata();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function Home() {
  const jsonLd = buildHomeJsonLd(getBranches(), siteUrl);

  return (
    <>
      <JsonLd data={jsonLd} />

      <Hero />

      <About />

      <Section id="menu" tone="light">
        <Menu variant="preview" />
      </Section>

      <Section id="sucursales" tone="warm">
        <Branches />
      </Section>

      <Section id="avisos" tone="light">
        <Avisos />
      </Section>

      <Section id="galeria" tone="warm">
        <Gallery />
      </Section>

      <Section id="contacto" tone="light">
        <Contact />
      </Section>
    </>
  );
}
