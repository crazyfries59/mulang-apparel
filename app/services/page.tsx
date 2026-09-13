import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Prototyping, Sampling, Production & More",
  description:
    "Full-service clothing manufacturing: prototypes in 7-12 days, unlimited sample revisions, OEM/ODM production, private labels, global shipping, and product photography.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
