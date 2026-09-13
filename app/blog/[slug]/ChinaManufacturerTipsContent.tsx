import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

const InlineCTA = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-between gap-4 flex-wrap">
    <p className="text-white/70 text-sm">{children}</p>
    <Link href="/contact" className="btn-gradient flex-shrink-0 text-[0.65rem] py-2.5 px-5">
      Get A Free Quote
    </Link>
  </div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-syne font-bold text-white text-2xl md:text-3xl leading-snug mt-14 mb-5">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-white/55 text-[0.95rem] leading-relaxed mb-4">{children}</p>
);

export default function ChinaManufacturerTipsContent() {
  return (
    <article>
      <P>
        Working with a clothing manufacturer in China can cut your production costs in half compared to
        sourcing domestically — but only if you know what to ask before you wire a deposit. We&apos;ve run
        production for 500+ brands out of our own 50,000 sq ft facility in Guangzhou, and these are the ten
        things that actually separate a smooth first order from a nightmare one.
      </P>

      <H2>1. Ask for the real MOQ, not the headline number</H2>
      <P>
        Marketing pages love to advertise &ldquo;MOQ from 1 piece&rdquo; — in practice that usually means one
        piece <em>per size, per color, from an existing blank</em>, not one piece of a fully custom design.
        A factory that can genuinely produce a custom style at low volume will tell you the real number
        upfront: ours is <strong>50 pieces per style</strong> (mixed sizes and colors), or 100 pieces for
        accessories. If a supplier won&apos;t give you a straight number in the first message, that&apos;s
        your answer.
      </P>

      <H2>2. Verify certifications instead of trusting a badge</H2>
      <P>
        ISO 9001 logos are easy to paste into a homepage footer. Ask for the certificate number and the
        issuing body, and check it independently — a legitimate factory won&apos;t hesitate. Same goes for
        third-party inspection: a manufacturer confident in its process will happily accommodate an SGS or
        Bureau Veritas inspection before shipment, because they&apos;re already running that level of QC
        internally.
      </P>

      <H2>3. Know what &ldquo;500+ fabrics&rdquo; actually means</H2>
      <P>
        A big fabric library sounds impressive until you realize it just means the factory can source
        anything from a middleman — with the markup and lead time that comes with it. Ask specifically
        which fabrics are stocked in-house versus sourced per order. Our library spans <strong>200–500GSM</strong>{" "}
        French terry, ringspun cotton, and selvedge denim held on-site, which is what keeps sample turnaround
        fast. See the full breakdown on our{" "}
        <Link href="/fabrics" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
          fabric library page
        </Link>.
      </P>

      <InlineCTA>Not sure which fabric fits your design? Send us your spec and we&apos;ll recommend one.</InlineCTA>

      <H2>4. Never skip the physical sample — even for a &ldquo;simple&rdquo; blank</H2>
      <P>
        Photos and tech packs hide fit issues, GSM discrepancies, and color drift that only show up in hand.
        Ask for a real sample lead time, not a vague &ldquo;a few weeks.&rdquo; A factory that runs its own
        cutting and sewing floor (rather than outsourcing samples to a separate workshop) should be able to
        turn one around in <strong>7–12 days</strong>, with revisions included until it&apos;s right.
      </P>

      <H2>5. Ask exactly what &ldquo;quality control&rdquo; means to them</H2>
      <P>
        &ldquo;We do QC&rdquo; is not an answer. Ask for the actual checklist. Ours runs a{" "}
        <strong>42-point inspection</strong> across eight stages — from raw material inspection on arrival,
        through in-line checks during sewing, to a final pre-shipment inspection before anything leaves the
        floor. If a supplier can&apos;t describe their process in that level of detail, they probably
        don&apos;t have one. More on our process on the{" "}
        <Link href="/manufacturing" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
          manufacturing page
        </Link>.
      </P>

      <H2>6. Get clear on OEM, ODM, and private label before you brief them</H2>
      <P>
        These three terms change what you&apos;re actually paying for. OEM means you supply the design and
        the factory produces it. ODM means the factory develops the design for you, from an existing
        template or from scratch. Private label sits on top of either one — your labels, tags, and packaging
        on the finished product. Knowing which one you need before the first call saves both sides a lot of
        back-and-forth; our{" "}
        <Link href="/solutions" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
          solutions page
        </Link>{" "}
        breaks down all three plus blank wholesale and startup programs.
      </P>

      <H2>7. Pin down lead times for samples and bulk separately</H2>
      <P>
        &ldquo;Fast production&rdquo; means nothing without a number attached to a specific product. Lead
        time varies by category more than most brands expect — a basic tee runs faster than a lined jacket
        or a pair of jeans. Ask for bulk lead time by category, not a blanket estimate: expect roughly{" "}
        <strong>14 days</strong> for most styles and <strong>21 days</strong> for hoodies, denim, outerwear,
        and dresses that need more finishing steps.
      </P>

      <InlineCTA>Tell us your product category and target quantity — we&apos;ll give you an exact timeline.</InlineCTA>

      <H2>8. Ask whether shipping is DDP or FOB — the difference is thousands of dollars</H2>
      <P>
        FOB (Free On Board) means you handle customs clearance and duties on arrival — unpredictable if
        you&apos;ve never imported before. DDP (Delivered Duty Paid) means the manufacturer handles customs,
        duties, and delivery to your door, for one all-in price. For a first order, DDP removes the biggest
        source of surprise costs. We ship DDP, DAP, or FOB to 60+ countries — ask your supplier which they
        actually offer, since not all factories can manage DDP paperwork themselves.
      </P>

      <H2>9. Be wary of a factory that won&apos;t say who&apos;s actually sewing your order</H2>
      <P>
        Plenty of &ldquo;factories&rdquo; are trading companies that quote you a price, then farm the actual
        production out to a third workshop you&apos;ll never see or vet. Ask directly: is this produced in
        your own facility? A supplier with nothing to hide will tell you exactly where your order is
        physically made — ours is a single 50,000 sq ft floor with 400+ in-house workers, not a network of
        subcontractors.
      </P>

      <H2>10. Test their responsiveness before you commit a single dollar</H2>
      <P>
        How a supplier communicates during the quote stage is the best predictor of how they&apos;ll
        communicate mid-production, when something inevitably needs a decision fast. Send a real question
        with real specs and time the reply. We commit to responding to every quote request within 24
        business hours — if a supplier takes a week to answer a simple question now, expect the same during
        your production run.
      </P>

      <div className="my-10 p-6 rounded-2xl glass-card">
        <h3 className="font-syne font-bold text-white text-lg mb-4 flex items-center gap-2">
          <CheckCircle size={18} className="text-violet-400" /> Quick checklist before you send a deposit
        </h3>
        <ul className="space-y-2.5">
          {[
            "Got a specific MOQ number in writing, not a marketing headline",
            "Verified certifications independently",
            "Confirmed which fabrics are stocked in-house",
            "Received (and approved) a physical sample",
            "Asked for the exact QC checklist, not just \"we do QC\"",
            "Clarified OEM vs ODM vs private label for your specific order",
            "Got category-specific lead times for sample and bulk separately",
            "Confirmed DDP vs FOB shipping terms",
            "Confirmed the order is made in-house, not subcontracted",
            "Timed their response speed before committing",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-white/60 text-sm">
              <CheckCircle size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <H2>FAQ</H2>
      <P>
        <strong className="text-white/80">What&apos;s a realistic MOQ for a new streetwear brand?</strong>
        <br />
        Most reliable factories set custom-design MOQs between 50–100 pieces per style. Anything advertised
        far below that is usually referring to blank, uncustomized stock.
      </P>
      <P>
        <strong className="text-white/80">How long should I budget from first sample to delivered bulk order?</strong>
        <br />
        Plan for roughly 3–5 weeks total: 7–12 days for sampling and revisions, then 14–21 days for bulk
        production depending on the product category, plus shipping time.
      </P>
      <P>
        <strong className="text-white/80">Is it normal for a factory to ask for a deposit before sampling?</strong>
        <br />
        Sample fees are standard and reasonable — it&apos;s a bulk-order deposit before you&apos;ve seen a
        sample that should raise questions.
      </P>

      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/20 text-center">
        <h3 className="font-syne font-bold text-white text-xl mb-3">Ready to run this checklist against a real quote?</h3>
        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
          Send us your product idea, target quantity, and timeline — you&apos;ll get a straight answer on
          MOQ, sample lead time, and pricing within 24 business hours.
        </p>
        <Link href="/contact" className="btn-gradient inline-flex">
          Get A Free Quote <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
