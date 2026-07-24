/* ─────────────────────────────────────────────────────────────────
   Mulang Apparel — catalog cloned 1:1 from Hongyu Apparel.
   Categories + products mirror hongyuapparel.com exactly.
   Product data lives in ./hongyu-products.json (241 products).
   Images: Hongyu Apparel (authorized).
   ───────────────────────────────────────────────────────────────── */

import raw from "./hongyu-products.json";

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const UPLOAD = "https://www.hongyuapparel.com/wp-content/uploads/";
// Percent-encode non-ASCII path chars (e.g. Chinese "主图") so next/image / HTTP headers stay valid.
const enc = (u: string) => u.replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c));
const fullUrl = (p: string) => enc(p.startsWith("http") ? p : UPLOAD + p);

/* ── Category taxonomy (identical to Hongyu) ────────────────────── */
export type Category = {
  slug: string;
  label: string;
  img: string;
  subs?: { label: string; slug: string }[];
};

const TREE: { slug: string; label: string; subs?: { label: string; slug: string }[] }[] = [
  {
    slug: "t-shirts", label: "T-Shirts",
    subs: [
      { label: "Oversized T-Shirt", slug: "oversized-t-shirt" },
      { label: "Vintage T-Shirt",   slug: "vintage-wash-t-shirt" },
      { label: "Polo",              slug: "polo" },
      { label: "Vest",              slug: "vest" },
      { label: "Long Sleeve",       slug: "long-sleeve" },
      { label: "Basic Fit",         slug: "basic-fit-t-shirt" },
    ],
  },
  {
    slug: "pants", label: "Pants",
    subs: [{ label: "Shorts", slug: "shorts" }],
  },
  {
    slug: "hoodies", label: "Hoodies",
    subs: [
      { label: "Fleece Hoodie", slug: "fleece-hoodie" },
      { label: "Terry Hoodie",  slug: "terry-hoodie" },
      { label: "Sweatshirt",    slug: "sweatshirt" },
      { label: "Zip Up Hoodie", slug: "zip-up-hoodie" },
    ],
  },
  { slug: "kids-wear",        label: "Kids Wear" },
  { slug: "outdoor-clothing", label: "Outdoor Clothing" },
  { slug: "denim",            label: "Denim" },
  { slug: "accessories",      label: "Accessories" },
  { slug: "sleepwear",        label: "Sleepwear" },
  { slug: "y2k-fashion",      label: "Y2K Fashion" },
  { slug: "shirt",            label: "Shirt" },
  { slug: "swimwear",         label: "Swimwear" },
  { slug: "dresses",          label: "Dresses" },
  { slug: "jersey",           label: "Jersey" },
  { slug: "sweater",          label: "Sweater" },
];

/* ── Product shape used across the UI ───────────────────────────── */
export type Intro = {
  Feature?: string; Size?: string; Material?: string; Weight?: string;
  Blank?: string; "Logo customization"?: string; "Clothing Customize"?: string;
};

export type Product = {
  id: string; name: string; cat: string; sub: string;
  gsm: string; price: string; moq: string; lead: string;
  fabric: string; badge: string; img: string; desc: string;
  sizes?: string; gallery: string[]; slug: string; intro: Intro;
  details: string[];
};

type RawProduct = {
  id: number; name: string; slug: string; price: string;
  top: string; sub: string; imgs: string[]; intro?: Intro; details?: string[];
};

