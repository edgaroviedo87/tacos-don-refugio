import type { Metadata } from "next";
import { Branches } from "@/components/sections/Branches";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBranches } from "@/lib/content/branches";
import { sucursalesMetadata } from "@/lib/seo/metadata";
import { buildBranchListJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/content/site.data";

export const metadata: Metadata = sucursalesMetadata();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function SucursalesPage() {
  const jsonLd = buildBranchListJsonLd(getBranches(), siteUrl);

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section tone="warm">
        <Container className="mb-4 max-w-3xl text-center">
          <h1 className="type-h1 text-brown-900">Nuestras sucursales</h1>
          <p className="type-body-l mt-3 text-text-muted">
            Encuéntranos en {site.city}, {site.region}.
          </p>
        </Container>
        <Branches showHeading={false} />
      </Section>
    </>
  );
}
