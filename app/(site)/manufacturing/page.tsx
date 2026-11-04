import type { Metadata } from "next";
import ManufacturingClient from "./ManufacturingClient";

export const metadata: Metadata = {
  title: "Clothing Manufacturing in Guangzhou",
  description:
    "How we make your clothing line in Guangzhou: tech packs, fabric sourcing, cutting and sewing, printing, embroidery and checks against your approved sample.",
  alternates: { canonical: "/manufacturing" },
};

export default function ManufacturingPage() {
  return <ManufacturingClient />;
}
