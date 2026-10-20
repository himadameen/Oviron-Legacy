import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "Oviron — Leather Footwear Sourcing & Export";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #172A3A 0%, #702E35 100%)",
          color: "#F7F3EB",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#B3935D",
            marginBottom: 24,
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 56, lineHeight: 1.1, maxWidth: 900 }}>
          Leather Footwear Sourcing &amp; Export
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "rgba(247, 243, 235, 0.85)",
            maxWidth: 820,
          }}
        >
          Wholesale supply and private-label enquiries for international buyers.
        </div>
      </div>
    ),
    { ...size }
  );
}
