/**
 * Conversion-link helpers for per-branch `tel:` and `wa.me` targets.
 *
 * Branch contact values are authored as human strings (e.g. "312 145 9820" or
 * "+52 1 312 198 4471"). These helpers normalize them to dialable/clickable
 * URLs without mutating the source data. Mexico (country code 52) is assumed for
 * bare national numbers; numbers that already carry a country code pass through.
 */

/** Strip everything but digits. */
export function digits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Build a `tel:` URL. A bare 10-digit national number is prefixed with +52;
 * anything longer is assumed to already include the country code.
 */
export function telHref(phone: string): string {
  const d = digits(phone);
  const withCountry = d.length === 10 ? `52${d}` : d;
  return `tel:+${withCountry}`;
}

/**
 * Build a `https://wa.me/...` URL with an optional prefilled message. A bare
 * 10-digit national number is prefixed with 52; longer numbers (already carrying
 * a country code, e.g. "5213121984471") pass through unchanged.
 */
export function whatsappHref(number: string, message?: string): string {
  const d = digits(number);
  const withCountry = d.length === 10 ? `52${d}` : d;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountry}${query}`;
}
