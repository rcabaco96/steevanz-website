import { JsonLd } from "@/components/JsonLd";
import { NovoHome, novoHomeMetadata } from "@/components/novo/NovoHome";
import { localeOf, type LangParams } from "@/lib/intl-route";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

// The home in English, Spanish, French, German and Italian: the same page as «/». Indexable, canonical
// «/en», «/es», …, with the alternates to the other languages (lib/seo).
export async function generateMetadata({ params }: { params: LangParams }) {
  return novoHomeMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  const locale = await localeOf(params);
  return (
    <>
      <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <NovoHome locale={locale} />
    </>
  );
}
