import { CompatShell } from "@/components/lab/CompatShell";
import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";

export const metadata = legalMetadata("pt", "privacy");

export default function Page() {
  return (
    <CompatShell>
      <LegalPage locale="pt" documentId="privacy" />
    </CompatShell>
  );
}
