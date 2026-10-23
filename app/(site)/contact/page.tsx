import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { findProduct } from "../products/data";

export const metadata: Metadata = {
  title: "Contact Us — Get A Free Quote",
  description:
    "Get in touch with Mulang Apparel for a free manufacturing quote. WhatsApp, email, or fill out our form — we respond within 24 business hours with pricing and timelines.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product: slug } = await searchParams;
  const product = typeof slug === "string" ? findProduct(slug) : undefined;
  return <ContactClient key={product?.slug ?? "general"} initialProduct={product ? {
    name: product.name, slug: product.slug,
  } : undefined} />;
}
