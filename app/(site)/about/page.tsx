import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Mulang Apparel is a Guangzhou clothing manufacturer for growing brands: blanks and logo from 50 pcs, cut & sew from 100 pcs per style per color, 1-pc sampling.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
