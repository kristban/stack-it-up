import type { Metadata } from "next";

export const SITE_NAME = "StackItUp";

// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://stackitup.app) so
// canonical URLs, sitemaps, and social preview images resolve to real
// addresses instead of localhost.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string = "/"): string {
  return new URL(path, SITE_URL).toString();
}

interface PageMetadataOptions {
  /** Page-specific title fragment, WITHOUT the "— StackItUp" suffix — the root layout's title template adds that automatically for the <title> tag. */
  title: string;
  /** Meta description, ideally under 160 characters. */
  description: string;
  /** Path this page is served at, e.g. "/about". Used for the canonical URL and social preview URL. */
  path: string;
  /** Marks the page as excluded from search indexing (still crawlable unless robots.ts also blocks the path). */
  noIndex?: boolean;
}

// Builds a consistent Metadata object — title, description, canonical URL,
// and Open Graph / Twitter card previews — for a single page. The
// opengraph-image.tsx file colocated in the same route segment supplies the
// actual 1200x630 preview image; Next.js wires it into both og:image and
// twitter:image automatically.
export function pageMetadata({ title, description, path, noIndex }: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} — ${SITE_NAME}`;

  return {
    // The root layout's title.template doesn't apply to app/page.tsx ("/"),
    // since a page.js and the layout.js wrapping it share the same route
    // segment (see Next.js metadata docs) — so "/" needs the full, suffixed
    // title spelled out here; every other page gets the template applied.
    title: path === "/" ? fullTitle : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
