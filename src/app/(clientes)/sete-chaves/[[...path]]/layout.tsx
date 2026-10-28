import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./sete-chaves.css";
import { seteChavesFontVariables } from "@/components/clients/sete-chaves/fonts";
import { seteChavesViewport } from "@/components/clients/sete-chaves/metadata";
import {
  preloaderGateScript,
  preloaderNoscriptStyle,
} from "@/components/clients/sete-chaves/preloader-gate";

// Root layout of Sete Chaves' website — a FICTIONAL guest house in Aljezur, Steevanz's showcase site for lodging
// businesses (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button,
// analytics or metadata. Preview at /sete-chaves (out of search engines).
export const viewport: Viewport = seteChavesViewport;

export default function SeteChavesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="pt-PT"
      className={seteChavesFontVariables}
      suppressHydrationWarning
    >
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
