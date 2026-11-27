import type { Metadata } from "next";
import PaymentMethodClient from "./PaymentMethodClient";

export const metadata: Metadata = {
  title: "Payment Methods | Bank Transfer & Local Accounts",
  description:
    "Flexible payment options for custom clothing orders: SWIFT bank transfer and local bank accounts in the USA, UK, EU, Denmark, Australia and Nigeria. MOQ from 50 pieces.",
  alternates: { canonical: "/payment-method" },
};

export default function PaymentMethodPage() {
  return <PaymentMethodClient />;
}
