import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Small uppercase kicker label above section titles. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("type-eyebrow text-red-600", className)}>{children}</p>;
}
