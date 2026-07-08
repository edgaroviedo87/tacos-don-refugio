import { Anton, Oswald, Nunito, Pacifico } from "next/font/google";

/**
 * Brand typography (brand-visual-direction.md §2).
 * - Anton: mega display / poster (always visible) -> preload.
 * - Nunito: body / UI (always visible) -> preload.
 * - Oswald: headings / labels -> not preloaded.
 * - Pacifico: rare decorative script accent -> not preloaded.
 * All subset latin + latin-ext for Spanish glyphs (á é í ó ú ñ ¡ ¿).
 */
export const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
  preload: true,
});

export const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
  preload: true,
});

export const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
});

export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-pacifico",
  display: "swap",
  preload: false,
});

export const fontVariables = `${anton.variable} ${oswald.variable} ${nunito.variable} ${pacifico.variable}`;
