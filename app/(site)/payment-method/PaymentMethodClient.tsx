"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";

type Field = { label: string; value: string };

type Account = {
  flag: string;
  region: string;
  bank: string;
  currency: string;
  method: string;
  anchor: string;
  fields: Field[];
  remarks?: string;
};

/* Account details are copied from the XTransfer "export all accounts" export.
   Only the fields a buyer needs to make a payment are shown - no internal notes,
   compliance paragraphs or restricted-country lists. */
const ACCOUNTS: Account[] = [
  {
    flag: "🌐",
    region: "Global Account",
    bank: "JPMorgan Chase Bank, N.A., Hong Kong Branch",
    currency: "Multi-currency",
    method: "SWIFT / CHATS / FPS payment",
    anchor: "global",
    fields: [
      { label: "Account number", value: "63004294296" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "CHASHKHH" },
      { label: "Bank code / Branch code", value: "007 / 863" },
      { label: "Bank name", value: "JPMorgan Chase Bank, N.A., Hong Kong Branch" },
      { label: "Bank address", value: "18/F, 20/F, 22-29/F, CHATER HOUSE, 8 CONNAUGHT ROAD CENTRAL, HONG KONG" },
    ],
  },
  {
    flag: "🇺🇸",
    region: "USA Local Bank Account",
    bank: "Community Federal Savings Bank",
    currency: "USD",
    method: "ACH / Fedwire payment",
    anchor: "usa",
    fields: [
      { label: "Account number", value: "8335582789" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "ABA / Routing number", value: "026073008 (Fedwire) · 026073150 (ACH)" },
      { label: "Bank name", value: "Community Federal Savings Bank" },
      { label: "Bank address", value: "5 Penn Plaza, 14th Floor, New York, NY 10001" },
    ],
  },
  {
    flag: "🇨🇦",
    region: "Canada Local Bank Account",
    bank: "Digital Commerce Bank",
    currency: "CAD",
    method: "EFT payment",
    anchor: "canada",
    fields: [
      { label: "Account number", value: "969264597" },
      { label: "Account name", value: "Shantou Longhu District Mulang Department Store Sole Proprietorship" },
      { label: "Bank name", value: "Digital Commerce Bank" },
      { label: "Bank address", value: "736 Meridian Road N.E, Calgary, Alberta, CA" },
      { label: "Routing number", value: "035210009" },
      { label: "Clearing system", value: "EFT" },
    ],
    remarks: "Please include the following contents to your receiver when making a payment: [Seller Name]; [Product]; [PI/Contract Number]",
  },
  {
    flag: "🇬🇧",
    region: "UK Local Bank Account",
    bank: "Banking Circle S.A. UK Branch",
    currency: "GBP",
    method: "CHAPS / BACS / FPS payment",
    anchor: "uk",
    fields: [
      { label: "Account number", value: "47351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SAPYGB2L" },
      { label: "Sort code", value: "608382" },
      { label: "Bank name", value: "Banking Circle S.A. UK Branch" },
      { label: "Bank address", value: "24 King William Street, London, EC4R 9AT" },
    ],
  },
  {
    flag: "🇪🇺",
    region: "EU Local Bank Account",
    bank: "Banking Circle S.A. UK Branch",
    currency: "EUR",
    method: "SEPA Inst / SEPA SCT payment",
    anchor: "eu",
    fields: [
      { label: "IBAN", value: "GB33SAPY60838247351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SAPYGB2L" },
      { label: "Bank name", value: "Banking Circle S.A. UK Branch" },
      { label: "Bank address", value: "24 King William Street, London, EC4R 9AT" },
    ],
  },
  {
    flag: "🇩🇰",
    region: "Denmark Local Bank Account",
    bank: "Banking Circle Denmark",
    currency: "DKK",
    method: "DKK local payment",
    anchor: "denmark",
    fields: [
      { label: "Account number", value: "0047351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SXPYDKKK" },
      { label: "Reg number", value: "8900" },
      { label: "Bank name", value: "Banking Circle Denmark" },
      { label: "Bank address", value: "Lautrupsgade 13-15, 2100 Copenhagen" },
    ],
  },
  {
    flag: "🇦🇺",
    region: "Australia Local Bank Account",
    bank: "JPMorgan Chase Bank, N.A.",
    currency: "AUD",
    method: "ACH / Instant payment",
    anchor: "australia",
    fields: [
      { label: "Account number", value: "492389771" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "BSB", value: "212200" },
      { label: "Bank name", value: "JPMorgan Chase Bank, National Association" },
      { label: "Bank address", value: "Level 35, 259 George St, Sydney, New South Wales 2000, Australia" },
    ],
  },
  {
    flag: "🇳🇬",
    region: "Nigeria Local Bank Account",
    bank: "Zenith Bank Plc",
    currency: "NGN",
    method: "NIBSS local payment",
    anchor: "nigeria",
    fields: [
      { label: "Account number", value: "1962973386" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "ZEIBNGLAXXX" },
      { label: "Bank code", value: "057" },
      { label: "Bank name", value: "Zenith Bank Plc" },
      { label: "Bank address", value: "87 AJOSE ADEOGUN STREET, ZENITH HEIGHTS, VICTORIA ISLAND, Nigeria" },
    ],
  },
];

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
              <a href="https://wa.me/8615382890150" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp Us</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
