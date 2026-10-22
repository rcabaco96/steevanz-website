// The curtain (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. When motion is fine the script also adds «lm-anim», so the opening's words and films start hidden
// and only appear once, with their entrance (without it they showed, vanished and came in again: owner, 2026-10-23).
export const preloaderSeenKey = "lm-preloader";

export const preloaderGateScript = `try{var d=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r)d.classList.add("lm-anim");if(sessionStorage.getItem("${preloaderSeenKey}")||r)d.classList.add("lm-seen")}catch(e){document.documentElement.classList.add("lm-seen")}`;

export const preloaderNoscriptStyle = ".lm-pre{display:none!important}";
