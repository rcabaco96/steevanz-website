import { Cormorant, Montserrat } from "next/font/google";

// A high-contrast Garamond-style serif for the headings, with its italic for the second line, and the
// geometric capitals of the logo (Montserrat) for the small labels and the reading text.
export const cormorant = Cormorant({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--oe-font-serif",
});

export const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--oe-font-sans" });

export const ermitaFontVariables = `${cormorant.variable} ${montserrat.variable}`;
