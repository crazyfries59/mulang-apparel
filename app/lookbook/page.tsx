import type { Metadata } from "next";
import LookbookClient from "./LookbookClient";

export const metadata: Metadata = {
  title: "Lookbook — 2024 Streetwear Collection",
  description:
    "Explore Mulang Apparel's visual lookbook — premium streetwear photography showcasing our manufacturing quality and design capabilities.",
};

export default function LookbookPage() {
  return <LookbookClient />;
}
