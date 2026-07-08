import { ArrowRight } from "lucide-react";
import { getMenu } from "@/lib/content/menu";
import { formatDate } from "@/lib/utils/format";
import type { MenuCategory as MenuCategoryName } from "@/domain/menu/menu.types";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

/** Display order + Spanish labels for the menu categories. */
const CATEGORY_ORDER: { key: MenuCategoryName; label: string }[] = [
  { key: "tacos", label: "Tacos" },
  { key: "tortas", label: "Tortas" },
  { key: "ordenes", label: "Órdenes" },
  { key: "bebidas", label: "Bebidas" },
  { key: "extras", label: "Extras" },
];

/**
 * Menu (plan M3.4) — one component, two mount points.
 *
 * - `variant="preview"` (home): a flat list of featured items (`popular` tag,
 *   falling back to the first few) plus a "Ver menú completo" link to `/menu`.
 * - `variant="full"` (the `/menu` route): every category as an accessible
 *   accordion, with the prices disclaimer and "Actualizado: …" date.
 *
 * The caller supplies the surrounding `<Section>` (id/tone), so the same
 * component works on the home page and the dedicated route unchanged. On the
 * route, `showHeading={false}` lets the page own the `<h1>` while the disclaimer
 * + "Actualizado" line still renders.
 */
export function Menu({
  variant = "full",
  showHeading = true,
}: {
  variant?: "preview" | "full";
  showHeading?: boolean;
}) {
  const menu = getMenu();
  const { currency, items, pricesDisclaimer, updatedAt } = menu;

  if (variant === "preview") {
    const featured = items.filter((item) => item.tags?.includes("popular"));
    const preview = (featured.length > 0 ? featured : items).slice(0, 6);

    return (
      <>
        <div className="text-center">
          <Eyebrow>Nuestro menú</Eyebrow>
          <h2 className="type-h2 mt-2">Los favoritos de la casa</h2>
          <p className="type-body mt-3 text-text-muted">
            Una probadita de lo que servimos. {pricesDisclaimer}.
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-x-10 sm:grid-cols-2 [&>li]:border-b [&>li]:border-neutral-200">
          {preview.map((item) => (
            <MenuItem key={item.id} item={item} currency={currency} />
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Button href="/menu" variant="secondary" size="lg">
            Ver menú completo
            <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </>
    );
  }

  const grouped = CATEGORY_ORDER.map(({ key, label }) => ({
    label,
    items: items
      .filter((item) => item.category === key)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {showHeading && (
        <div className="text-center">
          <Eyebrow>Nuestro menú</Eyebrow>
          <h2 className="type-h2 mt-2">Tacos, tortas y órdenes</h2>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl">
        {grouped.map((group) => (
          <MenuCategory
            key={group.label}
            label={group.label}
            items={group.items}
            currency={currency}
          />
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-3xl type-small text-text-muted">
        {pricesDisclaimer}. Actualizado: {formatDate(updatedAt)}.
      </p>
    </>
  );
}
