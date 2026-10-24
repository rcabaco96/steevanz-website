import { Figtree, Newsreader } from "next/font/google";

// Newsreader, a calm reading serif with optical sizes, for the headings (its italic is the second voice of each
// title), and Figtree, a friendly, very legible sans, for the labels, prices and reading text. Neither is used by
// Steevanz or another client site.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--pr-font-display",
});

export const figtree = Figtree({ subsets: ["latin"], display: "swap", variable: "--pr-font-sans" });

export const prumoFontVariables = `${newsreader.variable} ${figtree.variable}`;
