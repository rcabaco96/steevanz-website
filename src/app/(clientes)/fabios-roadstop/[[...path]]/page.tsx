import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FabiosSite } from "@/components/clients/fabios-roadstop/FabiosSite";
import { fabiosMetadata } from "@/components/clients/fabios-roadstop/metadata";
import { fabiosStaticParams, resolveFabiosPath } from "@/content/fabios-roadstop/routes";

// Every page of the site is built ahead, in both variants (preview links and the client's domain links).
export const generateStaticParams = fabiosStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveFabiosPath((await params).path);
  return route ? fabiosMetadata(route) : { title: "Fabio's Roadstop", robots: { index: false } };
}

export default async function FabiosPage({ params }: { params: Params }) {
  const route = resolveFabiosPath((await params).path);
  if (!route) notFound();
  return <FabiosSite route={route} />;
}
