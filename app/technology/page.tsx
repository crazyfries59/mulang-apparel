import type { Metadata } from "next";
import TechnologyClient from "./TechnologyClient";

export const metadata: Metadata = {
  title: "Technology — Printing, Embroidery & Fabric Finishing",
  description:
    "6 printing methods, 6 embroidery styles, and premium washing/finishing techniques — the technology behind every Mulang Apparel garment.",
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
