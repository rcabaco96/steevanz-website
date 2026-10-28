"use client";

import { useSyncExternalStore } from "react";
import { ponteiroCopy } from "@/content/ponteiro/copy";
import { ponteiroHref, ponteiroPreviewBase } from "@/content/ponteiro/routes";
import { Mark } from "./Logo";

const noop = () => () => {};

// 404 inside Ponteiro's site (its own look, its own words): the shutter is down. The browser's address decides the
// link home.
export function PonteiroNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => ponteiroPreviewBase);
  const mode = pathname.startsWith(ponteiroPreviewBase) ? "preview" : "domain";
  const copy = ponteiroCopy;
  return (
    <main className="pn-on-dark pn-slats relative grid min-h-svh place-items-center overflow-hidden px-5 text-center">
      <div className="flex max-w-xl flex-col items-center gap-6 rounded-[1.6rem] bg-noite px-8 py-10 text-papel">
        <Mark className="h-20 w-auto text-papel" angle={225} title={copy.logoLabel} />
        <p className="font-display text-7xl leading-none text-gema italic">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-papel/80">{copy.notFound.text}</p>
        <a href={ponteiroHref(mode)} className="inline-flex h-14 items-center rounded-full bg-gema px-7 font-semibold text-tinta transition-colors hover:bg-gema-soft">
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
