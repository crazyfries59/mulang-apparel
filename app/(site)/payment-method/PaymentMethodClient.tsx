"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";
import { ACCOUNTS } from "./data";

export default function PaymentMethodClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="relative container max-w-[1200px] mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="label mb-4">
            Easy & Secure Payment
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[1.05] tracking-tight text-4xl md:text-6xl">
            Payment <span className="gradient-text">Methods</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/45 text-sm md:text-base mt-5 max-w-2xl leading-relaxed">
            Pay in your local currency through a bank account in your region. Choose the option below that works best for you.
          </motion.p>
        </div>
      </section>

      {/* Payment terms */}
      <section className="px-6 pb-4">
        <div className="container max-w-[1200px] mx-auto">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 md:p-8 border-violet-500/20">
              <h2 className="font-syne font-bold text-white text-lg mb-5">Payment Term</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="label mb-1.5">Sample</p>
                  <p className="text-white/55 text-sm leading-relaxed">Full payment before we make the sample.</p>
                </div>
                <div>
                  <p className="label mb-1.5">Bulk order</p>
                  <p className="text-white/55 text-sm leading-relaxed">50% deposit to start production, full balance before shipment.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Accounts */}
      <section className="py-14 px-6">
        <div className="container max-w-[1200px] mx-auto">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-12">
              <p className="label mb-4">On this page</p>
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {ACCOUNTS.map((a) => (
                  <a key={a.anchor} href={`#${a.anchor}`}
                    className="text-sm text-white/50 hover:text-violet-300 transition-colors">
                    {a.flag} {a.region}
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="space-y-8">
            {ACCOUNTS.map((a, i) => (
              <AnimatedSection key={a.anchor}>
                <div id={a.anchor} className="glass-card rounded-2xl overflow-hidden scroll-mt-24">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-6 md:p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl leading-none" aria-hidden="true">{a.flag}</span>
                      <div>
                        <h2 className="font-syne font-bold text-white text-xl md:text-2xl">
                          {i + 1}. {a.region}
                        </h2>
                        <p className="text-white/35 text-xs mt-1">{a.bank}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                      {a.currency}
                    </span>
                  </div>
                  <div className="p-6 md:p-8">
                    <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                      {a.fields.map((f) => (
                        <div key={f.label}>
                          <dt className="label mb-1.5">{f.label}</dt>
                          <dd className="text-white/75 text-sm break-words leading-relaxed">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-7 pt-5 border-t border-white/5 space-y-2">
                      <p className="text-white/35 text-xs">Payment method: {a.method}</p>
                      {a.remarks && <p className="text-white/35 text-xs leading-relaxed">{a.remarks}</p>}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-syne font-black text-white text-3xl mb-5">Need Help With Payment?</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              If your preferred method is not listed here, contact us and we will work it out with you.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="btn-gradient">Contact Us <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
