"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { findOQuintalProduct, formatEuros, oQuintalUnitPrice } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { cartCount, cartSubtotal } from "@/lib/o-quintal/cart";
import { oQuintalCart, useOQuintalCart } from "./cart-store";
import { ArrowIcon, PhoneIcon } from "./icons";
import { ProductVisual } from "./ProductVisual";

type Fulfilment = "delivery" | "pickup";
type PayState = "checking" | "ready" | "soon";

// The cart (mobile first: stacked lines, the total and the pay button in a bar fixed to the bottom on phones).
// Prices from the catalogue; no tax lines (owner rule). «Pagar» sends ids, choices and quantities to
// /api/o-quintal/checkout, which prices them again and opens Stripe's page. Without Stripe keys: «em breve».
export function Cart({ mode }: { mode: OQuintalMode }) {
  const lines = useOQuintalCart();
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [pay, setPay] = useState<PayState>("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/o-quintal/checkout", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { enabled: false }))
      .then((data: { enabled?: boolean }) => alive && setPay(data.enabled ? "ready" : "soon"))
      .catch(() => alive && setPay("soon"));
    return () => {
      alive = false;
    };
  }, []);

  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/o-quintal/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, fulfilment, mode }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string; comingSoon?: boolean };
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.comingSoon) setPay("soon");
      setError(data.error ?? "Não foi possível abrir o pagamento.");
    } catch {
      setError("Sem ligação. Verifique a internet e tente novamente.");
    }
    setBusy(false);
  };

  if (!lines.length) {
    return (
      <div className="px-4 pt-28 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="oq-stamp text-tomate-deep">Carrinho</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,8vw,3.6rem)] text-ardosia">O cesto está vazio.</h1>
          <p className="mt-4 text-lg text-terra">Escolha um cabaz ou passe pela banca.</p>
          <Link href={oQuintalHref(mode, { kind: "shop", category: null })} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-folha px-6 font-semibold text-giz">
            Ir para a loja <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-24 pb-44 sm:px-8 sm:pt-32 lg:pb-24">
      <div className="mx-auto grid max-w-[72rem] gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="oq-stamp text-tomate-deep">Carrinho</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,8vw,3.6rem)] text-ardosia">O seu cesto</h1>
          <ul className="mt-8 divide-y-2 divide-dashed divide-ardosia/10">
            {lines.map((line) => {
              const product = findOQuintalProduct(line.id);
              if (!product) return null;
              const unit = oQuintalUnitPrice(product, line.choice) ?? 0;
              const choiceName = product.option?.choices.find((entry) => entry.id === line.choice)?.name;
              return (
                <li key={`${line.id}-${line.choice ?? ""}`} className="flex gap-3 py-4 sm:gap-5">
                  <ProductVisual product={product} sizes="96px" className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={oQuintalHref(mode, { kind: "product", id: product.id })} className="font-display text-[1.1rem] leading-snug text-ardosia hover:underline">
                          {product.name}
                        </Link>
                        <p className="text-sm text-terra">
                          {choiceName ? `${choiceName} · ` : ""}
                          {formatEuros(unit)}
                          {product.unit ? ` / ${product.unit}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold text-ardosia">{formatEuros(unit * line.quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border-2 border-ardosia/15 bg-giz">
                        <button
                          type="button"
                          onClick={() => (line.quantity > 1 ? oQuintalCart.setQuantity(line.id, line.choice, line.quantity - 1) : oQuintalCart.remove(line.id, line.choice))}
                          className="grid h-10 w-10 place-items-center text-lg"
                          aria-label={`Menos um: ${product.name}`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold" aria-label={`Quantidade: ${line.quantity}`}>
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => oQuintalCart.setQuantity(line.id, line.choice, line.quantity + 1)}
                          className="grid h-10 w-10 place-items-center text-lg"
                          aria-label={`Mais um: ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => oQuintalCart.remove(line.id, line.choice)} className="min-h-10 px-2 text-sm font-semibold text-tomate-deep underline underline-offset-4">
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <fieldset className="mt-8">
            <legend className="oq-stamp text-ardosia">Como quer receber</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["delivery", oQuintal.fulfilment.delivery, `Em parte de ${oQuintal.deliveryCouncils.join(", ")}.`],
                  ["pickup", "Levantamento", oQuintal.fulfilment.pickup + "."],
                ] as const
              ).map(([value, title, hint]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-tomate ${fulfilment === value ? "border-folha bg-folha/5" : "border-ardosia/15"}`}
                >
                  <span className="flex items-center gap-2 font-semibold text-ardosia">
                    <input type="radio" name="entrega" value={value} checked={fulfilment === value} onChange={() => setFulfilment(value)} className="h-4 w-4 accent-[#2d4a2b]" />
                    {title}
                  </span>
                  <span className="text-sm text-terra">{hint}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-terra">
              O custo e o dia de entrega são confirmados pela O Quintal depois da encomenda. Antes de pagar, confirme connosco se a sua zona está abrangida.
            </p>
          </fieldset>
        </div>

        {/* Summary: a side card on large screens, a bar fixed to the bottom on phones. */}
        <aside aria-label="Resumo" className="fixed inset-x-0 bottom-0 z-40 border-t border-ardosia/10 bg-giz/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:sticky lg:top-28 lg:bottom-auto lg:self-start lg:rounded-2xl lg:border-0 lg:p-6 lg:shadow-[0_30px_60px_-40px_rgb(38_42_43/0.6)]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-terra">
              Total · {count} {count === 1 ? "artigo" : "artigos"}
            </span>
            <span className="font-display text-[1.7rem] text-ardosia">{formatEuros(subtotal)}</span>
          </div>
          <p className="mt-0.5 text-xs text-terra">Portes a confirmar pela O Quintal.</p>
          {pay === "soon" ? (
            <div className="mt-3">
              <p className="rounded-xl bg-limao/40 px-3 py-2 text-sm font-semibold text-ardosia">Pagamentos online em breve. Por agora, encomende por telefone ou email.</p>
              <div className="mt-2 flex gap-2">
                <a href={oQuintal.phoneHref} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-folha px-4 font-semibold text-giz">
                  <PhoneIcon className="h-4 w-4" /> Ligar
                </a>
                <a href={`mailto:${oQuintal.email}?subject=${encodeURIComponent("Encomenda")}`} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-ardosia/20 px-4 font-semibold text-ardosia">
                  Email
                </a>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={checkout}
              disabled={busy || pay === "checking"}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tomate px-6 font-semibold text-giz transition-opacity disabled:opacity-60"
            >
              {busy ? "A abrir o pagamento…" : "Pagar"} {busy ? null : <ArrowIcon className="h-4 w-4" />}
            </button>
          )}
          <p role="alert" className="mt-2 min-h-0 text-sm font-semibold text-tomate-deep empty:hidden">
            {error}
          </p>
          <p className="mt-2 hidden text-xs text-terra lg:block">Pagamento seguro na página da Stripe. {oQuintal.perishables}</p>
        </aside>
      </div>
    </div>
  );
}
