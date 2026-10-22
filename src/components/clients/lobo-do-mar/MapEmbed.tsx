"use client";

import Image from "next/image";
import { useState } from "react";
import { lobo, loboPhotoSize } from "@/content/lobo-do-mar/facts";
import { PinIcon } from "./icons";

// Google Maps only loads when the visitor asks for it (no third-party cookies, no weight before that).
// Until then: the restaurant's terrace and blue sign, so people know what to look for.
export function MapEmbed({ button, note, title, alt }: { button: string; note: string; title: string; alt: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-abismo sm:aspect-[16/11]">
      {show ? (
        <iframe src={lobo.mapsEmbed} title={title} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <>
          <Image src={lobo.media.front} alt={alt} width={loboPhotoSize.front.width} height={loboPhotoSize.front.height} sizes="(min-width: 1024px) 44vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(11_36_48/0.9))]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-areia px-5 text-[0.75rem] font-bold tracking-[0.14em] text-abismo uppercase shadow-lg transition-colors hover:bg-white"
            >
              <PinIcon width={18} height={18} />
              {button}
            </button>
            <p className="text-xs text-areia/85 sm:text-sm">{note}</p>
          </div>
        </>
      )}
    </div>
  );
}
