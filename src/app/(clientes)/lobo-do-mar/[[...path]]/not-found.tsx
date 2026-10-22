import type { Metadata } from "next";
import { LoboNotFound } from "@/components/clients/lobo-do-mar/NotFound";

export const metadata: Metadata = { title: "Lobo do Mar", robots: { index: false, follow: true } };

export default function NotFound() {
  return <LoboNotFound />;
}
