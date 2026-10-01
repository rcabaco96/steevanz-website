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
  const params = await searchParams;
  // ?embed=1: shown inside the homepage panel, without header and footer.
  const embed = params.embed === "1";
  return (
    <div className={embed ? "lab-root pd-page embed-page" : "lab-root pd-page"}>
      <SiteHeader solid />
      <main className="lab-compat">
        <InfoRequestPageView locale="pt" searchParams={params} />
      </main>
      <SiteFooter />
    </div>
  );
}
