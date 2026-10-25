import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./quintal.css";
import { oQuintalFontVariables } from "@/components/clients/o-quintal/fonts";
import { oQuintalHeadScript } from "@/components/clients/o-quintal/head-script";
import { oQuintalViewport } from "@/components/clients/o-quintal/metadata";

// Root layout of O Quintal's shop: the client's own <html>, fonts and stylesheet. No Steevanz header, footer,
// WhatsApp button, analytics or metadata. Preview at /o-quintal (out of search engines); its own domain later,
// through the proxy (src/lib/client-sites.ts).
export const viewport: Viewport = oQuintalViewport;

export default function QuintalLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={oQuintalFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: oQuintalHeadScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
