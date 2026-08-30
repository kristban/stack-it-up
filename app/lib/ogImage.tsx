import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

interface RenderOgImageOptions {
  title: string;
  subtitle?: string;
  emoji?: string;
  accent?: string;
  /** Short call-to-action shown as a pill in the bottom-right corner. Pass "" to omit it. */
  cta?: string;
}

// Shared 1200x630 social preview template, reused by each route segment's
// opengraph-image.tsx so every page gets a branded, on-theme image without
// duplicating the layout in every file.
export function renderOgImage({
  title,
  subtitle,
  emoji = "🌿",
  accent = "#CFE0F7",
  cta = "Get Your Free Routine →",
}: RenderOgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F5F3EC",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -70,
            right: -70,
            width: 340,
            height: 340,
            borderRadius: 90,
            background: accent,
            opacity: 0.6,
            transform: "rotate(12deg)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 30,
            background: accent,
            fontSize: 48,
            marginBottom: 36,
          }}
        >
          {emoji}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: "#111111",
            lineHeight: 1.15,
            maxWidth: 940,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#6B6558",
              marginTop: 22,
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)",
                display: "flex",
              }}
            />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#111111" }}>StackItUp</div>
          </div>

          {cta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 30px",
                borderRadius: 999,
                background: "#111111",
                color: "#FFFFFF",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {cta}
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
