import type { Metadata } from "next";
import "../compat.css";
import { BookingPageView, type SearchParams } from "@/components/booking/pages";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";
import { bookingCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "pt",
  route: { key: "book" },
  title: bookingCopy.pt.metaTitle,
  description: bookingCopy.pt.metaDescription,
});

export default async function BookRoute({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="lab-compat">
        <BookingPageView locale="pt" searchParams={await searchParams} />
      </main>
      <SiteFooter />
    </div>
  );
}
