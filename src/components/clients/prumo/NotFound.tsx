"use client";

import { useSyncExternalStore } from "react";
import { prumoCopy } from "@/content/prumo/copy";
import { prumoHref, prumoPreviewBase } from "@/content/prumo/routes";
import { Wordmark } from "./Logo";

const noop = () => () => {};

// 404 inside Prumo's site (its own look and words). The browser's address decides the link home.
export function PrumoNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => prumoPreviewBase);
  const mode = pathname.startsWith(prumoPreviewBase) ? "preview" : "domain";
  const copy = prumoCopy;
  return (
    <main className="pr-on-dark pr-grid pr-grid-dark relative grid min-h-svh place-items-center overflow-hidden bg-ardosia px-5 text-center text-cal">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Wordmark className="w-44" ink="var(--color-cal)" bob="var(--color-latao-claro)" title={copy.logoLabel} />
        <p className="font-display text-7xl leading-none text-latao-claro italic">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-cal/80">{copy.notFound.text}</p>
        <a href={prumoHref(mode)} className="inline-flex h-14 items-center rounded-full bg-cal px-7 font-semibold text-ardosia transition-colors hover:bg-white">
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
