import Link from "next/link";
import { Phone, MessageCircle, Clock, ShoppingBag } from "lucide-react";
import { site, telUrl, whatsappUrl } from "@/content/site.data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";

/**
 * Contacto / Pedidos (plan M3.8). Conversion channels (`tel:`/`wa.me`/social),
 * an hours summary, and a disabled "Ordena en línea — próximamente" placeholder
 * (Phase 3, no behavior). NAP stays consistent with the branch data.
 */
export function Contact() {
  return (
    <>
      <div className="text-center">
        <Eyebrow>Contacto</Eyebrow>
        <h2 className="type-h2 mt-2">Haz tu pedido</h2>
        <p className="type-body mt-3 text-text-muted">
          Llámanos o escríbenos por WhatsApp. Para eventos y taquizas, también estamos a un mensaje
          de distancia.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        <Button href={telUrl} variant="outline" size="lg" className="w-full">
          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Llamar {site.phoneDisplay}
        </Button>
        <Button
          href={whatsappUrl}
          variant="primary"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Pedir por WhatsApp
        </Button>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="inline-flex items-center gap-2 type-body text-text-muted">
          <Clock className="h-5 w-5 text-green-700" strokeWidth={2} aria-hidden="true" />
          {/* TODO(owner): confirm consolidated hours across branches. */}
          Lun a Dom, 6:00–11:00 PM · Descanso: Martes ·{" "}
          <Link href="#sucursales" className="text-green-700 underline-offset-4 hover:underline">
            ver por sucursal
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <a
            href={site.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Facebook de ${site.name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-neutral-100 text-brown-900 hover:bg-neutral-200"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${site.name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-neutral-100 text-brown-900 hover:bg-neutral-200"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-card border border-dashed border-neutral-200 px-6 py-5 text-center">
        <ShoppingBag className="h-5 w-5 text-neutral-400" strokeWidth={2} aria-hidden="true" />
        <p className="type-small text-text-muted">
          Ordena en línea — <span className="text-brown-900">próximamente</span>
        </p>
      </div>
    </>
  );
}
