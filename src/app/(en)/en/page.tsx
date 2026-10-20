import { JsonLd } from "@/components/JsonLd";
import { NovoHome, novoHomeMetadata } from "@/components/novo/NovoHome";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

// The English home (owner, 2026-10-20): the same page as «/», in English. Indexable, canonical «/en», with the
// alternate to «/».
export const metadata = novoHomeMetadata("en");

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationJsonLd("en"), websiteJsonLd("en")]} />
      <NovoHome locale="en" />
    </>
  );
}
