import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/login", "/auth"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
