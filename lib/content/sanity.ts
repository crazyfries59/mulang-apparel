import { createClient } from "next-sanity";
import type { CmsPost } from "./types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const cmsEnabled = Boolean(projectId && dataset);

const client = cmsEnabled
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion: "2025-02-19",
      useCdn: true,
    })
  : null;

const POST_FIELDS = `
  "slug": slug.current,
  title,
  excerpt,
  seoTitle,
  seoDescription,
  "category": coalesce(category, "Manufacturing"),
  "publishedAt": coalesce(publishedAt, _createdAt),
  readMinutes,
  "image": coverImage.asset->url,
  featured,
  body
`;

export async function getCmsPosts(): Promise<CmsPost[] | null> {
  if (!client) return null;
  const posts = await client.fetch<CmsPost[]>(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) { ${POST_FIELDS} }`,
    {},
    { next: { revalidate: 300, tags: ["sanity-posts"] } },
  );
  return posts.map((post) => ({ ...post, readTime: `${post.readMinutes ?? 5} min read` }));
}

export async function getCmsPost(slug: string): Promise<CmsPost | null> {
  if (!client) return null;
  const post = await client.fetch<CmsPost | null>(
    `*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] { ${POST_FIELDS} }`,
    { slug },
    { next: { revalidate: 300, tags: [`sanity-post-${slug}`] } },
  );
  return post ? { ...post, readTime: `${post.readMinutes ?? 5} min read` } : null;
}
