import type { Metadata } from "next";
import FabricsClient from "./FabricsClient";

export const metadata: Metadata = {
  title: "Fabric Library — Cotton, Fleece, Denim & More",
  description:
    "Browse our fabric library: French Terry, Ringspun Cotton, Selvedge Denim and more. GSM specs, composition, and best-use guidance for every material we stock.",
  alternates: { canonical: "/fabrics" },
};

export default function FabricsPage() {
  return <FabricsClient />;
}
