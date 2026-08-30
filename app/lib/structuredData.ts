import { SITE_NAME, SITE_URL, absoluteUrl } from "./seo";
import type { Supplement } from "./types";
import type { FaqItem, OptimizeTopic } from "./optimizeContent";
import type { SupplementContent } from "./supplementContent";

// Sitewide identity — included on every page via the root layout so crawlers
// can associate all pages with the same Organization/WebSite entity.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.ico"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
  };
}

// Supplements aren't commerce products with a price, so schema.org's
// DietarySupplement type (a Substance/Product subtype) fits better than
// forcing a Product+Offer shape Google expects to carry pricing. `content`
// (from supplementContent.ts) is optional since not every DB row has a
// hand-authored content entry yet.
export function dietarySupplementJsonLd(supplement: Supplement, content?: SupplementContent) {
  return {
    "@context": "https://schema.org",
    "@type": "DietarySupplement",
    name: supplement.name,
    description: supplement.why,
    recommendedIntake: supplement.dose,
    ...(supplement.warnings ? { warning: supplement.warnings } : {}),
    ...(content?.howItWorks ? { mechanismOfAction: content.howItWorks } : {}),
    ...(content?.whoMightBenefit ? { targetPopulation: content.whoMightBenefit } : {}),
    ...(content?.safetyNotes ? { safetyConsideration: content.safetyNotes } : {}),
    url: absoluteUrl(`/supplements/${supplement.key}`),
  };
}

// Combines a supplement's DietarySupplement entity with its FAQ entries (when
// hand-authored content exists) so the detail page surfaces both in one place.
export function supplementJsonLd(supplement: Supplement, content?: SupplementContent) {
  const blocks: object[] = [dietarySupplementJsonLd(supplement, content)];
  if (content?.faq?.length) blocks.push(faqPageJsonLd(content.faq));
  return blocks;
}

export function collectionPageJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

// Combines a topic's structured info (as an Article-ish WebPage) with its FAQ
// entries so /optimize/[slug] surfaces both in one script tag.
export function optimizeTopicJsonLd(topic: OptimizeTopic) {
  return [
    webPageJsonLd({
      name: topic.title,
      description: topic.tagline,
      path: `/optimize/${topic.slug}`,
    }),
    faqPageJsonLd(topic.faq),
  ];
}
