import type { Metadata } from "next";
import TechnologyClient from "./TechnologyClient";

export const metadata: Metadata = {
  title: "Custom Apparel Decoration Techniques | Screen Printing, DTF & Embroidery",
  description:
    "15 decoration techniques for custom T-shirts, hoodies and streetwear: screen printing, DTF, DTG, puff print, 3D and terry embroidery, appliqué, rhinestone, laser and more. MOQ from 50 pieces.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
