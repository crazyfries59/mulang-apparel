import type { Metadata } from "next";
import ManufacturingClient from "./ManufacturingClient";

export const metadata: Metadata = {
  title: "Manufacturing Facility — 50,000 sq ft ISO 9001 Factory",
  description:
    "Tour our ISO 9001 certified factory: 50,000 sq ft floor, 400+ skilled workers, 14+ finishing techniques, and an 8-point quality control process on every order.",
};

export default function ManufacturingPage() {
  return <ManufacturingClient />;
}
