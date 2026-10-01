import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../lab/lab.css";
import { labDisplay, labSans } from "../lab/fonts";
import { rootMetadata } from "@/lib/root-metadata";

export const metadata: Metadata = rootMetadata("pt");

export const viewport: Viewport = {
  themeColor: "#e9e3dc",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function HomeRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${labDisplay.variable} ${labSans.variable}`}>
      <body className="lab-page" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
