import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../lab/lab.css";
import { labDisplay, labSans, labTitle } from "../lab/fonts";
import { rootMetadata } from "@/lib/root-metadata";
import { Cursor } from "@/components/lab/Cursor";
import { EmbedFlag } from "@/components/lab/EmbedFlag";
import { themeBootScript } from "@/components/lab/themeScript";

export const metadata: Metadata = rootMetadata("pt");

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9e3dc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0f24" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function HomeRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${labDisplay.variable} ${labTitle.variable} ${labSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="lab-page" suppressHydrationWarning>
        {children}
        <Cursor />
        <EmbedFlag />
      </body>
    </html>
  );
}
