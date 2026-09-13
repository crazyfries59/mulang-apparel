import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions — Cut & Sew, Private Label & Blank Wholesale",
  description:
    "Manufacturing solutions for every brand stage: cut & sew customization, logo branding, blank wholesale, private label, and low-MOQ startup programs.",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
