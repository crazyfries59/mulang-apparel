"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Send, FileText, MessageCircle,
  Ruler, Droplets, Sun, Wind, Wand2, Tag, Printer, Sparkles, Scissors, Shirt,
  Layers,
} from "lucide-react";
import { findProduct, catLabel, PRODUCTS } from "../data";

const badgeBg = (b: string) =>
  b === "Best Seller" ? "bg-red-500" : b === "New" ? "bg-violet-500" : "bg-emerald-500";

const parseSizes = (s?: string) =>
  (s ?? "S, M, L, XL, 2XL").split(/[,，]/).map(x => x.trim()).filter(Boolean);

/* ── Size chart (placeholder measurements derived from size run + garment type) ──
   The Hongyu catalog ships no numeric size table, so we generate an indicative one:
   values are anchored at size M and stepped per size. Real spec is confirmed on quote. */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const normSize = (s: string) =>
  s.toUpperCase().replace(/\s+/g, "").replace(/^XXXL$/, "3XL").replace(/^XXL$/, "2XL");
const sizeIndex = (s: string) => {
  const i = SIZE_ORDER.indexOf(normSize(s));
  return i >= 0 ? i : SIZE_ORDER.indexOf("M");
};
const round5 = (n: number) => Math.round(n * 2) / 2;

const CHART_SPEC = {
  top: [
    { key: "Length", base: 70, step: 2 },
    { key: "Chest", base: 104, step: 4 },
    { key: "Shoulder", base: 44, step: 1.5 },
    { key: "Sleeve", base: 23, step: 1 },
  ],
  bottom: [
    { key: "Waist", base: 76, step: 4 },
    { key: "Hip", base: 100, step: 4 },
    { key: "Length", base: 100, step: 1.5 },
    { key: "Inseam", base: 74, step: 1 },
  ],
};
const isBottom = (cat: string, sub: string) =>
  ["pants", "shorts", "denim"].includes(cat) || sub === "shorts";

/* Keep only tokens we can measure: letter sizes (XS..5XL) or numeric kids sizes (e.g. 120).
   Drops the marketing tails Hongyu bakes into intro.Size ("& Customize", accessory blurbs). */
const SIZE_TOKEN = /^(XXS|XS|S|M|L|XL|2XL|3XL|4XL|5XL)$/;
const cleanSizes = (raw: string[]) =>
  raw.map(normSize).filter(s => SIZE_TOKEN.test(s) || /^\d{2,3}$/.test(s));

/* Numeric kids sizes are heights (cm); scale each measurement as a ratio of that height. */
const KID_RATIO = [
  { key: "Length", r: 0.43 },
  { key: "Chest", r: 0.52 },
  { key: "Shoulder", r: 0.25 },
  { key: "Sleeve", r: 0.17 },
];

