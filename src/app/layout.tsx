import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Libre_Baskerville, Jost, Unbounded, Manrope, Syne, Space_Grotesk, Cormorant_Garamond, Outfit, Bricolage_Grotesque, Epilogue, Cinzel, Afacad, Bodoni_Moda, Italiana } from "next/font/google";
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

const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const cormorantGaramond = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600", "700"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const bricolageGrotesque = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const epilogue = Epilogue({ variable: "--font-epilogue", subsets: ["latin"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const afacad = Afacad({ variable: "--font-afacad", subsets: ["latin"] });
const bodoniModa = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"] });
const italiana = Italiana({ variable: "--font-italiana", subsets: ["latin"], weight: ["400"] });

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
        className={`${playfair.variable} ${dmMono.variable} ${libreBaskerville.variable} ${jost.variable} ${unbounded.variable} ${manrope.variable} ${syne.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable} ${outfit.variable} ${bricolageGrotesque.variable} ${epilogue.variable} ${cinzel.variable} ${afacad.variable} ${bodoniModa.variable} ${italiana.variable} antialiased bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-[#12011A]`}
      >
        <OnboardingProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <OnboardingModal />
        </OnboardingProvider>
      </body>
    </html>
  );
}
