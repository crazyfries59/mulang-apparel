"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle, Scissors, Tag, Package, Rocket, ShoppingBag, Star } from "lucide-react";

const SOLUTIONS = [
  {
    id: "cut-sew",
    icon: Scissors,
    title: "Cut & Sew Customize",
    badge: "Most Popular",
    badgeColor: "bg-violet-500",
    headline: "Your Design. Our Production.",
    desc: "Bring your exact vision to life. We manufacture from your tech packs, sketches, or reference samples. Every seam, every stitch to your specification.",
    img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=900&q=85",
    features: [
      "Pattern making & size grading from your design",
      "Fabric sourcing from 500+ in-stock options",
      "MOQ from 50 pieces per style/color",
      "Bulk production in 21–30 days",
      "42-point quality inspection",
      "Full private labeling available",
    ],
    cta: "Start Cut & Sew",
    highlight: { val: "50 pcs", label: "Minimum Order" },
  },
  {
    id: "logo",
    icon: Star,
    title: "Logo Customize",
    badge: "Quick Turnaround",
    badgeColor: "bg-emerald-500",
    headline: "Blank + Your Branding = Your Brand.",
    desc: "Add your logo to premium blank garments. Screen print, embroidery, DTG, heat transfer—we apply your mark precisely to our quality basics and blanks.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85",
    features: [
      "6 decoration techniques available",
      "Pantone color matching for screen print",
      "Up to 12-thread embroidery",
      "Works on any garment type",
      "MOQ from 50 pieces",
      "7–14 day turnaround",
    ],
    cta: "Apply My Logo",
    highlight: { val: "14 days", label: "Fast Turnaround" },
  },
  {
    id: "blank",
    icon: ShoppingBag,
    title: "Blank Wholesale",
    badge: "Best Value",
    badgeColor: "bg-amber-500",
    headline: "Premium Blanks At Factory Prices.",
    desc: "Stock up on our premium blank garments for your custom decorating business. Consistent quality, consistent sizing, FOB Guangzhou pricing.",
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=85",
    features: [
      "T-shirts from 180–350GSM",
      "Hoodies from 280–420GSM",
      "Mix sizes and colors in same order",
      "FOB Guangzhou pricing",
      "MOQ 100 pcs per style",
      "Consistent dye-lot management",
    ],
    cta: "View Blank Catalog",
    highlight: { val: "$5.99", label: "Starting Price" },
  },
  {
    id: "private-label",
    icon: Tag,
    title: "Private Label Clothing",
    badge: "Full Service",
    badgeColor: "bg-violet-500",
    headline: "Your Label. Our Quality.",
    desc: "Launch your own clothing brand without a factory. We handle design, production, and branding so you can focus on selling. Your name on world-class garments.",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85",
    features: [
      "Custom woven & printed labels",
      "Hang tags, care labels & packing",
      "Brand identity development support",
      "Low MOQ for new brands",
      "Seasonal collection planning",
      "Exclusive designs—never duplicated",
    ],
    cta: "Build My Brand",
    highlight: { val: "100%", label: "Exclusive Designs" },
  },
  {
    id: "startups",
    icon: Rocket,
    title: "For Startups",
    badge: "New Brands",
    badgeColor: "bg-pink-500",
    headline: "Launch Your Clothing Brand Right.",
    desc: "Purpose-built for new fashion entrepreneurs. Low MOQs, flexible sampling, brand consultation, and a dedicated account manager to guide you through your first collection.",
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=85",
    features: [
      "MOQ from 50 pieces (some styles 30 pcs)",
      "Free first consultation call",
      "Dedicated account manager",
      "Brand identity & logo consultation",
      "Tech pack creation service",
      "Step-by-step production guidance",
    ],
    cta: "Launch My Brand",
    highlight: { val: "50 pcs", label: "Startup MOQ" },
  },
  {
    id: "oem-odm",
    icon: Package,
    title: "OEM & ODM",
    badge: "Established Brands",
    badgeColor: "bg-blue-500",
    headline: "Scale Your Production Globally.",
    desc: "For established brands ready to scale. OEM brings your designs to life. ODM lets our team develop new styles based on your market brief. Both to the highest standard.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=85",
    features: [
      "OEM: your designs, our production",
      "ODM: our design team creates for you",
      "High-volume capacity (2M+ pcs/year)",
      "R&D and trend research included in ODM",
      "Seasonal collection development",
      "NDA & IP protection available",
    ],
    cta: "Scale With Us",
    highlight: { val: "2M+", label: "Annual Capacity" },
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt="Solutions" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Find Your Solution
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
            Manufacturing<br /><span className="gradient-text">Solutions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-white/50 text-sm mt-4 max-w-md">
            Whether you&apos;re a startup or an established brand—we have the right solution for your specific needs and budget.
          </motion.p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="py-20 px-6">
        <div className="container max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map(({ id, icon: Icon, title, badge, badgeColor, headline, desc, img, features, cta, highlight }, i) => (
              <AnimatedSection key={id} delay={i * 0.08}>
                <div id={id} className="glass-card overflow-hidden flex flex-col h-full group">
                  {/* Image */}
                  <div className="relative aspect-[16/9] img-zoom overflow-hidden">
                    <Image src={img} alt={title} fill className="object-cover" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 ${badgeColor} rounded-full text-white text-[0.58rem] font-bold tracking-wider uppercase`}>
                      {badge}
                    </div>
                    {/* Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center
                      group-hover:bg-violet-500 transition-colors duration-300">
                      <Icon size={18} className="text-white" />
                    </div>
                    {/* Highlight */}
                    <div className="absolute bottom-4 right-4 text-right">
                      <p className="font-syne font-black text-white text-xl leading-none">{highlight.val}</p>
                      <p className="text-white/50 text-[0.55rem] tracking-widest uppercase mt-0.5">{highlight.label}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="label mb-2">{headline}</p>
                    <h3 className="font-syne font-black text-white text-xl mb-3 group-hover:text-violet-300 transition-colors">{title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

                    <ul className="space-y-2 mb-6">
                      {features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs text-white/55">
                          <CheckCircle size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />{f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact"
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600/10 to-pink-500/10 border border-violet-500/20 rounded-full
                        text-violet-400 text-xs font-bold tracking-wider uppercase hover:border-violet-500/50 hover:from-violet-600/20 hover:to-pink-500/20 transition-all group/btn">
                      {cta} <ArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-6 bg-[#0a0a0a] border-t border-white/5">
        <div className="container max-w-[1200px] mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="label mb-4">Quick Comparison</p>
            <h2 className="font-syne font-black text-white text-3xl">Which Solution Is Right For You?</h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-4 pr-6 text-white/30 text-xs uppercase tracking-widest font-medium w-40">Solution</th>
                    {["MOQ", "Lead Time", "Custom Design", "Private Label", "Best For"].map(h => (
                      <th key={h} className="text-left py-4 px-4 text-white/30 text-xs uppercase tracking-widest font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cut & Sew",      "50 pcs",  "21–30d", "✓ Full",   "✓ Full", "Brands with designs"],
                    ["Logo Customize", "50 pcs",  "7–14d",  "✓ Deco",   "✓ Basic","Print-on-demand"],
                    ["Blank Wholesale","100 pcs", "3–7d",   "✗",        "✗",      "Decorators & resellers"],
                    ["Private Label",  "50 pcs",  "25–35d", "✓ Full",   "✓ Full", "Brand launchers"],
                    ["For Startups",   "30–50pcs","14–21d", "✓ Full",   "✓ Full", "First-time founders"],
                    ["OEM / ODM",      "200 pcs", "30–45d", "✓ Full",   "✓ Full", "Established brands"],
                  ].map(([sol, ...vals], i) => (
                    <tr key={sol} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="py-4 pr-6 font-syne font-bold text-white text-sm">{sol}</td>
                      {vals.map((v, j) => (
                        <td key={j} className={`py-4 px-4 text-sm ${
                          v.startsWith("✓") ? "text-violet-400 font-medium" : v.startsWith("✗") ? "text-white/20" : "text-white/55"
                        }`}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-syne font-black text-white text-3xl mb-5">Not Sure Which Solution Fits?</h2>
            <p className="text-white/40 text-sm mb-8">Tell us about your brand and we&apos;ll recommend the right path forward. Free consultation, no commitment.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Get A Free Consultation <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
