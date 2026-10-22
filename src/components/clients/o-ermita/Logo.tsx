import type { CSSProperties } from "react";
import { ermita, ermitaLogoRatio } from "@/content/o-ermita/facts";

// The restaurant's logo (traced from its own file into three SVGs: the convent's skyline, «O ERMITA» and
// «RESTAURANTE»), painted in the current text colour through CSS masks.
function MaskPart({ src, ratio, className = "" }: { src: string; ratio: number; className?: string }) {
  return <span aria-hidden="true" className={`oe-mask ${className}`} style={{ "--src": `url(${src})`, aspectRatio: ratio } as CSSProperties} />;
}

export function Skyline({ className = "" }: { className?: string }) {
  return <MaskPart src={ermita.media.skyline} ratio={ermitaLogoRatio.skyline} className={className} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <MaskPart src={ermita.media.wordmark} ratio={ermitaLogoRatio.wordmark} className={className} />;
}

export function RestauranteLine({ className = "" }: { className?: string }) {
  return <MaskPart src={ermita.media.restaurante} ratio={ermitaLogoRatio.restaurante} className={className} />;
}

/** The whole logo, as one image for assistive technology. */
export function Logo({ label, className = "", compact = false }: { label: string; className?: string; compact?: boolean }) {
  return (
    <span role="img" aria-label={label} className={`flex flex-col items-center ${className}`}>
      <Skyline className="-ml-[0.6%] w-[94%] self-start" />
      <Wordmark className="mt-[6.5%] w-full" />
      {compact ? null : <RestauranteLine className="mt-[6.3%] w-[29.7%]" />}
    </span>
  );
}
