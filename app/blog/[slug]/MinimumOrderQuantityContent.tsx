import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-syne font-bold text-white text-2xl md:text-3xl leading-snug mt-12 mb-5">{children}</h2>
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
      <P>
        Minimum order quantity, usually shortened to MOQ, is the smallest order a supplier will accept under a defined set of production conditions. For clothing, that number is only useful when you know what it applies to: one style, one fabric, one color, or the whole purchase order. There is no single MOQ that applies to every factory or every garment.
      </P>

      <P>
        If you are testing a new apparel brand, understanding how MOQ is calculated helps you compare quotes fairly, plan cash flow, and avoid paying for stock you cannot sell. Use this guide to prepare a clear request and find out which parts of your design are driving the quantity.
      </P>

      <H2>What does clothing MOQ mean?</H2>
      <P>
        A manufacturer may quote MOQ per style, per color, or per fabric. Those terms are not interchangeable. For example, a quote might allow several sizes within one color, while requiring a separate minimum if you add another color. Ask the supplier to write down exactly how sizes, colors, and styles are counted.
      </P>
      <P>
        Also separate the garment MOQ from minimums set by material suppliers. A custom-dyed fabric, special wash, or unusual trim may have its own purchasing threshold. A factory can sometimes make fewer garments than the fabric mill&apos;s preferred batch, but unused material or a surcharge may affect the price.
      </P>

      <H2>Why does MOQ change from one project to another?</H2>
      <P>
        The production steps determine what quantity is practical. A basic garment made with available fabric and standard trims may have different requirements from a custom pattern with garment dyeing, embroidery, printing, or several colorways. Setup, cutting, machine changes, material purchasing, and finishing all affect how costs are spread across units.
      </P>
      <P>
        The same design can therefore receive different MOQ and unit-price options depending on fabric availability, construction, decoration method, size range, and delivery schedule. Ask for the assumptions behind each quote so that you can compare like with like.
      </P>

      <H2>How to read a supplier&apos;s MOQ quote</H2>
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

      <H2>Ways to test demand with a smaller first order</H2>
      <P>
        If the quoted quantity is too high for a first launch, ask which specification changes could reduce it. Using an available fabric color, limiting the first run to one style, choosing a simpler print method, or postponing custom packaging may reduce material or setup constraints. Ask the factory to explain the cost and quality trade-offs before changing the brief.
      </P>
      <P>
        You can also validate demand before bulk production with samples, a small preorder campaign, or a focused launch assortment. A sample is for checking fit and construction; it is not automatically evidence that the bulk MOQ can be reduced. Confirm the production minimum separately.
      </P>

      <CTA />

      <H2>What to send when requesting an MOQ</H2>
      <P>
        A useful inquiry gives the manufacturer enough information to identify material and process requirements. Send a reference image or tech pack, garment type, fabric composition or target weight if known, color count, decoration details, size range, target quantity, destination country, and target delivery date. If some details are undecided, say so and ask for options.
      </P>
      <P>
        Request two or three quantity breaks when possible, such as your planned first run and a larger comparison quantity. Ask the supplier to show unit cost, one-time charges, and any material minimum separately. This makes the effect of quantity visible without treating the lowest unit price as the only decision.
      </P>

      <H2>Frequently asked questions</H2>
      <P>
        <strong className="text-white/80">Is MOQ always per color?</strong>
        <br />
        No. Some suppliers count by style or total order, while fabric or dyeing requirements can create a separate per-color minimum. Confirm the counting rule for your specific product.
      </P>
      <P>
        <strong className="text-white/80">Can a clothing manufacturer produce below its MOQ?</strong>
        <br />
        Sometimes a supplier can offer a smaller run with a higher unit cost or a change to materials and customization. Whether that works depends on the production plan, so request a revised quote instead of assuming the published minimum is negotiable.
      </P>
      <P>
        <strong className="text-white/80">Does a sample count toward the bulk order quantity?</strong>
        <br />
        Usually sampling and bulk production are quoted separately. Ask whether any sample or development fee is credited toward a later order and get the terms in writing.
      </P>

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
