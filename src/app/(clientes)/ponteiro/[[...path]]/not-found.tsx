import type { Metadata } from "next";
import { PonteiroNotFound } from "@/components/clients/ponteiro/NotFound";

export const metadata: Metadata = { title: "Ponteiro", robots: { index: false, follow: true } };

export default function NotFound() {
  return <PonteiroNotFound />;
}
