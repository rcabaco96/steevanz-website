import { Alfa_Slab_One, Inter_Tight } from "next/font/google";

// The heavy slab capitals of the restaurant's logo and sign (Alfa Slab One) for the big words, and a tight
// grotesque for reading (Inter Tight).
export const alfaSlab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", display: "swap", variable: "--lm-font-display" });

export const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--lm-font-sans" });

export const loboFontVariables = `${alfaSlab.variable} ${interTight.variable}`;
