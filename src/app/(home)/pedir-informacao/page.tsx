import type { Metadata } from "next";
import "../compat.css";
import { InfoRequestPageView, type SearchParams } from "@/components/booking/pages";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";
import { infoRequestCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "pt",
  route: { key: "requestInfo" },
  title: infoRequestCopy.pt.metaTitle,
  description: infoRequestCopy.pt.metaDescription,
});

export default async function RequestInfoRoute({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="lab-compat">
        <InfoRequestPageView locale="pt" searchParams={await searchParams} />
      </main>
      <SiteFooter />
    </div>
  );
}
