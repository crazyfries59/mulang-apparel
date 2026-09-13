import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio — Streetwear Brands We've Manufactured For",
  description:
    "See real production work for streetwear, hoodie, tracksuit, and outerwear brands we've partnered with — from concept to finished collection.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
