import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

// Placeholder stock imagery: kept out of search and site navigation until real
// production photos replace it.
export const metadata: Metadata = {
  title: "Portfolio — Streetwear Brands We've Manufactured For",
  description:
    "See real production work for streetwear, hoodie, tracksuit, and outerwear brands we've partnered with — from concept to finished collection.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
