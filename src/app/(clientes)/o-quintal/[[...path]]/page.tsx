import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { oQuintalMetadata } from "@/components/clients/o-quintal/metadata";
import { QuintalSite } from "@/components/clients/o-quintal/QuintalSite";
import { findOQuintalProduct, oQuintalProducts } from "@/content/o-quintal/products";
import { oQuintalStaticParams, resolveOQuintalPath } from "@/content/o-quintal/routes";

// Every page is built ahead, in both variants (preview links and the client's domain links).
export function generateStaticParams() {
  return oQuintalStaticParams(oQuintalProducts.map((item) => item.id));
}
export const dynamicParams = false;

type Params = Promise<{ path?: string[] }>;

const exists = (id: string) => Boolean(findOQuintalProduct(id));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolveOQuintalPath((await params).path, exists);
  return route ? oQuintalMetadata(route) : { title: "O Quintal", robots: { index: false } };
}

export default async function QuintalPage({ params }: { params: Params }) {
  const route = resolveOQuintalPath((await params).path, exists);
  if (!route) notFound();
  return <QuintalSite route={route} />;
}
