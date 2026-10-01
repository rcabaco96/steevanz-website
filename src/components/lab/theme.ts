"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

import { flowerMarkSvg } from "./FlowerMark";
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

const VEIL_MARK = flowerMarkSvg(56);

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
  veil.innerHTML = `<span class="veil-spin"><span class="veil-ring"></span>${VEIL_MARK}</span>`;
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
        }, 520),
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
