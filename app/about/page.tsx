import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in Guangzhou's garment district, Mulang Apparel operates a 50,000 sq ft factory with 400+ skilled workers, serving 500+ fashion brands across 60+ countries.",
};

export default function AboutPage() {
  return <AboutClient />;
}
