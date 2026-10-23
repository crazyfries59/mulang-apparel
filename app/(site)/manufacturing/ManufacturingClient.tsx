"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";

const CAPABILITIES = [
  { n: "50,000", u: "sq ft",  label: "Factory Floor" },
  { n: "400+",   u: "people", label: "Skilled Workers" },
  { n: "500+",   u: "fabrics",label: "Fabric Library" },
  { n: "ISO",    u: "9001",   label: "Certified" },
];

const TECHNIQUES = [
  "Screen Printing", "DTG Digital Print", "Embroidery",
  "Woven Labels", "Heat Transfer", "Laser Engraving",
  "Sublimation", "Rubber Patch", "Puff Print", "Foil Print",
  "Discharge Print", "Acid Washing", "Enzyme Washing", "Stone Washing",
];

const QC = [
  "Raw material inspection upon arrival",
  "In-line quality checks during production",
  "Stitching density & seam strength test",
  "Color fastness & wash test (ISO standards)",
  "Measurement accuracy check (AQL)",
  "Label, tag & packaging verification",
  "Pre-shipment final inspection",
  "Third-party inspection available (SGS/BV)",
];

export default function ManufacturingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1800&q=80"
          alt="Factory" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="label mb-5">Our Facility</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight mb-5"
            style={{ fontSize: "clamp(2.5rem,7vw,7rem)" }}>
            World-Class<br /><span className="gradient-text">Manufacturing</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-white/55 text-base max-w-md">
            State-of-the-art facility with 400+ skilled workers producing 2M+ garments annually.
          </motion.p>
        </div>
      </section>

      {/* Capabilities bar */}
      <section className="bg-[#0a0a0a] border-b border-white/5 py-10 px-6">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {CAPABILITIES.map(({ n, u, label }) => (
            <AnimatedSection key={label}>
              <p className="font-syne font-black text-4xl gradient-text leading-none">
                {n}<span className="text-xl font-light text-white/30 ml-1">{u}</span>
              </p>
              <p className="text-white/35 text-xs tracking-widest uppercase mt-2">{label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Production process detail */}
      <section className="section">
        <div className="container">
          <AnimatedSection className="mb-14">
            <p className="label mb-4">Full-Service Production</p>
            <h2 className="heading-xl mb-5">From Fiber To<br />Finished Garment</h2>
            <p className="text-white/40 text-sm max-w-lg leading-relaxed">
              We manage every step of production under one roof—no outsourcing, no surprises. Complete visibility from start to finish.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <AnimatedSection direction="left">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80"
                  alt="Production" fill className="object-cover" />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right" className="space-y-6">
              {[
                ["Design & Tech Packs", "CAD pattern making, size grading, material specs and construction details."],
                ["Material Sourcing", "500+ premium fabrics in stock. Custom fabric sourcing available for special projects."],
                ["Cutting & Sewing", "Computerized cutting for precision. Expert sewers with brand-specific training."],
                ["Decoration & Finishing", "14 decoration techniques in-house: printing, embroidery, washing and more."],
              ].map(([t, d]) => (
                <div key={t as string} className="flex gap-4">
                  <CheckCircle size={18} className="text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-syne font-bold text-white text-sm mb-1">{t}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Decoration techniques */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <p className="label mb-4">Decoration Capabilities</p>
            <h2 className="heading-lg">Every Technique.<br />One Factory.</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {TECHNIQUES.map((t, i) => (
              <AnimatedSection key={t} delay={i * 0.04}>
                <div className="glass-card p-4 text-center text-white/50 text-xs font-medium hover:text-violet-300 hover:border-violet-500/30 transition-all cursor-default">
                  {t}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* QC */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left" className="space-y-6">
              <p className="label">Quality Standards</p>
              <h2 className="heading-xl">Zero Defects.<br />Zero Compromises.</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Our 42-point QC system ensures every garment meets international quality standards before it leaves our facility.
              </p>
              <ul className="space-y-3">
                {QC.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <CheckCircle size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
                  alt="Quality Control" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 glass-card p-5">
                  <p className="font-syne font-black text-white text-2xl">42-Point</p>
                  <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Inspection Checklist</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="heading-lg mb-5">Ready To Start Production?</h2>
            <p className="text-white/40 text-sm mb-8">Get a free consultation and quote within 24 hours.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Request A Quote <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
