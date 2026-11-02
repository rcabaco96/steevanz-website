import { Big_Shoulders, Figtree } from "next/font/google";

// Big Shoulders: as capitais estreitas dos placares e das camisolas, para os títulos e os números.
// Figtree: um texto claro e redondo, para ler bem no telemóvel.
export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--gb-font-display",
});

export const figtree = Figtree({ subsets: ["latin"], display: "swap", variable: "--gb-font-sans" });

export const grobFontVariables = `${bigShoulders.variable} ${figtree.variable}`;
