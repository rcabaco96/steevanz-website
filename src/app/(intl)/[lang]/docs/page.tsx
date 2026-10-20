import { DocsIndexPage, docsIndexMetadata } from "@/components/pages/DocsIndexPage";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return docsIndexMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <DocsIndexPage locale={await localeOf(params)} />;
}
