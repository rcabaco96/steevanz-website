// The opening (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. «rz-motion» marks a page that will animate (JavaScript on, motion allowed): only then are the
// trips' covers (a cave's rock, the binoculars' dark) drawn over their films, so nothing is ever left covered.
export const preloaderSeenKey = "rz-preloader";

export const preloaderGateScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("rz-motion");if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("rz-seen")}catch(e){document.documentElement.classList.add("rz-seen")}`;

export const preloaderNoscriptStyle = ".rz-pre{display:none!important}";
