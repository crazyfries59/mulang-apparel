"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Info } from "lucide-react";

const FABRICS = [
  {
    id: "french-terry",
    name: "French Terry",
    category: "Fleece",
    gsm: "280–420GSM",
    composition: "80% Cotton / 20% Polyester",
    bestFor: ["Hoodies", "Sweatshirts", "Sets"],
    texture: "Loop-back surface, smooth face",
    colors: 30,
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85",
    desc: "Our most popular hoodie fabric. Soft interior loops provide warmth while the smooth face holds print well. Available in heavyweight (380–420GSM) for premium streetwear.",
    care: "Machine wash cold, tumble dry low",
    origin: "China / Turkey",
  },
  {
    id: "ringspun-cotton",
    name: "Ringspun Cotton",
    category: "Cotton",
    gsm: "180–320GSM",
    composition: "100% Combed Ringspun Cotton",
    bestFor: ["T-Shirts", "Tees", "Crop Tops"],
    texture: "Smooth, soft hand-feel",
    colors: 45,
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85",
    desc: "The gold standard for premium tees. Ringspun yarns are finer, stronger and softer than regular cotton. Perfect for garment dyeing, acid washing, and DTG printing.",
    care: "Machine wash cold, hang dry",
    origin: "China / India",
  },
  {
    id: "selvedge-denim",
    name: "Selvedge Denim",
    category: "Denim",
    gsm: "380–600G",
    composition: "98% Cotton / 2% Elastane",
    bestFor: ["Jeans", "Jackets", "Shorts"],
    texture: "Structured, rigid, develops character",
    colors: 8,
    img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85",
    desc: "Premium Japanese-inspired selvedge denim for jeans, jackets and shorts. Available in 12oz–16oz weights with our signature wash treatments: acid, stone, enzyme.",
    care: "Cold wash, air dry, minimal washing",
    origin: "China / Japan",
  },
  {
    id: "nylon-ripstop",
    name: "Nylon Ripstop",
    category: "Technical",
    gsm: "70–200GSM",
    composition: "100% Nylon",
    bestFor: ["Cargo Pants", "Shorts", "Windbreakers"],
    texture: "Lightweight, grid-like reinforcement",
    colors: 20,
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85",
    desc: "Military-grade ripstop nylon with excellent tear resistance. Lightweight and packable—ideal for cargo pants, technical shorts, and wind-resistant outerwear.",
    care: "Machine wash cold, hang dry",
    origin: "China / Taiwan",
  },
  {
    id: "polar-fleece",
    name: "Polar Fleece",
    category: "Fleece",
    gsm: "180–360GSM",
    composition: "100% Polyester",
    bestFor: ["Jackets", "Vests", "Pullovers"],
    texture: "Fuzzy, soft pile both sides",
    colors: 25,
    img: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=85",
    desc: "Warm, breathable and fast-drying polar fleece for outerwear and layering pieces. Anti-pilling surface treatment maintains appearance through repeated washes.",
    care: "Machine wash warm, tumble dry low",
    origin: "China",
  },
  {
    id: "cotton-twill",
    name: "Cotton Twill",
    category: "Cotton",
    gsm: "200–350GSM",
    composition: "100% Cotton",
    bestFor: ["Caps", "Shorts", "Chinos", "Workwear"],
    texture: "Diagonal weave, smooth face",
    colors: 35,
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=85",
    desc: "Classic cotton twill with a distinctive diagonal rib. Durable, structured, and versatile. The go-to fabric for structured caps, workwear, and premium shorts.",
    care: "Machine wash cold, tumble dry low",
    origin: "China",
  },
  {
    id: "ribbed-knit",
    name: "Ribbed Knit",
    category: "Knit",
    gsm: "250–400GSM",
    composition: "95% Cotton / 5% Spandex",
    bestFor: ["Cuffs", "Hems", "Polo Collars", "Beanies"],
    texture: "Stretchy vertical rib structure",
    colors: 30,
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85",
    desc: "High-stretch ribbed knit for cuffs, waistbands and collar trims. Also used for entire garments—biker shorts, tank tops, and form-fitting pieces.",
    care: "Machine wash cold, lay flat to dry",
    origin: "China",
  },
  {
    id: "mesh",
    name: "Athletic Mesh",
    category: "Technical",
    gsm: "100–180GSM",
    composition: "100% Polyester",
    bestFor: ["Shorts", "Jersey", "Activewear", "Liners"],
    texture: "Open-hole knit, ultra-breathable",
    colors: 18,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85",
    desc: "Highly breathable athletic mesh for performance shorts, jersey tops, and inner linings. Moisture-wicking finish available. Ideal for sportswear and athleisure.",
    care: "Machine wash cold, air dry",
    origin: "China",
  },
];

