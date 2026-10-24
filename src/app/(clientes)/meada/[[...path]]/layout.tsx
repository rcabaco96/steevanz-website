import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./meada.css";
import { meadaFontVariables } from "@/components/clients/meada/fonts";
import { meadaViewport } from "@/components/clients/meada/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/meada/preloader-gate";
import { meadaCopy } from "@/content/meada/copy";

// Root layout of Meada's website — a FICTIONAL shop of home and Portuguese crafts, Steevanz's showcase site for shops
// (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button, analytics or
// metadata. Preview at /meada (out of search engines).
export const viewport: Viewport = meadaViewport;

export default function MeadaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={meadaCopy.htmlLang} className={meadaFontVariables} suppressHydrationWarning>
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
