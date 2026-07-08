import { Clock } from "lucide-react";
import type { Branch } from "@/domain/branches/branch.types";

/**
 * Shared opening-hours block (used by both the branch card and the per-branch
 * detail). Renders each structured `hours` entry and the optional rest day.
 */
export function BranchHours({ branch }: { branch: Branch }) {
  return (
    <div className="flex items-start gap-2">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-green-700" strokeWidth={2} aria-hidden="true" />
      <div className="type-body text-text-muted">
        {branch.hours.map((slot) => (
          <p key={`${slot.days}-${slot.open}`}>
            <span className="text-brown-900">{slot.days}:</span> {slot.open}–{slot.close} h
          </p>
        ))}
        {branch.restDay && <p>Descanso: {branch.restDay}</p>}
      </div>
    </div>
  );
}
