import { notFound } from "next/navigation";
import { SectorPage, sectorMetadata } from "@/components/pages/SectorPage";
import { sectors } from "@/content/sectors";
import { localeOf, staticLocale } from "@/lib/intl-route";
import { slugIn } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = staticLocale(params);
  return locale ? sectors.map((sector) => ({ slug: slugIn(sector.slug, locale) })) : [];
}

type Params = Promise<{ lang: string; slug: string }>;

async function resolve(params: Params) {
  const locale = await localeOf(params);
  const { slug } = await params;
  const sector = sectors.find((candidate) => slugIn(candidate.slug, locale) === slug);
  return sector ? { locale, sectorId: sector.id } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const resolved = await resolve(params);
  return resolved ? sectorMetadata(resolved.locale, resolved.sectorId) : {};
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return <SectorPage locale={resolved.locale} sectorId={resolved.sectorId} />;
}
