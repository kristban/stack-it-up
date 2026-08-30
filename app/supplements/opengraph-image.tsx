import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp Supplement Library";

export default async function Image() {
  return renderOgImage({
    title: "Supplement Library",
    subtitle: "Doses, timing, and evidence for every supplement we recommend.",
    emoji: "🧪",
    accent: "#CFE0F7",
  });
}
