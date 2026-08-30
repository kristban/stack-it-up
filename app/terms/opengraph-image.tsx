import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = "StackItUp Terms of Service";

export default async function Image() {
  return renderOgImage({
    title: "Terms of Service",
    subtitle: "The terms that apply when you use StackItUp.",
    emoji: "🧾",
    accent: "#F4E14F",
  });
}
