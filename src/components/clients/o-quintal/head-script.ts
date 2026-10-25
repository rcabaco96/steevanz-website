// Set before the first paint (in the layout's <head>): with JavaScript and without reduced motion, the elements
// that animate in start hidden (html.oq-anim [data-intro]) and the crate covers are shown, so the opening runs once
// (owner, 2026-10-23: never visible → hidden → animated). Without JavaScript nothing is hidden.
export const oQuintalHeadScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("oq-anim")}catch(e){}`;
