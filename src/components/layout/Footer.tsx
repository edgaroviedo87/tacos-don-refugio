import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { site, telUrl } from "@/content/site.data";
import { getBranches } from "@/lib/content/branches";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";
import styles from "./Footer.module.css";

/** Global footer: brand, branches summary, contact, social, and legal line. */
export function Footer() {
  const year = new Date().getFullYear();
  const branches = getBranches();

  return (
    <footer className="bg-wood-900 text-on-dark">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Image
            src="/images/logo.png"
            alt={`${site.name} — ${site.tagline}`}
            width={420}
            height={215}
            className={`h-24 w-auto ${styles.logoGlow}`}
          />
          <p className="type-script text-xl text-gold-500">{site.tagline}</p>
          <p className="type-body text-on-dark-muted">
            Toda una tradición en el Valle de Colima, {site.city}, {site.region}.
          </p>
        </div>

        <nav aria-label="Sucursales" className="space-y-2">
          <p className="type-eyebrow text-gold-500">Sucursales</p>
          <ul className="space-y-1">
            {branches.map((branch) => (
              <li key={branch.id}>
                <Link
                  href={`/sucursales/${branch.id}`}
                  className="type-body text-on-dark hover:text-gold-500"
                >
                  {branch.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/menu" className="type-body text-on-dark hover:text-gold-500">
                Ver menú
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-2">
          <p className="type-eyebrow text-gold-500">Contacto</p>
          {/* TODO(owner): confirm phone + hours per branch (M2). */}
          <a
            href={telUrl}
            className="inline-flex items-center gap-2 type-body text-on-dark hover:text-gold-500"
          >
            <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            {site.phoneDisplay}
          </a>
          <p className="type-small text-on-dark-muted">Horarios sujetos a confirmación.</p>
        </div>

        <div className="space-y-3">
          <p className="type-eyebrow text-gold-500">Síguenos</p>
          <div className="flex items-center gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Facebook de ${site.name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-wood-800 hover:bg-wood-700"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram de ${site.name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-wood-800 hover:bg-wood-700"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-wood-800">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
          <p className="type-small text-on-dark-muted">
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p className="type-small text-on-dark-muted">
            Precios sujetos a cambio sin previo aviso.
          </p>
        </Container>
      </div>
    </footer>
  );
}
