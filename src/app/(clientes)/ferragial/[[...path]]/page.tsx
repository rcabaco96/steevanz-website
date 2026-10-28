import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FerragialSite } from "@/components/clients/ferragial/FerragialSite";
import { ferragialMetadata } from "@/components/clients/ferragial/metadata";
import { ferragialStaticParams, resolveFerragialPath } from "@/content/ferragial/routes";

// Built ahead in both variants (the preview link and the links of a domain of its own).
export const generateStaticParams = ferragialStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveFerragialPath((await params).path);
  return route ? ferragialMetadata() : { title: "Adega Ferragial", robots: { index: false } };
}

export default async function FerragialPage({ params }: { params: Params }) {
  const route = resolveFerragialPath((await params).path);
  if (!route) notFound();
  return <FerragialSite route={route} />;
}
