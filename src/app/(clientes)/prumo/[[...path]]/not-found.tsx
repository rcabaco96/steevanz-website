import type { Metadata } from "next";
import { PrumoNotFound } from "@/components/clients/prumo/NotFound";

export const metadata: Metadata = { title: "Prumo", robots: { index: false, follow: true } };

export default function NotFound() {
  return <PrumoNotFound />;
}
