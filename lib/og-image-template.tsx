import { ImageResponse } from "next/og";
import { OG_IMAGE_SIZE } from "./seo-images";

type OgTemplateOptions = {
  logoSrc: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  productImageSrc?: string | null;
};

export function renderOgImage(options: OgTemplateOptions) {
  const { logoSrc, eyebrow, title, subtitle, productImageSrc } = options;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #172A3A 0%, #702E35 100%)",
          color: "#F7F3EB",
          fontFamily: "Georgia, serif",
        }}
      >
        {productImageSrc ? (
          <div
            style={{
              width: "42%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 48,
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={productImageSrc}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 12,
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: productImageSrc ? "56px 64px" : "72px",
          }}
        >
          <img
            src={logoSrc}
            alt=""
            style={{
              height: 56,
              width: "auto",
              objectFit: "contain",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#B3935D",
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize: productImageSrc ? 44 : 52, lineHeight: 1.12 }}>
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 22,
                fontSize: 24,
                lineHeight: 1.35,
                color: "rgba(247, 243, 235, 0.88)",
                maxWidth: 640,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
