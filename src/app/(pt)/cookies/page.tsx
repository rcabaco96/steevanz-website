import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";

export const metadata = legalMetadata("pt", "cookies");

export default function Page() {
  return <LegalPage locale="pt" documentId="cookies" />;
}
