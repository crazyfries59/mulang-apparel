import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Mulang Apparel is a Guangzhou clothing manufacturer for growing brands: blank wholesale and logo customization from 50 pcs, cut & sew from 100 pcs per style per color, and single-piece sampling.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
