import type { MetadataRoute } from "next";
import { POSTS, postDateIso } from "./blog/posts";
import { SITE_URL } from "@/lib/site";
import { getCmsPosts } from "@/lib/content";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/t-shirt-manufacturer", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/custom-hoodie-manufacturer", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/custom-streetwear-manufacturer", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/global-shipping", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/labels-tags-packaging", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/solutions", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/fabrics", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/technology", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/payment-method", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/manufacturing", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  /* The product pages are deliberately NOT listed here. They are template
     pages (~400 words, same layout, differing only in SKU, photo and GSM), and
     submitting all of them made Google mark 240 of 266 URLs as "Discovered -
     currently not indexed": the crawl budget went to near-duplicates instead of
     the pages that can rank. They stay crawlable and indexable through
     /products, the category landings and the related-styles block, they are just
     no longer queued ahead of the money pages. Re-add selected styles once the
     domain has authority and the pages carry unique copy. */

  const cmsPosts = await getCmsPosts();
  const publishedPosts = [
    ...(cmsPosts ?? []).map((post) => ({ slug: post.slug, date: post.publishedAt })),
    ...POSTS.filter((post) => post.published && !cmsPosts?.some((cmsPost) => cmsPost.slug === post.slug))
      .map((post) => ({ slug: post.slug, date: postDateIso(post.date) })),
  ];
  const blogEntries: MetadataRoute.Sitemap = publishedPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
