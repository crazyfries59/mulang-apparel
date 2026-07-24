"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const COLLECTIONS = ["全部", "SS24", "FW23", "SS23", "档案"];

const PHOTOS = [
  { id: 1, src: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&q=85", col: "SS24", caption: "街头精华系列" },
  { id: 2, src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85", col: "SS24", caption: "极简系列" },
  { id: 3, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85", col: "FW23", caption: "寒季胶囊系列" },
  { id: 4, src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85", col: "FW23", caption: "都市叠穿" },
  { id: 5, src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85", col: "SS23", caption: "夏日漂移" },
  { id: 6, src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85", col: "SS23", caption: "街头核心" },
  { id: 7, src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85", col: "FW23", caption: "暗黑物质" },
  { id: 8, src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85", col: "档案",  caption: "经典传承" },
  { id: 9, src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85", col: "SS24", caption: "廓形运动" },
  { id: 10,src: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=1400&q=85", col: "FW23", caption: "重磅系列" },
  { id: 11,src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1400&q=85", col: "SS23", caption: "图案季" },
  { id: 12,src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=85", col: "档案",  caption: "外套精选" },
];

export default function LookbookPage() {
  const [activeColl, setActiveColl] = useState("全部");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeColl === "全部" ? PHOTOS : PHOTOS.filter(p => p.col === activeColl);
  const curIdx = lightbox !== null ? filtered.findIndex(p => p.id === lightbox) : -1;
  const activePhoto = filtered.find(p => p.id === lightbox);

  const goNext = () => curIdx < filtered.length - 1 && setLightbox(filtered[curIdx + 1].id);
  const goPrev = () => curIdx > 0 && setLightbox(filtered[curIdx - 1].id);

  return (
    <>
      {/* 页面头 */}
      <section className="pt-40 pb-14 px-6 text-center">
        <AnimatedSection>
          <p className="section-label mb-4">视觉日志</p>
          <h1 className="section-title mb-5">
            品牌画册<br /><span className="text-[var(--accent)]">&apos;24</span>
          </h1>
          <p className="text-[var(--muted)] max-w-lg mx-auto text-sm leading-relaxed">
            探索街头服饰文化的视觉叙事——每一件精制服装背后，都是一种生活态度。
          </p>
        </AnimatedSection>
      </section>

      {/* 系列过滤 */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto flex gap-2.5 flex-wrap justify-center">
          {COLLECTIONS.map(col => (
            <button
              key={col}
              onClick={() => setActiveColl(col)}
              className={`px-5 py-2 rounded-full text-[0.65rem] tracking-widest uppercase font-bold transition-all duration-200 ${
                activeColl === col
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </section>

      {/* 瀑布流网格 */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem]">
            <AnimatePresence>
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="break-inside-avoid mb-4"
                >
                  <button
                    onClick={() => setLightbox(photo.id)}
                    className="group relative w-full overflow-hidden rounded-2xl block text-left"
                  >
                    <div className={`relative w-full ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}>
                      <Image src={photo.src} alt={photo.caption} fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                      {/* 遮层 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex flex-col items-center justify-center">
                        <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3" />
                        <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-center px-4">
                          <p className="text-white font-bold text-sm">{photo.caption}</p>
                          <p className="text-white/55 text-[0.6rem] tracking-widest uppercase mt-1">{photo.col}</p>
                        </div>
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
        {lightbox !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* 关闭 */}
            <button onClick={e => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-colors z-10">
              <X size={18} />
            </button>

            {/* 上一张 */}
            <AnimatePresence>
              {curIdx > 0 && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={e => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 md:left-7 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-colors z-10"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* 下一张 */}
            <AnimatePresence>
              {curIdx < filtered.length - 1 && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={e => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 md:right-7 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-colors z-10"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* 图片 */}
            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="relative max-h-[85vh] max-w-3xl w-full mx-16"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5]">
                <Image src={activePhoto.src} alt={activePhoto.caption} fill className="object-contain"
                  sizes="80vw" />
              </div>
              <div className="text-center mt-4">
                <p className="text-white font-semibold text-sm">{activePhoto.caption}</p>
                <p className="text-white/35 text-[0.6rem] tracking-widest uppercase mt-1">{activePhoto.col}</p>
                <p className="text-white/25 text-[0.6rem] mt-2">{curIdx + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
