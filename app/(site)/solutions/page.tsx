import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Clothing Private Label Manufacturer",
  description:
    "Clothing private label manufacturer in Guangzhou: cut and sew from 100 pcs per style per color, OEM/ODM, logo customization and blank wholesale from 50 pcs.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
