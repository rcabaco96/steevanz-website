import { BookingPageView, bookingMetadata, type SearchParams } from "@/components/booking/pages";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return bookingMetadata(await localeOf(params));
}

export default async function BookPage({ params, searchParams }: { params: LangParams; searchParams: Promise<SearchParams> }) {
  return <BookingPageView locale={await localeOf(params)} searchParams={await searchParams} />;
}
