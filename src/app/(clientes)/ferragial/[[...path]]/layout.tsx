import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./ferragial.css";
import { ferragialFontVariables } from "@/components/clients/ferragial/fonts";
import { ferragialViewport } from "@/components/clients/ferragial/metadata";
import { openingGateScript, openingNoscriptStyle } from "@/components/clients/ferragial/preloader-gate";

// Root layout of the Adega Ferragial's website — a FICTIONAL family winery in the Alentejo, Steevanz's showcase site
// for wineries (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz header, footer, WhatsApp button,
// analytics or metadata. Preview at /ferragial (out of search engines), in Portuguese.
export const viewport: Viewport = ferragialViewport;

export default function FerragialLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={ferragialFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: openingGateScript }} />
        <noscript>
          <style>{openingNoscriptStyle}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
