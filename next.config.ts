import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "images.higgs.ai" },
    ],
    // Next's built-in optimizer proxies + resizes every remote image on
    // the server before serving it, and that fetch was timing out.
    // Unsplash already returns resized/compressed images via its own
    // `w=`/`q=` query params, so skipping Next's optimizer costs little
    // here and removes an unreliable extra hop.
    unoptimized: true,
  },
};

export default nextConfig;
