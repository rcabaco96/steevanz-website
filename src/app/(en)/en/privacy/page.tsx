import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";

export const metadata = legalMetadata("en", "privacy");

export default function Page() {
  return <LegalPage locale="en" documentId="privacy" />;
}
