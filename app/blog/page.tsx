import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { POSTS } from "./posts";

export const metadata: Metadata = {
  title: "Blog — Streetwear Manufacturing Insights",
  description: "Expert guides on custom clothing manufacturing, starting a streetwear brand, OEM/ODM sourcing, and scaling your apparel business.",
};

const CATS = ["All", "Manufacturing", "Brand Startup", "Custom Apparel", "OEM & ODM", "Industry News"];

export default function BlogPage() {
  const featured = POSTS[0];
  const rest     = POSTS.slice(1);

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-14 px-6 border-b border-white/5">
        <div className="container">
          <AnimatedSection>
            <p className="label mb-5">Insights & Resources</p>
            <h1 className="heading-xl mb-4">The Mulang Blog</h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg">
              Expert guides on streetwear manufacturing, brand building, OEM/ODM sourcing, and scaling your apparel business globally.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-6 py-5 border-b border-white/5 bg-[#0a0a0a]">
        <div className="container flex gap-2 overflow-x-auto">
          {CATS.map(c => (
            <button key={c}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[0.65rem] tracking-widest uppercase font-semibold border border-white/10 text-white/45 hover:border-white/30 hover:text-white transition-all first:bg-white first:text-black first:border-transparent">
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured post */}
      <section className="section-sm px-6">
        <div className="container">
          <AnimatedSection>
            <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 glass-card p-0 overflow-hidden hover:border-violet-500/25 transition-all">
              <div className="relative aspect-[16/10] md:aspect-auto img-zoom">
                <Image src={featured.img} alt={featured.title} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="label">{featured.cat}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/30 text-xs flex items-center gap-1"><Clock size={10} />{featured.read}</span>
                </div>
                <h2 className="font-syne font-bold text-white text-xl md:text-2xl leading-snug mb-4 group-hover:text-violet-300 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Post grid */}
      <section className="section pt-4 px-6">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => {
              const cardBody = (
                <>
                  <div className="relative aspect-[16/10] img-zoom">
                    <Image src={post.img} alt={post.title} fill className="object-cover" sizes="33vw" />
                    {!post.published && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-white/70 text-[0.6rem] tracking-widest uppercase font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-[0.6rem] text-violet-400 tracking-widest uppercase font-semibold">
                        <Tag size={9} />{post.cat}
                      </span>
                      <span className="text-white/15">·</span>
                      <span className="text-white/25 text-[0.65rem] flex items-center gap-1">
                        <Clock size={9} />{post.read}
                      </span>
                    </div>
                    <h3 className="font-syne font-bold text-white text-sm leading-snug mb-3 flex-1 group-hover:text-violet-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-white/25 pt-4 border-t border-white/6">
                      <span>{post.date}</span>
                      {post.published ? (
                        <span className="text-violet-400/60 group-hover:text-violet-400 transition-colors flex items-center gap-1">
                          Read <ArrowRight size={10} />
                        </span>
                      ) : (
                        <span className="text-white/20">Coming soon</span>
                      )}
                    </div>
                  </div>
                </>
              );
              return (
                <AnimatedSection key={post.slug} delay={i * 0.08}>
                  {post.published ? (
                    <Link href={`/blog/${post.slug}`} className="group glass-card overflow-hidden flex flex-col h-full">
                      {cardBody}
                    </Link>
                  ) : (
                    <div className="group glass-card overflow-hidden flex flex-col h-full opacity-60">
                      {cardBody}
                    </div>
                  )}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5 px-6">
        <div className="container max-w-xl mx-auto text-center">
          <AnimatedSection>
            <p className="label mb-4">Stay Updated</p>
            <h2 className="heading-lg mb-4">Manufacturing Insights<br />In Your Inbox</h2>
            <p className="text-white/40 text-sm mb-8">Weekly guides on clothing manufacturing, brand building, and industry trends. No spam.</p>
            <div className="flex gap-3">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-white/4 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition-colors" />
              <button className="btn-gradient flex-shrink-0">Subscribe</button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
