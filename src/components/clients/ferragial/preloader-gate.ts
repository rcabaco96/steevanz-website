// The opening (Opening.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it. While it plays, «fg-loading» holds the hero's entrance, so the hero comes in once.
export const openingSeenKey = "fg-opening";

export const openingGateScript = `try{if(sessionStorage.getItem("${openingSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("fg-seen");else document.documentElement.classList.add("fg-loading")}catch(e){document.documentElement.classList.add("fg-seen")}`;

export const openingNoscriptStyle = ".fg-open{display:none!important}.fg-rise{animation:none!important;opacity:1!important}";
