import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are pre-resized and compressed at import time by
    // scripts/migrate-product-images.mjs, so there's nothing left for the
    // optimizer to do — skipping it avoids paying for per-request processing.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
