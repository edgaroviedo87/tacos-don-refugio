import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tacos Don Refugio — El Sabor de Siempre | Villa de Álvarez, Colima";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded OG image (plan M4.2). Uses a warm wood gradient + golden accent to
 * reflect the brand visual direction. Loaded as the default OG image for all
 * routes that do not provide their own; each route can add a route-level
 * opengraph-image if needed.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #160f09 0%, #241910 50%, #3a2a1c 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Warm glow blob */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 300,
            background: "rgba(242, 183, 5, 0.12)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#fbf1e2",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Tacos Don Refugio
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: "#f2b705",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          El Sabor de Siempre
        </div>

        {/* Divider line */}
        <div
          style={{
            width: 120,
            height: 3,
            background: "#c2371a",
            borderRadius: 2,
            marginBottom: 28,
          }}
        />

        {/* Location */}
        <div
          style={{
            fontSize: 28,
            color: "#c9b79e",
            textAlign: "center",
          }}
        >
          Villa de Álvarez, Colima · Tacos · Tortas · Eventos
        </div>
      </div>
    ),
    { ...size },
  );
}
