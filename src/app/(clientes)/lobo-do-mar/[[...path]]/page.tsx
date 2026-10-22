import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoboSite } from "@/components/clients/lobo-do-mar/LoboSite";
import { loboMetadata } from "@/components/clients/lobo-do-mar/metadata";
import { loboStaticParams, resolveLoboPath } from "@/content/lobo-do-mar/routes";

// Both languages are built ahead, in both variants (preview links and the client's domain links).
export const generateStaticParams = loboStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveLoboPath((await params).path);
  return route ? loboMetadata(route) : { title: "Lobo do Mar", robots: { index: false } };
}

export default async function LoboPage({ params }: { params: Params }) {
  const route = resolveLoboPath((await params).path);
  if (!route) notFound();
  return <LoboSite route={route} />;
}
