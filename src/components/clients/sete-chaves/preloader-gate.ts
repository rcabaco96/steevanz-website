// The opening (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. So it comes in once and never flashes (owner, 2026-10-23: «dá load 2 vezes»).
export const preloaderSeenKey = "sc-preloader";

export const preloaderGateScript = `try{if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("sc-seen")}catch(e){document.documentElement.classList.add("sc-seen")}`;

export const preloaderNoscriptStyle = ".sc-pre{display:none!important}";
