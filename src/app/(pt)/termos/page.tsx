import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";

export const metadata = legalMetadata("pt", "terms");

export default function Page() {
  return <LegalPage locale="pt" documentId="terms" />;
}
