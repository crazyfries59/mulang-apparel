"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import type { Category } from "./products/data";
import { landingForCategory } from "@/lib/seo/category-landing";
import {
  ArrowRight, Plus, Minus,
  Zap, Shield, Globe, Star, Package, Clock,
} from "lucide-react";

/* ─── DATA ─── */

const ORDER_OPTIONS = [
  {
    title: "1. Blank Wholesale",
    audience: "For Wholesalers",
    description: "Order ready-made clothing from our product collection.",
    quantity: "50 pieces",
    details: "Mix styles, colors and sizes.",
    facts: [
      { label: "Sample time", value: "3 days" },
      { label: "Sample fee", value: "USD 20–25 per piece" },
      { label: "Bulk price", value: "As shown on the product page. Share your address for a shipping quote." },
    ],
    href: "/products",
    action: "Explore blanks",
  },
  {
    title: "2. Logo Customize",
    audience: "For Brand Starters",
    description: "Add your logo to our blank clothing with printing, embroidery or your private label.",
    quantity: "50 pieces",
    details: "Mix styles, colors and sizes.",
    facts: [
      { label: "Sample time", value: "5–8 days, depending on the final design" },
      { label: "Bulk order time", value: "12–18 days" },
      { label: "Sample fee", value: "USD 50 per piece" },
      { label: "Bulk price", value: "Choose a blank design and send your logo for a quote. Share your address for a shipping quote." },
    ],
    href: "/contact",
    action: "Discuss your logo",
  },
  {
    title: "3. Cut & Sew Customize",
    audience: "For Fashion Brands",
    description: "Create your own clothing designs from a sketch.",
    quantity: "100 pieces",
    details: "Per style, per color (4 sizes).",
    facts: [
      { label: "Sample time", value: "8–15 days after confirming all details" },
      { label: "Sample fee", value: "USD 50 per piece, depending on the design; printing and embroidery may cost extra" },
      { label: "Bulk order time", value: "24–30 days, depending on the design and order quantity" },
      { label: "Bulk price", value: "Quoted after confirming the quantity, design and fabric." },
    ],
    href: "/contact",
    action: "Discuss your design",
  },
];

const FEATURES = [
  { icon: Package, n: "01", title: "Low MOQ",          desc: "50 pieces for blanks or adding your logo — mix styles, colors and sizes. Cut & sew from 100 pcs per style per color." },
  { icon: Zap,     n: "02", title: "Sampling",         desc: "Single-piece sampling: 3 days for blanks, 5–8 days for logo customization and 8–15 days for cut & sew." },
  { icon: Star,    n: "03", title: "OEM & ODM",        desc: "Whether you have a design or need one—we handle everything from concept to delivery." },
  { icon: Shield,  n: "04", title: "Premium Quality",  desc: "Pick the fabric composition and weight (GSM) that fit your design, hand-feel and price point." },
  { icon: Globe,   n: "05", title: "Strict QC",        desc: "Garments are checked against your approved sample before they are packed and shipped." },
  { icon: Clock,   n: "06", title: "Global Shipping",  desc: "We ship to brands in the US, Australia, Europe and beyond, and help arrange the logistics." },
];

const PROCESS = [
  { n: "01", title: "Design Consultation", desc: "Share your concept, references or tech pack. We review it and advise on fabric, trims and techniques." },
  { n: "02", title: "Sampling",            desc: "Single-piece sampling: 3 days for blanks, 5–8 days with your logo and 8–15 days for cut & sew after confirming the details." },
  { n: "03", title: "Fabric Selection",    desc: "Choose composition, weight (GSM) and finish to match your design and target price." },
  { n: "04", title: "Production",          desc: "Bulk production starts once you approve the sample. Lead time is confirmed with your quote." },
  { n: "05", title: "Quality Inspection",  desc: "Garments are checked against the approved sample before packing." },
  { n: "06", title: "Global Delivery",     desc: "We ship to the US, Australia, Europe and beyond, with tracking on every shipment." },
];


const FAQS = [
  { q: "What is the minimum order quantity (MOQ)?", a: "50 pieces for blank wholesale and for adding your logo to our ready-made blanks — styles, colors and sizes can be mixed. Full cut & sew starts at 100 pieces per style per color." },
  { q: "How long does sampling take?", a: "Single-piece sampling is available. Blank samples take 3 days, logo samples 5–8 days depending on the design, and cut & sew samples 8–15 days after all details are confirmed." },
  { q: "What is the cost for samples?", a: "Blank samples are USD 20–25 per piece. Logo samples are USD 50 per piece. Cut & sew samples are USD 50 per piece depending on the design; printing and embroidery may cost extra." },
  { q: "Can you produce custom labels and packaging?", a: "Yes! We offer complete private label services including woven labels, hang tags, heat transfers, custom poly bags, boxes, and tissue paper—all with your branding." },
  { q: "What is the lead time for bulk production?", a: "Logo customization takes 12–18 days. Cut & sew takes 24–30 days depending on the design and order quantity. We confirm the timeline with your quote." },
  { q: "Which countries do you ship to?", a: "We work with brands in the US, Australia, Switzerland, Canada, the UK and New Zealand, and can ship to most other countries. Shipping is quoted per order." },
];

