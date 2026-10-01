"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

import { THEME_STORAGE_KEY as STORAGE_KEY } from "./themeScript";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Current theme, kept in sync with <html data-theme>. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

const VEIL_MARK = `<svg width="46" height="46" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#562650"/><g transform="translate(20 20)">${[0, 72, 144, 216, 288]
  .map((r) => `<g transform="rotate(${r})"><ellipse cx="0" cy="-7.4" rx="6" ry="7.6" fill="#f3ebde"/><path d="M0 -10.5 Q1.6 -6 0 -3.4 Q-1.6 -6 0 -10.5Z" fill="#562650"/></g>`)
  .join("")}<circle r="2" fill="#d9a238"/></g></svg>`;

/**
 * Switches theme behind a short veil: the screen eases to the wall colour with the
 * flower mark, the theme (and the 3D wall) updates underneath, then the veil lifts
 * in the new colours. Hides the brief re-render instead of showing a stutter.
 */
export function toggleTheme() {
  const next: Theme = read() === "dark" ? "light" : "dark";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || document.querySelector(".theme-veil")) {
    applyTheme(next);
    return;
  }
  const veil = document.createElement("div");
  veil.className = "theme-veil";
  veil.setAttribute("aria-hidden", "true");
  veil.innerHTML = VEIL_MARK;
  document.body.appendChild(veil);
  requestAnimationFrame(() => (veil.dataset.state = "in"));
  window.setTimeout(() => {
    applyTheme(next);
    // Let the new theme (and the re-baked wall) render a few frames before lifting.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        window.setTimeout(() => {
          veil.dataset.state = "out";
          window.setTimeout(() => veil.remove(), 520);
        }, 260),
      ),
    );
  }, 240);
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted in private mode; the toggle still works for this visit.
  }
}
