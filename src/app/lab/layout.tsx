import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./lab.css";
import { labDisplay, labSans } from "./fonts";

export const metadata: Metadata = {
  title: "Steevanz · Lab",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#cdb7cb",
  colorScheme: "light",
};

export default function LabRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" className={`${labDisplay.variable} ${labSans.variable}`}>
      <body className="lab-page">{children}</body>
    </html>
  );
}
