import { JsonLd } from "@/components/JsonLd";
import { NovoHome, novoHomeMetadata } from "@/components/novo/NovoHome";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

// The home page (2026-10-20: the /novo design became «/»; no FAQ on it, so no FAQ structured data). Indexable, canonical «/»,
// with the alternate to the English home «/en», which is the same page in English.
export const metadata = novoHomeMetadata("pt");

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationJsonLd("pt"), websiteJsonLd("pt")]} />
      <NovoHome locale="pt" />
    </>
  );
}
