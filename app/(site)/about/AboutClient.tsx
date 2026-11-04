"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1800&q=80"
          alt="Mulang Factory" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,7vw,7rem)" }}>
            Crafting Excellence<br /><span className="gradient-text">In Guangzhou</span>
          </motion.h1>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a0a0a] border-b border-white/5 py-10 px-6">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["50","Pcs","Blank & Logo MOQ"],["100","Pcs","Cut & Sew MOQ"],["1","Piece","Sampling"],["5–20","Days","Sample Time"]].map(([n,l1,l2]) => (
            <AnimatedSection key={l1}>
              <p className="font-syne font-black text-4xl gradient-text leading-none">{n}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase mt-2">{l1} {l2}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left" className="space-y-6">
              <p className="label">Who We Are</p>
              <h2 className="heading-xl">More Than<br />A Manufacturer</h2>
              <p className="text-white/45 text-sm leading-relaxed">
                Mulang Apparel was founded in Guangzhou&apos;s garment district with a single belief: every emerging fashion brand deserves access to the same quality manufacturing previously reserved for global giants.
              </p>
              <p className="text-white/45 text-sm leading-relaxed">
                We make blanks, logo-customized blanks and full cut &amp; sew collections for brands in the US, Australia, Switzerland, Canada, the UK and New Zealand. Start with 50 pieces across mixed styles, colors and sizes—or 100 pieces per style per color for cut &amp; sew—and scale as you grow.
              </p>
              <div className="space-y-3 pt-2">
                {["OEM & ODM manufacturing","Single-piece sampling","Printed, embroidered, silicone & woven logos","Shipping to the US, Australia, Europe & beyond"].map(t => (
                  <div key={t} className="flex items-center gap-3 text-sm text-white/55">
                    <CheckCircle size={14} className="text-violet-400 flex-shrink-0" />{t}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80" alt="Production" fill className="object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="QC" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" alt="Team" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="heading-lg mb-5">Ready To Start Your Line?</h2>
            <p className="text-white/40 text-sm mb-8">Send us your design, tech pack or reference images and we&apos;ll recommend the right route.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Get A Quote <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
