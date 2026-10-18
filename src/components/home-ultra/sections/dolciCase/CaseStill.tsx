"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

// A lazy still inside a phone screen that tolerates a missing file: the fallback sits underneath and
// the image is dropped if it fails to load (no broken-image icon).

export function CaseStill({
  src,
  alt,
  sizes,
  className = "",
  fallback,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={className}>
      {fallback}
      {failed ? null : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
}
