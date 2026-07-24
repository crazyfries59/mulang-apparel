"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { CATEGORIES } from "./products/data"; // shared catalog categories
import {
  ArrowRight, Plus, Minus,
  Zap, Shield, Globe, Star, Package, Clock,
} from "lucide-react";

/* ─── DATA ─── */

const BRANDS = [
  "SHEIN", "H&M", "ASOS", "TOPSHOP", "MINKPINK",
  "FIRA WEAR", "URBAN OUTFITTERS", "BOOHOO", "PRETTY LITTLE THING",
  "REVOLVE", "MISSGUIDED", "ZARA", "NA-KD", "PRINCESS POLLY",
];

const FEATURES = [
  { icon: Package, n: "01", title: "Low MOQ",          desc: "Start from just 50 pieces per style. Perfect for emerging brands and limited drops." },
  { icon: Zap,     n: "02", title: "Fast Sampling",    desc: "Samples ready in 7–12 days. Revisions included until you're 100% satisfied." },
  { icon: Star,    n: "03", title: "OEM & ODM",        desc: "Whether you have a design or need one—we handle everything from concept to delivery." },
  { icon: Shield,  n: "04", title: "Premium Quality",  desc: "Premium fabrics from 200–500GSM. Every garment meets our exacting standards." },
  { icon: Globe,   n: "05", title: "Strict QC",        desc: "42-point inspection checklist on every order. Zero defects, zero compromises." },
  { icon: Clock,   n: "06", title: "Global Shipping",  desc: "Shipping to 60+ countries. DDP, DAP, FOB—we handle all logistics and customs." },
];

const PROCESS = [
  { n: "01", title: "Design Consultation", desc: "Share your concept, references, and requirements. We provide tech packs and costing within 24h." },
  { n: "02", title: "Sampling",            desc: "Our team creates samples in 7-12 days. Unlimited revisions until the perfect fit." },
  { n: "03", title: "Fabric Selection",    desc: "Choose from 500+ premium fabrics. GSM, composition, finish—every detail controlled." },
  { n: "04", title: "Production",          desc: "State-of-the-art facility, 400+ skilled workers. Bulk orders in 21-30 days." },
  { n: "05", title: "Quality Inspection",  desc: "42-point QC checklist. Every piece inspected before packing. AQL standards." },
  { n: "06", title: "Global Delivery",     desc: "DDP shipping to your door in 60+ countries. Real-time tracking provided." },
];

