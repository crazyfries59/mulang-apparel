import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts } from "@/lib/content/products";
import ProductDetailClient from "./ProductDetailClient";
import CapEditorial from "@/components/CapEditorial";
import { capCopyFor } from "@/lib/content/cap-copy";
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

  /* The four headwear pages are category pages wearing a product URL: buyers
     search "custom baseball cap manufacturer", not a style number. They carry
     their own title, description and body copy in lib/content/cap-copy.ts. */
  const capCopy = capCopyFor(slug);
  const title = capCopy?.title ?? buildProductTitle(p);
  const description = capCopy?.description ?? buildProductDescription(p);
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
  const capCopy = capCopyFor(slug);

  const structuredData: Record<string, unknown>[] = [productJsonLd];
  if (capCopy) {
    structuredData.push(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: capCopy.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
          { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/products/${p.slug}` },
        ],
      },
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient product={p} relatedProducts={relatedProducts} />
      {capCopy && <CapEditorial copy={capCopy} />}
    </>
  );
}
