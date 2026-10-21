import type { Metadata } from "next";
import { FabiosNotFound } from "@/components/clients/fabios-roadstop/NotFound";

export const metadata: Metadata = { title: "Fabio's Roadstop", robots: { index: false, follow: true } };

export default function NotFound() {
  return <FabiosNotFound />;
}
