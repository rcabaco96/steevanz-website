// The rolling shutter (Shutter.tsx) is decided before the first paint, in the layout's <head>: already seen in this
// tab session, or reduced motion, or storage blocked → the page starts without it. Without JavaScript the <noscript>
// style hides it.
export const shutterSeenKey = "pn-shutter";

export const shutterGateScript = `try{if(sessionStorage.getItem("${shutterSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("pn-seen")}catch(e){document.documentElement.classList.add("pn-seen")}`;

export const shutterNoscriptStyle = ".pn-shutter{display:none!important}";
