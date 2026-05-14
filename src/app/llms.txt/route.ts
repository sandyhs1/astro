import { createLlmsTxtHandler } from "@dualmark/nextjs";

const handler = createLlmsTxtHandler({
  brandName: "Quantum Karma",
  description: "Quantum Karma is an advanced platform bridging Vedic Astrology and modern AI.",
  sections: [
    {
      title: "Pages",
      links: [
        { title: "Home", href: "https://quantumkarma.tech/" },
        { title: "About", href: "https://quantumkarma.tech/about" },
      ],
    },
  ],
});

export const dynamic = "force-static";
export const GET = handler.GET;
