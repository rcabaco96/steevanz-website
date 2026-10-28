import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RiscaSite } from "@/components/clients/risca/RiscaSite";
import { riscaMetadata } from "@/components/clients/risca/metadata";
import { riscaStaticParams, resolveRiscaPath } from "@/content/risca/routes";

// Built ahead in both variants (preview links and the links of a domain of its own).
export const generateStaticParams = riscaStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveRiscaPath((await params).path);
  return route ? riscaMetadata() : { title: "Risca", robots: { index: false } };
}

export default async function RiscaPage({ params }: { params: Params }) {
  const route = resolveRiscaPath((await params).path);
  if (!route) notFound();
  return <RiscaSite route={route} />;
}
