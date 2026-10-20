import { ContactPage, contactMetadata } from "@/components/pages/InfoPages";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return contactMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <ContactPage locale={await localeOf(params)} />;
}
