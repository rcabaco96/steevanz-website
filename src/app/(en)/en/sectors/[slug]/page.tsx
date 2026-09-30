import { notFound } from "next/navigation";
import { SectorPage, sectorMetadata } from "@/components/pages/SectorPage";
import { sectors } from "@/content/sectors";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug.en }));
}

function findSector(slug: string) {
  return sectors.find((sector) => sector.slug.en === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = findSector(slug);
  return sector ? sectorMetadata("en", sector.id) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = findSector(slug);
  if (!sector) notFound();
  return <SectorPage locale="en" sectorId={sector.id} />;
}
