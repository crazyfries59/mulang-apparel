"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";

/* 18 garment techniques, grouped the same way buyers search for them.
   Every image lives locally under /images/technology/<group>/<slug>.jpg so
   factory photos can replace the current set one-for-one without code edits.
   hasPhoto=false renders a placeholder until the final shot lands. */
const TECH_GROUPS: {
  id: string;
  title: string;
  subtitle: string;
  items: { name: string; slug: string; desc: string; hasPhoto?: boolean }[];
}[] = [
  {
    id: "printing",
    title: "Printing Techniques",
    subtitle: "From classic screen prints to full-color transfers.",
    items: [
      { name: "Screen Printing", slug: "screen-printing", desc: "Thick, opaque plastisol layers with Pantone color matching — the standard for bold graphics and large runs.", hasPhoto: true },
      { name: "DTF Printing", slug: "dtf-printing", desc: "Full-color transfer film printing with crisp edges and a soft hand feel. Works on cotton, poly and blends.", hasPhoto: true },
      { name: "DTG Printing", slug: "dtg-printing", desc: "Water-based ink printed directly onto the garment. Best for photographic, multi-color artwork.", hasPhoto: true },
      { name: "Puff Printing", slug: "puff-printing", desc: "Heat-activated ink that rises into a raised 3D layer — the streetwear staple for logos and lettering.", hasPhoto: true },
      { name: "Rubber Printing", slug: "rubber-printing", desc: "Dense, flexible rubber-like ink with a smooth raised surface and a slightly glossy finish.", hasPhoto: true },
      { name: "Reflective Printing", slug: "reflective-printing", desc: "Light-reactive print that glows under flash or headlights. Technical and nightlife-ready.", hasPhoto: true },
    ],
  },
  {
    id: "embroidery",
    title: "Embroidery",
    subtitle: "Stitched detail that outlasts the garment.",
    items: [
      { name: "Flat Embroidery", slug: "flat-embroidery", desc: "Clean, precise stitching in unlimited thread colors. The standard for logos and wordmarks.", hasPhoto: true },
      { name: "3D Embroidery", slug: "3d-embroidery", desc: "Foam-backed stitching that stands proud of the fabric for a dimensional, premium logo effect.", hasPhoto: true },
      { name: "Terry Embroidery", slug: "terry-embroidery", desc: "Chenille loops with a thick, fuzzy texture — varsity lettering and retro streetwear looks.", hasPhoto: true },
      { name: "Appliqué Embroidery", slug: "applique-embroidery", desc: "Cut fabric pieces stitched onto the garment for layered, textured, oversized graphics.", hasPhoto: true },
      { name: "Embroidery Patch", slug: "embroidery-patch", desc: "Pre-made embroidered patches stitched or heat-fused on — high detail, easy to re-order.", hasPhoto: true },
    ],
  },
  {
    id: "finishing",
    title: "Special Techniques",
    subtitle: "Texture, shine and detailing beyond ink and thread.",
    items: [
      { name: "Rhinestone", slug: "rhinestone", desc: "Heat-fixed crystal studs that catch the light — bold front logos and full-panel patterns.", hasPhoto: true },
      { name: "Flocking", slug: "flocking", desc: "Velvet-soft fiber finish applied to the garment surface for a raised, suede-like feel.", hasPhoto: true },
      { name: "Embossing", slug: "embossing", desc: "High-pressure heat embossing that presses tone-on-tone logos into the fabric itself.", hasPhoto: true },
      { name: "Laser Engraving", slug: "laser-engraving", desc: "Precision laser burning for washed-in graphics, distressing and intricate cut-out detail.", hasPhoto: true },
    ],
  },
];

export default function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <Image src="/images/technology/hero-decoration.jpg"
          alt="Gold foil decoration detail on a custom streetwear hoodie" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="label mb-5">
            Custom Apparel Craftsmanship
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
            Decoration{" "}<br /><span className="gradient-text">Techniques</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-white/50 text-sm mt-4 max-w-md">
            15 printing, embroidery and finishing techniques for streetwear, sportswear and private-label programs.
          </motion.p>
        </div>
      </section>

      {/* Technique galleries */}
      <section className="py-20 px-6">
        <div className="container max-w-[1200px] mx-auto space-y-24">
          {TECH_GROUPS.map(({ id, title, subtitle, items }) => (
            <div key={id} id={id}>
              <AnimatedSection>
                <div className="mb-10">
                  <span className="label">{title}</span>
                  <h2 className="font-syne font-black text-white text-3xl md:text-4xl mt-2 leading-tight">{subtitle}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(({ name, slug, desc, hasPhoto }) => (
                    <div key={slug}
                      className="group glass-card overflow-hidden rounded-2xl hover:border-violet-500/30 transition-all">
                      <div className="relative aspect-[4/3] overflow-hidden img-zoom">
                        {hasPhoto ? (
                          <Image src={`/images/technology/${id}/${slug}.jpg`}
                            alt={`${name} technique on custom apparel`} fill
                            className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-500/10 via-transparent to-violet-500/5">
                            <span className="label !text-white/25">{name} — Photo coming soon</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-syne font-bold text-white text-sm mb-2 group-hover:text-violet-300 transition-colors">{name}</h3>
                        <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-syne font-black text-white text-3xl mb-5">Not Sure Which Technique Fits?</h2>
            <p className="text-white/40 text-sm mb-8">Send us your design and we&apos;ll recommend the right technique, then quote a sample.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="btn-gradient">Get A Technique Recommendation <ArrowRight size={13} /></Link>
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
            <p className="text-white/25 text-xs mt-8 leading-relaxed">
              Applied across our{" "}
              <Link href="/t-shirt-manufacturer" className="text-white/45 hover:text-violet-300 underline underline-offset-2">custom T-shirt production</Link>,{" "}
              <Link href="/custom-hoodie-manufacturer" className="text-white/45 hover:text-violet-300 underline underline-offset-2">hoodie manufacturing</Link>{" "}
              and{" "}
              <Link href="/custom-streetwear-manufacturer" className="text-white/45 hover:text-violet-300 underline underline-offset-2">streetwear programs</Link>.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
