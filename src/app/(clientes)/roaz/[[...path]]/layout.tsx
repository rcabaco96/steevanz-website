import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./roaz.css";
import { roazFontVariables } from "@/components/clients/roaz/fonts";
import { roazViewport } from "@/components/clients/roaz/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/roaz/preloader-gate";
import { roazCopy } from "@/content/roaz/copy";

// Root layout of Roaz's website — a FICTIONAL boat-trip operator in Ferragudo, Steevanz's showcase site for
// boat-trip and activity businesses (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header,
// footer, WhatsApp button, analytics or metadata. Preview at /roaz (out of search engines).
export const viewport: Viewport = roazViewport;

export default function RoazLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={roazCopy.htmlLang} className={roazFontVariables} suppressHydrationWarning>
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
