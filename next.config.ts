import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use unoptimized so images are passed directly to the browser
    // without server-side fetching — avoids network issues in restricted environments.
    // In production, remove this line to re-enable optimization.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.hongyuapparel.com" },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
