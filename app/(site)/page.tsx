import HomeClient from "./HomeClient";
import { CATEGORIES } from "./products/data";
import { getPublicProducts } from "@/lib/content/products";

/* Rendered once and served from the CDN for 10 minutes. Every page used to be
   force-dynamic, which meant a Supabase round-trip before the first byte of HTML
   and no CDN cache at all (2-5s TTFB). CMS writes still invalidate the cache
   immediately through the collection hooks. */
export const revalidate = 600;

export default async function HomePage() {
  const products = await getPublicProducts();
  const categories = CATEGORIES.flatMap((category) => {
    const representative = products.find((product) => product.cat === category.slug);
    return representative ? [{ ...category, img: representative.img }] : [];
  });

  return <HomeClient categories={categories} />;
}
