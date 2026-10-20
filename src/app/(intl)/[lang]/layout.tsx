import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../../globals.css";
import { SiteShell } from "@/components/site/SiteShell";
import { langStaticParams, localeOf, type LangParams } from "@/lib/intl-route";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

// The root layout of /en, /es, /fr, /de and /it (2026-10-20). Only those five: anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = langStaticParams;
export const viewport: Viewport = rootViewport;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  return rootMetadata(await localeOf(params));
}

export default async function IntlLayout({ children, params }: { children: ReactNode; params: LangParams }) {
  return <SiteShell locale={await localeOf(params)}>{children}</SiteShell>;
}
