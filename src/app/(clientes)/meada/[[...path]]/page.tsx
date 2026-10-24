import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeadaSite } from "@/components/clients/meada/MeadaSite";
import { meadaMetadata } from "@/components/clients/meada/metadata";
import { meadaStaticParams, resolveMeadaPath } from "@/content/meada/routes";

// Built ahead in both variants (preview links and the links of a domain of its own).
export const generateStaticParams = meadaStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveMeadaPath((await params).path);
  return route ? meadaMetadata() : { title: "Meada", robots: { index: false } };
}

export default async function MeadaPage({ params }: { params: Params }) {
  const route = resolveMeadaPath((await params).path);
  if (!route) notFound();
  return <MeadaSite route={route} />;
}
