// The opening (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. So the opening comes in once and never flashes in and out.
export const preloaderSeenKey = "pb-preloader";

// It also marks «pb-motion» when the visitor allows motion, so elements that animate in can start in their first
// pose from the first paint (the property gallery's house front).
export const preloaderGateScript = `try{var h=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r)h.classList.add("pb-motion");if(sessionStorage.getItem("${preloaderSeenKey}")||r)h.classList.add("pb-seen")}catch(e){document.documentElement.classList.add("pb-seen")}`;

export const preloaderNoscriptStyle = ".pb-pre{display:none!important}";
