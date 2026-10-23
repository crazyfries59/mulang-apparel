"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { X, ChevronLeft, ChevronRight, Link2 } from "lucide-react";

const FILTERS = ["All", "Streetwear", "Hoodies", "Sets & Tracksuits", "Outerwear", "Editorial"];

const WORKS = [
  { id:1,  img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=90", cat: "Editorial",        title: "Dark Matter SS25",    brand: "Void Collective",    tall: true  },
  { id:2,  img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=85", cat: "Streetwear",       title: "Street Core Drop",   brand: "Urban Echo",         tall: false },
  { id:3,  img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85", cat: "Editorial",        title: "Minimal Series FW",  brand: "Apex Wear",          tall: false },
  { id:4,  img: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=1200&q=85", cat: "Hoodies",          title: "Heavy Weight Capsule", brand: "North District",    tall: true  },
  { id:5,  img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85", cat: "Sets & Tracksuits", title: "Summer Drift Set",    brand: "Cloud Nine",        tall: false },
  { id:6,  img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=85", cat: "Streetwear",       title: "Graphic Season",     brand: "Raw Supply",         tall: false },
  { id:7,  img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=85", cat: "Outerwear",        title: "Bomber Collection",  brand: "Epoch Studio",       tall: false },
  { id:8,  img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85", cat: "Streetwear",       title: "Urban Capsule FW24", brand: "Five AM Club",       tall: true  },
  { id:9,  img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85", cat: "Editorial",        title: "Premium Series",     brand: "Dark Matter",        tall: false },
  { id:10, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85", cat: "Sets & Tracksuits", title: "Elevated Basics",     brand: "Street Core",       tall: false },
  { id:11, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",    cat: "Outerwear",        title: "Tech Layer SS24",    brand: "Apex Wear",          tall: false },
  { id:12, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=85", cat: "Streetwear",       title: "Cargo Season",       brand: "Void Collective",    tall: false },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const [lb, setLb]         = useState<number | null>(null);

  const list = filter === "All" ? WORKS : WORKS.filter(w => w.cat === filter);
  const idx  = lb !== null ? list.findIndex(w => w.id === lb) : -1;
  const cur  = list.find(w => w.id === lb);

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-14 px-6 border-b border-white/5">
        <div className="container">
          <AnimatedSection>
            <p className="label mb-5">Our Work</p>
            <h1 className="heading-xl mb-4">Portfolio</h1>
            <p className="text-white/40 text-sm max-w-lg leading-relaxed">
              A selection of campaigns, collections, and lookbooks produced at Mulang Apparel for brands worldwide.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="container flex gap-2 overflow-x-auto">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[0.65rem] tracking-widest uppercase font-semibold transition-all ${
                filter === f ? "bg-white text-black" : "border border-white/10 text-white/45 hover:border-white/30 hover:text-white"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="section">
        <div className="container-wide px-6">
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem]">
            <AnimatePresence>
              {list.map((work, i) => (
                <motion.div key={work.id} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="break-inside-avoid mb-4"
                >
                  <button onClick={() => setLb(work.id)}
                    className="group relative w-full overflow-hidden rounded-2xl block text-left">
                    <div className={`relative ${work.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                      <Image src={work.img} alt={work.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="33vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-400" />
                      {/* Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-syne font-bold text-sm">{work.title}</p>
                            <p className="text-white/50 text-xs mt-0.5">{work.brand}</p>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Link2 size={14} className="text-white" />
                          </div>
                        </div>
                      </div>
                      {/* Cat badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white/60 text-[0.55rem] tracking-widest uppercase">
                        {work.cat}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lb !== null && cur && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLb(null)}
          >
            <button onClick={e => { e.stopPropagation(); setLb(null); }}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors z-10">
              <X size={16} />
            </button>
            {idx > 0 && (
              <button onClick={e => { e.stopPropagation(); setLb(list[idx - 1].id); }}
                className="absolute left-4 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10">
                <ChevronLeft size={18} />
              </button>
            )}
            {idx < list.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setLb(list[idx + 1].id); }}
                className="absolute right-4 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10">
                <ChevronRight size={18} />
              </button>
            )}
            <motion.div key={cur.id} initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-2xl w-full mx-14"
              onClick={e => e.stopPropagation()}
            >
              <div className={`relative ${cur.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image src={cur.img} alt={cur.title} fill className="object-contain" sizes="80vw" />
              </div>
              <div className="text-center mt-4">
                <p className="text-white font-syne font-bold">{cur.title}</p>
                <p className="text-white/35 text-xs mt-1">{cur.brand} · {cur.cat}</p>
                <p className="text-white/20 text-xs mt-1">{idx + 1} / {list.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
