import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./risca.css";
import { riscaFontVariables } from "@/components/clients/risca/fonts";
import { riscaViewport } from "@/components/clients/risca/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/risca/preloader-gate";
import { riscaCopy } from "@/content/risca/copy";

// Root layout of Risca's website — a FICTIONAL hair salon in Porto, Steevanz's showcase site for hair
// salons (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button,
// analytics or metadata. Preview at /risca (out of search engines).
export const viewport: Viewport = riscaViewport;

export default function RiscaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={riscaCopy.htmlLang} className={riscaFontVariables} suppressHydrationWarning>
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
