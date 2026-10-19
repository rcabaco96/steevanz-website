"use client";

import { useSyncExternalStore } from "react";
import { defaultMenuLanguage, languageParam, languageStorageKey, pickMenuLanguage, type MenuLanguage } from "@/lib/video-menus/i18n";

// The language the menu is shown in, shared by the menu and its ordering code (one store per page).
// The server draws the page in Portuguese; on the phone the menu switches, before the opening ends, to
// ?lang= in the address, else the customer's earlier choice, else the phone's own language when the
// menu has it. Switching never reloads the page nor touches the videos: only the words change.

let current: MenuLanguage | null = null;
const listeners = new Set<() => void>();

function readStored(): string | null {
  try {
    return window.localStorage.getItem(languageStorageKey);
  } catch {
    return null;
  }
}

function snapshot(): MenuLanguage {
  if (current === null) {
    current = pickMenuLanguage({ search: window.location.search, stored: readStored(), browser: navigator.languages ?? [navigator.language] });
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The customer chose a language: remembered on this phone (and in the address when it has ?lang=). */
export function chooseMenuLanguage(language: MenuLanguage) {
  current = language;
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // Private mode or blocked storage: the choice lasts for this page.
  }
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(languageParam)) {
      url.searchParams.set(languageParam, language);
      window.history.replaceState(window.history.state, "", url);
    }
  } catch {
    // The address stays as it was.
  }
  for (const listener of listeners) listener();
}

export function useMenuLanguage(): MenuLanguage {
  return useSyncExternalStore(subscribe, snapshot, () => defaultMenuLanguage);
}
