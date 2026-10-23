import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { POSTS } from "../posts";
import ChinaManufacturerTipsContent from "./ChinaManufacturerTipsContent";
import MinimumOrderQuantityContent from "./MinimumOrderQuantityContent";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getCmsPost, getCmsPosts } from "@/lib/content";

const CONTENT_BY_SLUG: Record<string, React.ComponentType> = {
  "china-clothing-manufacturer-tips": ChinaManufacturerTipsContent,
  "minimum-order-quantity-guide": MinimumOrderQuantityContent,
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const cmsPosts = await getCmsPosts();
  return [
    ...POSTS.filter((p) => p.published).map((p) => ({ slug: p.slug })),
    ...cmsPosts.filter((p) => !POSTS.some((local) => local.slug === p.slug)).map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cmsPost = await getCmsPost(slug);
  const post = cmsPost ?? POSTS.find((p) => p.slug === slug && p.published);
  if (!post) return { title: "Post Not Found" };
  const image = "image" in post ? post.image : post.img;
  const title = "seoTitle" in post && post.seoTitle ? post.seoTitle : post.title;
  const description = "seoDescription" in post && post.seoDescription ? post.seoDescription : post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmsPost = await getCmsPost(slug);
  const post = cmsPost ?? POSTS.find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const Content = "body" in post ? null : CONTENT_BY_SLUG[slug];
  const isCmsPost = "readMinutes" in post;
  const category = "category" in post ? post.category : post.cat;
  const readTime = isCmsPost ? `${post.readMinutes} min read` : post.read;
  const publishedDate = isCmsPost
    ? post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""
    : post.date;
  const image = "image" in post && post.image ? post.image : "img" in post ? post.img : "/products/y2k-fashion/bx8105-rib-260gsm-stretch-crop-y2k-baby-tee/img-1.jpg";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image,
    author: { "@type": "Organization", name: "Mulang Apparel" },
    publisher: { "@type": "Organization", name: "Mulang Apparel" },
    datePublished: isCmsPost ? post.publishedAt : post.date,
    mainEntityOfPage: `https://www.lin6666.top/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Header */}
      <section className="pt-36 pb-10 px-6 border-b border-white/5">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="flex items-center gap-2 text-xs text-white/30 mb-5">
              <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/50">{category}</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center gap-1 text-[0.65rem] text-violet-400 tracking-widest uppercase font-semibold">
                <Tag size={10} />{category}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-white/30 text-xs flex items-center gap-1"><Clock size={10} />{readTime}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/30 text-xs">{publishedDate}</span>
            </div>
            <h1 className="heading-lg">{post.title}</h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Hero image */}
      <section className="px-6 pt-10">
        <div className="container max-w-3xl">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image src={image} alt={post.title} fill className="object-cover" sizes="768px" priority />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="px-6 pb-10">
        <div className="container max-w-3xl">
          <AnimatedSection>
            {isCmsPost && post.body ? <div className="prose prose-invert max-w-none prose-headings:font-syne prose-headings:text-white prose-p:text-white/65 prose-p:leading-8 prose-li:text-white/65"><RichText data={post.body as never} /></div> : Content && <Content />}
          </AnimatedSection>
        </div>
      </section>

      {/* Back to blog */}
      <section className="section-sm px-6 border-t border-white/5">
        <div className="container max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
            <ArrowRight size={14} className="rotate-180" /> Back to all articles
          </Link>
        </div>
      </section>
    </>
  );
}
