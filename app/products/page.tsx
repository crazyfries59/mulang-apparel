import { Suspense } from "react";
import ProductsView from "./ProductsView";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-32 px-6 text-white/30 text-sm">Loading…</div>}>
      <ProductsView />
    </Suspense>
  );
}
