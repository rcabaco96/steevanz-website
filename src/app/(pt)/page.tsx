import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NovoHome } from "@/components/novo/NovoHome";
import { homeCopy } from "@/content/home";
import { novoCopy } from "@/content/novo-home";
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

// The home page (2026-10-20: the /novo design became «/»). Indexable, canonical «/», with the
// alternate to the English home. The English home is still components/pages/HomePage.
export const metadata: Metadata = pageMetadata({
  locale: "pt",
  route: { key: "home" },
  title: novoCopy.metaTitle,
  description: novoCopy.metaDescription,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationJsonLd("pt"), websiteJsonLd("pt"), faqJsonLd(homeCopy.pt.faq.items)]} />
      <NovoHome />
    </>
  );
}
