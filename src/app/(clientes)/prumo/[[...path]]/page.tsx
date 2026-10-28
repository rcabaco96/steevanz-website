import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrumoSite } from "@/components/clients/prumo/PrumoSite";
import { prumoMetadata } from "@/components/clients/prumo/metadata";
import { prumoStaticParams, resolvePrumoPath } from "@/content/prumo/routes";

// Built ahead in both variants (the preview link and the links of a domain of its own).
export const generateStaticParams = prumoStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolvePrumoPath((await params).path);
  return route ? prumoMetadata() : { title: "Prumo", robots: { index: false } };
}

export default async function PrumoPage({ params }: { params: Params }) {
  const route = resolvePrumoPath((await params).path);
  if (!route) notFound();
  return <PrumoSite route={route} />;
}
