"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * Nav link that sets aria-current="page" for screen readers (plan M6.2).
 *
 * Matching rules:
 * - "/" → exact match only (avoids marking everything as active)
 * - "/menu", "/sucursales" → startsWith so /sucursales/[id] stays highlighted
 * - "/#…" hash-only anchors → no aria-current (in-page scrolling, not a page)
 */
export function NavLink({ href, className, onClick, children }: Props) {
  const pathname = usePathname();
  const isHash = href.startsWith("/#");

  const isActive = isHash
    ? false
    : href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
