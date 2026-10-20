import { BookingPageView, bookingMetadata, type SearchParams } from "@/components/booking/pages";

export const metadata = bookingMetadata("pt");

export default async function BookPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <BookingPageView locale="pt" searchParams={await searchParams} />;
}
