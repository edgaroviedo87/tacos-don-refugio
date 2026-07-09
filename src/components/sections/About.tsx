import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** A single trust/proof stat. */
type Stat = { value: string; label: string };

// TODO(owner): confirm the exact figures (years operating, recommendation rate,
// follower count). These reflect the approved customer-language proof points.
const stats: Stat[] = [
  { value: "+30 años", label: "de tradición taquera" },
  { value: "90%", label: "de clientes nos recomiendan" },
  { value: "~10 mil", label: "seguidores en redes" },
];

/**
 * Sobre Nosotros (plan M3.3). Brand story rooted in Villa de Álvarez with
 * trust/proof points. On-brand, warm voice. Geography is Villa de Álvarez,
 * Colima — never the retired brand's Jalisco/Ciudad Guzmán.
 */
export function About() {
  return (
    <Section id="nosotros" tone="warm">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Sobre nosotros</Eyebrow>
        <h2 className="type-h2 mt-2">Toda una tradición en Villa de Álvarez</h2>
        <p className="type-body-l mt-5 text-text-muted">
          Nacimos en el corazón de Villa de Álvarez y crecimos sirviendo el sabor que une a las
          familias de la región. Cada taco y cada torta llevan la misma sazón de siempre:
          ingredientes frescos, recetas de casa y el cariño de quienes nos visitan generación
          tras generación.
        </p>
        <p className="type-body mt-4 text-text-muted">
          Más que una taquería, somos un punto de encuentro. Por eso seguimos creciendo con tres
          sucursales y servicio para tus eventos, sin perder nunca el sabor que nos hizo
          tradición.
        </p>
      </div>

      <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card bg-neutral-0 p-6 text-center shadow-warm-sm"
          >
            <dt className="type-display text-4xl text-green-700 sm:text-5xl">{stat.value}</dt>
            <dd className="type-small mt-2 text-text-muted">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
