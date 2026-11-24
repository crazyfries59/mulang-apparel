import type { Metadata } from "next";
import Link from "next/link";
import { Box, Check, ClipboardList, MapPin, PackageCheck, Plane, Scale, Ship, Truck } from "lucide-react";
import { ServiceCTA, ServiceFAQ, ServiceHero, ServiceStructuredData } from "@/components/services/ServicePage";

const DESCRIPTION = "Plan shipping for your custom clothing order with Mulang Apparel. Compare express, air and sea freight, discuss delivery terms, and request a destination-specific quote.";

export const metadata: Metadata = {
  title: "Global Shipping for Custom Clothing Orders",
  description: DESCRIPTION,
  alternates: { canonical: "/global-shipping" },
  openGraph: {
    title: "Global Shipping | Mulang Apparel",
    description: DESCRIPTION,
    url: "/global-shipping",
  },
  twitter: { title: "Global Shipping | Mulang Apparel", description: DESCRIPTION },
};

const SHIPPING_OPTIONS = [
  {
    icon: PackageCheck,
    title: "Express Courier",
    subtitle: "For samples & smaller shipments",
    description: "A practical option when you need to review a sample or receive a smaller order. Tell us your delivery address and required arrival date so we can check the available courier service.",
    points: ["Sample and small-order planning", "Delivery to your nominated address", "Tracking details after dispatch"],
  },
  {
    icon: Plane,
    title: "Air Freight",
    subtitle: "For orders with a tighter schedule",
    description: "Consider air freight when the launch schedule matters and an express shipment may not suit the order size. We discuss the destination, packed volume and delivery requirements before quoting.",
    points: ["Compare with express for your order size", "Confirm airport or final-address delivery", "Clearance and local charges agreed in advance"],
  },
  {
    icon: Ship,
    title: "Sea Freight",
    subtitle: "For larger, planned-ahead orders",
    description: "An option to discuss for bulk clothing shipments when you can allow more transit time. Your destination and packing details determine the available route and how the goods reach you.",
    points: ["Plan around your collection launch", "Confirm port or door delivery", "Compare total freight and destination costs"],
  },
];

const FAQS = [
  { question: "How much will shipping cost?", answer: "Freight is quoted for the actual order and destination. Send us the product type, quantity, country, postcode and required delivery date. Packed weight, carton dimensions, service availability and the agreed delivery terms all affect the final quote." },
  { question: "How long will delivery take?", answer: "We confirm an estimated transit window with the shipping quote. Transit begins after dispatch and is separate from sampling and production. Customs checks, carrier schedules and local delivery conditions can affect arrival, so share your launch date before the order is confirmed." },
  { question: "Are import duties and taxes included?", answer: "That depends on the delivery terms confirmed in your quote. Under DDP, import clearance and duties are the seller’s responsibility; under DAP, import clearance and import charges are the buyer’s responsibility. Ask us to confirm the named destination and the included charges before paying." },
  { question: "Can I use my own freight forwarder?", answer: "Yes. Share your forwarder’s contact details and shipping instructions so we can coordinate the handover. The collection location, timing, export documents and each party’s responsibilities should be agreed before dispatch." },
  { question: "Can I arrange rail or road freight?", answer: "These are route-specific options rather than a service available for every destination. Tell us where the order is going, or share your forwarder’s proposed route, so availability and the handover requirements can be checked." },
  { question: "Can branded packaging be included before shipping?", answer: "We can discuss garment bags, labels, hang tags and other packaging as part of the clothing order. Confirm the packing requirements before production because boxes, inserts and individual packing can change the packed volume and freight quote." },
];

