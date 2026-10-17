import type { Metadata } from "next";
import { NovoHome } from "@/components/novo/NovoHome";
import { novoCopy } from "@/content/novo-home";

// Preview of the new home page: not indexed and not linked from the navigation yet.
export const metadata: Metadata = {
  title: { absolute: novoCopy.metaTitle },
  description: novoCopy.metaDescription,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function Page() {
  return <NovoHome />;
}
