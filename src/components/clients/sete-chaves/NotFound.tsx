"use client";

import { useSyncExternalStore } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  seteChavesHref,
  seteChavesPreviewBase,
} from "@/content/sete-chaves/routes";
import { FobMark } from "./Logo";

const noop = () => () => {};

// 404 inside Sete Chaves' site (its own look, its own words): the key tag swinging on the schist.
export function SeteChavesNotFound() {
  const pathname = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => seteChavesPreviewBase,
  );
  const mode = pathname.startsWith(seteChavesPreviewBase)
    ? "preview"
    : "domain";
  return (
    <main className="sc-on-dark relative grid min-h-svh place-items-center overflow-hidden bg-xisto px-5 text-center text-cal">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <FobMark
          gradientId="sc-brass-404"
          className="sc-sway h-28 w-auto"
          style={{ ["--sc-hole" as string]: "var(--color-xisto)" }}
        />
        <p className="font-display text-7xl leading-none text-latao-claro">
          404
        </p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          {copy.notFound.title}
        </h1>
        <p className="text-cal/80">{copy.notFound.text}</p>
        <a
          href={seteChavesHref(mode)}
          className="inline-flex h-14 items-center rounded-full bg-cal px-7 text-[0.8rem] font-semibold tracking-[0.14em] text-xisto uppercase transition-colors hover:bg-white"
        >
          {copy.notFound.back}
        </a>
      </div>
    </main>
  );
}
