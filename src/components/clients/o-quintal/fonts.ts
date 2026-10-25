import localFont from "next/font/local";

// O Quintal's type (latin subset: covers Portuguese; OFL fonts, files and licences in ./fonts; from the @fontsource packages on npm):
//  - Young Serif: a warm, round old-style serif, like a painted grocer's sign — titles.
//  - Instrument Sans: a clear grotesque for reading and for the crate stamps.
//  - Caveat: handwriting, for the prices chalked on the slate tags.
export const youngSerif = localFont({
  src: [{ path: "./fonts/young-serif-latin-400-normal.woff2", weight: "400", style: "normal" }],
  display: "swap",
  variable: "--oq-font-display",
  fallback: ["Georgia", "serif"],
});

export const instrumentSans = localFont({
  src: [{ path: "./fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--oq-font-sans",
  fallback: ["system-ui", "sans-serif"],
});

export const caveat = localFont({
  src: [{ path: "./fonts/caveat-latin-600-normal.woff2", weight: "600", style: "normal" }],
  display: "swap",
  variable: "--oq-font-giz",
  fallback: ["cursive"],
});

export const oQuintalFontVariables = `${youngSerif.variable} ${instrumentSans.variable} ${caveat.variable}`;
