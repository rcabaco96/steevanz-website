import { CompatShell } from "@/components/lab/CompatShell";
import { DocsIndexPage, docsIndexMetadata } from "@/components/pages/DocsIndexPage";

export const metadata = docsIndexMetadata("pt");

export default function Page() {
  return (
    <CompatShell>
      <DocsIndexPage locale="pt" />
    </CompatShell>
  );
}
