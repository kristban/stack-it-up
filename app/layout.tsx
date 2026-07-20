import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackItUp — Build Your Supplement Routine",
  description:
    "Answer 5 gentle questions and get a personalized supplement routine built for your goals, activity level, and diet. Free, no account needed.",
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
        <noscript>
          <style>{`.fade-in-up { opacity: 1 !important; }`}</style>
        </noscript>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
