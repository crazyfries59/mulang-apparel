import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsView from "./ProductsView";

export const metadata: Metadata = {
  title: "Products — T-Shirts, Hoodies, Denim & More",
  description:
    "Browse 240+ ready-to-customize styles across T-Shirts, Hoodies, Denim, Dresses and more. Low MOQ from 50 pieces, OEM & ODM available.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-32 px-6 text-white/30 text-sm">Loading…</div>}>
      <ProductsView />
    </Suspense>
  );
}
