import { SectorsIndexPage, sectorsIndexMetadata } from "@/components/pages/SectorsIndexPage";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return sectorsIndexMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <SectorsIndexPage locale={await localeOf(params)} />;
}
