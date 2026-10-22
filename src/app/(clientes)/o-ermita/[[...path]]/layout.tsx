import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./ermita.css";
import { ermitaFontVariables } from "@/components/clients/o-ermita/fonts";
import { ermitaViewport } from "@/components/clients/o-ermita/metadata";
import { ermitaCopy } from "@/content/o-ermita/copy";
import { resolveErmitaPath } from "@/content/o-ermita/routes";

// Root layout of O Ermita's website: the client's own <html>, fonts and stylesheet. No Steevanz header, footer,
// WhatsApp button, analytics or metadata. Preview at /o-ermita (out of search engines); its own domain later,
// through the proxy (src/lib/client-sites.ts).
export const viewport: Viewport = ermitaViewport;

type Params = Promise<{ path?: string[] }>;

export default async function ErmitaLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveErmitaPath((await params).path)?.locale ?? "pt";
  return (
    <html lang={ermitaCopy[locale].htmlLang} className={ermitaFontVariables}>
      <body>{children}</body>
    </html>
  );
}
