import type { Metadata } from "next";
import { RiscaNotFound } from "@/components/clients/risca/NotFound";

export const metadata: Metadata = { title: "Risca", robots: { index: false, follow: true } };

export default function NotFound() {
  return <RiscaNotFound />;
}
