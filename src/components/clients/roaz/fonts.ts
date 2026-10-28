import { Big_Shoulders, Big_Shoulders_Stencil, Figtree } from "next/font/google";

// Big Shoulders, a tall condensed grotesque (the lettering of harbour signs and boat sheds) for the headings; its
// stencil cut for numbers, prices and the big labels, like the registration painted on a hull; Figtree, open and
// friendly, for the reading text.
export const shoulders = Big_Shoulders({ subsets: ["latin"], display: "swap", variable: "--rz-font-display" });

export const stencil = Big_Shoulders_Stencil({ subsets: ["latin"], display: "swap", variable: "--rz-font-stencil" });

export const figtree = Figtree({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--rz-font-sans" });

export const roazFontVariables = `${shoulders.variable} ${stencil.variable} ${figtree.variable}`;
