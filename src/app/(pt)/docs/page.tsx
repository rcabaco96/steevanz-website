import { DocsIndexPage, docsIndexMetadata } from "@/components/pages/DocsIndexPage";

export const metadata = docsIndexMetadata("pt");

export default function Page() {
  return <DocsIndexPage locale="pt" />;
}
