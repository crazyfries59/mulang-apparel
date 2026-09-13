import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Get A Free Quote",
  description:
    "Get in touch with Mulang Apparel for a free manufacturing quote. WhatsApp, email, or fill out our form — we respond within 24 business hours with pricing and timelines.",
};

export default function ContactPage() {
  return <ContactClient />;
}
