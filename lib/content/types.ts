export type CmsPost = {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  readMinutes: number;
  publishedAt?: string;
  image: string;
  featured: boolean;
  body: unknown;
};
