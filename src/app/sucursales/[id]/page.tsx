import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBranches } from "@/lib/content/branches";
import { BranchDetail } from "@/components/sections/BranchDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { branchMetadata } from "@/lib/seo/metadata";
import { buildRestaurantJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/content/site.data";

type Params = { id: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams(): Params[] {
  return getBranches().map((branch) => ({ id: branch.id }));
}

function findBranch(id: string) {
  return getBranches().find((branch) => branch.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const branch = findBranch(id);
  if (!branch) return {};
  return branchMetadata(branch);
}

export default async function BranchPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const branch = findBranch(id);

  if (!branch) notFound();

  const jsonLd = buildRestaurantJsonLd(branch, siteUrl);

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section tone="warm">
        <Container className="max-w-4xl">
          <Link
            href="/sucursales"
            className="inline-flex items-center gap-1.5 type-small text-green-700 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Todas las sucursales
          </Link>

          <h1 className="type-h1 mt-4 text-brown-900">{branch.name}</h1>
          <p className="type-body-l mt-2 text-text-muted">
            {site.name} en {site.city}, {site.region}.
          </p>

          <div className="mt-8">
            <BranchDetail branch={branch} />
          </div>
        </Container>
      </Section>
    </>
  );
}
