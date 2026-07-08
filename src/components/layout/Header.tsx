import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { site, telUrl, whatsappUrl } from "@/content/site.data";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

/** Sticky global header: logo, in-page nav, and call/WhatsApp CTAs. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/80">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="flex items-center" aria-label={`${site.name} — inicio`}>
          <Image
            id="navbar-logo"
            src="/images/logo.png"
            alt={`${site.name} — ${site.tagline}`}
            width={420}
            height={215}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="rounded-button px-3 py-2 type-small text-brown-900 hover:bg-neutral-100 aria-[current=page]:font-semibold aria-[current=page]:text-green-700"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            href={telUrl}
            variant="ghost"
            size="sm"
            aria-label={`Llamar ${site.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            <span className="hidden lg:inline">{site.phoneDisplay}</span>
          </Button>
          <Button
            href={whatsappUrl}
            variant="primary"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Pedir
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
