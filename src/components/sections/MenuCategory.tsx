import { MenuItem } from "./MenuItem";
import type { MenuItem as MenuItemType } from "@/domain/menu/menu.types";

/**
 * One menu category as a native `<details>` accordion (plan M3.4). Native
 * `<details>`/`<summary>` is keyboard-operable and ARIA-correct with zero JS, and
 * keeps every item in the DOM (good for SEO) even when collapsed. Categories
 * render `open` by default so the full menu is visible on load.
 */
export function MenuCategory({
  label,
  items,
  currency,
}: {
  label: string;
  items: MenuItemType[];
  currency: string;
}) {
  return (
    <details open className="group border-b border-neutral-200 py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3">
        <h3 className="type-h3 text-brown-900">{label}</h3>
        <span
          aria-hidden="true"
          className="type-small text-text-muted transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <ul className="divide-y divide-neutral-100">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} currency={currency} />
        ))}
      </ul>
    </details>
  );
}
