import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-syne font-bold text-white text-2xl md:text-3xl leading-snug mt-12 mb-5 scroll-mt-28">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-white/55 text-[0.95rem] leading-relaxed mb-4">{children}</p>
);

const CTA = () => (
  <div className="my-8 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-between gap-4 flex-wrap">
    <p className="text-white/70 text-sm">Share your design, quantity, and customization details to get an MOQ checked for your project.</p>
    <Link href="/contact" className="btn-gradient flex-shrink-0 text-[0.65rem] py-2.5 px-5">
      Request A Quote
    </Link>
  </div>
);

export default function MinimumOrderQuantityContent() {
  return (
    <article>
      <section aria-labelledby="moq-at-a-glance" className="my-8 rounded-2xl border border-violet-400/25 bg-violet-500/5 p-6 md:p-8">
        <p className="text-violet-300 text-[0.65rem] font-semibold uppercase tracking-widest mb-3">Quick answer</p>
        <h2 id="moq-at-a-glance" className="font-syne font-bold text-white text-xl md:text-2xl mb-4">MOQ at a glance</h2>
        <p className="text-white/70 text-sm leading-relaxed mb-5">
          Clothing MOQ is the smallest order a manufacturer accepts for a defined set of specifications. Confirm what the minimum covers before comparing quotes.
        </p>
        <ul className="space-y-3 text-sm text-white/65 leading-relaxed">
          <li><strong className="text-white/90">Check the counting rule:</strong> the minimum may apply per style, color, fabric, or total order.</li>
          <li><strong className="text-white/90">Compare the same specifications:</strong> materials, decoration, and trims can change the production minimum.</li>
          <li><strong className="text-white/90">Send a clear brief:</strong> include your design, quantity, size range, and customization details.</li>
        </ul>
        <nav aria-label="In this MOQ guide" className="mt-6 border-t border-white/10 pt-5">
          <p className="text-white/45 text-xs mb-3">Jump to the part you need</p>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
            {[
              ["moq-meaning", "What MOQ means"],
              ["moq-factors", "What affects the minimum"],
              ["below-moq", "Ordering below MOQ"],
              ["compare-moq-quotes", "How to compare quotes"],
              ["smaller-first-order", "Planning a smaller first order"],
              ["request-moq", "What to send a manufacturer"],
              ["moq-faq", "Common MOQ questions"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-violet-300 hover:text-white underline underline-offset-4 decoration-violet-400/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <P>
        Minimum order quantity, usually shortened to MOQ, is the smallest order a supplier will accept under a defined set of production conditions. For clothing, that number is only useful when you know what it applies to: one style, one fabric, one color, or the whole purchase order. There is no single MOQ that applies to every factory or every garment.
      </P>

      <P>
        If you are testing a new apparel brand, understanding how MOQ is calculated helps you compare quotes fairly, plan cash flow, and avoid paying for stock you cannot sell. Use this guide to prepare a clear request and find out which parts of your design are driving the quantity.
      </P>

      <H2 id="moq-meaning">What does clothing MOQ mean?</H2>
      <P>
        A manufacturer may quote MOQ per style, per color, or per fabric. Those terms are not interchangeable. For example, a quote might allow several sizes within one color, while requiring a separate minimum if you add another color. Ask the supplier to write down exactly how sizes, colors, and styles are counted.
      </P>
      <P>
        Also separate the garment MOQ from minimums set by material suppliers. A custom-dyed fabric, special wash, or unusual trim may have its own purchasing threshold. A factory can sometimes make fewer garments than the fabric mill&apos;s preferred batch, but unused material or a surcharge may affect the price.
      </P>

      <H2 id="moq-factors">Why does MOQ change from one project to another?</H2>
      <P>
        The production steps determine what quantity is practical. A basic garment made with available fabric and standard trims may have different requirements from a custom pattern with garment dyeing, embroidery, printing, or several colorways. Setup, cutting, machine changes, material purchasing, and finishing all affect how costs are spread across units.
      </P>
      <P>
        The same design can therefore receive different MOQ and unit-price options depending on fabric availability, construction, decoration method, size range, and delivery schedule. Ask for the assumptions behind each quote so that you can compare like with like.
      </P>

      <H2 id="below-moq">Can You Place a Clothing Order Below the MOQ?</H2>

      <P>
        Sometimes a clothing manufacturer can accept an order below its minimum order quantity (MOQ), depending on the fabric, color and production setup. When a smaller run is feasible, expect the factory to quote it separately. A higher price per garment can reflect the cost of preparing and cutting a batch that produces fewer finished pieces.
      </P>

      <h3 className="font-syne font-semibold text-white text-lg mt-7 mb-3">Why a smaller run can cost more per garment</h3>

      <P>
        For a cut-and-sew order, the factory plans how the pattern pieces fit across the fabric, lays out the fabric and cuts the pieces together in a batch. A smaller run can still require much of the same cutting preparation. With fewer finished garments to share that work, the preparation cost per garment rises if the work stays the same.
      </P>

      <P>
        Fabric purchasing is a separate factor. A custom color can require a minimum fabric purchase or dye batch larger than the order uses. Uncut fabric may be suitable for a later run, but the current order can still carry some of the cost of buying and preparing that batch. Ask whether the quote includes a material charge and whether any usable fabric can be held for a reorder.
      </P>

      <P>
        For example, suppose a brand wants a small first run of one hoodie style in a custom color. If the supplier requires the same minimum dye batch for that smaller run as for a larger order, producing fewer hoodies uses less fabric while the initial fabric purchase can stay the same. An available fabric in a similar color might remove that particular constraint. Compare the swatch with the original brief before changing the fabric.
      </P>

      <h3 className="font-syne font-semibold text-white text-lg mt-7 mb-3">What to ask your manufacturer to quote</h3>

      <ul className="list-disc pl-5 space-y-3 mb-6 text-white/60 text-sm leading-relaxed">
        <li>
          <strong className="text-white/85">Confirm where the minimum applies.</strong> Ask whether it is per style, per color, per fabric or for the order as a whole. Check whether sizes can be mixed within one color.
        </li>
        <li>
          <strong className="text-white/85">Request two quantities with the same specifications.</strong> If both quantities are feasible, ask for your target quantity and the standard minimum on the same fabric, color, construction and decoration. Compare the per-garment price and the total you would pay.
        </li>
        <li>
          <strong className="text-white/85">Ask what drives the difference.</strong> Confirm whether the quote includes one-time setup, fabric minimums or a separate material charge. If usable fabric remains, ask who keeps it and how it would be treated on a reorder.
        </li>
        <li>
          <strong className="text-white/85">Ask for one alternative you can actually sell.</strong> If the original specification needs a larger batch, ask whether an available fabric color or a first run with fewer colorways would meet your design and launch needs.
        </li>
      </ul>

      <P>
        If you are planning a custom hoodie or T-shirt, share the style, the fabric or reference sample, the colorways and the quantity per color so Mulang Apparel can review the production options. <Link href="/contact" className="text-violet-300 hover:text-white underline underline-offset-4">Discuss your project with Mulang Apparel</Link>.
      </P>

      <H2 id="compare-moq-quotes">How to read a supplier&apos;s MOQ quote</H2>
      <P>Before comparing offers, confirm these details in writing:</P>
      <ul className="space-y-3 mb-7">
        {[
          "Is the minimum counted per style, color, fabric, or total order?",
          "Can sizes be mixed within the stated quantity, and is there a size ratio requirement?",
          "Does the quote use stock fabric or require custom color development?",
          "Are labels, prints, embroidery, washes, and special trims included?",
          "Are sampling fees, tooling, material surcharges, and shipping quoted separately?",
          "What changes to price or lead time apply at a lower quantity?",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-white/60 text-sm leading-relaxed">
            <CheckCircle size={15} className="text-violet-400 mt-0.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <H2 id="smaller-first-order">Ways to test demand with a smaller first order</H2>
      <P>
        If the quoted quantity is too high for a first launch, ask which specification changes could reduce it. Using an available fabric color, limiting the first run to one style, choosing a simpler print method, or postponing custom packaging may reduce material or setup constraints. Ask the factory to explain the cost and quality trade-offs before changing the brief.
      </P>
      <P>
        You can also validate demand before bulk production with samples, a small preorder campaign, or a focused launch assortment. A sample is for checking fit and construction; it is not automatically evidence that the bulk MOQ can be reduced. Confirm the production minimum separately.
      </P>

      <CTA />

      <H2 id="request-moq">What to send when requesting an MOQ</H2>
      <P>
        A useful inquiry gives the manufacturer enough information to identify material and process requirements. Send a reference image or tech pack, garment type, fabric composition or target weight if known, color count, decoration details, size range, target quantity, destination country, and target delivery date. If some details are undecided, say so and ask for options.
      </P>
      <P>
        Request two or three quantity breaks when possible, such as your planned first run and a larger comparison quantity. Ask the supplier to show unit cost, one-time charges, and any material minimum separately. This makes the effect of quantity visible without treating the lowest unit price as the only decision.
      </P>

      <H2 id="moq-faq">Frequently asked questions</H2>
      <P>
        <strong className="text-white/80">Is MOQ always per color?</strong>
        <br />
        No. Some suppliers count by style or total order, while fabric or dyeing requirements can create a separate per-color minimum. Confirm the counting rule for your specific product.
      </P>
      <P>
        <strong className="text-white/80">Can a clothing manufacturer produce below its MOQ?</strong>
        <br />
        Sometimes, if the fabric and production setup allow it. Ask for a quote for your target quantity and the usual minimum. Cutting preparation and any fabric batch minimum may still apply, which can raise the price per garment.
      </P>
      <P>
        <strong className="text-white/80">Does a sample count toward the bulk order quantity?</strong>
        <br />
        Usually sampling and bulk production are quoted separately. Ask whether any sample or development fee is credited toward a later order and get the terms in writing.
      </P>

      <aside aria-label="Related manufacturing resources" className="mt-10 border-t border-white/10 pt-6">
        <h2 className="font-syne font-bold text-white text-lg mb-3">Continue planning your production</h2>
        <ul className="space-y-3 text-sm">
          <li><Link href="/blog/china-clothing-manufacturer-tips" className="text-violet-300 hover:text-white underline underline-offset-4">How to evaluate a clothing manufacturer in China</Link></li>
          <li><Link href="/services" className="text-violet-300 hover:text-white underline underline-offset-4">Explore OEM and ODM clothing services</Link></li>
        </ul>
      </aside>

      <div className="mt-10 p-7 rounded-2xl glass-card text-center">
        <h3 className="font-syne font-bold text-white text-xl mb-3">Planning your first production run?</h3>
        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
          Send your product details and target quantity. We can review the specifications and clarify which MOQ assumptions need to be confirmed.
        </p>
        <Link href="/contact" className="btn-gradient inline-flex items-center gap-2">
          Discuss Your Project <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
