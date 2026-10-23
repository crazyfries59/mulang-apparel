import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";
import type { CmsPost } from "./types";
import { publishedPostWhere } from "./publication";

type PayloadPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readMinutes?: number;
  coverImage?: string;
  body?: unknown;
  publishedAt?: string;
  featured?: boolean;
  seo?: { title?: string; description?: string };
};

function mapPost(post: PayloadPost): CmsPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category ?? "Manufacturing",
    readMinutes: post.readMinutes ?? 7,
    image: post.coverImage ?? "/products/y2k-fashion/bx8105-rib-260gsm-stretch-crop-y2k-baby-tee/img-1.jpg",
    body: post.body ?? null,
    publishedAt: post.publishedAt,
    featured: Boolean(post.featured),
    seoTitle: post.seo?.title,
    seoDescription: post.seo?.description,
  };
}

async function getPayloadClient() {
  return getPayload({ config });
}

export async function getCmsPosts(): Promise<CmsPost[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      depth: 0,
      limit: 100,
      sort: "-publishedAt",
      draft: false,
      overrideAccess: false,
      where: publishedPostWhere(),
    });
    return result.docs.map((post) => mapPost(post as unknown as PayloadPost));
  } catch {
    console.error("[content] CMS query failed; serving local published posts.");
    return [];
  }
}

export async function getCmsPost(slug: string): Promise<CmsPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      depth: 0,
      limit: 1,
      draft: false,
      overrideAccess: false,
      where: {
        and: [
          { slug: { equals: slug } },
          publishedPostWhere(),
        ],
      },
    });
    return result.docs[0] ? mapPost(result.docs[0] as unknown as PayloadPost) : null;
  } catch {
    console.error("[content] CMS post query failed; checking local published content.");
    return null;
  }
}
