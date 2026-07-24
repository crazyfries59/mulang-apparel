"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, countFor } from "./data";

const badgeColor = (b: string) =>
  b === "Best Seller" ? "bg-red-500" : b === "New" ? "bg-violet-500" : "bg-emerald-500";

const catHref = (slug: string) => (slug === "all" ? "/products" : `/products?cat=${slug}`);

export default function ProductsView() {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") ?? "all";
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORIES) {
      map[c.slug] = countFor(c.slug);
      for (const s of c.subs ?? []) map[s.slug] = countFor(s.slug);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = activeCat === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.cat === activeCat || p.sub === activeCat);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q));
    return list;
  }, [activeCat, search]);

  const catRow = (slug: string, label: string, n: number) => {
    const active = activeCat === slug;
    return (
      <Link
        key={slug}
        href={catHref(slug)}
        scroll={false}
        className={`w-full flex items-center justify-between py-2 text-sm transition-colors
          ${active ? "text-violet-400 font-semibold" : "text-white/55 hover:text-white"}`}
      >
        <span>{label}</span>
        <span className={`text-xs ${active ? "text-violet-400/70" : "text-white/25"}`}>{n}</span>
      </Link>
    );
  };

  return (
    <>
      {/* ── Page header ── */}
      <section className="pt-32 pb-8 px-6 border-b border-white/5">
        <div className="container max-w-[1280px] mx-auto">
          <AnimatedSection>
            <p className="label mb-3">What We Make</p>
            <h1 className="font-display-serif text-white text-[clamp(2.2rem,5vw,4rem)] leading-none">
              Products
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 py-8 pb-24">
        <div className="container max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
              <p className="label mb-4">Categories</p>
              {catRow("all", "All Products", PRODUCTS.length)}
              <div className="h-px bg-white/8 my-2" />
              {CATEGORIES.map(c => {
                const subActive = c.subs?.some(s => s.slug === activeCat);
                const open = activeCat === c.slug || subActive;
                return (
                  <div key={c.slug}>
                    {catRow(c.slug, c.label, counts[c.slug] || 0)}
                    {open && c.subs && (
                      <div className="ml-3 pl-2 border-l border-white/10 mb-1">
                        {c.subs.map(s => {
                          const a = activeCat === s.slug;
                          return (
                            <Link key={s.slug} href={catHref(s.slug)} scroll={false}
                              className={`flex items-center justify-between py-1.5 text-[0.8rem] transition-colors
                                ${a ? "text-violet-400 font-semibold" : "text-white/40 hover:text-white/80"}`}>
                              <span>{s.label}</span>
                              <span className={`text-[0.65rem] ${a ? "text-violet-400/70" : "text-white/20"}`}>{counts[s.slug] || 0}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* count + search */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-white/40 text-sm">
                <span className="text-white font-semibold">{filtered.length}</span> products
              </p>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text" placeholder="Search products..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 w-40 sm:w-56 transition-all"
                />
              </div>
            </div>

            {/* mobile category chips */}
            <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
              {[["all", "All"], ...CATEGORIES.map(c => [c.slug, c.label] as const)].map(([slug, label]) => (
                <Link key={slug} href={catHref(slug)} scroll={false}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[0.62rem] tracking-widest uppercase font-semibold transition-all ${
                    activeCat === slug ? "bg-white text-black" : "border border-white/10 text-white/40"
                  }`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* grid */}
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <motion.div key={p.slug} layout
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
                    <Link href={`/products/${p.slug}`} className="group block">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#141414] mb-3">
                        <Image src={p.img} alt={p.name} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width:768px) 50vw, 33vw" />
                        {p.gsm !== "—" && (
                          <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-sm text-white text-[0.6rem] font-bold tracking-wide px-2.5 py-1 rounded-md">
                            {p.gsm}
                          </span>
                        )}
                        {p.badge && (
                          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[0.55rem] font-bold uppercase tracking-wider text-white ${badgeColor(p.badge)}`}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-violet-400 text-[0.7rem] font-semibold font-mono mb-1">{p.id}</p>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-white/85 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                          {p.name}
                        </p>
                        <p className="text-white font-semibold text-sm whitespace-nowrap">{p.price}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-white/25 text-sm">
                  No products found.{" "}
                  <Link href="/products" onClick={() => setSearch("")} className="text-violet-400 hover:text-violet-300">
                    Clear filters
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
