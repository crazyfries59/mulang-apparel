import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts } from "@/lib/content/products";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicProduct(slug);
  if (!p) notFound();

  const description = p.seoDescription || `${p.name} — ${p.fabric}, ${p.gsm}. MOQ ${p.moq}, ${p.lead} lead time. Custom OEM/ODM manufacturing from Mulang Apparel.`;
  return {
    title: p.seoTitle || p.name,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: p.seoTitle || p.name,
      description,
      images: p.img ? [{ url: p.img }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, products] = await Promise.all([getPublicProduct(slug), getPublicProducts()]);
  if (!p) notFound();

  const numericPrice = Number(p.price.replace(/[^0-9.]/g, ""));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.img ? [p.img] : undefined,
    description: `${p.fabric}, ${p.gsm}. MOQ ${p.moq}, ${p.lead} lead time.`,
    ...(Number.isFinite(numericPrice) && numericPrice > 0
      ? {
          offers: {
            "@type": "Offer",
            price: numericPrice.toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  const relatedProducts = products.filter((product) => product.cat === p.cat && product.slug !== p.slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={p} relatedProducts={relatedProducts} />
    </>
  );
}
