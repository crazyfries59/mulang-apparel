import type { MetadataRoute } from "next";

const SITE_URL = "https://lin6666.top";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/tools/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
