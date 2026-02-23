import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Libre_Baskerville, Jost, Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Most Astrology Is Emotional Fraud. This Isn’t.",
  description: "A Vedic based life report that decodes your patterns, blindspots and timing - without emotional blackmail, fake curses or upsells. Built for thinkers, not believers.",
  openGraph: {
    title: "Most Astrology Is Emotional Fraud. This Isn’t.",
    description: "A Vedic based life report that decodes your patterns, blindspots and timing - without emotional blackmail, fake curses or upsells. Built for thinkers, not believers.",
    url: "https://quantumkarma.tech",
    siteName: "SoulSync",
    images: [
      {
        url: "https://quantumkarma.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "SoulSync Cosmic Mascot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Most Astrology Is Emotional Fraud. This Isn’t.",
    description: "A Vedic based life report that decodes your patterns, blindspots and timing - without emotional blackmail, fake curses or upsells. Built for thinkers, not believers.",
    images: ["https://quantumkarma.tech/og-image.png"],
  },
};

import { OnboardingProvider } from "@/context/OnboardingContext";
import OnboardingModal from "@/components/features/OnboardingModal";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${dmMono.variable} ${libreBaskerville.variable} ${jost.variable} ${unbounded.variable} ${manrope.variable} antialiased bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-[#12011A]`}
      >
        <OnboardingProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <OnboardingModal />
        </OnboardingProvider>
      </body>
    </html>
  );
}
