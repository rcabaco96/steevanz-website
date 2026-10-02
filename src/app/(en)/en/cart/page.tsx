import type { Metadata } from "next";
import { CartPage, cartMetadata } from "@/components/pages/CartPage";

export const metadata: Metadata = cartMetadata("en");

export default function Page() {
  return <CartPage locale="en" />;
}
