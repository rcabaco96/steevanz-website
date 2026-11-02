import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrobSite } from "@/components/clients/grob/GrobSite";
import { grobMetadata } from "@/components/clients/grob/metadata";
import { grobStaticParams, resolveGrobPath } from "@/content/grob/routes";

// A página nos dois modos (ligações da pré-visualização e do domínio do clube), feita de antemão.
export const generateStaticParams = grobStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveGrobPath((await params).path);
  return route ? grobMetadata() : { title: "GROB", robots: { index: false } };
}

export default async function GrobPage({ params }: { params: Params }) {
  const route = resolveGrobPath((await params).path);
  if (!route) notFound();
  return <GrobSite route={route} />;
}
