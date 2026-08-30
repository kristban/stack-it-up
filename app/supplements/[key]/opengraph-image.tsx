import { getSupplement } from "../../lib/supplements";
import { accentFor } from "../../lib/theme";
import { renderOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "../../lib/ogImage";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const supplement = await getSupplement(key);

  if (!supplement) {
    return renderOgImage({ title: "Supplement Not Found", emoji: "🌿" });
  }

  return renderOgImage({
    title: supplement.name,
    subtitle: supplement.why,
    emoji: supplement.emoji,
    accent: accentFor(supplement.key).bg,
  });
}
