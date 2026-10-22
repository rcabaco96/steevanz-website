import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./lobo.css";
import { loboFontVariables } from "@/components/clients/lobo-do-mar/fonts";
import { loboViewport } from "@/components/clients/lobo-do-mar/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/lobo-do-mar/preloader-gate";
import { loboCopy } from "@/content/lobo-do-mar/copy";
import { resolveLoboPath } from "@/content/lobo-do-mar/routes";

// Root layout of Lobo do Mar's website: the client's own <html>, fonts and stylesheet. No Steevanz header, footer,
// WhatsApp button, analytics or metadata. Preview at /lobo-do-mar (out of search engines); its own domain later,
// through the proxy (src/lib/client-sites.ts).
export const viewport: Viewport = loboViewport;

type Params = Promise<{ path?: string[] }>;

export default async function LoboLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveLoboPath((await params).path)?.locale ?? "pt";
  return (
    <html lang={loboCopy[locale].htmlLang} className={loboFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderGateScript }} />
        <noscript>
          <style>{preloaderNoscriptStyle}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
