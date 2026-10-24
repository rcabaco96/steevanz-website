import type { Metadata } from "next";
import { PlatibandaNotFound } from "@/components/clients/platibanda/NotFound";

export const metadata: Metadata = { title: "Platibanda", robots: { index: false, follow: true } };

export default function NotFound() {
  return <PlatibandaNotFound />;
}
