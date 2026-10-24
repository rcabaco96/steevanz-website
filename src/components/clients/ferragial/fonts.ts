import { Familjen_Grotesk, Gloock } from "next/font/google";

// Gloock, a sharp high-contrast serif with the weight of a wine label's name, for the headings and the wordmark;
// Familjen Grotesk, a warm grotesque with a little ink trap, for the labels and the reading text. No other Steevanz
// client site uses either.
export const gloock = Gloock({ subsets: ["latin"], weight: "400", display: "swap", variable: "--fg-font-display" });

export const familjen = Familjen_Grotesk({ subsets: ["latin"], display: "swap", variable: "--fg-font-sans" });

export const ferragialFontVariables = `${gloock.variable} ${familjen.variable}`;