/* Categories that have their own landing page link there instead of to the filtered
   product list. The home page is the strongest link on the site, so it should point
   at the pages that carry the buying copy and pass equity on to the individual styles. */
const categoryLandingPath = (slug: string) => landingForCategory(slug)?.path ?? `/products?cat=${slug}`;

/* The three landing pages we actually want ranked. They are linked from here, from
   the footer and from the blog, which is what gets them crawled ahead of the 241
   template product pages. Figures are taken from the live catalogue (106 tee styles
   135–310 GSM, 43 hoodie styles 320–543 GSM). */
const SPECIALTIES = [
  {
    href: "/t-shirt-manufacturer",
    title: "Custom T-Shirt Manufacturing",
    desc: "106 styles from 135 to 310 GSM, in oversized, boxy and vintage-wash fits. Screen print, puff print, embroidery and garment dye run on the same line.",
  },
  {
    href: "/custom-hoodie-manufacturer",
    title: "Custom Hoodie Manufacturing",
    desc: "43 styles from 320 to 543 GSM brushed fleece, with dropped shoulders and heavyweight fits. Ribbing, drawcords and patch embroidery made to your sample.",
  },
  {
    href: "/custom-streetwear-manufacturer",
    title: "Custom Streetwear Manufacturing",
    desc: "Full cut & sew from your tech pack: tees, hoodies, tracksuits, cargo and denim, with wash, print and embroidery handled under one roof in Guangzhou.",
  },
];

/* ─── PAGE ─── */

