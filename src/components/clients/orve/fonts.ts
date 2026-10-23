import { Bodoni_Moda, Jost } from "next/font/google";

// A high-contrast didone for the headings (the same family the hand-drawn «orvé» wordmark follows), with its italic
// for the second line of each title, and Jost, a calm geometric sans, for the labels and the reading text.
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--or-font-display",
});

export const jost = Jost({ subsets: ["latin"], display: "swap", variable: "--or-font-sans" });

export const orveFontVariables = `${bodoni.variable} ${jost.variable}`;
