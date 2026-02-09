import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://saammaaeel.online"),
  title: "ael | Web3 Developer & Blockchain Engineer",
  description:
    "Minimalist portfolio showcasing cutting-edge Web3 development, on-chain analytics, and blockchain engineering. Explore predictive models, whale tracking systems, and more.",
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
    title: "ael | Web3 Developer & Blockchain Engineer",
    description:
      "Cutting-edge Web3 development portfolio featuring on-chain analytics, predictive models, and blockchain systems.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-void text-star min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
