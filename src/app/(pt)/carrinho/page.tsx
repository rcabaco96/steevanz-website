import type { Metadata } from "next";
import { CartPage, cartMetadata } from "@/components/pages/CartPage";

export const metadata: Metadata = cartMetadata("pt");

export default function Page() {
  return <CartPage locale="pt" />;
}
