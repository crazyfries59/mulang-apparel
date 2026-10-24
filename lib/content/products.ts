import "server-only";

import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { PRODUCTS, type Product } from "@/app/(site)/products/data";
import { publishedProductWhere } from "./publication";
import { mapCmsProduct, type CmsProductDocument } from "./product-mapping";

const hasPostgresCms = /^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL ?? "");

const readPublishedCmsProducts = cache(async (): Promise<Product[] | null> => {
  try {
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
