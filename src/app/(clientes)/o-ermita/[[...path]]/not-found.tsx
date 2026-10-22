import type { Metadata } from "next";
import { ErmitaNotFound } from "@/components/clients/o-ermita/NotFound";

export const metadata: Metadata = { title: "O Ermita", robots: { index: false, follow: true } };

export default function NotFound() {
  return <ErmitaNotFound />;
}
