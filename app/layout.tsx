import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import ChatBubble from "./components/ChatBubble";
import JsonLd from "./components/JsonLd";
import { SITE_NAME, SITE_URL } from "./lib/seo";
import { organizationJsonLd, websiteJsonLd } from "./lib/structuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "StackItUp — Build Your Personalized Supplement Routine";
const DEFAULT_DESCRIPTION =
  "Answer 6 gentle questions and get a personalized supplement routine built for your goals, activity level, and diet. Free, no account needed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="9285b6f8-fd83-4f35-a9ab-8ef4339ba893"
          strategy="afterInteractive"
        />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <noscript>
          <style>{`.fade-in-up { opacity: 1 !important; }`}</style>
        </noscript>
        {children}
        <CookieBanner />
        <ChatBubble />
      </body>
    </html>
  );
}
