import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

// Instrument Serif for the titles and the big hours (a tall, narrow serif with a lively italic, like the gilt
// lettering on an old café window) and Bricolage Grotesque, a warm grotesque with a bit of ink trap, for labels,
// prices and reading text.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--pn-font-display",
});

export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--pn-font-sans" });

export const ponteiroFontVariables = `${instrumentSerif.variable} ${bricolage.variable}`;
