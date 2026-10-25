import Link from "next/link";
import type { OQuintalProduct } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { PriceTag, ProductVisual } from "./ProductVisual";

// A product in the grid: photo (or crate label), name and the chalk price tag. The whole card links to the product.
export function ProductCard({ product, mode }: { product: OQuintalProduct; mode: OQuintalMode }) {
  return (
    <Link
      href={oQuintalHref(mode, { kind: "product", id: product.id })}
      data-card
      className="group flex flex-col overflow-hidden rounded-[1.1rem] bg-giz shadow-[0_1px_0_rgb(38_42_43/0.08),0_12px_28px_-18px_rgb(38_42_43/0.4)] transition-transform duration-300 ease-[var(--ease-banca)] hover:-translate-y-1"
    >
      <ProductVisual product={product} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw" className="aspect-[4/3.4] transition-transform duration-500 group-hover:scale-[1.03]" />
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <h3 className="font-display text-[1.02rem] leading-snug text-ardosia sm:text-[1.15rem]">{product.name}</h3>
        {product.unit ? <p className="-mt-2 text-sm text-terra min-[400px]:hidden">Preço por {product.unit}</p> : null}
        <div className="mt-auto">
          <PriceTag product={product} size="sm" />
        </div>
      </div>
    </Link>
  );
}
