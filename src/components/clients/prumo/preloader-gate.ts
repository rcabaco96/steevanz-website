// The opening (Preloader.tsx) is decided before the first paint, in the layout's <head>: already seen in this tab
// session, or reduced motion, or storage blocked → the page starts without it («pr-seen»). Otherwise «pr-loading»
// holds the hero's entrance back behind the opening, so it comes in once (owner, 2026-10-23: never visible → hidden
// → animated). If the page's script never starts the opening (a failed download), it steps aside after 5 s.
// Without JavaScript the <noscript> style hides it.
export const preloaderSeenKey = "pr-preloader";

export const preloaderGateScript = `(function(){var c=document.documentElement.classList;try{if(sessionStorage.getItem("${preloaderSeenKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches){c.add("pr-seen");return}c.add("pr-loading");setTimeout(function(){if(!c.contains("pr-playing")){c.remove("pr-loading");c.add("pr-seen")}},5000)}catch(e){c.add("pr-seen")}})()`;

export const preloaderNoscriptStyle = ".pr-pre{display:none!important}";
