import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/seo";
import { getSupplements } from "./lib/supplements";
import { OPTIMIZE_TOPICS } from "./lib/optimizeContent";

// Rebuilt on every request to next-cache's revalidation of this route (Next.js
// treats sitemap.ts as a cached route handler by default), so newly added
// supplements or optimize topics appear automatically without a redeploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/supplements"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const optimizeRoutes: MetadataRoute.Sitemap = OPTIMIZE_TOPICS.map((topic) => ({
    url: absoluteUrl(`/optimize/${topic.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const supplements = await getSupplements();
  const supplementRoutes: MetadataRoute.Sitemap = supplements.map((supplement) => ({
    url: absoluteUrl(`/supplements/${supplement.key}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...optimizeRoutes, ...supplementRoutes];
}
