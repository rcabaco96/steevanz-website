"use client";

import { useSyncExternalStore } from "react";
import { ferragialCopy } from "@/content/ferragial/copy";
import { ferragialHref, ferragialPreviewBase } from "@/content/ferragial/routes";
import { Logo } from "./Logo";

const noop = () => () => {};

// 404 inside the Adega Ferragial's site (its own look, its own words). The browser's address decides the link home.
export function FerragialNotFound() {
  const pathname = useSyncExternalStore(noop, () => window.location.pathname, () => ferragialPreviewBase);
  const mode = pathname.startsWith(ferragialPreviewBase) ? "preview" : "domain";
  const copy = ferragialCopy;
  return (
    <main className="fg-dark relative grid min-h-svh place-items-center overflow-hidden bg-xisto px-5 text-center text-cal">
      <span aria-hidden="true" className="absolute inset-x-0 top-[62%] h-px bg-cal/25" />
      <div className="relative flex max-w-xl flex-col items-center gap-6">
        <Logo label={copy.logoLabel} sun="var(--color-palha)" />
        <p className="font-display text-7xl leading-none text-barro-2">404</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">{copy.notFound.title}</h1>
        <p className="text-cal/80">{copy.notFound.text}</p>
        <a
          href={ferragialHref(mode)}
          className="inline-flex h-14 items-center rounded-full bg-cal px-7 text-[0.8rem] font-semibold tracking-[0.14em] text-xisto uppercase transition-colors hover:bg-white"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
