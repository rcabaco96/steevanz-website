import { Fraunces } from "next/font/google";

// Route-local italic Fraunces, preloaded so the plum italic accents (hero brand line) don't swap in late.
// The site-wide italic instance has preload: false; this one only loads on /novo-ultra.
export const huItalic = Fraunces({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "swap",
  preload: true,
  variable: "--font-hu-italic",
});
