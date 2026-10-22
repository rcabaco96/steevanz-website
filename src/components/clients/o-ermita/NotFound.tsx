"use client";

import { useSyncExternalStore } from "react";
import { ermitaCopy } from "@/content/o-ermita/copy";
import { ermitaHref, ermitaPreviewBase } from "@/content/o-ermita/routes";
import { Logo } from "./Logo";

const noop = () => () => {};

// 404 inside the client's site (its own look, its own words), on the preview path or on its domain. The
// browser's address decides the language and the link home (the server may only see the rewritten path).
export function ErmitaNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => ermitaPreviewBase);
  const mode = pathname.startsWith(ermitaPreviewBase) ? "preview" : "domain";
  const rest = mode === "preview" ? pathname.slice(ermitaPreviewBase.length) : pathname;
  const locale = /^\/(dominio\/)?en(\/|$)/.test(rest) ? "en" : "pt";
  const copy = ermitaCopy[locale];
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-noite px-5 text-center text-cal">
      <div aria-hidden="true" className="oe-azulejo oe-barra absolute inset-x-0 top-0" />
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Logo label={copy.logoLabel} className="w-52 text-cal" />
        <p className="font-serif text-7xl leading-none text-ouro italic">404</p>
        <h1 className="font-serif text-4xl leading-tight font-medium sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-cal/80">{copy.notFound.text}</p>
        <a
          href={ermitaHref(mode, locale)}
          className="inline-flex h-14 items-center rounded-full bg-cal px-7 text-[0.8rem] font-semibold tracking-[0.18em] text-azulejo-deep uppercase transition-colors hover:bg-white"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
