import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // canvas (native binary) + pdfjs-dist's legacy build do their own dynamic
  // requires and must run as real Node.js modules, not be webpack-bundled.
  serverExternalPackages: ["canvas", "pdfjs-dist", "pdf-lib"],
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
