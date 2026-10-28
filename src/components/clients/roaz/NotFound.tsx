"use client";

import { useSyncExternalStore } from "react";
import { roazCopy } from "@/content/roaz/copy";
import { roazHref, roazPreviewBase } from "@/content/roaz/routes";
import { Logo } from "./Logo";

const noop = () => () => {};

// 404 inside Roaz's site (its own look, its own words). The browser's address decides the link home.
export function RoazNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => roazPreviewBase);
  const mode = pathname.startsWith(roazPreviewBase) ? "preview" : "domain";
  const copy = roazCopy;
  return (
    <main className="rz-on-dark relative grid min-h-svh place-items-center overflow-hidden bg-fundo px-5 text-center text-sal">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Logo label={copy.logoLabel} line={copy.tagline} className="w-48 items-center text-sal" />
        <p className="font-stencil text-8xl leading-none font-bold text-falesia">404</p>
        <h1 className="rz-title text-5xl sm:text-6xl">{copy.notFound.title}</h1>
        <p className="text-sal/80">{copy.notFound.text}</p>
        <a
          href={roazHref(mode)}
          className="inline-flex h-14 items-center rounded-full bg-falesia px-7 font-display text-[1.2rem] font-bold tracking-[0.08em] text-fundo uppercase transition-colors hover:bg-falesia-deep"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
