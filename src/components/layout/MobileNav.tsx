"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { site, telUrl, whatsappUrl } from "@/content/site.data";
import { Button } from "@/components/ui/Button";
import { NavLink } from "./NavLink";

/** Accessible mobile navigation: hamburger -> right-side sheet (focus-trapped, Esc closes). */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="inline-flex h-11 w-11 items-center justify-center rounded-button text-brown-900 hover:bg-neutral-100 md:hidden"
        >
          <Menu className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-900/50" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream-50 shadow-warm-lg focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <Dialog.Title className="type-eyebrow text-green-700">Menú</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="inline-flex h-11 w-11 items-center justify-center rounded-button text-brown-900 hover:bg-neutral-100"
              >
                <X className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Navegación principal" className="flex flex-col gap-1 px-3 py-4">
            {site.nav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-button px-3 py-3 type-h4 text-brown-900 hover:bg-neutral-100 aria-[current=page]:font-semibold aria-[current=page]:text-green-700"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-neutral-200 p-5">
            <Button
              href={whatsappUrl}
              variant="primary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              Pedir por WhatsApp
            </Button>
            <Button href={telUrl} variant="outline" size="md">
              <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              Llamar {site.phoneDisplay}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
