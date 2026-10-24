// The opening cut (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. Otherwise the page starts «loading» (no scroll, the hero's entrance waiting) until the cut is done.
export const preloaderSeenKey = "rc-preloader";

export const preloaderGateScript = `try{if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("rc-seen");else document.documentElement.classList.add("rc-loading")}catch(e){document.documentElement.classList.add("rc-seen")}`;

export const preloaderNoscriptStyle = ".rc-pre{display:none!important}";
