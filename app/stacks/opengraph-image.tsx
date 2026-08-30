import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp Featured Stacks";

export default async function Image() {
  return renderOgImage({
    title: "Featured Supplement Stacks",
    subtitle: "Curated combinations for sleep, recovery, longevity, and more.",
    emoji: "✨",
    accent: "#CFE0F7",
  });
}
