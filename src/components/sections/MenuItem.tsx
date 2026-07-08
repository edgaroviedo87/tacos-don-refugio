import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { MenuItem as MenuItemType } from "@/domain/menu/menu.types";

const TAG_LABELS: Record<string, string> = {
  popular: "Popular",
  nuevo: "Nuevo",
  picante: "Picante",
};

function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * One menu item row (plan M3.4): name (Oswald), description (Nunito), price via
 * `formatPrice`, variants, tags. Unavailable items are visually de-emphasized
 * and labeled — never removed — so the listing stays stable.
 */
export function MenuItem({ item, currency }: { item: MenuItemType; currency: string }) {
  const unavailable = !item.available;

  return (
    <li
      className={cn(
        "flex items-start justify-between gap-4 py-3",
        unavailable && "opacity-55",
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="type-h4 text-brown-900">{item.name}</h4>
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-pill bg-gold-500/20 px-2 py-0.5 type-eyebrow text-[0.6875rem] text-brown-900"
            >
              {tagLabel(tag)}
            </span>
          ))}
          {unavailable && (
            <span className="rounded-pill bg-neutral-200 px-2 py-0.5 type-eyebrow text-[0.6875rem] text-text-muted">
              No disponible
            </span>
          )}
        </div>
        {item.description && (
          <p className="type-body mt-1 text-text-muted">{item.description}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        {item.priceCents != null && (
          <p className="type-price text-lg text-green-700">
            {formatPrice(item.priceCents, currency)}
          </p>
        )}
        {item.variants?.map((variant) => (
          <p key={variant.label} className="type-small text-text-muted">
            {variant.label}{" "}
            <span className="type-price text-green-700">
              {formatPrice(variant.priceCents, currency)}
            </span>
          </p>
        ))}
      </div>
    </li>
  );
}
