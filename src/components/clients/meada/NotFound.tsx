"use client";

import { useSyncExternalStore } from "react";
import { meadaCopy } from "@/content/meada/copy";
import { meadaHref, meadaPreviewBase } from "@/content/meada/routes";
import { Logo } from "./Logo";

const noop = () => () => {};

// 404 inside Meada's site (its own look, its own words). The browser's address decides the link home.
export function MeadaNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => meadaPreviewBase);
  const mode = pathname.startsWith(meadaPreviewBase) ? "preview" : "domain";
  const copy = meadaCopy;
  return (
    <main className="md-linen relative grid min-h-svh place-items-center overflow-hidden px-5 text-center text-tinta">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Logo id="md-mark-404" label={copy.logoLabel} className="w-44 items-center" />
        <p className="font-mono text-6xl leading-none text-fio">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-cinza">{copy.notFound.text}</p>
        <a
          href={meadaHref(mode)}
          className="inline-flex h-12 items-center rounded-full bg-grafite px-7 font-mono text-[0.8rem] tracking-[0.14em] text-algodao uppercase transition-colors hover:bg-fio"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
