import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { Branch } from "@/domain/branches/branch.types";
import { telHref, whatsappHref } from "@/lib/utils/contact";
import { site } from "@/content/site.data";
import { Button } from "@/components/ui/Button";
import { BranchHours } from "./BranchHours";

/**
 * Full per-branch detail block (plan M3.5), reused by the `/sucursales/[id]`
 * page. The page owns the `<h1>` (branch name); this renders address, hours, and
 * the conversion CTAs. Geography is Villa de Álvarez, Colima — never the
 * retired brand's Jalisco/Ciudad Guzmán.
 */
export function BranchDetail({ branch }: { branch: Branch }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="space-y-5">
        {branch.isDelivery && (
          <span className="inline-flex w-fit rounded-pill bg-green-700/10 px-3 py-1 type-eyebrow text-green-700">
            Servicio a domicilio
          </span>
        )}

        <p className="flex items-start gap-2 type-body-l text-text-muted">
          <MapPin className="mt-1 h-6 w-6 shrink-0 text-green-700" strokeWidth={2} aria-hidden="true" />
          {branch.address}
        </p>

        <BranchHours branch={branch} />
      </div>

      <div className="flex flex-col gap-3">
        {branch.phone && (
          <Button href={telHref(branch.phone)} variant="outline" size="md">
            <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Llamar {branch.phone}
          </Button>
        )}
        {branch.whatsapp && (
          <Button
            href={whatsappHref(branch.whatsapp, site.whatsappMessage)}
            variant="secondary"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Pedir por WhatsApp
          </Button>
        )}
        <Button
          href={branch.mapsUrl}
          variant="secondary"
          size="md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Cómo llegar
        </Button>
      </div>
    </div>
  );
}
