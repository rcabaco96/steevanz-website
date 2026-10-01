import type { ReactNode } from "react";
import "@/app/(home)/compat.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";

/** Wraps pages built on the previous design system in the new header, footer and palette. */
export function CompatShell({ children }: { children: ReactNode }) {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="lab-compat">{children}</main>
      <SiteFooter />
    </div>
  );
}
