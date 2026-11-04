import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Prototyping, Sampling, Production & More",
  description:
    "Full-service clothing manufacturing: prototypes and single-piece sampling, OEM/ODM production from 50 pcs, private labels and packaging, global shipping, and product photography.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
