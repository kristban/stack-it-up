import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "./lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp — Build Your Personalized Supplement Routine";

export default async function Image() {
  return renderOgImage({
    title: "Build Your Personalized Supplement Routine",
    subtitle: "Answer 5 questions. Get a free, evidence-based supplement stack.",
    emoji: "🌿",
    accent: "#CFE0F7",
  });
}
