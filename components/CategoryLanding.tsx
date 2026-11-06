import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/(site)/products/data";

/**
 * Shared layout for the category landing pages (/t-shirt-manufacturer,
 * /custom-hoodie-manufacturer). Server component on purpose: these pages exist
 * to rank for commercial keywords, so the copy has to be in the initial HTML
 * rather than assembled on the client. The FAQ uses <details> so it needs no JS.
 */

export type LandingGroup = { title: string; body: string; href: string };
export type LandingWeight = { weight: string; fabric: string; best: string };
export type LandingProgram = { title: string; body: string; href: string; cta: string };
export type LandingFaq = { q: string; a: string };
export type LandingSpec = { label: string; value: string };

export type LandingConfig = {
  eyebrow: string;
  h1: string;
  lead: string;
  ctas: { href: string; label: string }[];
  specs: LandingSpec[];
  intro: { title: string; paragraphs: string[] };
  groups: LandingGroup[];
  weight: { title: string; note: string; rows: LandingWeight[]; link: { href: string; label: string } };
  finishing: { title: string; items: { name: string; body: string }[]; link: { href: string; label: string } };
  programs: LandingProgram[];
  logisticsTitle: string;
  logistics: LandingSpec[];
  productsTitle: string;
  productsNote: string;
  productsLink: { href: string; label: string };
  faqs: LandingFaq[];
  relatedTitle: string;
  related: { href: string; label: string }[];
  faqHeading: string;
};

const DISPLAY = { fontFamily: "var(--font-display)" } as const;

export default function CategoryLanding({
  config,
  products,
}: {
  config: LandingConfig;
  products: Product[];
}) {
  return (
    <main className="bg-[#050505] text-[#f5f5f5]">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-14 md:pt-40 md:pb-20">
        <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#a78bfa]">
          {config.eyebrow}
        </p>
        <h1
          style={DISPLAY}
          className="max-w-4xl text-[2.1rem] leading-[1.12] tracking-tight md:text-[3.4rem]"
        >
          {config.h1}
        </h1>
        <p className="mt-7 max-w-3xl text-[1.02rem] leading-relaxed text-[#a1a1aa] md:text-[1.1rem]">
          {config.lead}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          {config.ctas.map((cta, index) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={
                index === 0
                  ? "rounded-full bg-[#8b5cf6] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed]"
                  : "rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-white/35"
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-4">
          {config.specs.map((spec) => (
            <div key={spec.label} className="bg-[#0d0d0d] px-5 py-6">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#52525b]">
                {spec.label}
              </dt>
              <dd style={DISPLAY} className="mt-2 text-2xl text-[#f5f5f5]">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.intro.title}
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-[#a1a1aa]">
          {config.intro.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* What we make */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          What We Make
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {config.groups.map((group) => (
            <Link
              key={group.title}
              href={group.href}
              className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-6 transition-colors hover:border-[#8b5cf6]/45 hover:bg-[#171717]"
            >
              <h3 className="text-base font-semibold text-[#f5f5f5]">{group.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">{group.body}</p>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-[#a78bfa] group-hover:text-[#c4b5fd]">
                View styles →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Weight guide */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.weight.title}
        </h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#0d0d0d] text-[0.65rem] uppercase tracking-[0.18em] text-[#52525b]">
                <th scope="col" className="px-5 py-4 font-semibold">Weight</th>
                <th scope="col" className="px-5 py-4 font-semibold">Fabric</th>
                <th scope="col" className="px-5 py-4 font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody>
              {config.weight.rows.map((row) => (
                <tr key={row.weight} className="border-t border-white/[0.07] bg-[#111111]">
                  <th scope="row" className="px-5 py-4 font-mono text-xs font-semibold text-[#a78bfa]">
                    {row.weight}
                  </th>
                  <td className="px-5 py-4 text-[#a1a1aa]">{row.fabric}</td>
                  <td className="px-5 py-4 text-[#a1a1aa]">{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#52525b]">{config.weight.note}</p>
        <Link href={config.weight.link.href} className="mt-3 inline-block text-sm font-semibold text-[#a78bfa] hover:text-[#c4b5fd]">
          {config.weight.link.label} →
        </Link>
      </section>

      {/* Finishing */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.finishing.title}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {config.finishing.items.map((item) => (
            <li key={item.name} className="rounded-xl border border-white/[0.07] bg-[#111111] p-5">
              <p className="text-sm font-semibold text-[#f5f5f5]">{item.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{item.body}</p>
            </li>
          ))}
        </ul>
        <Link href={config.finishing.link.href} className="mt-4 inline-block text-sm font-semibold text-[#a78bfa] hover:text-[#c4b5fd]">
          {config.finishing.link.label} →
        </Link>
      </section>

      {/* Two programs */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          Two Ways to Order
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {config.programs.map((program) => (
            <div key={program.title} className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
              <h3 className="text-lg font-semibold text-[#f5f5f5]">{program.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#a1a1aa]">{program.body}</p>
              <Link href={program.href} className="mt-5 inline-block text-sm font-semibold text-[#a78bfa] hover:text-[#c4b5fd]">
                {program.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Logistics */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.logisticsTitle}
        </h2>
        <dl className="mt-8 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-[#111111]">
          {config.logistics.map((item) => (
            <div key={item.label} className="grid gap-1 px-6 py-5 md:grid-cols-[13rem_1fr] md:gap-6">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#52525b]">
                {item.label}
              </dt>
              <dd className="text-sm leading-relaxed text-[#a1a1aa]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Real products */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.productsTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a1a1aa]">{config.productsNote}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111] transition-colors hover:border-[#8b5cf6]/45"
            >
              <div className="relative aspect-square bg-[#141414]">
                {product.img ? (
                  <Image
                    src={product.img}
                    alt={`${product.name} — custom manufacturing by Mulang Apparel`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                {product.gsm !== "—" ? (
                  <span className="absolute left-3 top-3 rounded-md bg-black/85 px-2.5 py-1 text-[0.6rem] font-bold tracking-wide text-white backdrop-blur-sm">
                    {product.gsm}
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-[0.7rem] font-mono text-[#52525b]">{product.id}</p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[#f5f5f5]">
                  {product.name}
                </p>
                <p className="mt-2 text-xs text-[#a1a1aa]">
                  MOQ {product.moq} · FOB from {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link href={config.productsLink.href} className="mt-6 inline-block rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-white/35">
          {config.productsLink.label} →
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 style={DISPLAY} className="text-2xl md:text-[2rem]">
          {config.faqHeading}
        </h2>
        <div className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {config.faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.98rem] font-semibold text-[#f5f5f5]">
                {faq.q}
                <span className="mt-0.5 shrink-0 text-[#8b5cf6] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#a1a1aa]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related + CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6 md:pb-32">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-8 md:p-10">
          <h2 style={DISPLAY} className="text-xl md:text-2xl">
            {config.relatedTitle}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {config.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-semibold text-[#a78bfa] hover:text-[#c4b5fd]">
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-[#8b5cf6] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed]"
            >
              Request a quote
            </Link>
            <Link
              href="/solutions"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-white/35"
            >
              See manufacturing solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
