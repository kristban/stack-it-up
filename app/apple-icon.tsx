import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple recommends an opaque background (iOS applies its own corner rounding
// and gloss) — unlike icon.tsx, this isn't a transparent PNG.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F3EC",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
