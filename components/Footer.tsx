"use client";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Mail, MapPin } from "lucide-react";

const LINKS = {
  Company:  [
    { label: "About Us",       href: "/about"         },
    { label: "Manufacturing",  href: "/manufacturing" },
    { label: "Portfolio",      href: "/portfolio"     },
    { label: "Blog",           href: "/blog"          },
    { label: "Contact",        href: "/contact"       },
  ],
  Products: [
    { label: "Oversized T-Shirts",    href: "/products" },
    { label: "Hoodies & Sweatshirts", href: "/products" },
    { label: "Tracksuits & Sets",     href: "/products" },
    { label: "Jackets & Outerwear",   href: "/products" },
    { label: "Cargo Pants & Shorts",  href: "/products" },
  ],
  Services: [
    { label: "OEM Manufacturing",  href: "/services" },
    { label: "ODM Development",    href: "/services" },
    { label: "Private Label",      href: "/services" },
    { label: "Custom Printing",    href: "/services" },
    { label: "Brand Packaging",    href: "/services" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      {/* Top CTA strip */}
      <div className="border-b border-white/5 py-12 px-6">
        <div className="container-wide mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="label mb-2">Ready To Scale?</p>
            <h3 className="font-syne font-bold text-2xl text-white">
              Let&apos;s Build Your Brand Together
            </h3>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn-gradient">Get A Free Quote</Link>
            <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="py-16 px-6">
        <div className="container-wide mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <p className="font-syne font-black text-lg tracking-widest uppercase text-white">MULANG</p>
              <p className="font-syne font-light text-lg tracking-widest uppercase text-white/35">APPAREL</p>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Premium streetwear and private label clothing manufacturer. Serving global fashion brands since 2010.
            </p>
            <div className="space-y-3">
              <a href="https://wa.me/8615986213212" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/45 hover:text-[#25D366] transition-colors group">
                <MessageCircle size={14} className="flex-shrink-0" />
                +86 159 8621 3212
              </a>
              <a href="mailto:sales@lin6666.top"
                className="flex items-center gap-2.5 text-sm text-white/45 hover:text-violet-400 transition-colors">
                <Mail size={14} className="flex-shrink-0" />
                sales@lin6666.top
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/45">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                Guangzhou, Guangdong, China
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="label mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group">
                      {label}
                      <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="container-wide mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <p>© 2024 Mulang Apparel Co., Ltd. All rights reserved.</p>
          <p>Custom Clothing Manufacturer · Guangzhou, China</p>
        </div>
      </div>
    </footer>
  );
}
