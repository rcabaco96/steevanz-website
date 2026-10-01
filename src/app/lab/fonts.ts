import { Bebas_Neue, Geist } from "next/font/google";

export const labDisplay = Bebas_Neue({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  variable: "--font-lab-display",
});

export const labSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lab-sans",
});