export default function HomeClient({ categories }: { categories: Category[] }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY      = useTransform(scrollYProgress, [0, 1], ["0%",  "20%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const heroOpa   = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ══════════════════════════════════════
          §1  HERO  — Split Layout
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden bg-black">
        {/* Parallax image */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 h-[120%] md:left-[42%]">
          <Image
            src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&q=75&auto=format"
            alt="Premium streetwear model"
            fill priority className="object-cover object-top"
          />
          {/* left gradient fade — strong so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 md:via-black/40 to-transparent" />
          {/* bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* top fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity: heroOpa }}
          className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl"
        >
          {/* Headline */}
          <h1 className="overflow-hidden mb-8">
            {[
              { text: "Clothing Manufacturer", grad: false },
              { text: "For YOUR",              grad: true  },
              { text: "Streetwear Brand.",     grad: false },
            ].map(({ text, grad }, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="block">
                  <span
                    className={`font-display-serif block
                      text-[clamp(2.8rem,7.2vw,7.8rem)]
                      ${grad ? "gradient-text italic" : "text-white"}`}
                  >
                    {text}{" "}
                  </span>
                </span>
              </span>
            ))}
          </h1>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="btn-gradient">
              Get A Quote <ArrowRight size={14} />
            </Link>
            <Link href="/products" className="btn-ghost">
              View Products
            </Link>
          </div>
        </motion.div>

      </section>

      {/* Order options and minimums, immediately after the hero. */}
      <section id="minimum-order-quantity" aria-label="Clothing order options and minimums" className="bg-white px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 md:grid-cols-3">
            {ORDER_OPTIONS.map(({ title, audience, description, quantity, details, facts, href, action }) => (
              <article key={title} className="flex h-full flex-col bg-[#ededed] px-7 py-10 text-black sm:px-10 md:px-7 lg:px-12 lg:py-14">
                <div className="text-center">
                  <h2 className="font-sans text-2xl font-bold leading-tight lg:text-3xl">{title}</h2>
                  <p className="mt-3 text-lg">{audience}</p>
                </div>
                <p className="mt-10 text-base leading-relaxed lg:mt-14 lg:text-lg">{description}</p>
                <div className="mt-7 space-y-5 text-base leading-relaxed lg:text-lg">
                  <p><strong>MOQ:</strong> {quantity}. {details}</p>
                  {facts.map(({ label, value }) => <p key={label}><strong>{label}:</strong> {value}</p>)}
                </div>
                <Link href={href} className="mt-8 self-start font-semibold underline underline-offset-4 transition-colors hover:text-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700">
                  {action}
                </Link>
              </article>
            ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          §3  WHY CHOOSE MULANG
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="label mb-4">Why Work With Us</p>
              <h2 className="heading-xl">The Mulang<br />Advantage</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Low minimums, single-piece sampling and full OEM / ODM — built for brands that are launching or scaling.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, n, title, desc }, i) => (
              <AnimatedSection key={n} delay={i * 0.07}>
                <div className="glass-card p-7 group h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center
                      group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-pink-500 transition-all duration-300">
                      <Icon size={20} className="text-violet-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-syne font-black text-4xl text-white/5 group-hover:text-white/8 transition-colors">{n}</span>
                  </div>
                  <h3 className="font-syne font-bold text-lg text-white mb-2.5">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §3b  THE THREE LINES WE SPECIALISE IN
      ══════════════════════════════════════ */}
      <section className="section-sm border-t border-white/5">
        <div className="container">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="label mb-4">What We Specialise In</p>
              <h2 className="heading-xl">Tees, Hoodies,<br />Streetwear.</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              One factory, three lines. Each one has its own team, its own machines and its own
              page — so you can go straight to the process you need.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SPECIALTIES.map(({ href, title, desc }, i) => (
              <AnimatedSection key={href} delay={i * 0.07} className="h-full">
                <Link href={href} className="glass-card p-7 h-full flex flex-col group">
                  <h3 className="font-syne font-bold text-lg text-white mb-3 group-hover:text-violet-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-violet-400">
                    Explore {title.replace("Custom ", "").replace(" Manufacturing", "")} <ArrowRight size={12} />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §4  PRODUCT CATEGORIES
      ══════════════════════════════════════ */}
      <section className="section bg-[#0a0a0a]">
        <div className="container-wide px-6">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="label mb-4">What We Make</p>
              <h2 className="heading-xl">Product<br />Categories</h2>
            </div>
            <Link href="/products" className="btn-ghost self-start">
              View All Products <ArrowRight size={13} />
            </Link>
          </AnimatedSection>

          {/* Bento-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
            {categories.map(({ slug, label, img }, i) => (
              <AnimatedSection key={slug} delay={i * 0.06}
                className={i === 1 ? "col-span-1 row-span-2" : "col-span-1"}>
                <Link href={categoryLandingPath(slug)} className="group block relative w-full h-full rounded-2xl overflow-hidden img-zoom">
                  <Image src={img} alt={label} fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 transition-colors duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="font-syne font-bold text-white text-sm leading-tight block">{label}</span>
                    <span className="text-white/0 group-hover:text-white/50 text-xs transition-all duration-300 flex items-center gap-1 mt-1">
                      Explore <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §5  MANUFACTURING PROCESS
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <p className="label mb-4">How It Works</p>
            <h2 className="heading-xl">From Idea<br />To Your Door</h2>
          </AnimatedSection>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-white/5" />
            <div className="hidden md:block absolute top-8 left-0 h-px bg-gradient-to-r from-violet-600 to-pink-500 w-full opacity-30" />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {PROCESS.map(({ n, title, desc }, i) => (
                <AnimatedSection key={n} delay={i * 0.1}>
                  <div className="relative">
                    {/* Node */}
                    <div className="flex md:block items-start gap-4 md:text-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-pink-500
                          flex items-center justify-center font-syne font-black text-white text-sm
                          shadow-[0_0_30px_rgba(139,92,246,0.35)] md:mx-auto md:mb-5">
                          {n}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-syne font-bold text-white text-sm mb-2">{title}</h3>
                        <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection className="text-center mt-14">
            <Link href="/manufacturing" className="btn-gradient">
              Learn More About Our Process <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §6  FACTORY SHOWCASE
      ══════════════════════════════════════ */}
      <section className="section-sm bg-[#0a0a0a] overflow-hidden">
        <div className="container-wide px-6">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="label mb-4">World-Class Facility</p>
              <h2 className="heading-xl">Inside<br />Our Factory</h2>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              From sampling and cutting to printing, embroidery, quality checks and packing — made in Guangzhou, China.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[240px] gap-3">
            {[
              { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80&auto=format", label: "Modern Equipment" },
              { img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&q=80&auto=format", label: "Production Floor" },
              { img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format", label: "Quality Control" },
              { img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80&auto=format", label: "Fabric Storage" },
              { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80&auto=format", label: "Expert Team" },
              { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format", label: "Finishing & Packaging" },
            ].map(({ img, label }, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className="relative h-full overflow-hidden rounded-2xl img-zoom">
                  <Image src={img} alt={label} fill className="object-cover" sizes="33vw" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white/70 text-[0.65rem] tracking-widest uppercase">{label}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §9  FAQ
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="container max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <p className="label mb-4">Common Questions</p>
            <h2 className="heading-xl">FAQ</h2>
          </AnimatedSection>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                  >
                    <span className="font-medium text-white text-sm pr-4 group-hover:text-violet-300 transition-colors">
                      {q}
                    </span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-violet-500/50 group-hover:text-violet-400 transition-all">
                      {openFaq === i ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <p className="px-6 pb-6 text-white/45 text-sm leading-relaxed">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §10  FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0a0a0a] border-t border-white/5">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
        </div>

        <div className="container py-32 px-6 text-center relative z-10">
          <AnimatedSection>
            <p className="label mb-6">Start Today</p>
            <h2 className="font-syne font-black text-white leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "clamp(2.5rem,7vw,6rem)" }}>
              Ready To Build<br />
              <span className="gradient-text">Your Brand?</span>
            </h2>
            <p className="text-white/40 text-base mb-10 max-w-md mx-auto leading-relaxed">
              Send us your design or references and we&apos;ll guide you through the next step. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gradient text-sm py-4 px-8">
                Start Your Project <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/8615382890150" target="_blank" rel="noopener noreferrer"
                className="btn-ghost text-sm py-4 px-8">
                Chat On WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
