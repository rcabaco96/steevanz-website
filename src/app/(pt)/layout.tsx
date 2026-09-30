import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { SiteShell } from "@/components/site/SiteShell";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

export const metadata: Metadata = rootMetadata("pt");
export const viewport: Viewport = rootViewport;

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="pt">{children}</SiteShell>;
}
