"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CATEGORIES } from "@/app/products/data";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, MessageCircle, ChevronDown, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────
   NAV DATA — mirrors Hongyu structure
───────────────────────────────────────────── */
const SERVICE_ITEMS = [
  { label: "Clothing Prototype",        href: "/services#prototype",   desc: "First samples in 7-12 days" },
  { label: "Sample Development",        href: "/services#sampling",    desc: "Unlimited revisions" },
  { label: "Custom Apparel Production", href: "/services#production",  desc: "OEM & ODM, MOQ 50pcs" },
  { label: "Labels / Tags / Packaging", href: "/services#labels",      desc: "Full private label service" },
  { label: "Global Shipping",           href: "/services#shipping",    desc: "DDP to 60+ countries" },
  { label: "Product Photography",       href: "/services#photography", desc: "Studio & lifestyle shots" },
];

const SOLUTIONS_ITEMS = [
  { label: "Cut & Sew Customize",  href: "/solutions#cut-sew",      desc: "Your design, our production" },
  { label: "Logo Customize",       href: "/solutions#logo",         desc: "Print, embroidery & more" },
  { label: "Blank Wholesale",      href: "/solutions#blank",        desc: "Premium blank garments" },
  { label: "Private Label",        href: "/solutions#private-label",desc: "Your brand on our quality" },
  { label: "For Startups",         href: "/solutions#startups",     desc: "Low MOQ, fast turnaround" },
];

const ABOUT_ITEMS = [
  { label: "About Us",        href: "/about" },
  { label: "Our Ethics",      href: "/about#ethics" },
  { label: "Customer Reviews",href: "/about#reviews" },
  { label: "Blog",            href: "/blog" },
  { label: "Contact Us",      href: "/contact" },
];

const NAV = [
  { href: "/",            label: "Home" },
  { href: "/products",    label: "Products",   dropdown: "products" },
  { href: "/fabrics",     label: "Fabrics" },
  { href: "/technology",  label: "Technology" },
  { href: "/solutions",   label: "Solutions",  dropdown: "solutions" },
  { href: "/services",    label: "Service",    dropdown: "service" },
  { href: "/about",       label: "About Us",   dropdown: "about" },
];

