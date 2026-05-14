import type { NextConfig } from "next";
import { withDualmark } from "@dualmark/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default withDualmark(nextConfig, {
  siteUrl: "https://quantumkarma.tech",
});
