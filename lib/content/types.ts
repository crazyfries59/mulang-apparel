export type CmsPost = {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  readTime: string;
  publishedAt: string;
  readMinutes?: number;
  image: string;
  featured: boolean;
  body: unknown[];
};
