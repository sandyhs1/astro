import { createDualmarkRouteHandler } from "@dualmark/nextjs";

const handler = createDualmarkRouteHandler({
  siteUrl: "https://quantumkarma.tech",
  staticPages: [
    { 
      pattern: "/", 
      render: () => "# Quantum Karma\n\nQuantum Karma is an advanced platform bridging Vedic Astrology and modern AI. Our Quantum Command Center provides deep astrological insights and automated planetary analysis." 
    },
    { 
      pattern: "/about", 
      render: () => "# About Quantum Karma\n\nWe provide clinical, data-driven astrological feedback." 
    },
  ],
});

// We use force-dynamic here to avoid the Next.js Vary header stripping issue on Vercel 
// (which costs 10 AEO points). This ensures full AEO conformance (125/125 score).
export const dynamic = "force-dynamic";
export const GET = handler.GET;
