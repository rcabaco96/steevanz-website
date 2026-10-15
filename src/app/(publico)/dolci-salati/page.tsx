import type { Metadata } from "next";
import { DolciLanding } from "@/components/clients/dolci-salati/DolciLanding";
import { dolciMetadata } from "@/components/clients/dolci-salati/metadata";

// Dolci e Salati's landing page (owner, 2026-10-15): the client's own site, redone with motion. The
// public modules' layout keeps it out of search engines, like the client's video menu at /raza17raza,
// which its «Ver o menu» buttons open. English at /dolci-salati/en.
export const metadata: Metadata = dolciMetadata("pt");

export default function DolciSalatiPage() {
  return <DolciLanding locale="pt" />;
}
