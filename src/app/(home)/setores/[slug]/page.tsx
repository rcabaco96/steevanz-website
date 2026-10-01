import { CompatShell } from "@/components/lab/CompatShell";
import { notFound } from "next/navigation";
import { SectorPage, sectorMetadata } from "@/components/pages/SectorPage";
import { sectors } from "@/content/sectors";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug.pt }));
}

function findSector(slug: string) {
  return sectors.find((sector) => sector.slug.pt === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = findSector(slug);
  return sector ? sectorMetadata("pt", sector.id) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = findSector(slug);
  if (!sector) notFound();
  return (
    <CompatShell>
      <SectorPage locale="pt" sectorId={sector.id} />
    </CompatShell>
  );
}
