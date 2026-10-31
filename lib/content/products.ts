import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { PRODUCTS, type Product } from "@/app/(site)/products/data";
import { PRODUCTS_CACHE_TAG } from "./cache-tags";
import { publishedProductWhere } from "./publication";
import { mapCmsProduct, type CmsProductDocument } from "./product-mapping";

const hasPostgresCms = /^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL ?? "");

/* The home page, product pages, contact page and sitemap all need the full published list.
   Caching it across requests (refreshed every 5 minutes, and immediately when a product is saved
   in the admin) keeps those pages from reading every product from the database on each visit.
   A failed query throws instead of returning, so a database outage is never cached and visitors
   keep getting the last good copy while Next.js retries. */
const queryPublishedCmsProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "products",
      depth: 0,
      limit: 1000,
      sort: "sortOrder",
      draft: false,
      overrideAccess: false,
      where: publishedProductWhere(),
    });
    return result.docs.map((document) => mapCmsProduct(document as unknown as CmsProductDocument));
  },
  ["cms-published-products"],
  { tags: [PRODUCTS_CACHE_TAG], revalidate: 300 },
);

const readPublishedCmsProducts = cache(async (): Promise<Product[] | null> => {
  try {
    return await queryPublishedCmsProducts();
  } catch {
    console.error("[products] CMS query failed; product visibility is limited to the configured fallback mode.");
    return null;
  }
});

export async function getPublicProducts(): Promise<Product[]> {
  const products = await readPublishedCmsProducts();
  // Keep the bundled catalog available for local development without a CMS
  // database. Once Postgres is configured, a CMS outage must fail closed so
  // unpublished or deleted products cannot reappear from the legacy catalog.
  return products ?? (hasPostgresCms ? [] : PRODUCTS);
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  return (await getPublicProducts()).find((product) => product.slug === slug) ?? null;
}
