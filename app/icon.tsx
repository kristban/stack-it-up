import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// The browser-tab / bookmark favicon, generated from the same brand mark used
// in Navbar.tsx's logoMark rather than a separately maintained image asset.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)",
        }}
      />
    ),
    { ...size }
  );
}
