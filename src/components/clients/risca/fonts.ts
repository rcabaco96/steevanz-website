import { Archivo, Instrument_Serif } from "next/font/google";

// Archivo with its width axis: squeezed to its narrowest and heaviest for the magazine headlines (the same
// condensed capitals the hand-drawn «RISCA» wordmark follows), at normal width for the reading text. Instrument
// Serif, in italic, for the second voice of each title, like a fashion magazine's deck.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--rc-font-sans",
});

export const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--rc-font-serif",
});

export const riscaFontVariables = `${archivo.variable} ${instrument.variable}`;
