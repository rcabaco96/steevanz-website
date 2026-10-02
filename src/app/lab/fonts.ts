import { Bebas_Neue, Cormorant_Garamond, Geist } from "next/font/google";

export const labDisplay = Bebas_Neue({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  variable: "--font-lab-display",
});

/**
 * Title face: a light, high-contrast uppercase serif in the spirit of PP Pangaia
 * (grail-app.com). Pangaia is a paid Pangram Pangram font; Cormorant Garamond is the
 * closest open-licence (OFL) match. With a Pangaia licence, swap this for next/font/local.
 */
export const labTitle = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-lab-title",
});

export const labSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lab-sans",
});
