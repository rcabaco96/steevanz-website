import { CompatShell } from "@/components/lab/CompatShell";
import { SectorsIndexPage, sectorsIndexMetadata } from "@/components/pages/SectorsIndexPage";

export const metadata = sectorsIndexMetadata("pt");

export default function Page() {
  return (
    <CompatShell>
      <SectorsIndexPage locale="pt" />
    </CompatShell>
  );
}
