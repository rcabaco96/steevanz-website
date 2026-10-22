import { Caveat, Inter_Tight, Unbounded } from "next/font/google";

// Modern and coastal: a wide geometric display face for the big words (Unbounded), a tight grotesque for
// reading (Inter Tight) and a chalk hand for the board by the door (Caveat).
export const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "700", "800"], display: "swap", variable: "--lm-font-display" });

export const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--lm-font-sans" });

export const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], display: "swap", preload: false, variable: "--lm-font-chalk" });

export const loboFontVariables = `${unbounded.variable} ${interTight.variable} ${caveat.variable}`;
