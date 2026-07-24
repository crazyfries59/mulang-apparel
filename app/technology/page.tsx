"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";

const TECH_SECTIONS = [
  {
    id: "printing",
    title: "Printing Technology",
    subtitle: "6 Printing Methods. Infinite Possibilities.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85",
    techniques: [
      { name: "Screen Printing",   desc: "Up to 12 colors. Best for large runs and opaque prints. Pantone matching." },
      { name: "DTG Direct-To-Garment", desc: "Full-color photographic prints. No minimum. Best for complex artwork." },
      { name: "Heat Transfer",     desc: "Soft-hand feel. Works on all fabric types. Fast setup, no screens needed." },
      { name: "Sublimation",       desc: "Full-garment all-over prints. Permanent, wash-proof. Polyester fabrics only." },
      { name: "Foil Print",        desc: "Metallic gold, silver & holographic effects. Luxury look for limited drops." },
      { name: "Puff / 3D Print",   desc: "Raised tactile surface. Adds dimension and premium feel to logos & text." },
    ],
  },
  {
    id: "embroidery",
    title: "Embroidery",
    subtitle: "12-Thread Precision. Built To Last.",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=85",
    techniques: [
      { name: "Flat Embroidery",    desc: "Clean, precise stitching. Unlimited colors. Standard for logos and text." },
      { name: "3D Puff Embroidery", desc: "Foam backing creates raised, dimensional logo effect. Premium streetwear staple." },
      { name: "Chenille Embroidery",desc: "Varsity jacket style. Thick, fuzzy texture with bold visual impact." },
      { name: "Reflective Thread",  desc: "Safety-grade thread visible at night. Technical and streetwear applications." },
      { name: "Appliqué",           desc: "Fabric-on-fabric layering. Creates patches and textural contrast." },
      { name: "Woven Patch",        desc: "High-detail pre-made patches. Stitched or heat-fused to garment." },
    ],
  },
  {
    id: "washing",
    title: "Washing & Finishing",
    subtitle: "Vintage Effects. Premium Textures.",
    img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1200&q=85",
    techniques: [
      { name: "Acid Wash",    desc: "Hand-finished bleach treatment. Every piece unique. Classic streetwear aesthetic." },
      { name: "Enzyme Wash",  desc: "Natural bio-enzyme softening. Subtle vintage feel without color damage." },
      { name: "Stone Wash",   desc: "Tumbled with pumice stones. Worn-in look with natural fade patterns." },
      { name: "Garment Dye",  desc: "Post-construction dyeing. Subtle tonal variation, soft hand feel throughout." },
      { name: "Bleach Spray", desc: "Targeted bleach application for tie-dye, splatter and cloud-wash effects." },
      { name: "Softening",    desc: "Silicon or PEG treatment for ultra-soft, smooth hand feel on final product." },
    ],
  },
  {
    id: "cutting",
    title: "Cutting & Pattern Making",
    subtitle: "Precision From Pattern To Production.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85",
    techniques: [
      { name: "CAD Pattern Making",       desc: "Digital pattern creation with exact measurements. Exportable tech packs." },
      { name: "Computerized Cutting",     desc: "Auto-cut machines for precise, repeatable cutting across all sizes." },
      { name: "Laser Cutting",            desc: "Clean edges, intricate shapes, no fraying. Perfect for technical detailing." },
      { name: "Size Grading",             desc: "Systematic size scaling (XS–3XL) maintaining proportional consistency." },
      { name: "Marker Making",            desc: "Optimized fabric layout to minimize waste and reduce material cost." },
      { name: "Shrinkage Testing",        desc: "Pre-wash shrinkage test on all fabrics before bulk cutting commences." },
    ],
  },
];

const CERTIFICATIONS = [
  { title: "ISO 9001:2015", desc: "Quality Management System certified" },
  { title: "OEKO-TEX® Standard 100", desc: "Harmful substance testing" },
  { title: "GOTS Organic", desc: "Global Organic Textile Standard" },
  { title: "GRS Certified", desc: "Global Recycled Standard" },
  { title: "Sedex Member", desc: "Ethical trade platform member" },
  { title: "WRAP Certified", desc: "Worldwide Responsible Apparel" },
];

export default function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1800&q=80"
          alt="Technology" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Advanced Manufacturing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
            Production<br /><span className="gradient-text">Technology</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-white/50 text-sm mt-4 max-w-md">
            State-of-the-art equipment and time-tested craftsmanship. 14 decoration techniques under one roof.
          </motion.p>
        </div>
      </section>

      {/* Technology sections — alternating */}
      <section className="py-20 px-6">
        <div className="container max-w-[1200px] mx-auto space-y-20">
          {TECH_SECTIONS.map(({ id, title, subtitle, img, techniques }, i) => (
            <div key={id} id={id}>
            <AnimatedSection>
              <div className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden img-zoom sticky top-28">
                  <Image src={img} alt={title} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-syne font-black text-white text-2xl leading-tight">{title}</p>
                    <p className="text-white/45 text-xs mt-1">{subtitle}</p>
                  </div>
                </div>

                {/* Techniques grid */}
                <div>
                  <div className="mb-6">
                    <span className="label">{title}</span>
                    <h2 className="font-syne font-black text-white text-2xl md:text-3xl mt-2 leading-tight">{subtitle}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {techniques.map(({ name, desc }) => (
                      <div key={name}
                        className="glass-card p-5 group hover:border-violet-500/30 transition-all">
                        <div className="flex items-start gap-3 mb-2">
                          <CheckCircle size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                          <h3 className="font-syne font-bold text-white text-sm group-hover:text-violet-300 transition-colors">{name}</h3>
                        </div>
                        <p className="text-white/35 text-xs leading-relaxed pl-5">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6 bg-[#0a0a0a] border-t border-white/5">
        <div className="container max-w-[1200px] mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="label mb-4">Compliance & Standards</p>
            <h2 className="font-syne font-black text-white text-3xl">Our Certifications</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CERTIFICATIONS.map(({ title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.07}>
                <div className="glass-card p-5 text-center group hover:border-violet-500/30 transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3
                    group-hover:from-violet-600 group-hover:to-pink-500 transition-all duration-300">
                    <CheckCircle size={16} className="text-violet-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-syne font-bold text-white text-xs mb-1">{title}</p>
                  <p className="text-white/30 text-[0.6rem] leading-tight">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-syne font-black text-white text-3xl mb-5">See Our Technology In Action</h2>
            <p className="text-white/40 text-sm mb-8">Schedule a virtual factory tour or request a technique sample pack.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Book A Factory Tour <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
