import type { Metadata } from "next";
import { findProduct } from "../data";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return { title: "Product Not Found" };

  const description = `${p.name} — ${p.fabric}, ${p.gsm}. MOQ ${p.moq}, ${p.lead} lead time. Custom OEM/ODM manufacturing from Mulang Apparel.`;
  return {
    title: p.name,
    description,
    openGraph: {
      title: p.name,
      description,
      images: p.img ? [{ url: p.img }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findProduct(slug);

  const productJsonLd = p
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        image: p.img ? [p.img] : undefined,
        description: `${p.fabric}, ${p.gsm}. MOQ ${p.moq}, ${p.lead} lead time.`,
        offers: {
          "@type": "Offer",
          price: p.price.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailClient params={params} />
    </>
  );
}
