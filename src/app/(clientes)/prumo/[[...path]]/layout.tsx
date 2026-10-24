import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./prumo.css";
import { prumoFontVariables } from "@/components/clients/prumo/fonts";
import { prumoViewport } from "@/components/clients/prumo/metadata";
import { preloaderGateScript, preloaderNoscriptStyle } from "@/components/clients/prumo/preloader-gate";

// Root layout of Prumo's website — a FICTIONAL clinic of physiotherapy, osteopathy and wellness, Steevanz's showcase
// site for health and wellness businesses (owner, 2026-10-24). Its own <html>, fonts and stylesheet: no Steevanz
// header, footer, WhatsApp button, analytics or metadata. Preview at /prumo (out of search engines).
export const viewport: Viewport = prumoViewport;

export default function PrumoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={prumoFontVariables} suppressHydrationWarning>
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
