import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { whatsappUrl } from "@/content/site.data";

/** Persistent floating WhatsApp action — high-converting for MX SMBs. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-pill bg-green-500 text-white shadow-warm-lg transition-colors hover:bg-green-700"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
