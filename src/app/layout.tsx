import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";

import CustomCursor from "@/components/CustomCursor";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://saammaaeel.online"),
  title: "ael | Web3 Developer & Blockchain Developer",
  description:
    "Minimalist portfolio showcasing Web3 development, on-chain analytics, and blockchain development. Explore predictive models, whale tracking systems, and more.",
  keywords: [
    "Web3",
    "Blockchain",
    "Developer",
    "DeFi",
    "Smart Contracts",
    "On-chain Analytics",
    "Crypto",
    "TypeScript",
    "React",
    "Next.js",
  ],
  authors: [{ name: "ael" }],
  creator: "ael",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ael | Web3 Portfolio",
    title: "ael | Web3 Developer & Blockchain Developer",
    description:
      "Web3 development portfolio featuring on-chain analytics, predictive models, and blockchain systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ael | Web3 Developer",
    description: "Web3 development portfolio with live blockchain demos.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

/* JSON-LD Person schema for SEO */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "ael",
  url: "https://saammaaeel.online",
  jobTitle: "Web3 Developer & Blockchain Developer",
  knowsAbout: [
    "Web3",
    "Blockchain",
    "DeFi",
    "Smart Contracts",
    "On-chain Analytics",
    "TypeScript",
    "React",
    "Next.js",
  ],
  sameAs: [
    "https://github.com/thelastbodhisattva",
    "https://twitter.com/saammaaeel",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:glass focus:rounded-full focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        <PageTransition>
          <div id="main-content">{children}</div>
        </PageTransition>


        <BackToTop />
        <CustomCursor />
      </body>
    </html>
  );
}