/* ─────────────────────────────────────────────
   DROPDOWN FADE
───────────────────────────────────────────── */
const dropVariant = {
  hidden:  { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -4, scale: 0.98 },
};

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [activeDropdown, setActive] = useState<string | null>(null);
  const [searchOpen, setSearch]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProductCat, setProductCat] = useState("t-shirts");
  const pathname                  = usePathname();
  const router                    = useRouter();
  const navRef                    = useRef<HTMLElement>(null);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobile(false);
    setActive(null);
    setSearch(false);
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openDropdown = useCallback((key: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(key);
  }, []);

  const closeDropdown = useCallback(() => {
    timerRef.current = setTimeout(() => setActive(null), 120);
  }, []);

  const keepOpen = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const submitSearch = useCallback((e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearch(false);
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }, [searchQuery, router]);

  // active category for the Products mega-menu featured image
  const activeGroup = CATEGORIES.find(c => c.slug === activeProductCat) ?? CATEGORIES[0];

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-400 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between w-full gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="font-syne font-black text-[1.1rem] tracking-[0.14em] uppercase text-white group-hover:text-violet-300 transition-colors">
              MULANG
            </span>
            <span className="font-syne font-light text-[1.1rem] tracking-[0.14em] uppercase text-white/40">
              APPAREL
            </span>
          </Link>

          {/* ── Desktop Nav (spaced) ── */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV.map(({ href, label, dropdown }) => {
              const isActive = pathname === href || (pathname.startsWith(href) && href !== "/");
              return (
              <div
                key={href}
                className="relative"
                onMouseEnter={() => dropdown && openDropdown(dropdown)}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[0.9rem] tracking-tight font-medium rounded-lg transition-colors whitespace-nowrap
                    ${isActive
                      ? "text-violet-300"
                      : "text-white/65 hover:text-white hover:bg-white/[0.07]"
                    }`}
                >
                  {label}
                  {dropdown && (
                    <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === dropdown ? "rotate-180" : ""}`} />
                  )}
                </Link>

                {/* active underline */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  />
                )}

                {/* ── Products Mega Menu ── */}
                {dropdown === "products" && (
                  <AnimatePresence>
                    {activeDropdown === "products" && (
                      <motion.div
                        variants={dropVariant} initial="hidden" animate="visible" exit="exit"
                        onMouseEnter={keepOpen} onMouseLeave={closeDropdown}
                        className="absolute top-full left-0 mt-2 w-[660px] bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50 flex"
                      >
                        {/* left — main categories (synced with /products) */}
                        <div className="w-[212px] flex-shrink-0 py-3 border-r border-white/6 max-h-[440px] overflow-y-auto">
                          <div className="px-5 pb-2 flex items-center justify-between">
                            <span className="text-[0.6rem] tracking-widest uppercase text-white/30">Categories</span>
                            <Link href="/products" className="text-[0.6rem] tracking-widest uppercase text-violet-400 hover:text-violet-300 flex items-center gap-1">
                              All <ArrowRight size={9} />
                            </Link>
                          </div>
                          {CATEGORIES.map((c) => {
                            const on = activeProductCat === c.slug;
                            return (
                              <Link key={c.slug} href={`/products?cat=${c.slug}`}
                                onMouseEnter={() => setProductCat(c.slug)}
                                className={`flex items-center justify-between px-5 py-2.5 text-[0.82rem] transition-colors ${
                                  on ? "text-violet-400 bg-white/5" : "text-white/55 hover:text-white hover:bg-white/3"}`}>
                                <span>{c.label}</span>
                                {c.subs
                                  ? <ChevronDown size={12} className={`-rotate-90 ${on ? "opacity-100" : "opacity-40"}`} />
                                  : <ArrowRight size={11} className={on ? "opacity-100" : "opacity-0"} />}
                              </Link>
                            );
                          })}
                        </div>

                        {/* middle — sub-categories of active group */}
                        <div className="flex-1 min-w-0 py-4 px-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[0.6rem] tracking-widest uppercase text-violet-400">{activeGroup.label}</span>
                          </div>
                          {activeGroup.subs ? (
                            <div className="flex flex-col">
                              {activeGroup.subs.map((s) => (
                                <Link key={s.label} href={`/products?cat=${s.slug}`}
                                  className="py-2 text-[0.85rem] text-white/60 hover:text-white hover:translate-x-1 transition-all">
                                  {s.label}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link href={`/products?cat=${activeGroup.slug}`}
                              className="inline-flex items-center gap-1.5 py-2 text-[0.85rem] text-white/60 hover:text-white transition-colors">
                              View all {activeGroup.label} <ArrowRight size={11} />
                            </Link>
                          )}
                        </div>

                        {/* right — featured image of active category */}
                        <Link href={`/products?cat=${activeGroup.slug}`}
                          className="w-[190px] flex-shrink-0 relative overflow-hidden group/img border-l border-white/6">
                          <Image src={activeGroup.img} alt={activeGroup.label} fill sizes="190px"
                            className="object-cover transition-transform duration-500 group-hover/img:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-medium text-sm leading-tight">{activeGroup.label}</p>
                            <span className="text-violet-300 text-[0.62rem] flex items-center gap-1 mt-1">Shop now <ArrowRight size={9} /></span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* ── Service Dropdown ── */}
                {dropdown === "service" && (
                  <AnimatePresence>
                    {activeDropdown === "service" && (
                      <motion.div
                        variants={dropVariant} initial="hidden" animate="visible" exit="exit"
                        onMouseEnter={keepOpen} onMouseLeave={closeDropdown}
                        className="absolute top-full left-0 mt-1 w-64 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                      >
                        {SERVICE_ITEMS.map(({ label: sLabel, href: sHref, desc }) => (
                          <Link key={sHref} href={sHref}
                            className="group flex flex-col px-5 py-3.5 hover:bg-white/4 transition-colors border-b border-white/4 last:border-0">
                            <span className="text-[0.75rem] text-white/75 group-hover:text-violet-300 transition-colors font-medium">{sLabel}</span>
                            <span className="text-[0.62rem] text-white/30 mt-0.5">{desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* ── Solutions Dropdown ── */}
                {dropdown === "solutions" && (
                  <AnimatePresence>
                    {activeDropdown === "solutions" && (
                      <motion.div
                        variants={dropVariant} initial="hidden" animate="visible" exit="exit"
                        onMouseEnter={keepOpen} onMouseLeave={closeDropdown}
                        className="absolute top-full left-0 mt-1 w-60 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                      >
                        {SOLUTIONS_ITEMS.map(({ label: sLabel, href: sHref, desc }) => (
                          <Link key={sHref} href={sHref}
                            className="group flex flex-col px-5 py-3.5 hover:bg-white/4 transition-colors border-b border-white/4 last:border-0">
                            <span className="text-[0.75rem] text-white/75 group-hover:text-violet-300 transition-colors font-medium">{sLabel}</span>
                            <span className="text-[0.62rem] text-white/30 mt-0.5">{desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* ── About Dropdown ── */}
                {dropdown === "about" && (
                  <AnimatePresence>
                    {activeDropdown === "about" && (
                      <motion.div
                        variants={dropVariant} initial="hidden" animate="visible" exit="exit"
                        onMouseEnter={keepOpen} onMouseLeave={closeDropdown}
                        className="absolute top-full right-0 mt-1 w-52 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                      >
                        {ABOUT_ITEMS.map(({ label: aLabel, href: aHref }) => (
                          <Link key={aHref} href={aHref}
                            className="flex items-center gap-2 px-5 py-3 text-[0.75rem] text-white/65 hover:text-violet-300 hover:bg-white/4 transition-all border-b border-white/4 last:border-0">
                            {aLabel}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setSearch(!searchOpen)} aria-label="Search"
              className="flex w-8 h-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-colors">
              <Search size={13} />
            </button>
            <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer"
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-[#25D366] hover:border-[#25D366]/40 transition-colors">
              <MessageCircle size={13} />
            </a>
            <Link href="/contact" className="btn-gradient hidden lg:inline-flex text-[0.67rem] py-2 px-5">
              Get A Quote
            </Link>
            <button onClick={() => setMobile(!mobileOpen)} aria-label="Menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
            >
              <form onSubmit={submitSearch} className="max-w-2xl mx-auto px-6 py-4">
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, fabrics, services..."
                  className="w-full bg-transparent text-white text-lg placeholder:text-white/25 outline-none border-b border-white/10 pb-2 focus:border-violet-500/60 transition-colors" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Mobile Full-Screen Menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center px-6 h-20 border-b border-white/5">
              <span className="font-syne font-black tracking-widest uppercase text-white">MULANG APPAREL</span>
              <button onClick={() => setMobile(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {NAV.map(({ href, label }, i) => (
                <motion.div key={href}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <Link href={href}
                    className={`block py-4 text-xl font-syne font-bold border-b border-white/5 transition-colors hover:text-violet-400 ${
                      pathname === href ? "text-violet-400" : "text-white"
                    }`}>
                    {label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile product categories */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-6">
                <p className="label mb-3">Product Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(({ label: c, slug }) => (
                    <Link key={c} href={`/products?cat=${slug}`}
                      className="py-2.5 px-3 border border-white/8 rounded-xl text-xs text-white/50 hover:text-white hover:border-violet-500/40 transition-all text-center">
                      {c}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </nav>

            <div className="px-6 pb-8 pt-4 border-t border-white/5 space-y-3">
              <Link href="/contact" className="btn-gradient w-full justify-center">Get A Quote</Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-[#25D366]/30 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/10 transition-colors">
                <MessageCircle size={14} /> WhatsApp: +86 159 8621 3212
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
