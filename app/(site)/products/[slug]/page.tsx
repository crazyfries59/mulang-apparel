import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts } from "@/lib/content/products";
import ProductDetailClient from "./ProductDetailClient";
import { SITE_URL } from "@/lib/site";
import { buildProductDescription, buildProductSpecLine, buildProductTitle } from "@/lib/seo/product-copy";

/* Prerendered on demand and cached for 10 minutes. 241 product pages therefore
   stop paying a database round-trip per crawler hit. */
export const revalidate = 600;

/* Listing the slugs is what lets Next prerender the 241 product pages at build
   time. Without it the route renders on demand and stays uncached, which is the
   slow path Googlebot was hitting. Styles published later still render on demand
   (dynamicParams defaults to true) and are cached from then on. */
export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicProduct(slug);
  if (!p) notFound();

  const title = buildProductTitle(p);
  const description = buildProductDescription(p);
  return {
    // `absolute` bypasses the layout's "%s | Mulang Apparel" template so the brand
    // suffix cannot push a product title past the SERP truncation point.
    title: { absolute: title },
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title,
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
    url: `${SITE_URL}/products/${p.slug}`,
    brand: { "@type": "Brand", name: "Mulang Apparel" },
    sku: p.id !== "—" ? p.id.replace(/^#/, "") : undefined,
    image: p.img ? [new URL(p.img, SITE_URL).toString()] : undefined,
    description: buildProductSpecLine(p) || buildProductDescription(p),
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
