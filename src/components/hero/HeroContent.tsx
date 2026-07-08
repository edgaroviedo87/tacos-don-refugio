import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { site, telUrl } from "@/content/site.data";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroContent() {
  return (
    <Container className="py-20 text-center sm:py-28">
      <h1 className="type-display text-on-dark">Antojos que valen la pena</h1>

      <p className="type-body-l mx-auto mt-4 max-w-xl text-on-dark-muted">
        Tacos, tortas y órdenes con el sabor de siempre. Toda una tradición en {site.city},{" "}
        {site.region}.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="#menu" variant="secondary" size="lg">
          Ver menú
        </Button>
        <Button href={telUrl} variant="primary" size="lg">
          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Llamar
        </Button>
      </div>

      <Link
        href="#sucursales"
        className="mt-6 inline-flex items-center gap-1.5 type-small text-on-dark-muted underline-offset-4 hover:text-on-dark hover:underline"
      >
        <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        ¿Cómo llegar? Mira nuestras sucursales
      </Link>
    </Container>
  );
}
