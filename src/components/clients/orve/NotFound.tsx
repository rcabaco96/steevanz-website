"use client";

import { useSyncExternalStore } from "react";
import { orveCopy } from "@/content/orve/copy";
import { orveHref, orvePreviewBase } from "@/content/orve/routes";
import { Logo } from "./Logo";

const noop = () => () => {};

// 404 inside Orvé's site (its own look, its own words). The browser's address decides the link home.
export function OrveNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => orvePreviewBase);
  const mode = pathname.startsWith(orvePreviewBase) ? "preview" : "domain";
  const copy = orveCopy;
  return (
    <main className="or-on-dark relative grid min-h-svh place-items-center overflow-hidden bg-cacau px-5 text-center text-nacar">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Logo id="or-mark-404" label={copy.logoLabel} accent="var(--color-argila)" className="w-48 text-nacar" />
        <p className="font-display text-7xl leading-none text-argila italic">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-nacar/80">{copy.notFound.text}</p>
        <a
          href={orveHref(mode)}
          className="inline-flex h-14 items-center rounded-full bg-nacar px-7 text-[0.8rem] font-medium tracking-[0.16em] text-cacau uppercase transition-colors hover:bg-white"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
