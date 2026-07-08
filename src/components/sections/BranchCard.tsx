import Link from "next/link";
import { MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";
import type { Branch } from "@/domain/branches/branch.types";
import { telHref, whatsappHref } from "@/lib/utils/contact";
import { site } from "@/content/site.data";
import { BranchHours } from "./BranchHours";

/**
 * One branch card for the overview grid (plan M3.5). Shows name, address, hours,
 * and the conversion links (`tel:`/`wa.me`/"Cómo llegar"), plus a soft-nav link
 * to the dedicated `/sucursales/[id]` page.
 */
export function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="flex flex-col rounded-card bg-neutral-0 p-6 shadow-warm-sm">
      <h3 className="type-h3 text-brown-900">{branch.name}</h3>
      {branch.isDelivery && (
        <span className="mt-2 inline-flex w-fit rounded-pill bg-green-700/10 px-2.5 py-0.5 type-eyebrow text-[0.6875rem] text-green-700">
          Servicio a domicilio
        </span>
      )}

      <p className="mt-3 flex items-start gap-2 type-body text-text-muted">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-700" strokeWidth={2} aria-hidden="true" />
        {branch.address}
      </p>

      <div className="mt-3">
        <BranchHours branch={branch} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {branch.phone && (
          <a
            href={telHref(branch.phone)}
            className="inline-flex h-11 items-center gap-2 rounded-button border-2 border-green-700 px-4 type-small text-green-700 hover:bg-green-700 hover:text-white"
          >
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Llamar
          </a>
        )}
        {branch.whatsapp && (
          <a
            href={whatsappHref(branch.whatsapp, site.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-button bg-green-700 px-4 type-small text-white hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            WhatsApp
          </a>
        )}
        <a
          href={branch.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-button px-4 type-small text-brown-900 hover:bg-neutral-100"
        >
          <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Cómo llegar
        </a>
      </div>

      <Link
        href={`/sucursales/${branch.id}`}
        className="mt-5 inline-flex items-center gap-1.5 type-small text-green-700 underline-offset-4 hover:underline"
      >
        Ver sucursal
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </Link>
    </article>
  );
}
