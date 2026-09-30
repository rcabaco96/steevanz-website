import type { Metadata } from "next";
import { InfoRequestPageView, type SearchParams } from "@/components/booking/pages";
import { infoRequestCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  route: { key: "requestInfo" },
  title: infoRequestCopy.en.metaTitle,
  description: infoRequestCopy.en.metaDescription,
});

export default async function RequestInfoPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <InfoRequestPageView locale="en" searchParams={await searchParams} />;
}
