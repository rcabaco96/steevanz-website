import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./ponteiro.css";
import { ponteiroFontVariables } from "@/components/clients/ponteiro/fonts";
import { ponteiroViewport } from "@/components/clients/ponteiro/metadata";
import { shutterGateScript, shutterNoscriptStyle } from "@/components/clients/ponteiro/preloader-gate";
import { ponteiroCopy } from "@/content/ponteiro/copy";

// Root layout of Ponteiro's website — a FICTIONAL café, kitchen and bar, Steevanz's showcase site for restaurants,
// cafés and bars (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp
// button, analytics or metadata. Preview at /ponteiro (out of search engines).
export const viewport: Viewport = ponteiroViewport;

export default function PonteiroLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={ponteiroCopy.htmlLang} className={ponteiroFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: shutterGateScript }} />
        <noscript>
          <style>{shutterNoscriptStyle}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
