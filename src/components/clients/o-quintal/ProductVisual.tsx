import Image from "next/image";
import { oQuintalLocalImages } from "@/content/o-quintal/images";
import { formatEuros, oQuintalFromPrice, type OQuintalCategoryId, type OQuintalProduct } from "@/content/o-quintal/products";

// The product's photo (downloaded from o-quintal.com by scripts/o-quintal/fetch-images.mjs) or, while it isn't
// there, a neutral crate label: the product's name stamped on kraft in its category's colour. No invented photo.
const tone: Record<OQuintalCategoryId, { bg: string; ink: string; ring: string }> = {
  cabazes: { bg: "bg-caixote", ink: "text-giz", ring: "border-giz/40" },
  fruta: { bg: "bg-tomate", ink: "text-giz", ring: "border-giz/40" },
  legumes: { bg: "bg-folha", ink: "text-giz", ring: "border-giz/35" },
  regionais: { bg: "bg-limao", ink: "text-ardosia", ring: "border-ardosia/30" },
  mercearia: { bg: "bg-kraft-2", ink: "text-terra", ring: "border-terra/30" },
};

export function ProductVisual({ product, sizes, priority = false, className = "" }: { product: OQuintalProduct; sizes: string; priority?: boolean; className?: string }) {
  const photo = oQuintalLocalImages[product.id];
  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-kraft-2 ${className}`}>
        <Image src={photo.src} alt={product.name} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const t = tone[product.category];
  const initial = product.name.replace(/^[\d\s]+(kg\s)?/i, "").charAt(0).toUpperCase();
  return (
    <div role="img" aria-label={product.name} className={`relative grid place-items-center overflow-hidden ${t.bg} ${t.ink} ${className}`}>
      <span aria-hidden="true" className="oq-slats absolute inset-x-0 bottom-0 h-[18%] opacity-60 [--slat:14px]" />
      <span aria-hidden="true" className={`grid aspect-square w-[46%] max-w-40 place-items-center rounded-full border-2 border-dashed ${t.ring}`}>
        <span className="font-display text-[clamp(2.4rem,9vw,4.6rem)] leading-none">{initial}</span>
      </span>
      <span aria-hidden="true" className="oq-stamp absolute top-3 left-3 opacity-70">O Quintal</span>
    </div>
  );
}

/** The chalk price tag, or «Preço sob consulta» when the catalogue has no price. */
export function PriceTag({ product, size = "md" }: { product: OQuintalProduct; size?: "sm" | "md" | "lg" }) {
  const from = oQuintalFromPrice(product);
  const text = size === "lg" ? "text-[2.1rem]" : size === "sm" ? "text-[1.2rem] sm:text-[1.35rem]" : "text-[1.6rem]";
  if (!product.inStock) return <span className="oq-stamp text-tomate-deep">Esgotado</span>;
  if (!from) return <span className="oq-stamp text-terra">Preço sob consulta</span>;
  return (
    <span className={`oq-tag ${text}`}>
      {from.varies ? <span className="oq-tag-unit">desde</span> : null}
      {formatEuros(from.cents)}
      {product.unit && !from.varies ? <span className={`oq-tag-unit ${size === "sm" ? "hidden min-[400px]:inline" : ""}`}>/ {product.unit}</span> : null}
    </span>
  );
}
