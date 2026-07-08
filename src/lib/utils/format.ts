/**
 * Display formatters for money and dates, localized to es-MX.
 *
 * Money is handled as integer centavos everywhere in the domain; these helpers
 * are the ONLY place we divide by 100, and only for presentation. We never do
 * arithmetic on the floating-point peso value.
 */

/**
 * Integer amount of money expressed in centavos (1 peso = 100 centavos).
 *
 * This is a plain `number` alias, not a runtime check — its job is to document
 * intent at call sites so a caller does not accidentally pass pesos as cents.
 */
export type Centavos = number;

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Format against UTC because we build the Date at UTC midnight below. This
  // keeps output independent of the host machine's timezone.
  timeZone: "UTC",
});

/**
 * Format an integer centavos amount as localized currency, e.g. 1700 -> "$17.00".
 *
 * @param priceCents - Amount in centavos. Expected to be a non-negative integer.
 * @param currency - ISO 4217 currency code (defaults to MXN).
 *
 * Non-integer input is a defect upstream (money should never carry fractional
 * centavos), so we round defensively to the nearest centavo. This guarantees
 * the output is always a valid currency amount rather than leaking a rounding
 * artifact from a bad caller. We round the integer centavos and divide by 100
 * only for display — the division never feeds back into any money math.
 */
export function formatPrice(priceCents: Centavos, currency = "MXN"): string {
  const safeCents = Math.round(priceCents);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(safeCents / 100);
}

/**
 * Format an ISO date string as a localized long date, e.g. "27 de junio de 2026".
 *
 * Accepts either a date-only string ("2026-06-27") or a full ISO datetime
 * ("2026-06-27T12:00:00Z"). In both cases we render the calendar date as
 * written in the string.
 *
 * `new Date("2026-06-27")` parses as UTC midnight, which can render as the
 * previous day in negative-offset timezones (the classic off-by-one). To avoid
 * that, we extract the Y-M-D components and build the date explicitly at UTC
 * midnight, then format in the UTC timezone — making output timezone-stable.
 */
export function formatDate(iso: string): string {
  const match = DATE_ONLY_PATTERN.exec(iso);

  if (!match) {
    throw new Error(`formatDate: unrecognized ISO date string: "${iso}"`);
  }

  const [, year, month, day] = match;
  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return dateFormatter.format(date);
}