function buildSizeChart(sizes: string[], bottom: boolean) {
  const numeric = sizes.every(s => /^\d+$/.test(s));
  if (numeric) {
    return {
      cols: KID_RATIO.map(s => s.key),
      rows: sizes.map(sz => ({ size: sz, values: KID_RATIO.map(s => round5(Number(sz) * s.r)) })),
    };
  }
  const spec = bottom ? CHART_SPEC.bottom : CHART_SPEC.top;
  const mIdx = SIZE_ORDER.indexOf("M");
  return {
    cols: spec.map(s => s.key),
    rows: sizes.map(sz => ({
      size: sz,
      values: spec.map(s => round5(s.base + (sizeIndex(sz) - mIdx) * s.step)),
    })),
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const p = findProduct(slug);
  const [active, setActive] = useState(0);

  if (!p) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display-serif text-white text-3xl mb-3">Product not found</p>
        <p className="text-white/40 text-sm mb-6">This item may have been moved or renamed.</p>
        <Link href="/products" className="btn-gradient">Back to Products</Link>
      </section>
    );
  }

  const gallery = p.gallery?.length ? p.gallery : [p.img];
  const sizes = parseSizes(p.sizes);
  const intro = p.intro ?? {};
  const details = p.details ?? [];
  const related = PRODUCTS.filter(r => r.cat === p.cat && r.slug !== p.slug).slice(0, 4);
  const cleanedSizes = cleanSizes(sizes);
  const chart = cleanedSizes.length ? buildSizeChart(cleanedSizes, isBottom(p.cat, p.sub)) : null;

  // Introduction rows (mirrors Hongyu's per-product introduction block)
  const introRows: { label: string; value?: string }[] = [
    { label: "Feature",            value: intro.Feature },
    { label: "Size",               value: intro.Size || p.sizes || sizes.join(", ") },
    { label: "Material",           value: intro.Material || p.fabric },
    { label: "Weight",             value: intro.Weight || (p.gsm !== "—" ? p.gsm : undefined) },
    { label: "Blank",              value: intro.Blank || `MOQ ${p.moq} mix style, color and sizes.` },
    { label: "Logo customization", value: intro["Logo customization"] || `MOQ ${p.moq}, change private label, printing logo.` },
    { label: "Clothing customize", value: intro["Clothing Customize"] || "MOQ 100 pcs per style per color (4 sizes). Full cut & sew to your spec." },
  ].filter(r => r.value);

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="container max-w-[1180px] mx-auto">

        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-5 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/products?cat=${p.cat}`} className="hover:text-white transition-colors">{catLabel(p.cat)}</Link>
          <ChevronRight size={12} />
          <span className="text-white/55 truncate max-w-[40vw]">{p.name}</span>
        </nav>

        {/* title box */}
        <div className="border border-white/10 rounded-xl px-6 py-5 mb-8">
          <h1 className="font-display-serif text-white text-[clamp(1.3rem,2.4vw,2rem)] leading-tight">
            <span className="text-violet-400">{p.id}</span> {p.name}
          </h1>
        </div>

        {/* ── Gallery + Introduction ── */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="md:sticky md:top-28">
            <motion.div key={active}
              initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414]">
              <Image src={gallery[active]} alt={p.name} fill priority className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
              {p.gsm !== "—" && (
                <span className="absolute top-4 left-4 bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-md">{p.gsm}</span>
              )}
              {p.badge && (
                <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-md text-[0.6rem] font-bold uppercase tracking-wider text-white ${badgeBg(p.badge)}`}>{p.badge}</span>
              )}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {gallery.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${active === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
                  ))}
                </div>
              )}
            </motion.div>
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`relative w-[18%] aspect-square rounded-lg overflow-hidden bg-[#141414] transition-all ${active === i ? "ring-2 ring-violet-500" : "opacity-55 hover:opacity-100"}`}>
                    <Image src={g} alt={`${p.name} ${i + 1}`} fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Introduction card */}
          <div className="rounded-2xl border border-white/10 bg-[#0e0e10] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
              <div>
                <p className="label mb-2">Introduction</p>
                <p className="text-white/80 text-sm leading-relaxed">{p.id} {p.name}</p>
                <p className="text-white/35 text-xs mt-1">Price is for blank items only and does not include shipping.</p>
              </div>
              <p className="gradient-text font-display-serif text-3xl leading-none whitespace-nowrap">
                {p.price}<span className="text-xs text-white/30 font-sans ml-1">/ pc</span>
              </p>
            </div>

            <div className="space-y-3 py-5">
              {introRows.map(({ label, value }) => (
                <div key={label} className="text-sm leading-relaxed">
                  <span className="text-white font-semibold">{label}: </span>
                  <span className="text-white/55">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 py-4 border-y border-white/8 text-sm">
              <span><span className="text-violet-400 font-semibold">Weight</span> <span className="text-white/60 ml-1">{p.gsm}</span></span>
              <span><span className="text-violet-400 font-semibold">MOQ</span> <span className="text-white/60 ml-1">{p.moq}</span></span>
              <span><span className="text-violet-400 font-semibold">Lead</span> <span className="text-white/60 ml-1">{p.lead}</span></span>
            </div>

            <p className="text-white/45 text-sm mt-4 mb-6">
              Looking to produce your own?{" "}
              <Link href="/contact" className="text-violet-400 hover:text-violet-300 font-medium">{catLabel(p.cat)} manufacturer</Link>
              {" "}— low MOQ, full OEM / ODM.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-[0.67rem] font-bold tracking-wider uppercase rounded-full hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow">
                <Send size={14} /> Inquiry Now
              </Link>
              <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/8 border border-white/12 text-white text-[0.67rem] font-bold tracking-wider uppercase rounded-full hover:bg-white/14 transition-colors">
                <FileText size={14} /> Request Sample
              </Link>
              <a href={`https://wa.me/8615986213212?text=${encodeURIComponent(`Hi! I'm interested in ${p.name} (${p.id}). Can you send more details?`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white text-[0.67rem] font-bold tracking-wider uppercase rounded-full hover:opacity-90 transition-opacity">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── MULANG APPAREL banner ── */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent py-10 px-6 text-center">
          <p className="font-display-serif text-white text-3xl tracking-tight">
            MULANG <span className="gradient-text">APPAREL</span>
          </p>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2">Custom Clothing Manufacturer · Guangzhou, China</p>
          {gallery[1] && (
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/7] mt-7 rounded-xl overflow-hidden bg-[#141414]">
              <Image src={gallery[1]} alt={`${p.name} lineup`} fill className="object-cover" sizes="100vw" />
            </div>
          )}
        </div>

        {/* ── SIZE & SPECIFICATION ── */}
        <SectionHeader icon={<Ruler size={16} />} title="Size Information" />
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-white/10 bg-[#0e0e10] p-6 space-y-4">
            <SpecLine k="SKU" v={p.id} />
            <SpecLine k="Thickness" v={p.gsm} />
            <SpecLine k="Fabric" v={intro.Material || p.fabric} />
            <div>
              <p className="text-white font-semibold text-sm mb-2">Available Sizes</p>
              {cleanedSizes.length ? (
                <div className="flex flex-wrap gap-2">
                  {cleanedSizes.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 text-white/75 text-xs font-semibold">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-white/55 text-xs leading-relaxed">{intro.Size || "Custom sizing to your spec — adult & kids."}</p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0e0e10] p-6">
            <p className="text-white font-semibold text-sm mb-3">Washing Instructions</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Droplets size={16} />, t: "Machine wash cold" },
                { icon: <Sun size={16} />,      t: "Do not bleach" },
                { icon: <Wind size={16} />,     t: "Tumble dry low" },
                { icon: <Shirt size={16} />,    t: "Warm iron if needed" },
              ].map(w => (
                <div key={w.t} className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] border border-white/8 px-3 py-2.5">
                  <span className="text-violet-400">{w.icon}</span>
                  <span className="text-white/60 text-xs">{w.t}</span>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-xs mt-4 leading-relaxed">
              Manual measurements may vary by 1–3 cm. Detailed size chart (length / bust / shoulder / sleeve)
              is provided with your quotation.
            </p>
          </div>
        </div>

        {/* Numeric size chart (indicative, generated — hidden when no measurable sizes) */}
        {chart && (
          <div className="rounded-2xl border border-white/10 bg-[#0e0e10] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-2">
              <p className="text-white font-semibold text-sm">Size Chart</p>
              <p className="text-white/35 text-xs">Unit: cm · indicative — exact spec confirmed with your quotation</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[440px]">
                <thead>
                  <tr className="border-y border-white/8 text-white/45 text-xs uppercase tracking-wider">
                    <th className="text-left font-medium px-6 py-2.5">Size</th>
                    {chart.cols.map(c => (
                      <th key={c} className="text-right font-medium px-6 py-2.5">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((r, i) => (
                    <tr key={r.size} className={i % 2 ? "bg-white/[0.02]" : ""}>
                      <td className="px-6 py-2.5 text-violet-400 font-semibold">{r.size}</td>
                      {r.values.map((v, j) => (
                        <td key={j} className="px-6 py-2.5 text-right text-white/70">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CUSTOM PROCESS (MULANG branded, shared) ── */}
        <SectionHeader icon={<Wand2 size={16} />} title="Custom Process" />
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { n: "STEP 1", t: "Select color & size", d: "Choose from our stock colors and the size run you need." },
            { n: "STEP 2", t: "Provide artwork or logo", d: "Send your design, logo or tech pack — we advise on the best method." },
            { n: "STEP 3", t: "Confirm sample & produce", d: "Approve a pre-production sample, then we manufacture your order." },
          ].map(s => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-[#0e0e10] p-5">
              <p className="gradient-text font-display-serif text-xl mb-1">{s.n}</p>
              <p className="text-white font-semibold text-sm mb-1.5">{s.t}</p>
              <p className="text-white/45 text-xs leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 mb-6">
          {[
            { icon: <Tag size={13} />, t: "Private Label" },
            { icon: <Printer size={13} />, t: "Heat Transfer Print" },
            { icon: <Printer size={13} />, t: "Digital Print" },
            { icon: <Sparkles size={13} />, t: "Rhinestones" },
            { icon: <Sparkles size={13} />, t: "Flocking" },
            { icon: <Scissors size={13} />, t: "Embroidery" },
            { icon: <Scissors size={13} />, t: "3D Embroidery" },
          ].map(m => (
            <span key={m.t} className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/65 text-xs">
              <span className="text-violet-400">{m.icon}</span>{m.t}
            </span>
          ))}
        </div>

        {/* ── PRODUCT DETAIL (real detail strip — size chart, fabric, colors) ── */}
        <SectionHeader icon={<Shirt size={16} />} title="Product Detail" />
        {details.length > 0 ? (
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white mb-6">
            {details.map((src, i) => (
              <div key={i} className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic aspect ratio is unknown per-image, so next/image fill would require guessing dimensions and could distort the layout */}
                <img src={src} alt={`${p.name} detail ${i + 1}`} className="block w-full" loading="lazy" />
                {/* First panel: full-width MULANG band masks the brand title banner baked at the top */}
                {i === 0 && (
                  <div className="absolute top-0 left-0 right-0 h-[12%] min-h-[44px] bg-white flex items-center justify-center border-b border-black/5">
                    <span className="font-display-serif text-[#111] text-[clamp(1rem,3.2vw,1.9rem)] tracking-tight">
                      MULANG <span className="text-violet-600">APPAREL</span>
                    </span>
                  </div>
                )}
                {/* MULANG corner badge — sized to fully cover the brand watermark block (logo + text) at the top-right of each panel */}
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[26%] h-[6.5%] min-h-[40px] px-3 text-[0.7rem] sm:text-xs font-bold tracking-[0.2em] uppercase text-white bg-gradient-to-l from-violet-600 to-pink-500 rounded-bl-xl shadow z-10">
                  MULANG
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e10] mb-6">
            <div className="relative aspect-[16/9] bg-[#141414]">
              <Image src={gallery[gallery.length - 1] || p.img} alt={`${p.name} fabric`} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <p className="font-display-serif text-white text-[clamp(2.5rem,8vw,6rem)] leading-none drop-shadow-lg">{p.gsm}</p>
                <p className="text-white/85 text-sm tracking-[0.3em] uppercase mt-2">{intro.Material || p.fabric}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── FRONT AND BACK DISPLAY ── */}
        <SectionHeader icon={<Layers size={16} />} title="Front and Back Display" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
          {[
            { label: "Front", img: gallery[0] },
            { label: "Back", img: gallery[1] || gallery[gallery.length - 1] || gallery[0] },
          ].map(f => (
            <div key={f.label} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414] border border-white/10">
              <Image src={f.img} alt={`${p.name} ${f.label.toLowerCase()}`} fill className="object-cover" sizes="(max-width:640px) 50vw, 45vw" />
              <span className="absolute top-4 left-4 bg-black/85 text-white text-[0.6rem] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">{f.label}</span>
              <span className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-[0.6rem] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">
                <Printer size={11} /> Printing
              </span>
            </div>
          ))}
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <p className="label mb-6">More in {catLabel(p.cat)}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(r => (
                <Link key={r.slug} href={`/products/${r.slug}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#141414] mb-3">
                    <Image src={r.img} alt={r.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="25vw" />
                    {r.gsm !== "—" && (
                      <span className="absolute top-3 left-3 bg-black/85 text-white text-[0.6rem] font-bold px-2.5 py-1 rounded-md">{r.gsm}</span>
                    )}
                  </div>
                  <p className="text-violet-400 text-[0.7rem] font-mono mb-1">{r.id}</p>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white/85 text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">{r.name}</p>
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── small presentational helpers ── */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mt-14 mb-5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400">{icon}</span>
      <h2 className="font-display-serif text-white text-xl tracking-tight">{title}</h2>
      <span className="text-[0.6rem] tracking-[0.25em] text-white/25 uppercase ml-1">MULANG</span>
      <div className="flex-1 h-px bg-white/8 ml-2" />
    </div>
  );
}

function SpecLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/6 pb-2.5">
      <span className="text-white/45 text-xs uppercase tracking-wider">{k}</span>
      <span className="text-white/85 text-sm text-right">{v}</span>
    </div>
  );
}
