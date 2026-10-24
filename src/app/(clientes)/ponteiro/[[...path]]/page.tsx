import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PonteiroSite } from "@/components/clients/ponteiro/PonteiroSite";
import { ponteiroMetadata } from "@/components/clients/ponteiro/metadata";
import { ponteiroStaticParams, resolvePonteiroPath } from "@/content/ponteiro/routes";

// Built ahead in both variants (preview links and the links of a domain of its own).
export const generateStaticParams = ponteiroStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolvePonteiroPath((await params).path);
  return route ? ponteiroMetadata() : { title: "Ponteiro", robots: { index: false } };
}

export default async function PonteiroPage({ params }: { params: Params }) {
  const route = resolvePonteiroPath((await params).path);
  if (!route) notFound();
  return <PonteiroSite route={route} />;
}
