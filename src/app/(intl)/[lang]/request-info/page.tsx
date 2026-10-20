import { InfoRequestPageView, infoRequestMetadata, type SearchParams } from "@/components/booking/pages";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return infoRequestMetadata(await localeOf(params));
}

export default async function RequestInfoPage({ params, searchParams }: { params: LangParams; searchParams: Promise<SearchParams> }) {
  return <InfoRequestPageView locale={await localeOf(params)} searchParams={await searchParams} />;
}
