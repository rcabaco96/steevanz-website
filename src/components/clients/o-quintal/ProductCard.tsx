"use client";

import Link from "next/link";
import { useState } from "react";
import { oQuintalFromPrice, oQuintalUnitPrice, type OQuintalProduct } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { oQuintalCart } from "./cart-store";
import { PriceTag, ProductVisual } from "./ProductVisual";

// A product in the grid: the real photo, the name, the price with its unit and a clear «Adicionar» button.
// Products with options («Cabaz Misto», tamanhos…) open their page to choose («Escolher»); unpriced ones show a
// quiet «Preço sob consulta» and no button. The photo and the name link to the product.
export function ProductCard({ product, mode, preload = false }: { product: OQuintalProduct; mode: OQuintalMode; preload?: boolean }) {
  const [added, setAdded] = useState(false);
  const href = oQuintalHref(mode, { kind: "product", id: product.id });
  const priced = oQuintalFromPrice(product) !== null;
  const direct = priced && !product.option && oQuintalUnitPrice(product, null) !== null;

  const add = () => {
    oQuintalCart.add(product.id, null, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article data-card className={`group flex flex-col overflow-hidden rounded-[1.1rem] bg-giz shadow-[0_1px_0_rgb(38_42_43/0.06),0_14px_30px_-20px_rgb(38_42_43/0.45)] ${priced ? "" : "opacity-90"}`}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <ProductVisual
          product={product}
          preload={preload}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 47vw"
          className="aspect-square"
          imageClassName="transition-transform duration-500 ease-[var(--ease-banca)] group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-[1rem] leading-snug text-ardosia sm:text-[1.12rem]">
          <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto pt-3">
          <PriceTag product={product} size="sm" />
          {direct ? (
            <button
              type="button"
              onClick={add}
              aria-label={`Adicionar ${product.name} ao carrinho`}
              className={`mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-giz transition-colors ${added ? "bg-folha" : "bg-tomate hover:bg-tomate-deep"}`}
            >
              <span aria-hidden="true" className="text-base leading-none">{added ? "✓" : "+"}</span>
              {added ? "No cesto" : "Adicionar"}
            </button>
          ) : priced ? (
            <Link href={href} className="mt-3 flex h-10 w-full items-center justify-center rounded-full border-2 border-folha text-sm font-semibold text-folha hover:bg-folha hover:text-giz">
              Escolher opção
            </Link>
          ) : null}
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `${product.name} adicionado ao carrinho` : ""}
      </span>
    </article>
  );
}