/* derive display fields from the product name */
const extractId = (name: string) => {
  const m = name.match(/^#?\s*([A-Za-z0-9.\-]+)/);
  return m ? "#" + m[1].replace(/^#/, "") : "#—";
};
const extractGsm = (name: string) => {
  const m = name.match(/(\d{2,3})\s?gsm/i) || name.match(/(\d{2,3})\s?g\b/i);
  return m ? `${m[1]}GSM` : "—";
};
const FABRICS = ["Cotton", "Denim", "Fleece", "Terry", "Linen", "Polyester", "Knit", "Wool", "Sorona", "Hemp", "Nylon", "Pima", "Acrylic"];
const extractFabric = (name: string) => {
  const found = FABRICS.filter(f => new RegExp(f, "i").test(name));
  return found.length ? found.slice(0, 2).join(" / ") : "Custom Fabric";
};
const cleanName = (name: string) =>
  name.replace(/^#?\s*[A-Za-z0-9.\-]+\s*/, "").trim() || name;

/* Replace any Hongyu brand references in display text with Mulang (URLs are never passed here). */
const debrand = (s?: string) =>
  (s ?? "")
    .replace(/HONGYU/g, "MULANG")
    .replace(/Hongyu/g, "Mulang")
    .replace(/hongyu(?!apparel)/gi, "Mulang");

/* Trim marketing tail that bled into a parsed intro field (e.g. "100% Cotton MOQ: ... Don't like ..."). */
const trimField = (s?: string) =>
  debrand((s ?? "").split(/\s+(?:MOQ\s*:|Don['’]t\s+like|Don['’]t\s+Like|This\s+product\s+has)/i)[0].trim());

const cleanIntro = (intro: Intro): Intro => {
  const out: Intro = {};
  (Object.keys(intro) as (keyof Intro)[]).forEach(k => {
    const v = intro[k];
    if (v) out[k] = trimField(v);
  });
  return out;
};

const moqFor = (top: string) => (top === "accessories" ? "100 pcs" : "50 pcs");
const leadFor = (top: string) =>
  ["hoodies", "denim", "outdoor-clothing", "dresses"].includes(top) ? "21 days" : "14 days";

export const PRODUCTS: Product[] = (raw.products as RawProduct[]).map(p => {
  const imgs = (p.imgs.length ? p.imgs : []).map(fullUrl);
  const name = debrand(p.name.replace(/^#?\s*/, "").trim());
  const intro = cleanIntro((p.intro ?? {}) as Intro);
  // prefer the real Material / Weight from the scraped intro when present
  const fabric = intro.Material?.trim() || extractFabric(p.name);
  // GSM: product name is the most reliable (e.g. "275G"); intro Weight is a fallback
  let gsm = extractGsm(p.name);
  if (gsm === "—") {
    const m = intro.Weight?.match(/(\d{2,3})\s?gsm/i) || intro.Weight?.match(/(\d{2,3})\s?g\b/i);
    if (m) gsm = `${m[1]}GSM`;
  }
  return {
    id: extractId(p.name),
    name: debrand(cleanName(p.name)),
    cat: p.top,
    sub: p.sub || "",
    gsm,
    price: "$" + p.price,
    moq: moqFor(p.top),
    lead: leadFor(p.top),
    fabric,
    badge: "",
    img: imgs[0] || "",
    desc: intro.Feature?.trim() || name,
    sizes: intro.Size?.trim(),
    gallery: imgs.length ? imgs : [imgs[0] || ""],
    slug: p.slug,
    intro,
    details: (p.details ?? []).map(fullUrl),
  };
});

/* Build CATEGORIES with a representative image taken from the first product in each */
const firstImg = (slug: string) =>
  PRODUCTS.find(p => p.cat === slug || p.sub === slug)?.img || "";

export const CATEGORIES: Category[] = TREE.map(c => ({
  slug: c.slug,
  label: c.label,
  img: firstImg(c.slug),
  subs: c.subs,
}));

/* count helper for sidebar — matches top-level cat OR sub */
export const countFor = (slug: string) =>
  PRODUCTS.filter(p => p.cat === slug || p.sub === slug).length;

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);

const SUB_LABELS: Record<string, string> = {};
for (const c of TREE) for (const s of c.subs ?? []) SUB_LABELS[s.slug] = s.label;
export const catLabel = (slug: string) =>
  CATEGORIES.find(c => c.slug === slug)?.label ?? SUB_LABELS[slug] ?? slug;
