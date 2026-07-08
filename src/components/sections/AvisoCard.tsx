import { Info, AlertTriangle, DoorClosed, Tag, PartyPopper, type LucideIcon } from "lucide-react";
import type { Aviso, AvisoType } from "@/domain/avisos/aviso.types";

type TypeStyle = {
  Icon: LucideIcon;
  iconColor: string;
  border: string;
};

/**
 * Visual treatment per aviso type. Functional alerts (`info`/`warning`) use the
 * semantic tokens; content categories (`closure`/`price-update`/`event`) key off
 * the brand ramp. Color is carried by the icon + left border, never by body text
 * alone (a11y).
 */
const TYPE_STYLES: Record<AvisoType, TypeStyle> = {
  info: { Icon: Info, iconColor: "text-info", border: "border-l-info" },
  warning: { Icon: AlertTriangle, iconColor: "text-warning", border: "border-l-warning" },
  closure: { Icon: DoorClosed, iconColor: "text-error", border: "border-l-error" },
  "price-update": { Icon: Tag, iconColor: "text-green-700", border: "border-l-green-700" },
  event: { Icon: PartyPopper, iconColor: "text-red-600", border: "border-l-red-600" },
};

/**
 * One announcement (plan M3.6). Branch-specific avisos display the branch name.
 */
export function AvisoCard({ aviso, branchName }: { aviso: Aviso; branchName?: string }) {
  const { Icon, iconColor, border } = TYPE_STYLES[aviso.type];

  return (
    <article
      className={`flex gap-3 rounded-card border-l-4 bg-neutral-0 p-5 shadow-warm-sm ${border}`}
    >
      <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${iconColor}`} strokeWidth={2} aria-hidden={true} />
      <div className="min-w-0">
        <h3 className="type-h4 text-brown-900">{aviso.title}</h3>
        {branchName && (
          <p className="type-eyebrow mt-1 text-text-muted">Sucursal: {branchName}</p>
        )}
        <p className="type-body mt-2 text-text-muted">{aviso.body}</p>
      </div>
    </article>
  );
}
