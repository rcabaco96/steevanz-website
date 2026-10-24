import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeteChavesSite } from "@/components/clients/sete-chaves/SeteChavesSite";
import { seteChavesMetadata } from "@/components/clients/sete-chaves/metadata";
import {
  resolveSeteChavesPath,
  seteChavesStaticParams,
} from "@/content/sete-chaves/routes";

// Built ahead in both variants (the preview link and the links of a domain of its own).
export const generateStaticParams = seteChavesStaticParams;

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const route = resolveSeteChavesPath((await params).path);
  return route
    ? seteChavesMetadata()
    : { title: "Sete Chaves", robots: { index: false } };
}

export default async function SeteChavesPage({ params }: { params: Params }) {
  const route = resolveSeteChavesPath((await params).path);
  if (!route) notFound();
  return <SeteChavesSite route={route} />;
}
