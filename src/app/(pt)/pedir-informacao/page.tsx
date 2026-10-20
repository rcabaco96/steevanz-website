import { InfoRequestPageView, infoRequestMetadata, type SearchParams } from "@/components/booking/pages";

export const metadata = infoRequestMetadata("pt");

export default async function RequestInfoPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <InfoRequestPageView locale="pt" searchParams={await searchParams} />;
}
