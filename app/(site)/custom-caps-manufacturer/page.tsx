import type { Metadata } from "next";
import CategoryLanding, { type LandingConfig } from "@/components/CategoryLanding";
import { getPublicProducts } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

const PAGE_PATH = "/custom-caps-manufacturer";
const TITLE = "Custom Caps Manufacturer in China | Hats & Beanies";
const DESCRIPTION =
  "Custom caps from 50 pcs: 6-panel baseball caps, snapbacks, bucket hats and beanies. 3D puff embroidery, woven patches and private label. FOB Guangzhou.";

/** The four headwear blocks we actually run, resolved by slug. */
const FEATURED = [
  "custom-baseball-cap-manufacturer",
  "custom-snapback-manufacturer",
  "custom-bucket-hat-manufacturer",
  "custom-beanie-manufacturer",
];

const config: LandingConfig = {
  eyebrow: "Headwear OEM · Private label · Embroidery",
  h1: "Custom Caps Manufacturer",
  lead: "A cap is the cheapest item in a drop and the fastest way for a brand to be seen on a street, so buyers judge caps harder than tees. We make headwear in Guangzhou on the same floor as our knitwear: 6-panel baseball caps, flat-brim snapbacks, bucket hats and knit beanies, decorated with 3D puff embroidery, flat embroidery, woven patches or screen print. Private label runs start at 50 pieces per style in mixed sizes, adult and kids, and OEM programmes work from your tech pack or a sample you post us.",
  ctas: [
    { href: "/contact", label: "Request a cap quote" },
    { href: "/products?cat=accessories", label: "Browse headwear styles" },
  ],
  specs: [
    { label: "Headwear blocks", value: "4" },
    { label: "Minimum order", value: "50 pcs" },
    { label: "Bulk lead time", value: "14–21 days" },
    { label: "Main decoration", value: "3D puff embroidery" },
  ],
  intro: {
    title: "What a Cap Manufacturer Has to Get Right",
    paragraphs: [
      "A cap looks like a simple product and behaves like a precise one. Six panels have to meet at a point that sits on the crown instead of twisting to one side, the front panel needs enough body to carry a 3D embroidery without the crown collapsing, and the sweatband has to hold the finished circumference after the fabric has been washed and the embroidery has pulled it in. Those are pattern and construction decisions, and they are made before the first cut, not fixed at the end of the line.",
      "The second thing buyers underestimate is how much the decoration changes the garment. Puff embroidery adds height and weight to a front panel that was graded flat; a leather patch sewn across a seam changes how the brim sits; a metal eyelet or a heavier buckle turns a light cap into one that reads premium or cheap depending on the trims, not the fabric. On a cap the logo is 40% of the product, so decoration and construction cannot be quoted as separate line items.",
      "We run headwear next to our jersey and fleece lines, which is why we can hold one standard across a mixed drop: the same embroidery threads, the same woven label supplier, the same packing spec as the tees and hoodies in the same order. That matters when a brand ships caps as an add-on — the headwear has to look like it came out of the same factory as the garment it sits beside.",
    ],
  },
  groups: [
    {
      title: "6-panel baseball caps",
      body: "Structured or unstructured, curved brim, cotton twill or brushed cotton, with a plastic snap, metal buckle or strapback closure. The workhorse of promo and retail ranges.",
      href: "/products/custom-baseball-cap-manufacturer",
    },
    {
      title: "Flat-brim snapbacks",
      body: "Wider flat brim, higher crown and a plastic snapback closure. Built for large front embroidery and flat-stitch blocks, and the shape most streetwear capsules open with.",
      href: "/products/custom-snapback-manufacturer",
    },
    {
      title: "Bucket hats",
      body: "Short or wide downturned brim in cotton, canvas or pigment-dyed fabric. Reversible and packable versions are made by dropping the interlining on one side.",
      href: "/products/custom-bucket-hat-manufacturer",
    },
    {
      title: "Knit beanies",
      body: "Rib-knit or cable-knit cuffs in acrylic and wool blends, with woven labels, leather tabs or cuff embroidery. Cuff length and stretch are specified, not assumed.",
      href: "/products/custom-beanie-manufacturer",
    },
    {
      title: "Dad caps & 5-panel",
      body: "Soft, unstructured, low-profile. Usually garment washed for a worn hand feel, with a fabric strap and metal slider instead of plastic snaps.",
      href: "/products?cat=accessories",
    },
    {
      title: "Trims & hardware",
      body: "Woven and leather patches, metal eyelets, custom buckles, drawcords and interior taping — the parts that separate a retail cap from a giveaway.",
      href: "/labels-tags-packaging",
    },
  ],
  weight: {
    title: "Cap Fabric and Structure — What to Pick",
    note: "Send a cap you already sell and we will match the hand feel, the crown height and the brim stiffness before sampling. Crown height and brim curve are written into the spec sheet, not left to the sample room.",
    rows: [
      { weight: "240–280 gsm", fabric: "Cotton twill, 6-panel structured", best: "Retail caps that must keep their shape" },
      { weight: "300–340 gsm", fabric: "Heavy brushed cotton twill", best: "Premium fronts with 3D puff embroidery" },
      { weight: "180–220 gsm", fabric: "Lightweight cotton, 5-panel", best: "Camp caps, summer and promo drops" },
      { weight: "280–320 gsm", fabric: "Pigment-dyed canvas, unstructured", best: "Washed, worn-in dad caps" },
      { weight: "Acrylic / wool blend", fabric: "Rib knit, single or double cuff", best: "Beanies and winter headwear" },
    ],
    link: { href: "/fabrics", label: "See the fabrics we stock" },
  },
  finishing: {
    title: "Cap Decoration and Finishing",
    items: [
      { name: "3D puff embroidery", body: "Raised foam-underlay embroidery for front panels, up to 12 threads. Adds height, so the panel is graded for it." },
      { name: "Flat embroidery", body: "Crisp flat-stitch marks for side panels, back arches and cuffs, where puff would distort the shape." },
      { name: "Screen print", body: "Plastisol and water-based print for large all-over graphics, usually on unstructured or 5-panel bodies." },
      { name: "Woven & leather patches", body: "Woven labels, laser-cut leather and suede patches, stitched flat or over a seam." },
      { name: "Metal trims & eyelets", body: "Brass eyelets, metal buckles, custom snaps and interior taping for a retail finish." },
      { name: "Private label", body: "Woven interior labels, size tags, hangtags and polybags matched to the rest of the drop." },
    ],
    link: { href: "/technology", label: "How our decoration lines work" },
  },
  programs: [
    {
      title: "Private label caps on our blocks",
      body: "Take one of our four headwear blocks, change the fabric, colour, brim and trims, and put your embroidery and labels on it. Fastest and cheapest route to a first headwear run, and it still ships as your product.",
      href: "/products?cat=accessories",
      cta: "View headwear blocks",
    },
    {
      title: "OEM & ODM headwear from your tech pack",
      body: "You send a tech pack, a sketch or a cap you want matched. We handle the pattern, the crown and brim spec, sampling rounds and bulk, then decorate in-house. Best when the shape is yours.",
      href: "/solutions",
      cta: "See cut & sew",
    },
  ],
  logisticsTitle: "MOQ, Sampling and Lead Time",
  logistics: [
    {
      label: "Minimum order",
      value: "50 pieces per style and colour, with mixed sizes inside that 50 and adult and kids sizes in the same run.",
    },
    {
      label: "Sampling",
      value: "A pre-production sample in the target fabric and decoration, then a second round only if the crown or brim needs correction. Bulk starts after written approval.",
    },
    {
      label: "Bulk lead time",
      value: "14–21 days after sample approval, depending on embroidery coverage and how many trims are custom-made.",
    },
    {
      label: "Fabric & colour",
      value: "Cotton twill, brushed cotton, canvas, polyester and acrylic, in stock colours or dyed to a Pantone reference.",
    },
    {
      label: "Labels & packing",
      value: "Woven interior labels, size tags, hangtags and polybags, handled in-house and matched to the rest of the order.",
      link: { href: "/labels-tags-packaging", label: "Custom labels and packaging" },
    },
    {
      label: "Shipping",
      value: "FOB Guangzhou, or to a forwarder you nominate. We prepare the export documents; duties and destination charges sit with you.",
      link: { href: "/global-shipping", label: "Apparel shipping from China" },
    },
  ],
  productsTitle: "Headwear We Already Produce",
  productsNote: "The four blocks currently in production. Each one can change fabric, crown height, brim shape, closure and decoration — they are a starting point, not a fixed menu.",
  productsLink: { href: "/products?cat=accessories", label: "See all headwear styles" },
  faqHeading: "Custom Cap Manufacturing FAQ",
  faqs: [
    {
      q: "What is the minimum order for custom caps?",
      a: "50 pieces per style and colour, with mixed sizes allowed inside that 50. Adult and kids sizes can be combined in the same run, so a first headwear order does not have to be one size curve.",
    },
    {
      q: "How much does a custom cap cost?",
      a: "The price is driven by the block, the fabric and the stitch count rather than by the cap type alone. A 6-panel cotton twill cap with a one-colour front mark sits at the bottom of the range; a heavy brushed twill snapback with 3D puff embroidery across the front, a woven side patch and metal eyelets sits at the top. Send the artwork and we quote against a real spec.",
    },
    {
      q: "Can you match a cap sample I already have?",
      a: "Yes. Post us the cap or send clear photos with measurements — crown height, brim length and curve, panel count, closure type and sweatband width. We match the shape first, then the fabric hand feel, then the decoration.",
    },
    {
      q: "Which decoration is best for caps?",
      a: "3D puff embroidery for front panels that need to read from a distance, flat embroidery for side and back marks where puff would distort the panel, screen print for large all-over graphics, and woven or leather patches when the design needs a hard edge. The method follows the panel, not the artwork.",
    },
    {
      q: "How long does a cap order take?",
      a: "14–21 days after sample approval for most embroidered orders. Custom metal trims, dyed-to-match fabric and high stitch counts add process days, and those are quoted per style rather than assumed.",
    },
    {
      q: "Do you make caps to match a t-shirt or hoodie order?",
      a: "Yes, and this is where most headwear orders come from. The embroidery threads, woven labels, hangtags and polybags are specified together with the garments so the cap looks like part of the same drop rather than an afterthought.",
    },
    {
      q: "Can caps be made in kids sizes?",
      a: "Yes. Adult and kids sizes are graded on the same block, and the closure is adjusted for the smaller circumference rather than simply scaled down.",
    },
    {
      q: "Do you ship custom caps to the US and Europe?",
      a: "We ship FOB Guangzhou or to a forwarder you nominate, and we prepare the export documents. Import duties and destination charges sit with you.",
    },
  ],
  relatedTitle: "Keep Reading",
  related: [
    { href: "/products/custom-baseball-cap-manufacturer", label: "Custom baseball cap manufacturing" },
    { href: "/products/custom-snapback-manufacturer", label: "Custom snapback manufacturing" },
    { href: "/products/custom-bucket-hat-manufacturer", label: "Custom bucket hat manufacturing" },
    { href: "/products/custom-beanie-manufacturer", label: "Custom beanie manufacturing" },
    { href: "/t-shirt-manufacturer", label: "T-shirt manufacturer in China" },
    { href: "/custom-streetwear-manufacturer", label: "Custom streetwear manufacturer" },
  ],
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}` },
};

export default async function CustomCapsManufacturerPage() {
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
        { "@type": "ListItem", position: 2, name: "Custom Caps Manufacturer", item: `${SITE_URL}${PAGE_PATH}` },
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
