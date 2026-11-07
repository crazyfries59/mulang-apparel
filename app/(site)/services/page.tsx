import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Sampling, Production & Labels",
  description:
    "Clothing manufacturing services: prototypes and single-piece sampling, OEM/ODM production from 50 pcs, private labels and packaging, and global shipping.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
