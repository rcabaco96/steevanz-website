import type { Metadata } from "next";
import { MeadaNotFound } from "@/components/clients/meada/NotFound";

export const metadata: Metadata = { title: "Meada", robots: { index: false, follow: true } };

export default function NotFound() {
  return <MeadaNotFound />;
}
