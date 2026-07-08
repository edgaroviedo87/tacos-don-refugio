import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

type Tone = "light" | "warm" | "dark";

const tones: Record<Tone, string> = {
  light: "bg-neutral-0 text-brown-900",
  warm: "bg-cream-50 text-brown-900",
  dark: "bg-wood-900 text-on-dark",
};

/** A page section with an anchor id, vertical rhythm, and a background tone. */
export function Section({
  id,
  tone = "warm",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
