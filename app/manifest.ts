import type { MetadataRoute } from "next";
import { SITE_NAME } from "./lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Build Your Personalized Supplement Routine`,
    short_name: SITE_NAME,
    description:
      "Answer 6 gentle questions and get a personalized supplement routine built for your goals, activity level, and diet.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F3EC",
    theme_color: "#F5F3EC",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
