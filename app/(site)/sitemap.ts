import type { MetadataRoute } from "next";
import { POSTS } from "./blog/posts";
import { SITE_URL } from "@/lib/site";
import { getCmsPosts } from "@/lib/content";
import { getPublicProducts } from "@/lib/content/products";

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

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const products = await getPublicProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const cmsPosts = await getCmsPosts();
  const publishedPosts = [
    ...(cmsPosts ?? []).map((post) => ({ slug: post.slug, published: true })),
    ...POSTS.filter((post) => post.published && !cmsPosts?.some((cmsPost) => cmsPost.slug === post.slug)),
  ];
  const blogEntries: MetadataRoute.Sitemap = publishedPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
