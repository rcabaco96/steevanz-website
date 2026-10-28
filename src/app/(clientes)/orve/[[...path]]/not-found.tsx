import type { Metadata } from "next";
import { OrveNotFound } from "@/components/clients/orve/NotFound";

export const metadata: Metadata = { title: "Orvé", robots: { index: false, follow: true } };

export default function NotFound() {
  return <OrveNotFound />;
}
