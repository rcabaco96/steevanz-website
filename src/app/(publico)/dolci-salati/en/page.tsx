import type { Metadata } from "next";
import { DolciLanding } from "@/components/clients/dolci-salati/DolciLanding";
import { dolciMetadata } from "@/components/clients/dolci-salati/metadata";

// The English version of /dolci-salati (the client's own site has both languages).
export const metadata: Metadata = dolciMetadata("en");

export default function DolciSalatiEnglishPage() {
  return <DolciLanding locale="en" />;
}