function ShippingArtwork() {
  return (
    <figure className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171323] to-[#0b0b10] p-4 sm:p-6">
      <svg viewBox="0 0 600 420" role="img" aria-labelledby="shipping-art-title shipping-art-desc" className="h-auto w-full">
        <title id="shipping-art-title">From Guangzhou to your brand</title>
        <desc id="shipping-art-desc">An illustrated Mulang Apparel parcel in front of a globe with international shipping routes.</desc>
        <defs>
          <radialGradient id="shipping-globe"><stop stopColor="#8b5cf6" stopOpacity=".18" /><stop offset="1" stopColor="#8b5cf6" stopOpacity=".01" /></radialGradient>
          <linearGradient id="shipping-box" x2="1" y2="1"><stop stopColor="#3c3155" /><stop offset="1" stopColor="#211a31" /></linearGradient>
          <linearGradient id="shipping-route"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
        </defs>
        <circle cx="330" cy="188" r="158" fill="url(#shipping-globe)" stroke="#a78bfa" strokeOpacity=".25" />
        <g fill="none" stroke="#a78bfa" strokeOpacity=".17">
          <ellipse cx="330" cy="188" rx="83" ry="158" /><ellipse cx="330" cy="188" rx="130" ry="158" />
          <ellipse cx="330" cy="188" rx="158" ry="57" /><ellipse cx="330" cy="188" rx="158" ry="112" />
          <path d="M172 188h316M330 30v316" />
        </g>
        <g fill="none" stroke="url(#shipping-route)" strokeWidth="2" strokeDasharray="5 7">
          <path d="M384 225Q245 16 202 126" /><path d="M384 225Q420 33 468 124" /><path d="M384 225Q515 190 482 284" />
        </g>
        <g fill="#d8b4fe"><circle cx="202" cy="126" r="5" /><circle cx="468" cy="124" r="5" /><circle cx="482" cy="284" r="5" /></g>
        <circle cx="384" cy="225" r="10" fill="#8b5cf6" fillOpacity=".3" /><circle cx="384" cy="225" r="4" fill="#e9d5ff" />
        <text x="400" y="249" fill="#e9d5ff" fontSize="16" fontFamily="sans-serif">Guangzhou</text>
        <g transform="translate(37 162)">
          <path d="M0 62 122 7 254 63 132 121Z" fill="#524064" stroke="#9b83b5" strokeOpacity=".4" />
          <path d="M0 62 132 121v134L0 191Z" fill="url(#shipping-box)" stroke="#9b83b5" strokeOpacity=".4" />
          <path d="m132 121 122-58v132l-122 60Z" fill="#191420" stroke="#9b83b5" strokeOpacity=".4" />
          <path d="m90 22 133 57-28 13L62 35Z" fill="#b79bcf" fillOpacity=".45" /><path d="m195 92 28-13v72l-28 13Z" fill="#b79bcf" fillOpacity=".25" />
          <g transform="matrix(1 .46 0 1 22 104)">
            <rect width="88" height="66" rx="3" fill="#eae4f2" />
            <text x="9" y="22" fill="#231b31" fontSize="12" fontFamily="sans-serif" fontWeight="700">MULANG</text>
            <text x="9" y="37" fill="#62566e" fontSize="9" fontFamily="sans-serif" letterSpacing="2">APPAREL</text>
            {[0, 5, 9, 16, 20, 26, 31, 37, 42, 49, 54, 59, 65].map((x, i) => <rect key={x} x={10 + x} y="46" width={i % 3 === 0 ? 3 : 1.5} height="12" fill="#463b52" />)}
          </g>
        </g>
        <g transform="translate(338 326)"><rect width="211" height="57" rx="12" fill="#181221" stroke="#a78bfa" strokeOpacity=".25" /><circle cx="23" cy="28" r="5" fill="#a78bfa" /><text x="39" y="25" fill="#f4f0fa" fontSize="14" fontFamily="sans-serif">Your collection. Your destination.</text><text x="39" y="43" fill="#aaa0b6" fontSize="12" fontFamily="sans-serif">A shipping plan for your order</text></g>
      </svg>
      <figcaption className="px-2 pb-1 pt-4 text-center text-sm text-zinc-400">From our Guangzhou production base to your next collection.</figcaption>
    </figure>
  );
}

