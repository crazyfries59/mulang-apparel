import HomeClient from "./HomeClient";
import { CATEGORIES } from "./products/data";
import { getPublicProducts } from "@/lib/content/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getPublicProducts();
  const categories = CATEGORIES.flatMap((category) => {
    const representative = products.find((product) => product.cat === category.slug);
    return representative ? [{ ...category, img: representative.img }] : [];
  });

  return <HomeClient categories={categories} />;
}
