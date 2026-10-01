"use client";

import { useEffect } from "react";

/** Inside the homepage panel (an iframe, or ?embed=1), hide the page's own header and footer. */
export function EmbedFlag() {
  useEffect(() => {
    if (window.self !== window.top || new URLSearchParams(window.location.search).get("embed") === "1") {
      document.querySelector(".lab-root")?.classList.add("embed-page");
    }
  }, []);
  return null;
}
