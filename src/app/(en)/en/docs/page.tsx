import { DocsIndexPage, docsIndexMetadata } from "@/components/pages/DocsIndexPage";

export const metadata = docsIndexMetadata("en");

export default function Page() {
  return <DocsIndexPage locale="en" />;
}
