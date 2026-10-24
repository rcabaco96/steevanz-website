import { Schibsted_Grotesk, Young_Serif } from "next/font/google";

// Young Serif — a sturdy, warm serif with the feel of letters painted on a shop front — for the headings and the
// wordmark; Schibsted Grotesk, a clear grotesque with some character, for labels, prices and reading text.
export const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--pb-font-display",
});

export const schibsted = Schibsted_Grotesk({ subsets: ["latin"], display: "swap", variable: "--pb-font-sans" });

export const platibandaFontVariables = `${youngSerif.variable} ${schibsted.variable}`;
