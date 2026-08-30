import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp Frequently Asked Questions";

export default async function Image() {
  return renderOgImage({
    title: "Frequently Asked Questions",
    subtitle: "Everything about the quiz, your privacy, and our recommendations.",
    emoji: "🧭",
    accent: "#F4E14F",
  });
}
