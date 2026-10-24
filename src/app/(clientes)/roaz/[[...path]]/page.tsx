import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoazSite } from "@/components/clients/roaz/RoazSite";
import { roazMetadata } from "@/components/clients/roaz/metadata";
import { resolveRoazPath, roazStaticParams } from "@/content/roaz/routes";

// Built ahead in both variants (preview links and the links of a domain of its own).
export const generateStaticParams = roazStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveRoazPath((await params).path);
  return route ? roazMetadata() : { title: "Roaz", robots: { index: false } };
}

export default async function RoazPage({ params }: { params: Params }) {
  const route = resolveRoazPath((await params).path);
  if (!route) notFound();
  return <RoazSite route={route} />;
}
