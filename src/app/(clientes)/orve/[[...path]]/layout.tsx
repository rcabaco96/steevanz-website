import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./orve.css";
import { orveFontVariables } from "@/components/clients/orve/fonts";
import { orveViewport } from "@/components/clients/orve/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/orve/preloader-gate";
import { orveCopy } from "@/content/orve/copy";

// Root layout of Orvé's website — a FICTIONAL beauty atelier, Steevanz's showcase site for beauty and aesthetics
// businesses (owner, 2026-10-23). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button,
// analytics or metadata. Preview at /orve (out of search engines).
export const viewport: Viewport = orveViewport;

export default function OrveLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={orveCopy.htmlLang} className={orveFontVariables} suppressHydrationWarning>
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
