"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { MessageCircle, Mail, MapPin, CheckCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", whatsapp: "",
    productType: "", quantity: "", message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your message — please try WhatsApp instead, or email sales@lin6666.top directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-16 px-6 border-b border-white/5">
        <div className="container">
          <AnimatedSection>
            <p className="label mb-5">Get In Touch</p>
            <h1 className="heading-xl mb-5">
              Start Your<br />
              <span className="gradient-text">Project Today</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg">
              Tell us about your brand and what you need. We respond to all inquiries within 24 hours with a detailed quote.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact grid */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

            {/* Left — Info */}
            <AnimatedSection direction="left" className="space-y-10">
              {/* Contact cards */}
              <div className="space-y-4">
                {[
                  { icon: MessageCircle, label: "WhatsApp", val: "+86 159 8621 3212", href: "https://wa.me/8615986213212", accent: "#25D366" },
                  { icon: Mail,          label: "Email",    val: "sales@lin6666.top",  href: "mailto:sales@lin6666.top",  accent: "#8b5cf6" },
                  { icon: MapPin,        label: "Factory",  val: "Guangzhou, Guangdong, China", href: "#", accent: "#ec4899" },
                ].map(({ icon: Icon, label, val, href, accent }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="glass-card p-5 flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${accent}18` }}>
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-white/30 text-[0.6rem] tracking-widest uppercase mb-0.5">{label}</p>
                      <p className="text-white font-medium text-sm group-hover:text-violet-300 transition-colors">{val}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="rounded-2xl overflow-hidden border border-white/7">
                <div className="bg-[#25D366] p-5">
                  <p className="text-white font-syne font-bold">Prefer to chat directly?</p>
                  <p className="text-white/75 text-sm mt-1">Get an instant response on WhatsApp</p>
                </div>
                <div className="bg-[#111] p-5">
                  <a
                    href="https://wa.me/8615986213212?text=Hi%20Mulang%20Apparel!%20I'm%20interested%20in%20custom%20clothing%20manufacturing."
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={14} /> Message Us On WhatsApp
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="glass-card p-6">
                <p className="label mb-4">Business Hours</p>
                <div className="space-y-2.5 text-sm">
                  {[["Mon – Fri", "9:00 AM – 6:00 PM CST"], ["Saturday", "10:00 AM – 3:00 PM CST"], ["Sunday", "Closed"]].map(([d, t]) => (
                    <div key={d} className="flex justify-between">
                      <span className="text-white/40">{d}</span>
                      <span className="text-white/70">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Right — Form */}
            <AnimatedSection direction="right">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center glass-card p-12"
                >
                  <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mb-6">
                    <CheckCircle size={38} className="text-violet-400" />
                  </div>
                  <h3 className="font-syne font-black text-2xl text-white mb-3">Message Received!</h3>
                  <p className="text-white/45 text-sm leading-relaxed max-w-xs mb-8">
                    Thank you for reaching out. We&apos;ll review your inquiry and respond within 24 business hours with a detailed quote.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-ghost">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="glass-card p-8 space-y-5">
                  <div className="pb-2 border-b border-white/6">
                    <p className="label">Request A Quote</p>
                  </div>

                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    {[["name","Name *","Your name","text",true], ["company","Company","Brand name","text",false]].map(([n,l,ph,t,req]) => (
                      <div key={n as string}>
                        <label className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-1.5">{l as string}</label>
                        <input type={t as string} name={n as string} required={!!req}
                          value={form[n as keyof typeof form]} onChange={onChange} placeholder={ph as string}
                          className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
                      </div>
                    ))}
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    {[["email","Email *","your@email.com","email",true], ["whatsapp","WhatsApp","+1 234 567 890","text",false]].map(([n,l,ph,t,req]) => (
                      <div key={n as string}>
                        <label className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-1.5">{l as string}</label>
                        <input type={t as string} name={n as string} required={!!req}
                          value={form[n as keyof typeof form]} onChange={onChange} placeholder={ph as string}
                          className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
                      </div>
                    ))}
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-1.5">Product Type</label>
                      <select name="productType" value={form.productType} onChange={onChange}
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors">
                        <option value="" className="bg-[#111]">Select type...</option>
                        {["Oversized T-Shirts","Hoodies","Tracksuits","Jackets","Cargo Pants","Custom Sets","Other"].map(o =>
                          <option key={o} value={o} className="bg-[#111]">{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-1.5">Quantity</label>
                      <input type="text" name="quantity" value={form.quantity} onChange={onChange} placeholder="e.g. 200 pcs"
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[0.6rem] tracking-widest uppercase text-white/30 mb-1.5">Project Details *</label>
                    <textarea name="message" required rows={4} value={form.message} onChange={onChange}
                      placeholder="Describe your project: fabric weight, colors, printing techniques, timeline, brand references..."
                      className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none" />
                  </div>

                  {error && (
                    <p className="text-center text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl py-2.5 px-4">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full btn-gradient justify-center py-4 rounded-xl disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : <><Send size={14} /> Submit Inquiry</>}
                  </button>

                  <p className="text-center text-white/20 text-xs">
                    We respond within 24 hours · All inquiries are confidential
                  </p>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm bg-[#0a0a0a] border-t border-white/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[["< 24h", "Response Time"], ["7-12", "Days Sampling"], ["50+", "Min. MOQ"], ["60+", "Countries Served"]].map(([n, l]) => (
              <AnimatedSection key={l}>
                <p className="font-syne font-black text-3xl gradient-text mb-1">{n}</p>
                <p className="text-white/30 text-xs tracking-widest uppercase">{l}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
