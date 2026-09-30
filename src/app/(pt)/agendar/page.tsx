import type { Metadata } from "next";
import { BookingPageView, type SearchParams } from "@/components/booking/pages";
import { bookingCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "pt",
  route: { key: "book" },
  title: bookingCopy.pt.metaTitle,
  description: bookingCopy.pt.metaDescription,
});

export default async function BookPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <BookingPageView locale="pt" searchParams={await searchParams} />;
}
