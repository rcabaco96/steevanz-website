import { Anton, DM_Sans, Monoton, Yellowtail } from "next/font/google";

// 1950s Americana: a tall poster face for the big words, a brush script like the «Roadstop» of the logo,
// a neon-tube face for the signs and a clean grotesque for reading.
export const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--fr-font-display" });

export const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--fr-font-script",
});

export const monoton = Monoton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--fr-font-neon",
});

export const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--fr-font-text" });

export const fabiosFontVariables = `${anton.variable} ${yellowtail.variable} ${monoton.variable} ${dmSans.variable}`;
