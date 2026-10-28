import { DM_Mono, Schibsted_Grotesk, Young_Serif } from "next/font/google";

// Young Serif, a sturdy old-style serif with soft, hand-cut curves, for the headings; Schibsted Grotesk, a plain and
// warm grotesque, for the reading text; DM Mono for the labels and prices, like the stamped kraft tags on the pieces.
export const youngSerif = Young_Serif({ subsets: ["latin"], weight: "400", display: "swap", variable: "--md-font-display" });

export const schibsted = Schibsted_Grotesk({ subsets: ["latin"], display: "swap", variable: "--md-font-sans" });

export const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--md-font-mono" });

export const meadaFontVariables = `${youngSerif.variable} ${schibsted.variable} ${dmMono.variable}`;
