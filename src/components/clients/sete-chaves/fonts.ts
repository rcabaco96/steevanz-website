import { Figtree, Gloock } from "next/font/google";

// Gloock, a high-contrast serif with the weight of letters stamped into a brass key tag, for the headings and the
// numbers on the keys; Figtree, a friendly, open sans, for labels and reading text. Neither is used by another
// Steevanz client site.
export const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--sc-font-display",
});

export const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--sc-font-sans",
});

export const seteChavesFontVariables = `${gloock.variable} ${figtree.variable}`;
