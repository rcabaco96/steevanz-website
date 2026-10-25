"use client";

import Image from "next/image";
import { useState } from "react";
import { oQuintalLocalImages } from "@/content/o-quintal/images";
import { formatEuros, oQuintalFromPrice, type OQuintalProduct } from "@/content/o-quintal/products";

// The product's real photo: a local copy when scripts/o-quintal/fetch-images.mjs has made one, otherwise the
// business's own photo on its Jumpseller CDN (fetched and cached by Vercel's image optimizer, next.config.ts
// remotePatterns). Every listed product has one. While it loads, or if the CDN fails, a soft kraft tile with the
// name keeps the layout intact (never a fake picture).
export function ProductVisual({
  product,
  sizes,
  preload = false,
  className = "",
  imageClassName = "",
}: {
  product: OQuintalProduct;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const local = oQuintalLocalImages[product.id];
  const src = local?.src ?? product.sourceImage;
  return (
    <div className={`relative overflow-hidden bg-kraft-2 ${className}`}>
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center p-4 text-center font-display text-[0.95rem] leading-tight text-terra/45">
        {product.name}
      </span>
      {src && !failed ? (
        <Image
          src={src}
          alt={product.name}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload ? undefined : "lazy"}
          onError={() => setFailed(true)}
          className={`object-cover ${imageClassName}`}
        />
      ) : null}
    </div>
  );
}

/** Price with its unit, in the shop's chalk-on-slate tag. Unpriced products get a quiet line, not a shout. */
export function PriceTag({ product, size = "md" }: { product: OQuintalProduct; size?: "sm" | "md" | "lg" }) {
  const from = oQuintalFromPrice(product);
  const text = size === "lg" ? "text-[2.1rem]" : size === "sm" ? "text-[1.25rem]" : "text-[1.6rem]";
  if (!product.inStock) return <span className="text-sm text-tomate-deep">Esgotado</span>;
  if (!from) return <span className="text-sm text-terra italic">Preço sob consulta</span>;
  return (
    <span className={`oq-tag ${text}`}>
      {from.varies ? <span className="oq-tag-unit">desde</span> : null}
      {formatEuros(from.cents)}
      {product.unit && !from.varies ? <span className="oq-tag-unit">/ {product.unit}</span> : null}
    </span>
  );
}
