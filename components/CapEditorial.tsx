import Link from "next/link";
import type { CapCopy } from "@/lib/content/cap-copy";

/**
 * Long-form copy block for the four headwear pages. Server-rendered on purpose:
 * the text exists to be read by a crawler in the initial HTML, not assembled on
 * the client after hydration. It sits below the product detail so it never
 * pushes the gallery out of the first screen.
 */

const DISPLAY = { fontFamily: "var(--font-display)" } as const;

export default function CapEditorial({ copy }: { copy: CapCopy }) {
  return (
    <section className="border-t border-white/[0.07] bg-[#050505]">
      <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <p className="text-[1.02rem] leading-relaxed text-[#a1a1aa] md:text-[1.08rem]">{copy.lead}</p>

        {copy.sections.map((section) => (
          <div key={section.heading} className="mt-12">
            <h2 style={DISPLAY} className="text-xl tracking-tight text-[#f5f5f5] md:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-5 text-[0.97rem] leading-relaxed text-[#a1a1aa]">
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        <div className="mt-14 overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <tbody>
              {copy.specs.map((spec) => (
                <tr key={spec.label} className="border-t border-white/[0.07] first:border-t-0 bg-[#111111]">
                  <th
                    scope="row"
                    className="w-40 px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#52525b]"
                  >
                    {spec.label}
                  </th>
                  <td className="px-5 py-4 text-[#d4d4d8]">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={DISPLAY} className="mt-16 text-xl tracking-tight text-[#f5f5f5] md:text-2xl">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-[#111111]">
          {copy.faqs.map((faq) => (
            <details key={faq.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-[#f5f5f5]">
                <span>{faq.q}</span>
                <span className="mt-0.5 shrink-0 text-[#a78bfa] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#a78bfa]">
            Related headwear
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {copy.siblings.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-[#d4d4d8] transition-colors hover:border-white/35 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
