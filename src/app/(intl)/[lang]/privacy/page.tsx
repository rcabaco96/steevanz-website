import { LegalPage, legalMetadata } from "@/components/pages/InfoPages";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return legalMetadata(await localeOf(params), "privacy");
}

export default async function Page({ params }: { params: LangParams }) {
  return <LegalPage locale={await localeOf(params)} documentId="privacy" />;
}
