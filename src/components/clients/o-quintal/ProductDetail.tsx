"use client";

import Link from "next/link";
import { useState } from "react";
import { oQuintalAbout } from "@/content/o-quintal/about";
import { oQuintal } from "@/content/o-quintal/facts";
import { findOQuintalProduct, formatEuros, oQuintalCategories, oQuintalProductsIn, oQuintalUnitPrice } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { cartMaxQuantity } from "@/lib/o-quintal/cart";
import { oQuintalCart } from "./cart-store";
import { ArrowIcon, BasketIcon, PhoneIcon } from "./icons";
import { ProductCard } from "./ProductCard";
import { ProductVisual } from "./ProductVisual";

// A product's page. Mobile order (owner rule): name + short text, then the photo, then price, choice, quantity and
// the button. Products without a price show «Preço sob consulta» and the phone instead of the button.
export function ProductDetail({ mode, id }: { mode: OQuintalMode; id: string }) {
  const product = findOQuintalProduct(id);
  const firstChoice = product?.option?.choices.find((choice) => (product ? oQuintalUnitPrice(product, choice.id) !== null : false))?.id ?? null;
  const [choice, setChoice] = useState<string | null>(firstChoice);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return null;

  const unitCents = oQuintalUnitPrice(product, choice);
  const about = oQuintalAbout[product.id];
  const category = oQuintalCategories.find((entry) => entry.id === product.category);
  const related = oQuintalProductsIn(product.category)
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const add = () => {
    if (unitCents === null) return;
    oQuintalCart.add(product.id, product.option ? choice : null, quantity);
    setAdded(true);
  };

  return (
    <div className="px-4 pt-24 pb-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[84rem]">
        <nav aria-label="Caminho" className="oq-stamp flex flex-wrap gap-2 text-terra">
          <Link href={oQuintalHref(mode, { kind: "shop", category: null })} className="py-2 hover:text-ardosia">
            Loja
          </Link>
          <span aria-hidden="true" className="py-2">/</span>
          {category ? (
            <Link href={oQuintalHref(mode, { kind: "shop", category: category.id })} className="py-2 hover:text-ardosia">
              {category.name}
            </Link>
          ) : null}
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="lg:order-2">
            <h1 className="font-display text-[clamp(2.1rem,7.5vw,3.8rem)] leading-[1.04] text-ardosia">{product.name}</h1>
            {about ? <p className="mt-4 text-lg leading-relaxed text-ardosia/85">{about}</p> : null}
            {product.description.length ? (
              <ul className="mt-4 space-y-1.5 border-l-4 border-limao pl-4 text-terra">
                {product.description.map((paragraph) => (
                  <li key={paragraph}>{paragraph}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <ProductVisual product={product} preload sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-square rounded-[1.4rem] lg:order-1 lg:row-span-2" />

          <div className="lg:order-3">
            <div className="flex flex-wrap items-center gap-3">
              {unitCents !== null ? (
                <span className="oq-tag text-[2.3rem]">
                  {formatEuros(unitCents)}
                  {product.unit ? <span className="oq-tag-unit">/ {product.unit}</span> : null}
                </span>
              ) : (
                <span className="rounded-full bg-kraft-2 px-4 py-2.5 text-terra italic">{product.inStock ? "Preço sob consulta" : "Esgotado"}</span>
              )}
            </div>

            {product.option ? (
              <fieldset className="mt-7">
                <legend className="font-semibold text-ardosia">{product.option.label}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.option.choices.map((entry) => {
                    const price = oQuintalUnitPrice(product, entry.id);
                    const selected = entry.id === choice;
                    return (
                      <label
                        key={entry.id}
                        className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-tomate ${selected ? "border-folha bg-folha text-giz" : "border-ardosia/15 text-ardosia hover:border-folha"} ${price === null ? "opacity-60" : ""}`}
                      >
                        <input
                          type="radio"
                          name="escolha"
                          value={entry.id}
                          checked={selected}
                          onChange={() => {
                            setChoice(entry.id);
                            setAdded(false);
                          }}
                          className="sr-only"
                        />
                        {entry.name}
                        {price !== null && entry.priceCents !== undefined ? <span className="font-normal opacity-80">· {formatEuros(price)}</span> : null}
                        {price === null ? <span className="font-normal opacity-80">· sob consulta</span> : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {unitCents !== null ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border-2 border-ardosia/15 bg-giz">
                  <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} className="grid h-12 w-12 place-items-center text-xl" aria-label="Menos um">
                    −
                  </button>
                  <label className="sr-only" htmlFor="oq-qty">
                    Quantidade
                  </label>
                  <input
                    id="oq-qty"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(event) => {
                      const n = Number(event.target.value.replace(/\D/g, ""));
                      setQuantity(Math.min(cartMaxQuantity, Math.max(1, n || 1)));
                    }}
                    className="w-10 bg-transparent text-center text-lg font-semibold"
                  />
                  <button type="button" onClick={() => setQuantity((n) => Math.min(cartMaxQuantity, n + 1))} className="grid h-12 w-12 place-items-center text-xl" aria-label="Mais um">
                    +
                  </button>
                </div>
                <button type="button" onClick={add} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-tomate px-6 font-semibold text-giz transition-transform hover:scale-[1.02] sm:flex-none">
                  <BasketIcon className="h-5 w-5" /> Adicionar ao carrinho
                </button>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl bg-kraft-2 p-5">
                <p className="text-ardosia">Para este produto, fale connosco e confirmamos o preço e a disponibilidade.</p>
                <a href={oQuintal.phoneHref} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-folha px-5 font-semibold text-giz">
                  <PhoneIcon className="h-4 w-4" /> {oQuintal.phoneDisplay}
                </a>
                <p className="mt-2 text-xs text-terra">{oQuintal.phoneNote}</p>
              </div>
            )}

            <p role="status" aria-live="polite" className="mt-4 min-h-6 font-semibold text-folha">
              {added ? (
                <Link href={oQuintalHref(mode, { kind: "cart" })} className="inline-flex items-center gap-2 underline underline-offset-4">
                  Adicionado. Ver o carrinho <ArrowIcon className="h-4 w-4" />
                </Link>
              ) : null}
            </p>
          </div>
        </div>

        {related.length ? (
          <section aria-labelledby="oq-related" className="mt-20">
            <h2 id="oq-related" className="font-display text-[1.9rem] text-ardosia">
              Também em {category?.name.toLowerCase()}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} mode={mode} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
