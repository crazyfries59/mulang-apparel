import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsView from "./ProductsView";
import { getPublicProducts } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Products — T-Shirts, Hoodies, Denim & More",
  description:
    "Browse ready-to-customize styles across T-Shirts, Hoodies, Denim, Dresses and more. OEM & ODM manufacturing available.",
  alternates: { canonical: "/products" },
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getPublicProducts();
  return (
    <Suspense fallback={<div className="pt-32 px-6 text-white/30 text-sm">Loading…</div>}>
      <ProductsView products={products} />
    </Suspense>
  );
}
