import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "images.higgs.ai" },
    ],
    // Optimization is back on — it was disabled earlier because Next's
    // local DEV SERVER was timing out proxying Unsplash images on one
    // machine's network. In production, Vercel uses its own image
    // infrastructure to do this (not the same code path), so that issue
    // shouldn't recur there, and enabling it gets real savings: resized
    // images, WebP/AVIF conversion, proper responsive `sizes`.
    // If `npm run dev` locally ever shows the same timeout again, the
    // fix is just to set `unoptimized: true` back for local dev only —
    // it doesn't need to block production.
  },
};

export default nextConfig;
