import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErmitaSite } from "@/components/clients/o-ermita/ErmitaSite";
import { ermitaMetadata } from "@/components/clients/o-ermita/metadata";
import { ermitaStaticParams, resolveErmitaPath } from "@/content/o-ermita/routes";

// Both languages are built ahead, in both variants (preview links and the client's domain links).
export const generateStaticParams = ermitaStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveErmitaPath((await params).path);
  return route ? ermitaMetadata(route) : { title: "O Ermita", robots: { index: false } };
}

export default async function ErmitaPage({ params }: { params: Params }) {
  const route = resolveErmitaPath((await params).path);
  if (!route) notFound();
  return <ErmitaSite route={route} />;
}
