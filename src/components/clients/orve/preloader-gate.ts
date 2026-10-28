// The falling drop (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it.
export const preloaderSeenKey = "or-preloader";

export const preloaderGateScript = `try{if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("or-seen")}catch(e){document.documentElement.classList.add("or-seen")}`;

export const preloaderNoscriptStyle = ".or-pre{display:none!important}";
