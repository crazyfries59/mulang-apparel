import type { Metadata } from "next";
import CategoryLanding, { type LandingConfig } from "@/components/CategoryLanding";
import { getPublicProducts } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

const PAGE_PATH = "/custom-streetwear-manufacturer";
const TITLE = "Custom Streetwear Manufacturer in China | OEM & ODM";
const DESCRIPTION =
  "Custom streetwear manufacturing from 50 pcs: 240–425 gsm tees, 300–500 gsm hoodies, acid wash, puff print and embroidery. OEM & ODM, FOB Guangzhou.";

/** Real streetwear styles from the published catalogue, resolved by slug. */
const FEATURED = [
  "s1708-thick-oversized-fashion-streetwear-t-shirt-305gsm",
  "2310ss-thick-305g-sleeveless-street-loose-vest-for-men",
  "bx8107-acid-wash-320g-ribbing-y2k-fit-vest-for-women",
  "w0175-heavy-weight-oversized-sweatshirt-cotton-terry-440gsm",
  "2531-thick-terry-450gsm-vintage-wash-distressed-hoodie",
  "yq292-streetwear-220gsm-baseball-shorts-set",
];

const config: LandingConfig = {
  eyebrow: "Streetwear OEM · Private label · Heavyweight",
  h1: "Custom Streetwear Manufacturer",
  lead: "A custom streetwear manufacturer does more than sew: the drop shoulder, the fleece weight, the wash and the print decide whether a piece reads as streetwear or as a blank with a logo on it. We are a streetwear factory in Guangzhou running 106 tee styles and 43 hoodie styles — 240 gsm boxy tees up to 500 gsm polar fleece, washed and decorated in-house. A private label streetwear run starts at 50 pieces per style; OEM and ODM programmes work from your tech pack.",
  ctas: [
    { href: "/contact", label: "Request a quote" },
    { href: "/products?cat=oversized-t-shirt", label: "Browse streetwear styles" },
  ],
  specs: [
    { label: "Tee & hoodie styles", value: "149" },
    { label: "Cotton weight", value: "240–500 gsm" },
    { label: "Minimum order", value: "50 pcs" },
    { label: "Bulk lead time", value: "14–21 days" },
  ],
  intro: {
    title: "What Makes a Streetwear Manufacturer Different",
    paragraphs: [
      "Streetwear is a proportion game played on heavy fabric. A custom streetwear manufacturer that only knows how to sew a standard fit will produce a garment that measures oversized and still looks wrong, because the shoulder drop, the chest-to-hem ratio and the body length have to move together. Those are pattern decisions, and they are made before a single metre of fabric is cut.",
      "The second difference is finishing. Acid wash, spray dye, snow wash, sun fade and distressed treatments are what give streetwear its surface, and every one of them changes the garment after sewing — including its final measurements. A streetwear factory that treats the wash as an afterthought will ship a bulk order that fits differently from the sample you approved.",
      "We run both steps in-house: pattern making and grading from your tech pack or from one of our 149 tee and hoodie styles, then decoration, wash and private label finishing on the same floor. That is what makes an OEM or ODM streetwear programme predictable rather than a series of surprises.",
    ],
  },
  groups: [
    {
      title: "Oversized & boxy tees",
      body: "240–425 gsm heavy cotton jersey, drop shoulder, wider chest and a shorter body. The base layer of most streetwear ranges.",
      href: "/products?cat=oversized-t-shirt",
    },
    {
      title: "Heavyweight hoodies",
      body: "300–500 gsm cotton terry, French terry and polar fleece with two-ply hoods and boxy bodies.",
      href: "/products?cat=hoodies",
    },
    {
      title: "Washed & garment-dyed",
      body: "Acid wash, spray dye, snow wash, sun fade and distressed finishes applied after sewing, so seams take colour unevenly — that is the point.",
      href: "/products?cat=vintage-wash-t-shirt",
    },
    {
      title: "Y2K & women's fits",
      body: "Ribbed crops, acid-wash vests and baby tees cut to the tighter streetwear silhouette rather than scaled down from menswear.",
      href: "/products?cat=y2k-fashion",
    },
    {
      title: "Zip-up & crewneck",
      body: "Zip hoodies and crewneck sweatshirts in the same fleece weights, for layering pieces in a drop.",
      href: "/products?cat=zip-up-hoodie",
    },
    {
      title: "Sets, shorts & jersey",
      body: "Baseball shorts sets, mesh jersey and 425 gsm street shorts — the bottoms that complete a capsule.",
      href: "/products?cat=shorts",
    },
  ],
  weight: {
    title: "Streetwear Fabric and Weight — What to Pick",
    note: "Send two reference garments and we will match the hand feel before you commit to a bulk weight. Weight tolerance is written into the order, not assumed.",
    rows: [
      { weight: "200–240 gsm", fabric: "Combed cotton jersey", best: "Summer streetwear, print-led drops" },
      { weight: "260–320 gsm", fabric: "Heavy jersey, 16s / 20s cotton", best: "Boxy tees, structured oversized fits" },
      { weight: "340–425 gsm", fabric: "Ultra-heavy cotton", best: "Drop shoulder, cropped body, no transparency" },
      { weight: "300–380 gsm", fabric: "Cotton terry / French terry", best: "Hoodies with a softer drape" },
      { weight: "400–500 gsm", fabric: "Heavy terry, polar fleece", best: "Boxy hoodies that hold their own shape" },
    ],
    link: { href: "/fabrics", label: "See the fabrics we stock" },
  },
  finishing: {
    title: "Streetwear Decoration and Finishing",
    items: [
      { name: "Screen print", body: "Plastisol, water-based and discharge, up to 8 colours per placement." },
      { name: "Puff & high-density print", body: "Raised graphics for heavyweight streetwear tees and hoodies." },
      { name: "Embroidery", body: "Chest marks, sleeve hits and 3D puff embroidery, up to 12 threads." },
      { name: "Patches & appliqué", body: "Woven and embroidered patches, stitched or heat-sealed over seams." },
      { name: "Garment dye & wash", body: "Acid wash, spray dye, snow wash, sun fade and distressed finishes." },
      { name: "Private label", body: "Woven neck labels, printed neck taps, hem tags and custom polybags." },
    ],
    link: { href: "/technology", label: "How our decoration lines work" },
  },
  programs: [
    {
      title: "OEM & ODM streetwear programme",
      body: "You supply a tech pack, sketch or reference sample. We handle pattern making, grading, fabric sourcing, sampling revision and bulk, then decorate and wash on the same floor. Best when the fit is yours and the wash is part of the design.",
      href: "/solutions",
      cta: "See cut & sew",
    },
    {
      title: "Private label streetwear",
      body: "You take one of our 149 tee and hoodie styles, change the fabric weight, colour and trims, and put your brand on it. Faster and cheaper than a full cut-and-sew programme, and it still ships as your product.",
      href: "/products?cat=hoodies",
      cta: "View styles",
    },
  ],
  logisticsTitle: "MOQ, Sampling and Lead Time",
  logistics: [
    { label: "Minimum order", value: "50 pieces per style and colour for private label and logo work. Full cut and sew starts at 100 pieces per style per colour." },
    { label: "Size range", value: "S to 4XL depending on the style. Grading is included, not charged per size." },
    { label: "Sampling", value: "Fit sample in the target weight, then the same sample after the intended wash, then decoration. Bulk starts only after written approval." },
    { label: "Bulk lead time", value: "14 days for t-shirts and 21 days for hoodies after sample approval. Garment dye and wash add process days." },
    { label: "Labels & packing", value: "Woven labels, printed neck taps, hem tags, care labels and polybags, all handled in-house." },
    { label: "Shipping", value: "FOB Guangzhou, or to a forwarder you nominate. We prepare export documents; duties and destination charges sit with you." },
  ],
  productsTitle: "Streetwear Styles We Already Run",
  productsNote: "Six of the 149 tees and hoodies currently in production, plus the Y2K and set styles built around them. Every one can change fabric, weight, fit, colour and decoration — they are a starting point, not a fixed menu.",
  productsLink: { href: "/products", label: "See all 241 styles" },
  faqHeading: "Custom Streetwear Manufacturing FAQ",
  faqs: [
    {
      q: "What is the minimum order for a custom streetwear manufacturer?",
      a: "50 pieces per style and colour for private label and logo work, with mixed sizes inside that 50. A full cut-and-sew streetwear programme starts at 100 pieces per style per colour across four sizes.",
    },
    {
      q: "Can you produce private label streetwear on your existing styles?",
      a: "Yes. Choose a tee or hoodie style, change the fabric weight, colour, fit and trims, and we add your woven labels, neck print, hem tags and packaging. This is the fastest route to a first streetwear drop.",
    },
    {
      q: "Do you work from a tech pack for OEM streetwear production?",
      a: "Yes. We work from tech packs, sketches, reference garments or measured photos. Pattern making and size grading are part of the job, not an add-on, and oversized patterns are graded on their own rules rather than scaled from a standard fit.",
    },
    {
      q: "What GSM should streetwear tees and hoodies be?",
      a: "Most streetwear tees sit between 240 and 320 gsm, with 340–425 gsm for ultra-heavy drop-shoulder cuts. Hoodies run 300–380 gsm for a softer drape and 400–500 gsm when the garment needs to hold a boxy shape on its own.",
    },
    {
      q: "Can you match an acid wash, snow wash or vintage wash finish?",
      a: "Yes. These are applied after sewing, so the seams, hems and ribbing take colour unevenly — that irregularity is the finish. Because the process shrinks the garment, the sample is approved after the wash, not before it.",
    },
    {
      q: "Which decoration works best on heavyweight streetwear?",
      a: "Puff and high-density screen print for large raised graphics on 300 gsm and above, flat plastisol for solid multi-colour artwork, and embroidery for small chest marks or logos that must survive industrial washing. The method follows the fabric weight, not the other way round.",
    },
    {
      q: "How long does a streetwear bulk order take?",
      a: "14 days for tees and 21 days for hoodies after sample approval. Garment dye, acid wash and distressed finishes add process time, and custom-knitted fabric is quoted per project.",
    },
    {
      q: "Do you ship custom streetwear to the US and Europe?",
      a: "We ship FOB Guangzhou or to a forwarder you nominate, and we prepare the export documents. Import duties and destination charges sit with you.",
    },
  ],
  relatedTitle: "Keep Reading",
  related: [
    { href: "/t-shirt-manufacturer", label: "T-shirt manufacturer in China" },
    { href: "/custom-hoodie-manufacturer", label: "Custom hoodie manufacturer" },
    { href: "/blog/custom-streetwear-manufacturer-guide", label: "How to choose a custom streetwear manufacturer" },
    { href: "/blog/heavyweight-t-shirt-manufacturer-guide", label: "Heavyweight t-shirt manufacturing" },
    { href: "/blog/oversized-hoodie-manufacturer-guide", label: "Oversized hoodie manufacturing" },
    { href: "/blog/streetwear-decoration-methods", label: "Streetwear decoration methods" },
  ],
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}` },
};

export default async function CustomStreetwearManufacturerPage() {
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
        { "@type": "ListItem", position: 2, name: "Custom Streetwear Manufacturer", item: `${SITE_URL}${PAGE_PATH}` },
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
