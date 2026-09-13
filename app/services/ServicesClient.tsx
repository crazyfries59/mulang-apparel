"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle, Camera, Truck, Scissors, Layers, Tag } from "lucide-react";

const SERVICES = [
  {
    id: "prototype",
    icon: Scissors,
    title: "Clothing Prototype",
    tagline: "Your Idea. Our First Sample.",
    img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&q=80",
    desc: "We translate your design concept into a physical sample. Our patternmakers work from sketches, reference images, or tech packs. First proto in 7–12 days.",
    features: ["CAD pattern making", "Size grading", "Material matching", "Unlimited revisions"],
    highlight: "7–12 Days",
    highlightLabel: "First Sample",
  },
  {
    id: "sampling",
    icon: Layers,
    title: "Sample Development",
    tagline: "Perfect The Fit. Nail The Details.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80",
    desc: "From proto to salesman samples. We refine every detail—construction, fit, fabric hand-feel, and decoration placement—until you sign off with confidence.",
    features: ["Proto → SMS workflow", "Fit sessions & revisions", "Fabric swatching", "Tech pack updates"],
    highlight: "100%",
    highlightLabel: "Satisfaction Policy",
  },
  {
    id: "production",
    icon: Scissors,
    title: "Custom Apparel Production",
    tagline: "From 50 Pcs To 50,000 Pcs.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80",
    desc: "Full OEM & ODM manufacturing. 400+ skilled workers, ISO 9001 certified, 42-point QC inspection. Consistent quality across every run, every season.",
    features: ["MOQ from 50 pieces", "OEM & ODM", "42-point QC inspection", "AQL standard testing"],
    highlight: "21–30",
    highlightLabel: "Days Bulk Production",
  },
  {
    id: "labels",
    icon: Tag,
    title: "Labels / Tags / Packaging",
    tagline: "Brand Every Touchpoint.",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
    desc: "Complete private label service. Woven labels, heat transfers, hang tags, custom poly bags, tissue paper, and retail-ready boxes. Your brand, everywhere.",
    features: ["Woven & printed labels", "Custom hang tags", "Branded poly bags", "Gift boxes & tissue"],
    highlight: "Full",
    highlightLabel: "Private Label Service",
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Global Shipping",
    tagline: "Delivered To Your Door.",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80",
    desc: "Door-to-door shipping with full export management. DDP, DAP, FOB—your choice. Real-time tracking, customs clearance, and delivery to 60+ countries.",
    features: ["DDP, DAP & FOB terms", "60+ countries", "Real-time tracking", "Customs documentation"],
    highlight: "60+",
    highlightLabel: "Countries Served",
  },
  {
    id: "photography",
    icon: Camera,
    title: "Product Photography",
    tagline: "Shoot-Ready Content For Your Brand.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    desc: "Studio and lifestyle photography services for your finished garments. We work with professional photographers and models in Guangzhou for fast turnaround.",
    features: ["Studio flat-lay & ghost mannequin", "Model lifestyle shots", "E-commerce ready images", "Social media content"],
    highlight: "3–5",
    highlightLabel: "Days Delivery",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt="Services" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Full-Service Manufacturing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
            Everything Your<br /><span className="gradient-text">Brand Needs</span>
          </motion.h1>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 px-6">
        <div className="container max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ id, icon: Icon, title, tagline, img, desc, features, highlight, highlightLabel }, i) => (
              <AnimatedSection key={id} delay={i * 0.07}>
                <div id={id} className="glass-card overflow-hidden flex flex-col h-full group">
                  {/* Card image */}
                  <div className="relative aspect-[16/9] img-zoom overflow-hidden">
                    <Image src={img} alt={title} fill className="object-cover" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {/* Highlight badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-violet-600 to-pink-500 rounded-xl px-4 py-2">
                      <p className="text-white font-syne font-black text-xl leading-none">{highlight}</p>
                      <p className="text-white/70 text-[0.55rem] tracking-widest uppercase mt-0.5">{highlightLabel}</p>
                    </div>
                    {/* Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center
                      group-hover:bg-violet-500 transition-colors duration-300">
                      <Icon size={18} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="label mb-2">{tagline}</p>
                    <h3 className="font-syne font-black text-white text-lg mb-3 group-hover:text-violet-300 transition-colors">{title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

                    <ul className="space-y-2 mb-6">
                      {features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-white/55">
                          <CheckCircle size={12} className="text-violet-400 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact"
                      className="flex items-center gap-2 text-violet-400 text-xs font-semibold tracking-widest uppercase hover:text-violet-300 transition-colors group/btn">
                      Learn More <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process overview */}
      <section className="py-16 px-6 bg-[#0a0a0a] border-t border-white/5">
        <div className="container max-w-[1200px] mx-auto">
          <AnimatedSection className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <p className="label mb-4">End-To-End Service</p>
              <h2 className="font-syne font-black text-white text-3xl md:text-4xl mb-5 leading-tight">
                One Partner.<br />Every Stage.
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-7 max-w-md">
                From your first sketch to the garment landing at your warehouse—we handle every step. No chasing multiple vendors. No coordination headaches. Just results.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[["500+","Global Clients"],["14+","Years Experience"],["60+","Countries Served"],["42pt","QC Inspection"]].map(([n,l]) => (
                  <div key={l} className="glass-card p-4">
                    <p className="gradient-text font-syne font-black text-2xl">{n}</p>
                    <p className="text-white/35 text-xs tracking-widest uppercase mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden max-w-md">
              <Image src="https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&q=80"
                alt="Factory" fill className="object-cover" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-syne font-black text-white text-3xl mb-5">Ready To Get Started?</h2>
            <p className="text-white/40 text-sm mb-8">Tell us about your project and we&apos;ll put together a detailed plan and quote.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Get A Free Quote <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
