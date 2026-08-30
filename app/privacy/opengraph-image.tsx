import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp Privacy Policy";

export default async function Image() {
  return renderOgImage({
    title: "Privacy Policy",
    subtitle: "What we collect, and what we don't.",
    emoji: "🔍",
    accent: "#CFE0F7",
  });
}
