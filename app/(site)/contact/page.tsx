import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getPublicProduct } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Contact Us — Get A Free Quote",
  description:
    "Get a free clothing manufacturing quote from Mulang Apparel. Send your design, tech pack or reference images by WhatsApp, email or our form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product: slug } = await searchParams;
  const product = typeof slug === "string" ? await getPublicProduct(slug) : undefined;
  return <ContactClient key={product?.slug ?? "general"} initialProduct={product ? {
    name: product.name, slug: product.slug,
  } : undefined} />;
}
