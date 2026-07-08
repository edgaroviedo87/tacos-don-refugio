"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

/** Shows a "back to top" button after the user scrolls down. */
export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-pill bg-wood-900 text-on-dark shadow-warm-lg transition-colors hover:bg-wood-800"
    >
      <ArrowUp className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
