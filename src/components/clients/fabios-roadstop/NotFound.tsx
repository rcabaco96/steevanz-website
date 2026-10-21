"use client";

import { useSyncExternalStore } from "react";
import { fabiosCopy } from "@/content/fabios-roadstop/copy";
import { fabiosHref, fabiosPreviewBase } from "@/content/fabios-roadstop/routes";

const noop = () => () => {};

// 404 inside the client's site (its own look, its own words), on the preview path or on its domain. The
// browser's address decides the language and the link home (the server may only see the rewritten path).
export function FabiosNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => fabiosPreviewBase);
  const mode = pathname.startsWith(fabiosPreviewBase) ? "preview" : "domain";
  const rest = mode === "preview" ? pathname.slice(fabiosPreviewBase.length) : pathname;
  const locale = /^\/(dominio\/)?en(\/|$)/.test(rest) ? "en" : "pt";
  const copy = fabiosCopy[locale];
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-night px-5 text-center text-cream">
      <div aria-hidden="true" className="fr-checker absolute inset-x-0 top-0 h-4 [--s:16px]" />
      <div className="flex max-w-xl flex-col items-center gap-6">
        <p className="fr-neon fr-neon-flicker text-7xl leading-none sm:text-8xl">404</p>
        <h1 className="font-display text-5xl leading-[0.95] uppercase sm:text-6xl">{copy.notFound.title}</h1>
        <p className="text-lg text-cream/80">{copy.notFound.text}</p>
        <a href={fabiosHref(mode, locale, "home")} className="inline-flex h-14 items-center rounded-full bg-cherry px-7 text-lg font-bold transition-colors hover:bg-cherry-bright">
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
