import type { Metadata } from "next";
import ManufacturingClient from "./ManufacturingClient";

export const metadata: Metadata = {
  title: "Clothing Manufacturing in Guangzhou",
  description:
    "How Mulang Apparel makes your clothing line in Guangzhou: tech packs, fabric sourcing, cutting and sewing, printing and embroidery, and quality checks against your approved sample.",
  alternates: { canonical: "/manufacturing" },
};

export default function ManufacturingPage() {
  return <ManufacturingClient />;
}
