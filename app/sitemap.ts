import type { MetadataRoute } from "next";
import { PRODUCTS } from "./products/data";
import { POSTS } from "./blog/posts";

const SITE_URL = "https://lin6666.top";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/solutions", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/fabrics", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/technology", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/manufacturing", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/portfolio", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/lookbook", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const blogEntries: MetadataRoute.Sitemap = POSTS.filter((p) => p.published).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
