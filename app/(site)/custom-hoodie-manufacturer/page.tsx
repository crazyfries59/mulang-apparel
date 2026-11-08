import type { Metadata } from "next";
import CategoryLanding, { type LandingConfig } from "@/components/CategoryLanding";
import { getPublicProducts } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

const PAGE_PATH = "/custom-hoodie-manufacturer";
const TITLE = "Custom Hoodie Manufacturer in China | Blank Wholesale";
const DESCRIPTION =
  "Custom hoodies from 50 pcs: 300–500 gsm fleece and French terry, spray dye, acid wash, puff print, embroidery. Blank wholesale available. FOB Guangzhou.";

/** Real styles from the published catalogue, resolved by slug at request time. */
const FEATURED = [
  "2239-drop-shoulder-blank-sherpa-fleece-hoodie-unisex-300gsm",
  "custom-unisex-drop-shoulder-hoodies",
  "2522-fleece-360gsm-spray-dye-distressed-wash-hoodie",
  "23819-fleece-360gsm-spray-dye-distressed-wash-hoodie",
  "wm-460g-heavy-100cotton-terry-oversized-hoodie",
  "26330-heavy-500gsm-polar-fleece-boxy-fit-hoodie",
];

const config: LandingConfig = {
  eyebrow: "Custom hoodies · Heavyweight · Blank wholesale",
  h1: "Custom Hoodie Manufacturer",
  lead: "43 hoodie styles, from a 300 gsm lightweight terry up to a 500 gsm polar fleece boxy fit. Fleece, French terry, crewneck sweatshirts and zip-ups — cut to your fit, washed and printed in-house, from 50 pieces per style. Most of what makes a hoodie feel expensive happens after sewing: the wash, the drawcord, the rib on the cuff, the weight of the fleece. That is the part we control.",
  ctas: [
    { href: "/contact", label: "Request a quote" },
    { href: "/products?cat=hoodies", label: "Browse all 43 styles" },
  ],
  specs: [
    { label: "Styles in line", value: "43" },
    { label: "Fleece weight", value: "300–500 gsm" },
    { label: "Minimum order", value: "50 pcs" },
    { label: "Bulk lead time", value: "21 days" },
  ],
  intro: {
    title: "What a Custom Hoodie Manufacturer Should Do For You",
    paragraphs: [
      "A hoodie lives or dies on two numbers: the weight of the fleece and the depth of the hood. Everything else — print, patch, drawcord, label — is visible on top of that base. Get the base wrong and no amount of decoration saves it.",
      "Our stock line runs 300 to 500 gsm, and the middle band around 350–400 gsm is what most private label programmes order: heavy enough to hold a boxy shape, light enough to wear in autumn. Below 320 gsm it drapes and layers, above 450 gsm it stands off the body and reads as a statement piece.",
      "We produce fleece, French terry, crewneck sweatshirts and zip-ups from the same floor, so a capsule can share one fabric lot and stay colour-consistent across every silhouette.",
    ],
  },
  groups: [
    {
      title: "Fleece hoodies",
      body: "300–500 gsm, brushed inside, 14 styles. Covers lightweight summer fleece through heavy 500 gsm polar.",
      href: "/products?cat=fleece-hoodie",
    },
    {
      title: "French terry hoodies",
      body: "Loop-back rather than brushed, 12 styles, cooler to wear and better for garment dye.",
      href: "/products?cat=terry-hoodie",
    },
    {
      title: "Crewneck sweatshirts",
      body: "Same fabrics without the hood, 11 styles — the piece that carries a capsule.",
      href: "/products?cat=sweatshirt",
    },
    {
      title: "Zip-up hoodies",
      body: "Full-zip and half-zip, 6 styles, metal and nylon zips.",
      href: "/products?cat=zip-up-hoodie",
    },
    {
      title: "Washed & spray-dyed",
      body: "Spray dye, acid wash and distressed wash applied after sewing, so no two pieces match exactly.",
      href: "/products?cat=hoodies",
    },
    {
      title: "Blank wholesale hoodies",
      body: "Undecorated, mixed sizes and colours in one order, for printers and decorators who need blanks fast.",
      href: "/products?cat=hoodies",
    },
  ],
  weight: {
    title: "Weight and Hand Feel",
    note: "Send us a reference hoodie and we will match the fleece weight and the hand feel before quoting. Weight alone does not determine how a hoodie feels — brushing, yarn and wash all change it.",
    rows: [
      { weight: "300–320 gsm", fabric: "Lightweight fleece, loop-back terry", best: "Spring and autumn retail, warm climates, layering" },
      { weight: "350–400 gsm", fabric: "Mid-weight brushed fleece", best: "Core streetwear and most private label lines" },
      { weight: "420–450 gsm", fabric: "Heavy fleece, dense hand", best: "Premium heavyweight programmes" },
      { weight: "460–500 gsm", fabric: "Polar fleece, 100% cotton terry", best: "Ultra-heavyweight, boxy fit, statement pieces" },
    ],
    link: { href: "/fabrics", label: "See the fleece and terry we stock" },
  },
  finishing: {
    title: "Wash, Dye and Print",
    items: [
      { name: "Spray dye", body: "Colour sprayed by hand after sewing, so no two pieces match exactly." },
      { name: "Acid wash & distressed wash", body: "Surface abrasion plus wash for a worn hand and faded seams." },
      { name: "Sun fade & dip dye", body: "Gradient effects along the body and sleeves." },
      { name: "Puff print", body: "Raised, soft relief on graphics — the texture streetwear buyers ask for." },
      { name: "Embroidery & chenille patches", body: "Chest, sleeve and back placements, up to 12 threads." },
      { name: "Screen print", body: "Plastisol, water-based and discharge, up to 8 colours." },
    ],
    link: { href: "/technology", label: "How our wash and print lines work" },
  },
  programs: [
    {
      title: "Custom hoodie programme",
      body: "You supply a tech pack, reference hoodie or a stock style to modify. We handle pattern making, grading, fit revision, fabric sourcing, wash, print and bulk. Best when the fit and the finish are yours.",
      href: "/solutions",
      cta: "See cut & sew",
    },
    {
      title: "Blank & wholesale",
      body: "Undecorated hoodies in bulk, same fabric lot across the order so colour stays consistent between sizes. Mixed sizes and colours in one order. Best when your printer needs blanks or you are testing a market before committing to a custom fit.",
      href: "/products?cat=hoodies",
      cta: "View blank styles",
    },
  ],
  logisticsTitle: "MOQ, Sampling and Lead Time",
  logistics: [
    { label: "Minimum order", value: "50 pieces per style and colour, mixed sizes inside the 50." },
    { label: "Size range", value: "XS to 2XL on most styles, up to 4XL on request." },
    { label: "Sampling", value: "Sample from your tech pack or from a stock style, approved in writing before bulk starts." },
    { label: "Bulk lead time", value: "21 days for hoodies after sample approval. Wash and dye add time on top, and we confirm the schedule before you commit." },
    { label: "Trims", value: "Drawcords, eyelets, zips, woven labels and hang tags handled in-house." },
    { label: "Shipping", value: "FOB Guangzhou, or to a forwarder you nominate. Export documents prepared by us." },
  ],
  productsTitle: "Start From These Styles",
  productsNote: "Six of the 43 hoodies in production, spanning 300 gsm through 500 gsm. Any of them can change fabric, weight, hood construction, pocket and decoration.",
  productsLink: { href: "/products?cat=hoodies", label: "See all 43 hoodie styles" },
  faqHeading: "Custom Hoodie FAQ",
  faqs: [
    {
      q: "What is your minimum order for custom hoodies?",
      a: "50 pieces per style and colour, with mixed sizes allowed inside the 50.",
    },
    {
      q: "What is the heaviest hoodie you make?",
      a: "500 gsm polar fleece in a boxy fit. Our stock line runs 300–500 gsm, and the band around 350–400 gsm is what most brands order.",
    },
    {
      q: "Can you make a hoodie from my tech pack?",
      a: "Yes — tech pack, reference sample, or a stock style you want changed. Pattern making, grading and fit revision are part of the process.",
    },
    {
      q: "Do you sell blank hoodies without a logo?",
      a: "Yes. Blank wholesale is a separate programme from custom, using the same fabrics and the same 300–500 gsm weights.",
    },
    {
      q: "How do you get that faded, washed look?",
      a: "Garment dyeing, spray dye, acid wash and distressed wash, applied after sewing. That is why seams and hems take colour unevenly and each piece comes out slightly different.",
    },
    {
      q: "How long does hoodie production take?",
      a: "21 days after sample approval. Wash and dye add time on top of that, and we confirm the schedule before you commit.",
    },
    {
      q: "Can you match a colour from a photo?",
      a: "We can get close, and we will tell you when a photo is not enough. For an exact match, send a Pantone reference or a physical swatch.",
    },
    {
      q: "Do you ship outside China?",
      a: "FOB Guangzhou, or to a forwarder you nominate. We prepare the export documents.",
    },
  ],
  relatedTitle: "Keep Reading",
  related: [
    { href: "/blog/how-to-start-a-clothing-brand", label: "How to start a clothing brand" },
    { href: "/blog/how-to-find-a-clothing-manufacturer", label: "How to find a clothing manufacturer" },
    { href: "/blog/custom-streetwear-manufacturer-guide", label: "How to choose a custom streetwear manufacturer" },
    { href: "/t-shirt-manufacturer", label: "T-shirt manufacturer" },
    { href: "/custom-streetwear-manufacturer", label: "Custom streetwear manufacturer" },
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

export default async function CustomHoodieManufacturerPage() {
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
        { "@type": "ListItem", position: 2, name: "Custom Hoodie Manufacturer", item: `${SITE_URL}${PAGE_PATH}` },
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
