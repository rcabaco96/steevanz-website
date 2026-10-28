import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/clients/platibanda/ListingPage";
import { PlatibandaSite } from "@/components/clients/platibanda/PlatibandaSite";
import { platibandaMetadata } from "@/components/clients/platibanda/metadata";
import { findListing, listings } from "@/content/platibanda/listings";
import { platibandaStaticParams, resolvePlatibandaPath } from "@/content/platibanda/routes";

const slugs = listings.map((l) => l.slug);

// Built ahead in both variants (preview links and the links of a domain of its own): the home page and every property.
export function generateStaticParams() {
  return platibandaStaticParams(slugs);
}

type Params = Promise<{ path?: string[] }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = resolvePlatibandaPath((await params).path, slugs);
  if (!route) return { title: "Platibanda", robots: { index: false } };
  return platibandaMetadata(route.page === "listing" ? findListing(route.slug) : undefined);
}

export default async function PlatibandaPage({ params }: { params: Params }) {
  const route = resolvePlatibandaPath((await params).path, slugs);
  if (!route) notFound();
  if (route.page === "listing") {
    const listing = findListing(route.slug);
    if (!listing) notFound();
    return <ListingPage mode={route.mode} listing={listing} />;
  }
  return <PlatibandaSite mode={route.mode} />;
}