const CATEGORIES = ["All", "Cotton", "Fleece", "Denim", "Technical", "Knit"];

export default function FabricsPage() {
  const [cat, setCat]       = useState("All");
  const [hovered, setHov]   = useState<string | null>(null);

  const filtered = cat === "All" ? FABRICS : FABRICS.filter(f => f.category === cat);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80"
          alt="Fabrics" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Material Excellence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
            Premium<br /><span className="gradient-text">Fabric Library</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-white/50 text-sm mt-4 max-w-sm">
            500+ fabrics in stock. From 180GSM tees to 600G denim. Request physical swatches with your sample order.
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-20 z-30 bg-black/85 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="container max-w-[1200px] mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[0.65rem] tracking-widest uppercase font-semibold transition-all ${
                cat === c ? "bg-white text-black" : "border border-white/10 text-white/45 hover:border-white/30 hover:text-white"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Fabric Grid */}
      <section className="py-14 px-6 pb-24">
        <div className="container max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((fabric, i) => (
              <AnimatedSection key={fabric.id} delay={i * 0.06}>
                <div
                  className="group glass-card overflow-hidden cursor-default"
                  onMouseEnter={() => setHov(fabric.id)}
                  onMouseLeave={() => setHov(null)}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden img-zoom">
                    <Image src={fabric.img} alt={fabric.name} fill className="object-cover" sizes="25vw" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-400" />

                    {/* Hover overlay with specs */}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: hovered === fabric.id ? 1 : 0 }}
                      className="absolute inset-0 flex flex-col justify-between p-4"
                    >
                      <div>
                        <span className="inline-block px-2.5 py-1 bg-violet-500/80 backdrop-blur-sm rounded-full text-[0.58rem] font-bold uppercase tracking-wider text-white">
                          {fabric.category}
                        </span>
                      </div>
                      <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 space-y-2">
                        <p className="text-white/50 text-[0.6rem] tracking-widest uppercase flex items-center gap-1">
                          <Info size={9} /> Fabric Specs
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.65rem]">
                          <div><p className="text-white/30">Weight</p><p className="text-white font-semibold">{fabric.gsm}</p></div>
                          <div><p className="text-white/30">Colors</p><p className="text-white font-semibold">{fabric.colors}+</p></div>
                          <div className="col-span-2"><p className="text-white/30">Composition</p><p className="text-white font-semibold">{fabric.composition}</p></div>
                          <div className="col-span-2"><p className="text-white/30">Best For</p><p className="text-violet-300 font-semibold">{fabric.bestFor.join(", ")}</p></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white/30 text-[0.58rem] tracking-widest uppercase">{fabric.category}</p>
                        <h3 className="font-syne font-bold text-white text-base group-hover:text-violet-300 transition-colors">{fabric.name}</h3>
                      </div>
                      <span className="text-white/50 text-xs font-mono bg-white/5 px-2 py-0.5 rounded-lg">{fabric.gsm}</span>
                    </div>
                    <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2">{fabric.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fabric.bestFor.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[0.58rem] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Request Swatches */}
      <section className="py-16 px-6 bg-[#0a0a0a] border-t border-white/5">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <p className="label mb-4">Physical Samples</p>
            <h2 className="font-syne font-black text-white text-3xl mb-5">Request Fabric Swatches</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Touch and feel the quality before committing. Request a physical swatch pack with your first sample order. Includes GSM card and care instruction label.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Request Swatches <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
