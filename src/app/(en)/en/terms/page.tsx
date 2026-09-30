import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";

export const metadata = legalMetadata("en", "terms");

export default function Page() {
  return <LegalPage locale="en" documentId="terms" />;
}
