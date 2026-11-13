"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";
import { CATEGORIES, type Product } from "./data";
import { CATEGORY_LANDING_LIST } from "@/lib/seo/category-landing";

const badgeColor = (b: string) =>
  b === "Best Seller" ? "bg-red-500" : b === "New" ? "bg-violet-500" : "bg-emerald-500";

const catHref = (slug: string) => (slug === "all" ? "/products" : `/products?cat=${slug}`);

/* Style numbers are displayed as "#K1160" but buyers type "k1160", "1160" or "K-1160",
   so compare on letters + digits only. */
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const matchesQuery = (product: Product, q: string, nq: string) => {
  const fields = [product.id, product.name, product.cat, product.sub, product.fabric, product.slug];
  if (fields.some(f => f.toLowerCase().includes(q))) return true;
  return nq !== "" && fields.some(f => normalize(f).includes(nq));
};

export default function ProductsView({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") ?? "all";
  const urlQuery = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(urlQuery);

  /* Keep the keyword in the URL so a refresh, a share or a "back" from a product
     page keeps the result the visitor was looking at. window.history is used on
     purpose: this must not kick off a router navigation per keystroke. */
  const syncQueryInUrl = (value: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    const qs = params.toString();
    const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (nextUrl === `${window.location.pathname}${window.location.search}`) return;
    // history.state carries the router payload: overwriting it with null breaks back/forward.
    window.history.replaceState(window.history.state, "", nextUrl);
  };

  /* A real navigation (navbar search, back button, external link) carries a new q. */
  useEffect(() => {
    setSearch((current) => (current.trim() === urlQuery.trim() ? current : urlQuery));
  }, [urlQuery]);

  /* Coming back from a product page the router may not report the q we mirrored
     into history, so trust the address bar once on mount. */
  useEffect(() => {
    const fromLocation = new URLSearchParams(window.location.search).get("q") ?? "";
    setSearch((current) => (current.trim() === fromLocation.trim() ? current : fromLocation));
  }, []);

  /* Picking a category is a fresh browse, not a filter inside the last search.
     Without this the old keyword kept filtering the new category (component stays
     mounted on client navigation), and the list looked frozen until a reload. */
  const previousCat = useRef(activeCat);
  useEffect(() => {
    if (previousCat.current === activeCat) return;
    previousCat.current = activeCat;
    // A navbar search lands here with a new keyword and no category: keep it.
    if (urlQuery.trim()) {
      setSearch(urlQuery);
      return;
    }
    setSearch("");
    syncQueryInUrl("");
  }, [activeCat, urlQuery]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    syncQueryInUrl(value);
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORIES) {
      map[c.slug] = products.filter((product) => product.cat === c.slug || product.sub === c.slug).length;
      for (const s of c.subs ?? []) {
        map[s.slug] = products.filter((product) => product.cat === s.slug || product.sub === s.slug).length;
      }
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let list = activeCat === "all"
      ? products
      : products.filter(p => p.cat === activeCat || p.sub === activeCat);
    const q = search.trim().toLowerCase();
    if (q) {
      const nq = normalize(q);
      list = list.filter(p => matchesQuery(p, q, nq));
    }
    return list;
  }, [activeCat, products, search]);

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
            <p className="text-white/45 text-sm leading-relaxed max-w-2xl mt-5">
              {products.length} ready-to-customize styles across {CATEGORIES.length} categories. Every style can ship
              blank, carry your logo, or be re-cut in your own fit and fabric. Manufacturing detail for our two
              biggest categories:
            </p>
            <div className="flex flex-wrap gap-2.5 mt-5">
              {CATEGORY_LANDING_LIST.map((landing) => (
                <Link
                  key={landing.path}
                  href={landing.path}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/[0.07] text-violet-300 text-[0.7rem] font-semibold tracking-wide hover:border-violet-500/50 hover:text-violet-200 transition-colors"
                >
                  {landing.keyword} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 py-8 pb-24">
        <div className="container max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
              <p className="label mb-4">Categories</p>
              {catRow("all", "All Products", products.length)}
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
                  type="text" placeholder="Style no. or name..."
                  aria-label="Search products by style number or name"
                  value={search} onChange={e => handleSearchChange(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 w-52 sm:w-64 transition-all"
                />
                {search && (
                  <button
                    type="button" onClick={() => handleSearchChange("")} aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
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
                  <Link href="/products" onClick={() => handleSearchChange("")} className="text-violet-400 hover:text-violet-300">
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
