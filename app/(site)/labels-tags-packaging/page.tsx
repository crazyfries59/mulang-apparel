import type { Metadata } from "next";
import Link from "next/link";
import { Check, FileText, Palette, PackageCheck, Scissors, Tag, Package, type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { ServiceHero, ServiceCTA, ServiceFAQ, ServiceStructuredData } from "@/components/services/ServicePage";
import { PackagingHeroPhoto, PackagingVisual } from "./BrandArtwork";

const TITLE = "Custom Clothing Labels & Packaging";
const DESCRIPTION = "Add woven neck labels, care labels, custom hang tags and branded packaging to your private label clothing order. Review options with Mulang Apparel.";
const SHARE_IMAGE = {
  url: "/images/services/packaging/retail-apparel-packaging-box.webp",
  width: 1100,
  height: 857,
  alt: "Folded knitwear in a cardboard apparel packaging box",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/labels-tags-packaging" },
  openGraph: { title: `${TITLE} | Mulang Apparel`, description: DESCRIPTION, url: "/labels-tags-packaging", type: "website", images: [SHARE_IMAGE] },
  twitter: { title: `${TITLE} | Mulang Apparel`, description: DESCRIPTION, images: [SHARE_IMAGE] },
};

type PackagingItem = {
  id: string;
  kind: ComponentProps<typeof PackagingVisual>["kind"];
  title: string;
  description: string;
  details: string[];
  ordering?: { label: string; value: string }[];
};

const GROUPS: {
  id: string;
  name: string;
  icon: LucideIcon;
  heading: string;
  intro: string;
  items: PackagingItem[];
}[] = [
  {
    id: "labels-and-tags", name: "Labels & Tags", icon: Tag,
    heading: "Custom Garment Labels & Hang Tags",
    intro: "Choose the neck labels, wash care labels and hang tags you want on your collection. Share your artwork, preferred placement and garment details so each trim fits the piece.",
    items: [
      {
        id: "woven-labels",
        kind: "woven",
        title: "Main Brand Labels",
        description: "A woven main label brings your brand name into the garment itself. Consider how the design reads at its finished size and how the label sits against the fabric.",
        details: ["Logo, lettering and colors", "Finished dimensions and fold", "Neck, seam or hem placement"],
        ordering: [
          { label: "Minimum order for custom main labels", value: "1,000 pieces" },
          { label: "Black and white", value: "USD 0.10 each" },
          { label: "Color", value: "USD 0.15 each" },
        ],
      },
      { id: "printed-labels", kind: "printed", title: "Printed & Heat-Transfer Labels", description: "Printed labels and neck transfers offer another way to carry your branding. The garment fabric, artwork and placement help determine a suitable application.", details: ["Print-ready logo and colors", "Label or direct neck transfer", "Position and finished print size"] },
      {
        id: "care-and-size",
        kind: "care",
        title: "Care & Size Labels",
        description: "Keep size, fabric composition and care information clear. Supply the wording and language required for your market, together with the details of the garment.",
        details: ["Size range and label position", "Confirmed composition and care text", "Destination-market requirements"],
        ordering: [
          { label: "Paper care labels", value: "Included at no extra charge" },
          { label: "Care labels in other materials", value: "USD 30 for 300 pieces" },
        ],
      },
      {
        id: "hang-tags",
        kind: "tag",
        title: "Custom Hang Tags",
        description: "Introduce your collection before the garment is worn. Coordinate the hang tag with your labels, packaging and brand artwork for a considered first impression.",
        details: ["Shape, dimensions and artwork", "Front and back information", "Attachment and placement"],
        ordering: [{ label: "Custom hang tags", value: "USD 100 for 1,000 pieces" }],
      },
    ],
  },
  {
    id: "brand-details", name: "Brand Details", icon: Scissors,
    heading: "A Signature in the Details.",
    intro: "Carry the identity beyond the neck label. Tell us how you want the logo to look and feel, and where it belongs on your garment.",
    items: [
      { id: "logo-patches", kind: "patch", title: "Logo Patches & Brand Trims", description: "Explore embroidered, silicone or woven branding for a visible finishing detail. Share a reference and the garment construction to discuss the right approach for your design.", details: ["Artwork and intended finish", "Patch dimensions and colors", "Placement and attachment details"] },
    ],
  },
  {
    id: "packaging", name: "Packaging", icon: Package,
    heading: "Branded Packaging for Clothing Orders",
    intro: "Choose branded garment bags, tissue paper or retail boxes alongside your apparel order. Confirm the folded garment size and packing instructions early so the packaging fits your collection.",
    items: [
      {
        id: "garment-bags",
        kind: "bag",
        title: "Branded Garment Bags",
        description: "Individual garment bags can keep your collection organized and carry your brand identity. Plan the bag around the folded product and the information you need to display.",
        details: ["Bag dimensions and closure", "Logo layout and print colors", "Size or product identification"],
        ordering: [{ label: "Custom polybags", value: "USD 150 for 1,000 pieces" }],
      },
      { id: "tissue-paper", kind: "tissue", title: "Tissue Paper & Wrapping", description: "Use tissue as a finishing layer around your garments. Coordinate the color and artwork with the rest of your packaging, and explain how you want each piece wrapped.", details: ["Plain or branded artwork", "Sheet size and color direction", "Wrapping and packing reference"] },
      { id: "retail-boxes", kind: "box", title: "Retail & Gift Boxes", description: "A branded box brings the garment and its presentation together. Share the folded product dimensions, contents and intended use so the packaging can be discussed as part of your order.", details: ["Box dimensions and structure", "Exterior and interior artwork", "Contents and packing arrangement"] },
    ],
  },
];

const PROCESS = [
  { icon: FileText, title: "Share Your Brief", text: "Send your logo, reference images, garment styles and order quantities. Include any existing label or packaging guidelines." },
  { icon: Palette, title: "Define the Details", text: "Discuss materials, dimensions, colors, placement and packing. Confirm the trim quantities, costs and timing in your quote." },
  { icon: Scissors, title: "Agree the Sample", text: "Specify the artwork or physical sample review you need. Check the finish and placement in the context of the garment before approving the specification." },
  { icon: PackageCheck, title: "Confirm for Production", text: "Approve the agreed details and packing instructions. Keep the approved specification as the reference for your clothing order." },
];

const FAQ = [
  { question: "Can I add custom labels and hang tags to my clothing order?", answer: "Yes. Mulang Apparel offers woven and printed neck labels, neck transfers, hang tags and branded packaging for private label clothing orders. Share your garment styles, logo and preferred placements so we can discuss what fits your collection." },
  { question: "What should I send for a custom labels and packaging quote?", answer: "Send your garment styles and quantities, logo or artwork, trim dimensions, colors and reference images. A vector file is helpful if available. For care labels, include the confirmed garment composition and the wording or language you require." },
  { question: "Do labels and packaging use the same MOQ as the garments?", answer: "Custom main labels have their own minimum order quantity of 1,000 pieces. Confirm quantities for other trims and packaging separately in your garment quote." },
  { question: "Can I review the design before production?", answer: "Discuss the review needed for your order: artwork layout, a physical trim sample or a garment sample with the branding applied. The sampling arrangements, cost and timing should be confirmed before you approve production." },
  { question: "Will my sample include my custom main label?", answer: "We generally do not add custom main labels during the garment sample stage because these labels have a 1,000-piece minimum order." },
  { question: "What if I do not request custom labels or packaging?", answer: "We use our standard specifications for any items you do not ask us to customize." },
  { question: "What happens to unused hang tags or labels?", answer: "We keep any unused hang tags or labels for you and use them on your future orders." },
  { question: "How are labeling requirements handled for my market?", answer: "Tell us where the garments will be sold and provide the required composition, care, size and other label information. Have the wording and any mandatory requirements checked for your destination market before approving the artwork." },
];

export default function LabelsTagsPackagingPage() {
  return (
    <>
      <ServiceStructuredData name={TITLE} description={DESCRIPTION} path="/labels-tags-packaging" />
      <ServiceHero eyebrow="Labels, Tags & Packaging" title={<>Custom Clothing<br /><span className="gradient-text">Labels &amp; Packaging</span></>} description="Plan woven neck labels, wash care labels, custom hang tags and branded packaging as part of your private label clothing order. Confirm the details alongside your T-shirts, hoodies or streetwear collection.">
        <PackagingHeroPhoto />
      </ServiceHero>

      <section id="service-details" aria-labelledby="explore-branding" className="scroll-mt-24 border-b border-white/10 px-6 py-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="explore-branding" className="font-syne text-2xl font-bold text-white md:text-3xl">Build Your Brand Kit</h2>
            <p className="max-w-xl text-base leading-relaxed text-zinc-400">Start with the details you need. Each item is quoted to your design, quantity and garment requirements.</p>
          </div>
          <nav aria-label="Labels and packaging categories" className="grid gap-4 md:grid-cols-3">
            {GROUPS.map(({ id, name, icon: Icon, items }) => <div key={id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <a href={`#${id}`} className="mb-4 flex items-center gap-3 text-lg font-medium text-white hover:text-violet-300"><Icon size={21} aria-hidden="true" className="text-violet-300" />{name}</a>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">{items.map(item => <li key={item.id}><a href={`#${item.id}`} className="text-sm text-zinc-400 underline decoration-white/15 underline-offset-4 hover:text-violet-300">{item.title}</a></li>)}</ul>
            </div>)}
          </nav>
        </div>
      </section>

      {GROUPS.map(({ id, name, heading, intro, items }) => <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-b border-white/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-9 grid gap-5 lg:grid-cols-2 lg:items-end">
            <div><p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">{name}</p><h2 id={`${id}-heading`} className="font-syne text-3xl font-bold leading-tight text-white md:text-4xl">{heading}</h2></div>
            <p className="max-w-xl text-base leading-relaxed text-zinc-400">{intro}</p>
          </div>
          <div className={`grid gap-6 ${items.length === 1 ? "" : items.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {items.map(({ id: itemId, kind, title, description, details, ordering }) => <article key={itemId} id={itemId} className={`scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d11] ${items.length === 1 ? "grid md:grid-cols-2" : ""}`}>
              <PackagingVisual kind={kind} />
              <div className="p-6 md:p-7">
                <h3 className="font-syne text-2xl font-bold leading-tight text-white">{title}</h3>
                <p className="mt-4 text-base leading-relaxed text-zinc-300">{description}</p>
                {ordering && (
                  <div className="mt-5 rounded-xl border border-violet-400/25 bg-violet-500/5 px-4 py-3">
                    <p className="mb-2 text-sm font-medium text-violet-300">Ordering details</p>
                    <dl className="divide-y divide-white/10">
                      {ordering.map(({ label, value }) => (
                        <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2 text-sm">
                          <dt className="text-zinc-300">{label}</dt>
                          <dd className="font-semibold text-white">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
                <p className="mb-3 mt-6 text-sm font-medium text-violet-300">Details to discuss</p>
                <ul className="space-y-2">{details.map(detail => <li key={detail} className="flex gap-2 text-base text-zinc-400"><Check size={17} aria-hidden="true" className="mt-1 shrink-0 text-violet-400" /><span>{detail}</span></li>)}</ul>
              </div>
            </article>)}
          </div>
        </div>
      </section>)}

      <section aria-labelledby="branding-process" className="border-b border-white/10 px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">From Artwork to Finished Garment</p>
          <h2 id="branding-process" className="font-syne text-3xl font-bold text-white md:text-4xl">Get the Details Right, Together.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{PROCESS.map(({ icon: Icon, title, text }) => <div key={title} className="border-t border-violet-400/30 pt-6">
            <Icon aria-hidden="true" size={26} className="mb-5 text-violet-300" />
            <h3 className="text-lg font-medium text-white">{title}</h3><p className="mt-3 text-base leading-relaxed text-zinc-400">{text}</p>
          </div>)}</div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
            <h3 className="text-lg font-medium text-white">A mockup shows the layout. A sample helps you judge the finish.</h3>
            <p className="mt-3 max-w-4xl text-base leading-relaxed text-zinc-300">Screen colors and digital illustrations do not show the exact texture, scale or feel of a finished label. Tell us what you need to review and confirm the approval steps in your quote. Keep artwork and packing instructions consistent with your <Link href="/services#sampling" className="text-violet-300 underline underline-offset-4 hover:text-white">garment sample</Link>.</p>
            <p className="mt-4 text-base text-zinc-300">Still choosing a label position? See our <Link href="/blog/woven-size-labels" className="text-violet-300 underline underline-offset-4 hover:text-white">guide to woven size labels and placement</Link>.</p>
          </div>
        </div>
      </section>

      <ServiceFAQ items={FAQ} />
      <ServiceCTA title="Quote Labels & Packaging With Your Apparel Order" description="Send your garment styles and quantities, logo and packaging preferences so we can discuss the finishing details for your collection." relatedHref="/global-shipping" relatedLabel="Plan apparel shipping from China" />
    </>
  );
}
