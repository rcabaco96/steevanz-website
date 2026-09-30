import type { Metadata } from "next";
import { InfoRequestPageView, type SearchParams } from "@/components/booking/pages";
import { infoRequestCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "pt",
  route: { key: "requestInfo" },
  title: infoRequestCopy.pt.metaTitle,
  description: infoRequestCopy.pt.metaDescription,
});

export default async function RequestInfoPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <InfoRequestPageView locale="pt" searchParams={await searchParams} />;
}
