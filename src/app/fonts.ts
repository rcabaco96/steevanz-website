import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal"],
  display: "optional",
  variable: "--font-fraunces",
});

export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-fraunces-italic",
});

export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-hanken",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  preload: false,
  variable: "--font-jetbrains",
});

export const fontVariables = `${fraunces.variable} ${frauncesItalic.variable} ${hanken.variable} ${jetbrains.variable}`;
