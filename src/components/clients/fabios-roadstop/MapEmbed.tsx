"use client";

import Image from "next/image";
import { useState } from "react";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import { PinIcon } from "./icons";

interface MapEmbedProps {
  button: string;
  note: string;
  title: string;
  facadeAlt: string;
}

// Google Maps only loads when the visitor asks for it (no third-party cookies, no weight before that).
// Until then: the shop front, so people know what to look for.
export function MapEmbed({ button, note, title, facadeAlt }: MapEmbedProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-night ring-4 ring-cream sm:aspect-[16/11]">
      {show ? (
        <iframe
          src={fabios.mapsEmbed}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={fabios.media.facade}
            alt={facadeAlt}
            width={fabiosImageSize.still.width}
            height={fabiosImageSize.still.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(13_23_38/0.85))]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:p-7">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-cream px-5 font-bold text-ink shadow-lg transition-colors hover:bg-sun"
            >
              <PinIcon width={18} height={18} />
              {button}
            </button>
            <p className="text-xs text-cream/80 sm:text-sm">{note}</p>
          </div>
        </>
      )}
    </div>
  );
}
