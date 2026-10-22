"use client";

import Image from "next/image";
import { useState } from "react";
import { ermita, ermitaImageSize } from "@/content/o-ermita/facts";
import { PinIcon } from "./icons";

interface MapEmbedProps {
  button: string;
  note: string;
  title: string;
  entranceAlt: string;
}

// Google Maps only loads when the visitor asks for it (no third-party cookies, no weight before that).
// Until then: the restaurant's door, so people know what to look for.
export function MapEmbed({ button, note, title, entranceAlt }: MapEmbedProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[0.4rem] bg-noite sm:aspect-[16/11]">
      {show ? (
        <iframe
          src={ermita.mapsEmbed}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={ermita.media.entrance}
            alt={entranceAlt}
            width={ermitaImageSize.wide.width}
            height={ermitaImageSize.wide.height}
            sizes="(min-width: 1024px) 44vw, 92vw"
            className="absolute inset-0 h-full w-full object-cover object-[45%_50%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(15_22_36/0.85))]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-cal px-5 text-[0.75rem] font-semibold tracking-[0.18em] text-azulejo-deep uppercase shadow-lg transition-colors hover:bg-white"
            >
              <PinIcon width={18} height={18} />
              {button}
            </button>
            <p className="text-xs text-cal/85 sm:text-sm">{note}</p>
          </div>
        </>
      )}
    </div>
  );
}
