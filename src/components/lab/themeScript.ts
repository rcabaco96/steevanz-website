// v2: resets earlier saved choices so every visitor opens in dark.
export const THEME_STORAGE_KEY = "stz-theme-v2";

/**
 * Runs before first paint (inline in <head>): applies the saved theme, or the
 * device preference on a first visit, so the page never flashes the wrong one.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

