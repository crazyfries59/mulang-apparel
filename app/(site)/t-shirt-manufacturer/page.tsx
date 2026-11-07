import type { Metadata } from "next";
import CategoryLanding, { type LandingConfig } from "@/components/CategoryLanding";
import { getPublicProducts } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

const PAGE_PATH = "/t-shirt-manufacturer";
const TITLE = "T-Shirt Manufacturer in China | Custom & Blank Tees";
const DESCRIPTION =
  "Custom and blank t-shirt manufacturing from 50 pcs. 145–425 gsm cotton, screen print, DTG, embroidery and garment dye. FOB Guangzhou.";

/** Six real styles from the published catalogue — no hard-coded copy, so a rename cannot break the page. */
const FEATURED = [
  "8039s25-golden-pima-cotton-145gsm-oversized-t-shirt",
  "2503-hand-dyed-linen-cotton-cooling-oversized-t-shirt",
  "339-heavy-425-gsm-16s-100-cotton-oversized-t-shirt",
  "s1722-extra-thick-drop-shoulder-oversize-t-shirt-425gsm",
  "w0186-heavy-weight-cotton-425gsm-long-sleeve-t-shirt",
  "s920-quick-dry-100-polyester-side-slit-polo-shirt",
];

const config: LandingConfig = {
  eyebrow: "Cut & sew · Private label · Blank wholesale",
  h1: "T-Shirt Manufacturer in China",
  lead: "We make tees for brands that need them to feel expensive. That means 145 gsm combed cotton basics through to 425 gsm heavyweight oversized cuts, garment-dyed and vintage-washed in-house, cut and sewn to your fit rather than ours. 106 styles are already in our line — bring a tech pack and we build from it, or start with one of those styles and change the fabric, the fit and the finish.",
  ctas: [
    { href: "/contact", label: "Request a quote" },
    { href: "/products?cat=t-shirts", label: "Browse all 106 styles" },
  ],
  specs: [
    { label: "Styles in line", value: "106" },
    { label: "Cotton weight", value: "145–425 gsm" },
    { label: "Minimum order", value: "50 pcs" },
    { label: "Bulk lead time", value: "14 days" },
  ],
  intro: {
    title: "What a T-Shirt Manufacturer Should Do For You",
    paragraphs: [
      "Most factories will sew whatever you send them. The part that decides whether a tee sells is upstream of that: which cotton, which weight, which shoulder seam, and whether the print survives twenty washes without cracking. Those decisions are cheap to make at the sampling stage and expensive to fix after bulk.",
      "So we start with the fabric and the fit, then the decoration. If you already have a tech pack, we work from it and flag anything that will not hold up in production. If you have a reference garment instead, we match the hand feel before quoting a weight — a 240 gsm tee from one mill is not the same garment as 240 gsm from another.",
      "Everything below is from our own production line, not a reseller catalogue. The weights, minimums and lead times are what we actually run.",
    ],
  },
  groups: [
    {
      title: "Oversized & boxy tees",
      body: "Drop-shoulder construction, 240–425 gsm, wider chest and a shorter body. Our largest group at 41 styles.",
      href: "/products?cat=oversized-t-shirt",
    },
    {
      title: "Vintage wash & garment dye",
      body: "Acid wash, sun fade, hand dye and spray effects applied after sewing, so seams and hems take colour unevenly — that is the point.",
      href: "/products?cat=vintage-wash-t-shirt",
    },
    {
      title: "Polos",
      body: "Piqué and jersey polos, including side-slit and faux-layered collar constructions, 20 styles.",
      href: "/products?cat=polo",
    },
    {
      title: "Long sleeve",
      body: "190–425 gsm, plain and heavy, for winter retail and layering programmes.",
      href: "/products?cat=long-sleeve",
    },
    {
      title: "Vests & tanks",
      body: "Ribbed and jersey, 12 styles, for gym and summer capsules.",
      href: "/products?cat=vest",
    },
    {
      title: "Basic fit",
      body: "The core crew neck: 180–220 gsm combed cotton, tighter size grading, made to sit on the body rather than over it.",
      href: "/products?cat=basic-fit-t-shirt",
    },
  ],
  weight: {
    title: "Fabric and Weight — What to Pick",
    note: "Not sure which weight sells in your market? Send us two reference garments and we will match the hand feel before you commit to a bulk weight.",
    rows: [
      { weight: "145–180 gsm", fabric: "Combed cotton jersey, 100% cotton", best: "Summer retail, promo runs, undershirts" },
      { weight: "190–220 gsm", fabric: "Combed cotton, cotton/poly blends", best: "The core retail tee — holds print, holds shape" },
      { weight: "230–260 gsm", fabric: "Heavy jersey", best: "Premium streetwear, boxy fits, no transparency" },
      { weight: "270–320 gsm", fabric: "Heavy cotton, brushed finish", best: "Structured oversized, keeps its shoulder line" },
      { weight: "340–425 gsm", fabric: "16s / 20s heavy cotton", best: "Ultra-heavyweight, drop shoulder, boxy body" },
    ],
    link: { href: "/fabrics", label: "See the fabrics we stock" },
  },
  finishing: {
    title: "Decoration and Finishing",
    items: [
      { name: "Screen print", body: "Plastisol, water-based and discharge, up to 8 colours per placement." },
      { name: "DTG", body: "Small runs and photographic artwork, no screen setup cost." },
      { name: "Embroidery", body: "Chest logos, sleeve hits, up to 12 threads." },
      { name: "Puff & high-density print", body: "Raised relief for streetwear graphics." },
      { name: "Garment dye, acid wash, sun fade", body: "Applied after sewing, so trims and seams read vintage." },
      { name: "Appliqué & labels", body: "Patches, woven neck labels, hem tags and side seams." },
    ],
    link: { href: "/technology", label: "How our decoration lines work" },
  },
  programs: [
    {
      title: "Custom program",
      body: "You supply a tech pack, sketch or reference sample. We handle pattern making, grading, fabric sourcing, sampling revision and bulk. Best when the fit is yours and the print is part of the design.",
      href: "/solutions",
      cta: "See cut & sew",
    },
    {
      title: "Blank wholesale",
      body: "You take our stock tees undecorated and decorate them yourself or through your printer. Same fabric lot, same size grading, mixed sizes and colours in one order. Best when speed matters more than a proprietary fit.",
      href: "/products?cat=t-shirts",
      cta: "View blank styles",
    },
  ],
  logisticsTitle: "MOQ, Sampling and Lead Time",
  logistics: [
    { label: "Minimum order", value: "50 pieces per style and colour. Mixed sizes within a style are fine." },
    { label: "Size range", value: "S to 4XL depending on the style. Grading is included, not charged per size." },
    { label: "Sampling", value: "We build a sample from your tech pack or from a stock style, and bulk does not start until you approve it in writing." },
    { label: "Bulk lead time", value: "14 days for t-shirts after sample approval. Fabric that has to be specially knitted or dyed adds time." },
    { label: "Labels & packing", value: "Woven labels, printed neck labels, hang tags, care labels and polybags, all handled in-house." },
    { label: "Shipping", value: "FOB Guangzhou, or to a forwarder you nominate. We prepare export documents; duties and destination charges sit with you." },
  ],
  productsTitle: "Start From These Styles",
  productsNote: "Six of the 106 tees currently in production. Every one can change fabric, weight, fit, colour and decoration — they are a starting point, not a fixed menu.",
  productsLink: { href: "/products?cat=t-shirts", label: "See all 106 t-shirt styles" },
  faqHeading: "T-Shirt Manufacturing FAQ",
  faqs: [
    {
      q: "What is your minimum order for custom t-shirts?",
      a: "50 pieces per style and colour. You can mix sizes inside that 50, and you can mix colours if each colourway still reaches 50.",
    },
    {
      q: "Can you make t-shirts from my tech pack?",
      a: "Yes. We work from tech packs, sketches, reference samples or a photo set with measurements. Pattern making and size grading are part of the job, not an add-on.",
    },
    {
      q: "Do you supply blank t-shirts as well as decorated ones?",
      a: "Both. Blank wholesale ships undecorated for your own printer; the custom programme includes decoration before packing.",
    },
    {
      q: "What is the heaviest cotton you produce?",
      a: "425 gsm is the top of our stock line — 16s and 20s cotton, drop shoulder, boxy body. Heavier than that is possible on request, but it stops behaving like a t-shirt.",
    },
    {
      q: "How long does bulk production take?",
      a: "14 days for t-shirts after you approve the sample. That excludes fabric that has to be specially knitted or dyed.",
    },
    {
      q: "Can you match a Pantone colour?",
      a: "Yes, for screen print and for garment dyeing. Send the Pantone reference with the order and we will confirm the match on the sample.",
    },
    {
      q: "Do you handle labels, hang tags and packaging?",
      a: "Yes — woven and printed neck labels, hang tags, care labels and polybags. Retail-ready packing is available if you tell us the requirement up front.",
    },
    {
      q: "Can you ship to the US or Europe?",
      a: "We ship FOB Guangzhou, or to a forwarder you nominate. We prepare the export documents; import duties and destination charges sit with you.",
    },
  ],
  relatedTitle: "Keep Reading",
  related: [
    { href: "/blog/how-to-start-a-clothing-brand", label: "How to start a clothing brand" },
    { href: "/blog/how-to-find-a-clothing-manufacturer", label: "How to find a clothing manufacturer" },
    { href: "/blog/custom-streetwear-manufacturer-guide", label: "How to choose a custom streetwear manufacturer" },
    { href: "/custom-hoodie-manufacturer", label: "Custom hoodie manufacturer" },
    { href: "/manufacturing", label: "Our production process" },
    { href: "/solutions", label: "All manufacturing solutions" },
  ],
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}` },
};

export default async function TShirtManufacturerPage() {
  const all = await getPublicProducts();
  const products = FEATURED.map((slug) => all.find((product) => product.slug === slug)).filter(
    (product) => product !== undefined,
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "T-Shirt Manufacturer", item: `${SITE_URL}${PAGE_PATH}` },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryLanding config={config} products={products} />
    </>
  );
}
