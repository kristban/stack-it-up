import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";
import { getSupplements } from "./lib/supplements";
import { getFeaturedStacks } from "./lib/featuredStacks";
import { pageMetadata } from "./lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Build Your Personalized Supplement Routine",
  description:
    "Answer 6 quick questions and get a free, personalized supplement routine matched to your goals, activity level, and diet. No account needed.",
  socialDescription: "Answer 6 quick questions and get a free, personalized supplement routine. No account needed.",
  path: "/",
});

export default async function Home() {
  const [supplements, featuredStacks] = await Promise.all([getSupplements(), getFeaturedStacks()]);
  return <HomeClient supplements={supplements} featuredStacks={featuredStacks} />;
}
