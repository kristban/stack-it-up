import { getFeaturedStack } from "../../lib/featuredStacks";
import { accentFor } from "../../lib/theme";
import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const stack = await getFeaturedStack(key);

  if (!stack) {
    return renderOgImage({ title: "Stack Not Found", emoji: "🌿" });
  }

  return renderOgImage({
    title: stack.name,
    subtitle: stack.tagline,
    emoji: stack.emoji,
    accent: accentFor(stack.key).bg,
  });
}
