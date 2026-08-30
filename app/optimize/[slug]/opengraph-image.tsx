import { getOptimizeTopic } from "../../lib/optimizeContent";
import { accentFor } from "../../lib/theme";
import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getOptimizeTopic(slug);

  if (!topic) {
    return renderOgImage({ title: "Topic Not Found", emoji: "🌿" });
  }

  return renderOgImage({
    title: topic.title,
    subtitle: topic.tagline,
    emoji: topic.emoji,
    accent: accentFor(topic.slug).bg,
  });
}
