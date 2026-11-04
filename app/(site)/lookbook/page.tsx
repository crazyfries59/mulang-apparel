import type { Metadata } from "next";
import LookbookClient from "./LookbookClient";

// Placeholder stock imagery: kept out of search and site navigation until real
// production photos replace it.
export const metadata: Metadata = {
  title: "Lookbook — 2024 Streetwear Collection",
  description:
    "Explore Mulang Apparel's visual lookbook — premium streetwear photography showcasing our manufacturing quality and design capabilities.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  return <LookbookClient />;
}
