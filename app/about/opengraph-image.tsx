import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "About StackItUp";

export default async function Image() {
  return renderOgImage({
    title: "About StackItUp",
    subtitle: "Why we built a no-nonsense, evidence-based supplement quiz.",
    emoji: "💭",
    accent: "#CFE0F7",
  });
}
