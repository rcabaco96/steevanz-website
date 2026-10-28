// The opening (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it.
export const preloaderSeenKey = "md-preloader";

export const preloaderGateScript = `try{if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("md-seen")}catch(e){document.documentElement.classList.add("md-seen")}`;

export const preloaderNoscriptStyle = ".md-pre{display:none!important}";
