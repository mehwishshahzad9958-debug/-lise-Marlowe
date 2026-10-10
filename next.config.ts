import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Needed only while using the Unsplash placeholder images in Hero.tsx.
    // Remove once you switch to images in /public or your own CDN.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
