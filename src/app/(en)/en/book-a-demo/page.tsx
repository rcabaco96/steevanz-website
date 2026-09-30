import type { Metadata } from "next";
import { BookingPageView, type SearchParams } from "@/components/booking/pages";
import { bookingCopy } from "@/content/booking";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  route: { key: "book" },
  title: bookingCopy.en.metaTitle,
  description: bookingCopy.en.metaDescription,
});

export default async function BookPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <BookingPageView locale="en" searchParams={await searchParams} />;
}
