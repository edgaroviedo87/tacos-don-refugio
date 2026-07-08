import type { Metadata } from "next";
import { Menu } from "@/components/sections/Menu";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMenu } from "@/lib/content/menu";
import { menuMetadata } from "@/lib/seo/metadata";
import { buildMenuJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/content/site.data";

export const metadata: Metadata = menuMetadata();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function MenuPage() {
  const jsonLd = buildMenuJsonLd(getMenu(), siteUrl);

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section tone="light">
        <Container className="mb-10 max-w-3xl text-center">
          <h1 className="type-h1 text-brown-900">Nuestro menú completo</h1>
          <p className="type-body-l mt-3 text-text-muted">
            Tacos, tortas y órdenes con el sabor de siempre en {site.city}.
          </p>
        </Container>
        <Menu variant="full" showHeading={false} />
      </Section>
    </>
  );
}
