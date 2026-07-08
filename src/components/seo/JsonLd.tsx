/**
 * Injects a JSON-LD `<script type="application/ld+json">` block (plan M4.3).
 * Accepts one or more structured data objects. Multiple objects are output as
 * separate script tags so validators can read each independently.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
