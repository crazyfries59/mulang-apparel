"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle } from "lucide-react";

const TIMELINE = [
  { year: "2010", ev: "Founded in Guangzhou with 12 workers and a mission to democratize premium manufacturing." },
  { year: "2013", ev: "Expanded to 5,000 sq ft. First international client from the UK." },
  { year: "2016", ev: "Launched OEM/ODM division. 100+ brand clients across 20 countries." },
  { year: "2019", ev: "Moved to 50,000 sq ft state-of-the-art facility. ISO 9001 certification achieved." },
  { year: "2022", ev: "2M+ garments produced annually. 400+ skilled workers. 50+ countries served." },
  { year: "2024", ev: "500+ global brand partners. Trusted manufacturer for streetwear, luxury, and DTC brands." },
];

const TEAM = [
  { name: "David Chen", role: "Founder & CEO",         img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
  { name: "Sarah Liu",  role: "Head of Design",         img: "https://images.unsplash.com/photo-1494790108755-2616b9d8b7c7?w=500&q=80" },
  { name: "Marcus Wong",role: "Production Director",    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80" },
  { name: "Emily Zhang",role: "Quality Control Manager",img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80" },
];

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
            Crafting Excellence<br /><span className="gradient-text">Since 2010</span>
          </motion.h1>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a0a0a] border-b border-white/5 py-10 px-6">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["14+","Years","Experience"],["500+","Brand","Clients"],["60+","Countries","Served"],["98%","On-Time","Delivery"]].map(([n,l1,l2]) => (
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
                Today we operate a 50,000 sq ft state-of-the-art facility with 400+ expert workers, serving 500+ brands across 60+ countries. From your first 50-piece sample to 50,000-piece collections—we scale with you.
              </p>
              <div className="space-y-3 pt-2">
                {["ISO 9001 Quality Certified","500+ premium fabrics in stock","14 in-house decoration techniques","Export to 60+ countries"].map(t => (
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

      {/* Timeline */}
      <section className="section bg-[#0a0a0a] border-t border-white/5">
        <div className="container max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="label mb-4">Our Journey</p>
            <h2 className="heading-xl">Milestones</h2>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
            {TIMELINE.map(({ year, ev }, i) => (
              <AnimatedSection key={year} delay={i * 0.08} className="relative mb-10">
                <div className={`flex gap-8 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                    <p className="font-syne font-black text-2xl gradient-text mb-2">{year}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{ev}</p>
                  </div>
                  <div className="hidden md:flex w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0 mt-1 z-10 shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <p className="label mb-4">The People</p>
            <h2 className="heading-xl">Our Team</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img }, i) => (
              <AnimatedSection key={name} delay={i * 0.1} className="group text-center">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                  <Image src={img} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-pink-500/0 group-hover:from-violet-600/15 group-hover:to-pink-500/15 transition-all duration-400" />
                </div>
                <p className="font-syne font-bold text-white text-sm">{name}</p>
                <p className="text-white/35 text-xs tracking-widest uppercase mt-1">{role}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="heading-lg mb-5">Want To Tour Our Facility?</h2>
            <p className="text-white/40 text-sm mb-8">Schedule a virtual factory tour or visit us in Guangzhou.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Book A Tour <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
