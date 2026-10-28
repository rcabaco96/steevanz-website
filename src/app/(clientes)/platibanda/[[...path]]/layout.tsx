import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./platibanda.css";
import { platibandaFontVariables } from "@/components/clients/platibanda/fonts";
import { platibandaViewport } from "@/components/clients/platibanda/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/platibanda/preloader-gate";
import { platibandaCopy } from "@/content/platibanda/copy";

// Root layout of Platibanda's website — a FICTIONAL real-estate agency in Tavira, Steevanz's showcase site for
// real-estate and holiday-rental businesses (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz
// header, footer, WhatsApp button, analytics or metadata. Preview at /platibanda (out of search engines).
export const viewport: Viewport = platibandaViewport;

export default function PlatibandaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={platibandaCopy.htmlLang} className={platibandaFontVariables} suppressHydrationWarning>
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
