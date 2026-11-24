import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export function ServiceHero({
  eyebrow, title, description, children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#08080c] px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-20 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-12 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span>
          <Link href="/services" className="hover:text-white">Service</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-200">{eyebrow}</span>
        </nav>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-violet-300">Mulang Apparel · {eyebrow}</p>
            <h1 className="font-syne text-[clamp(2.75rem,5vw,4.75rem)] font-bold leading-[1.03] tracking-tight text-white">{title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-gradient !text-sm">Discuss Your Project</Link>
              <a href="#service-details" className="btn-ghost !text-sm">Explore the Details</a>
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function ServiceCTA({ title, description, relatedHref, relatedLabel }: {
  title: string;
  description: string;
  relatedHref: string;
  relatedLabel: string;
}) {
  return (
    <section className="border-t border-white/10 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-[#101014] to-fuchsia-500/5 px-6 py-12 text-center md:px-16 md:py-16">
        <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">Made for Your Brand</p>
        <h2 className="font-syne text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-300">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-gradient !text-sm">Request a Quote</Link>
          <a href="https://wa.me/8615382890150" target="_blank" rel="noopener noreferrer" className="btn-ghost !text-sm"><MessageCircle size={17} aria-hidden="true" />Chat on WhatsApp</a>
        </div>
        <Link href={relatedHref} className="mt-8 inline-block text-sm text-violet-300 underline underline-offset-4 hover:text-white">{relatedLabel}</Link>
      </div>
    </section>
  );
}

export function ServiceFAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section aria-labelledby="service-faq" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[1fr_1.65fr] md:gap-16">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-violet-300">Before You Order</p>
          <h2 id="service-faq" className="font-syne text-3xl font-bold text-white md:text-4xl">Your Questions,<br />Answered.</h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">Have a detail specific to your order? <Link href="/contact" className="text-violet-300 underline underline-offset-4 hover:text-white">Talk it through with us.</Link></p>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                {question}<ChevronDown aria-hidden="true" size={20} className="mt-1 shrink-0 text-violet-300 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 max-w-2xl pr-6 text-base leading-relaxed text-zinc-300">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceStructuredData({ name, description, path }: { name: string; description: string; path: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name, description, url: `${SITE_URL}${path}`, provider: { "@type": "Organization", name: "Mulang Apparel", url: SITE_URL } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Service", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${path}` },
      ] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