export default function GlobalShippingPage() {
  return (
    <>
      <ServiceStructuredData name="Global Shipping" description={DESCRIPTION} path="/global-shipping" />
      <ServiceHero eyebrow="Global Shipping" title={<>Global Shipping.<br /><span className="gradient-text">From Us to You.</span></>} description="Your collection is ready. Let’s plan the journey. We help coordinate shipping for your clothing order, with the route, delivery terms and freight quote agreed around your destination.">
        <ShippingArtwork />
      </ServiceHero>

      <section id="service-details" aria-labelledby="shipping-options" className="scroll-mt-24 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">Choose Your Route</p>
            <h2 id="shipping-options" className="font-syne text-3xl font-bold leading-tight text-white md:text-5xl">The Right Shipping Method<br />for Your Order.</h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">Samples, a first collection or a larger restock each need a different plan. We compare the available options against your quantity, budget and delivery schedule.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {SHIPPING_OPTIONS.map(({ icon: Icon, title, subtitle, description, points }) => (
              <article key={title} className="flex flex-col rounded-2xl border border-white/10 bg-[#101014] p-6 md:p-8">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></div>
                <p className="mb-2 text-sm text-violet-300">{subtitle}</p>
                <h3 className="font-syne text-2xl font-bold text-white">{title}</h3>
                <p className="mb-7 mt-4 flex-1 text-base leading-relaxed text-zinc-300">{description}</p>
                <ul className="space-y-3 border-t border-white/10 pt-6">
                  {points.map((point) => <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300"><Check size={16} className="mt-1 shrink-0 text-violet-400" aria-hidden="true" />{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-white/10 px-6 py-5 text-base leading-relaxed text-zinc-400"><Truck size={23} className="mt-1 shrink-0 text-violet-300" aria-hidden="true" /><p><span className="text-white">Rail, road or your own forwarder?</span> Tell us your destination and proposed route. Availability, collection and handover arrangements are confirmed for each shipment.</p></div>
        </div>
      </section>

      <section aria-labelledby="delivery-terms" className="border-y border-white/10 bg-[#0b0b0e] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
            <div><p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">Know What Is Included</p><h2 id="delivery-terms" className="font-syne text-3xl font-bold text-white md:text-5xl">Delivery, Duties<br />& the Details.</h2></div>
            <p className="text-base leading-relaxed text-zinc-300">A freight price means more when everyone knows what it covers. Confirm the delivery term, named place or port, customs responsibilities and destination charges in your written quote.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              { term: "DDP", name: "Delivered Duty Paid", text: "A delivery arrangement in which the seller handles import clearance and import duties. We confirm whether a DDP route is available for your destination and what the quote includes." },
              { term: "DAP", name: "Delivered at Place", text: "Delivery to the agreed destination, with import clearance and import duties handled by the buyer. Confirm local requirements before your shipment leaves." },
              { term: "FOB", name: "Free On Board", text: "For sea or inland-waterway transport: goods are delivered on board the buyer’s nominated vessel at the agreed port. Your forwarder coordinates the onward journey." },
            ].map(({ term, name, text }) => <article key={term} className="bg-[#101014] p-7 md:p-8"><p className="font-syne text-4xl font-bold text-violet-300">{term}</p><h3 className="mb-4 mt-2 text-lg font-medium text-white">{name}</h3><p className="text-base leading-relaxed text-zinc-300">{text}</p></article>)}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">The agreed Incoterms® rule and named location belong in your order confirmation. <a href="https://academy.iccwbo.org/incoterms/article/place-of-delivery-risk-transfer-global-trade-contracts/" target="_blank" rel="noopener noreferrer" className="text-violet-300 underline underline-offset-4 hover:text-white">Read the ICC explanation of delivery terms.</a></p>
        </div>
      </section>

      <section aria-labelledby="freight-quote" className="px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">A Quote Built Around Your Shipment</p>
            <h2 id="freight-quote" className="font-syne text-3xl font-bold leading-tight text-white md:text-5xl">What Determines<br />Your Shipping Cost?</h2>
            <p className="mt-6 text-base leading-relaxed text-zinc-300">There is no single freight rate for every clothing order. The final route and price depend on how the order is packed, where it is going and when you need it.</p>
            <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-6"><Scale size={24} className="mb-4 text-violet-300" aria-hidden="true" /><h3 className="mb-2 text-lg font-medium text-white">Weight and volume both matter.</h3><p className="text-base leading-relaxed text-zinc-300">Carriers may charge using actual or volumetric weight. Retail boxes and individual packaging can increase the space your order occupies, so confirm packaging before the freight quote is finalized.</p></div>
          </div>
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Destination & delivery point", text: "Country, postcode and the final address, port or forwarder’s warehouse." },
              { icon: Box, title: "Products & packing", text: "Garment type, quantity, carton count, packed weight and carton dimensions." },
              { icon: ClipboardList, title: "Schedule & delivery terms", text: "Your required arrival date, preferred shipping method and the charges to include." },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-5 border-b border-white/10 pb-6"><Icon size={23} className="mt-1 shrink-0 text-violet-300" aria-hidden="true" /><div><h3 className="mb-2 text-lg font-medium text-white">{title}</h3><p className="text-base leading-relaxed text-zinc-300">{text}</p></div></div>)}
            <p className="text-base leading-relaxed text-zinc-400">Still planning your collection? Share the estimated quantity first. We can discuss shipping alongside your <Link href="/labels-tags-packaging" className="text-violet-300 underline underline-offset-4 hover:text-white">labels and packaging</Link>.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="shipping-process" className="border-t border-white/10 bg-[#0b0b0e] px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">From Packing to Arrival</p>
          <h2 id="shipping-process" className="font-syne text-3xl font-bold text-white md:text-4xl">Plan the Handover Before Dispatch.</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Confirm the plan", "Agree the packing, delivery address, freight method and quote before the shipment is booked."],
              ["Prepare & dispatch", "Coordinate final packing, export documents and handover to the carrier or your nominated forwarder."],
              ["Follow the shipment", "Receive the tracking or shipment reference and coordinate destination clearance where required by your terms."],
            ].map(([title, text]) => <li key={title} className="border-l-2 border-violet-500/50 pl-6"><h3 className="mb-3 text-lg font-medium text-white">{title}</h3><p className="text-base leading-relaxed text-zinc-300">{text}</p></li>)}
          </ol>
          <div className="mt-12 border-t border-white/10 pt-8"><p className="mb-4 text-base text-zinc-400">Working with brands in</p><ul className="flex flex-wrap gap-3">{["United States", "Australia", "United Kingdom", "Canada", "Switzerland", "New Zealand"].map((country) => <li key={country} className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">{country}</li>)}</ul><p className="mt-4 text-sm text-zinc-400">For another destination, contact us to check the available shipping arrangements.</p></div>
        </div>
      </section>

      <ServiceFAQ items={FAQS} />
      <ServiceCTA title="Let’s Plan Your Delivery." description="Send your product details, quantity, destination and target arrival date. We’ll discuss the packing and shipping arrangements alongside your clothing order." relatedHref="/labels-tags-packaging" relatedLabel="Explore Labels, Tags & Packaging" />
    </>
  );
}
