import { AboutPage, aboutMetadata } from "@/components/pages/InfoPages";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return aboutMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <AboutPage locale={await localeOf(params)} />;
}
