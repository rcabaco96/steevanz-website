import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrveSite } from "@/components/clients/orve/OrveSite";
import { orveMetadata } from "@/components/clients/orve/metadata";
import { orveStaticParams, resolveOrvePath } from "@/content/orve/routes";

// The six languages are built ahead, in both variants (preview links and the links of a domain of its own).
export const generateStaticParams = orveStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveOrvePath((await params).path);
  return route ? orveMetadata(route) : { title: "Orvé", robots: { index: false } };
}

export default async function OrvePage({ params }: { params: Params }) {
  const route = resolveOrvePath((await params).path);
  if (!route) notFound();
  return <OrveSite route={route} />;
}
