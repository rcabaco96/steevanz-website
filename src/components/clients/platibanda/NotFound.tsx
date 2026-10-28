"use client";

import { useSyncExternalStore } from "react";
import { platibandaCopy } from "@/content/platibanda/copy";
import { platibandaHref, platibandaPreviewBase } from "@/content/platibanda/routes";
import { Emblem } from "./Logo";

const noop = () => () => {};

// 404 inside Platibanda's site (its own look, its own words): a house front whose door stays shut.
// The browser's address decides the link home.
export function PlatibandaNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => platibandaPreviewBase);
  const mode = pathname.startsWith(platibandaPreviewBase) ? "preview" : "domain";
  const copy = platibandaCopy;
  return (
    <main className="pb-on-dark relative grid min-h-svh place-items-center overflow-hidden bg-ria px-5 text-center text-cal">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Emblem className="w-28" line="var(--color-cal)" />
        <p className="font-display text-7xl leading-none text-ocre">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-cal/80">{copy.notFound.text}</p>
        <a href={platibandaHref(mode)} className="inline-flex h-14 items-center rounded-full bg-cal px-7 font-semibold text-ria transition-colors hover:bg-white">
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
