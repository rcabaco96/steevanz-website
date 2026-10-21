import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./fabios.css";
import { fabiosFontVariables } from "@/components/clients/fabios-roadstop/fonts";
import { fabiosViewport } from "@/components/clients/fabios-roadstop/metadata";
import { fabiosCopy } from "@/content/fabios-roadstop/copy";
import { resolveFabiosPath } from "@/content/fabios-roadstop/routes";

// Root layout of Fabio's Roadstop's website: the client's own <html>, fonts and stylesheet. No Steevanz
// header, footer, WhatsApp button, analytics or metadata. Preview at /fabios-roadstop (out of search engines);
// its own domain later, through the proxy (src/lib/client-sites.ts).
export const viewport: Viewport = fabiosViewport;

type Params = Promise<{ path?: string[] }>;

export default async function FabiosLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveFabiosPath((await params).path)?.locale ?? "pt";
  return (
    <html lang={fabiosCopy[locale].htmlLang} className={fabiosFontVariables}>
      <body>{children}</body>
    </html>
  );
}