const PORTFOLIO = [
  { img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=85", label: "SS25 Collection" },
  { img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=85", label: "Street Core" },
  { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=85", label: "Editorial Series" },
  { img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85", label: "Minimal FW" },
  { img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85", label: "Urban Capsule" },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85", label: "Heavyweight Drop" },
];

const TESTIMONIALS = [
  { quote: "Mulang delivered 500 units for our first collection with flawless quality. Lead time was exactly as promised. We've been working together for 3 years now.", name: "James K.", role: "Founder, VOID Collective", location: "London, UK" },
  { quote: "The sampling process was incredibly smooth. They understood our brand aesthetic immediately and the final product was exactly what we envisioned.", name: "Sarah M.", role: "Creative Director, Apex Wear", location: "New York, USA" },
  { quote: "From private label tags to custom packaging, Mulang handles everything. Our brand looks world-class and the pricing is very competitive.", name: "Lucas R.", role: "CEO, Street Core Brand", location: "Berlin, Germany" },
];

const FAQS = [
  { q: "What is the minimum order quantity (MOQ)?", a: "Our standard MOQ is 50 pieces per style per color. For some premium items or complex designs, the MOQ may be 100+ pieces. We can discuss specific requirements for your project." },
  { q: "How long does sampling take?", a: "Standard samples are completed in 7-12 business days. For complex designs with special techniques (embroidery, multi-color prints, etc.), allow 10-15 days. Rush sampling is available." },
  { q: "What is the cost for samples?", a: "Sample costs range from $30-$80 per piece depending on complexity, fabric, and techniques. Sample fees are typically refunded or credited toward bulk orders." },
  { q: "Can you produce custom labels and packaging?", a: "Yes! We offer complete private label services including woven labels, hang tags, heat transfers, custom poly bags, boxes, and tissue paper—all with your branding." },
  { q: "What is the lead time for bulk production?", a: "Standard bulk production takes 21-30 days after sample approval. Rush production (15-20 days) is available for an additional fee. We'll provide a confirmed timeline when you place your order." },
  { q: "Which countries do you ship to?", a: "We ship to 60+ countries worldwide. We offer DDP (Delivered Duty Paid), DAP, and FOB shipping terms. For large orders, we can arrange dedicated freight solutions." },
];

/* ─── PAGE ─── */

export default function HomePage() {
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
            src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&q=90"
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
          <div className="overflow-hidden mb-8">
            {[
              { text: "Manufacturer For",  grad: false },
              { text: "YOUR",              grad: true  },
              { text: "Clothing Line.",    grad: false },
            ].map(({ text, grad }, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className={`font-display-serif block
                      text-[clamp(2.8rem,7.2vw,7.8rem)]
                      ${grad ? "gradient-text italic" : "text-white"}`}
                  >
                    {text}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/contact" className="btn-gradient">
              Get A Quote <ArrowRight size={14} />
            </Link>
            <Link href="/portfolio" className="btn-ghost">
              View Portfolio
            </Link>
          </motion.div>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════
          §2  TRUSTED BY BRANDS
      ══════════════════════════════════════ */}
      <section className="bg-black border-y border-white/6 py-7 overflow-hidden">
        <div className="flex items-center gap-6 px-8 mb-5">
          <span className="label text-white/30 flex-shrink-0">Trusted by global brands</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center gap-14 whitespace-nowrap"
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="font-syne font-black text-sm md:text-base tracking-[0.22em] uppercase flex-shrink-0
                text-white/22 hover:text-white/55 transition-colors duration-300"
            >
              {b}
            </span>
          ))}
        </motion.div>
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
              We&apos;ve helped 500+ brands launch and scale. Here&apos;s what sets us apart from every other manufacturer.
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
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
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
            {CATEGORIES.map(({ slug, label, img }, i) => (
              <AnimatedSection key={slug} delay={i * 0.06}
                className={i === 1 ? "col-span-1 row-span-2" : "col-span-1"}>
                <Link href={`/products?cat=${slug}`} className="group block relative w-full h-full rounded-2xl overflow-hidden img-zoom">
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
                  <div className="relative pt-0 md:pt-16">
                    {/* Node */}
                    <div className="flex md:block items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-pink-500
                          flex items-center justify-center font-syne font-black text-white text-sm
                          shadow-[0_0_30px_rgba(139,92,246,0.35)] md:absolute md:-top-8 md:left-1/2 md:-translate-x-1/2">
                          {n}
                        </div>
                      </div>
                      <div className="md:mt-0">
                        <h3 className="font-syne font-bold text-white text-sm mb-2">{title}</h3>
                        <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
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
              50,000 sq ft. 400+ skilled workers. State-of-the-art equipment. ISO 9001 certified.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80", label: "Modern Equipment", tall: true },
              { img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&q=80", label: "Production Floor", tall: false },
              { img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80", label: "Quality Control", tall: false },
              { img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80", label: "Fabric Storage", tall: false },
              { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80", label: "Expert Team", tall: false },
              { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80", label: "Finishing & Packaging", tall: true },
            ].map(({ img, label, tall }, i) => (
              <AnimatedSection key={i} delay={i * 0.07}
                className={tall ? "row-span-2" : ""}>
                <div className={`relative overflow-hidden rounded-2xl img-zoom ${tall ? "h-[420px]" : "h-[200px]"}`}>
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
          §7  PORTFOLIO
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="label mb-4">Our Work</p>
              <h2 className="heading-xl">Portfolio</h2>
            </div>
            <Link href="/portfolio" className="btn-ghost self-start">
              Full Portfolio <ArrowRight size={13} />
            </Link>
          </AnimatedSection>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {PORTFOLIO.map(({ img, label }, i) => (
              <AnimatedSection key={i} delay={i * 0.07} className="break-inside-avoid">
                <Link href="/portfolio" className="group block relative rounded-2xl overflow-hidden img-zoom">
                  <div className={`relative ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}`}>
                    <Image src={img} alt={label} fill className="object-cover" sizes="33vw" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-400 flex items-end p-5">
                      <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white font-syne font-bold text-sm">{label}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §8  TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="section bg-[#0a0a0a]">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <p className="label mb-4">Client Stories</p>
            <h2 className="heading-xl">What Brands<br />Say About Us</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, role, location }, i) => (
              <AnimatedSection key={name} delay={i * 0.1}>
                <div className="glass-card p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl font-syne font-black gradient-text leading-none mb-5">&quot;</div>
                    <p className="text-white/65 text-sm leading-relaxed mb-6">{quote}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center font-syne font-black text-white text-sm">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{name}</p>
                      <p className="text-white/35 text-xs">{role} · {location}</p>
                    </div>
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
              Start your project today. Get a free quote within 24 hours. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gradient text-sm py-4 px-8">
                Start Your Project <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer"
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
