"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialDelivery, ferragialMailHref, ferragialPrice, ferragialWhatsappHref, ferragialWines } from "@/content/ferragial/facts";
import { Bottle } from "./Bottle";
import { useCart, type Delivery } from "./cart";
import { ChatIcon, CloseIcon, MailIcon, MinusIcon, PlusIcon } from "./icons";

// The basket, sliding in from the side (a bottom-to-top sheet on phones): the bottles, how many, pick-up at the
// winery or shipping, the total — all without VAT, «+ IVA» beside it, never a VAT amount (owner's absolute rule) — a
// name, the 18+ confirmation, and the order written for WhatsApp or email. Nothing is paid or stored here: a demo,
// and the page says so (the number and the address are fictional).
export function Basket({ copy }: { copy: FerragialCopy }) {
  const { basket } = copy;
  const cart = useCart();
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [adult, setAdult] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { open, setOpen } = cart;

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, setOpen]);

  const lines = ferragialWines.filter((w) => (cart.items[w.id] ?? 0) > 0);
  const deliveryText =
    cart.delivery === "pickup"
      ? `${basket.pickup}.`
      : `${basket.ship}: ${cart.shipping ? `${ferragialPrice(cart.shipping)} + IVA` : basket.free.toLowerCase()}.`;
  const message = basket.message
    .replace("{linhas}", lines.map((w) => `- ${cart.items[w.id]} × ${w.name} ${w.vintage} (${ferragialPrice(w.price)} + IVA)`).join("\n"))
    .replace("{entrega}", deliveryText)
    .replace("{total}", ferragialPrice(cart.total))
    .replace("{nome}", name.trim() ? basket.messageName.replace("{nome}", name.trim()) : "");
  const ready = lines.length > 0 && adult;

  const option = (value: Delivery, title: string, note: string, price: string) => (
    <label className="relative block">
      <input type="radio" name="fg-entrega" checked={cart.delivery === value} onChange={() => cart.setDelivery(value)} className="peer sr-only" />
      <span className="flex min-h-16 items-center justify-between gap-4 rounded-xl px-4 py-3 ring-1 ring-tinta/15 transition-colors peer-checked:bg-cal-2 peer-checked:ring-tinto peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-barro hover:ring-tinto/50">
        <span className="min-w-0">
          <span className="block font-semibold">{title}</span>
          <span className="block text-[0.82rem] text-pedra">{note}</span>
        </span>
        <span className="shrink-0 text-right text-sm whitespace-nowrap">{price}</span>
      </span>
    </label>
  );

  return (
    <AnimatePresence>
      {open ? (
        <div key="basket" className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby="fg-basket-title">
          <m.button
            type="button"
            aria-label={basket.close}
            tabIndex={-1}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
            className="absolute inset-0 bg-xisto/55 backdrop-blur-[2px]"
          />
          <m.div
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.65, 0, 0.2, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col bg-cal shadow-[-30px_0_80px_-40px_rgb(0_0_0/0.5)]"
          >
            <div className="flex items-center justify-between border-b border-tinta/10 px-5 py-4 sm:px-7">
              <h2 id="fg-basket-title" className="font-display text-[1.9rem] leading-none">
                {basket.title}
              </h2>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label={basket.close} className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cal-2">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              {lines.length === 0 ? (
                <p className="py-10 text-center text-pedra">{basket.empty}</p>
              ) : (
                <ul className="divide-y divide-tinta/10">
                  {lines.map((wine) => {
                    const qty = cart.items[wine.id] ?? 0;
                    return (
                      <li key={wine.id} className="flex items-center gap-4 py-4">
                        <Bottle wine={wine} className="h-20 w-auto shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="leading-snug font-semibold">
                            {wine.name} <span className="font-normal text-pedra">{wine.vintage}</span>
                          </p>
                          <p className="text-[0.85rem] text-pedra">
                            {ferragialPrice(wine.price)} + IVA · {wine.unit}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button type="button" onClick={() => cart.setQty(wine.id, qty - 1)} aria-label={`${basket.less}: ${wine.name}`} className="grid size-10 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cal-2">
                              <MinusIcon width={16} height={16} />
                            </button>
                            <span className="w-7 text-center font-semibold tabular-nums" aria-live="polite">
                              {qty}
                            </span>
                            <button type="button" onClick={() => cart.setQty(wine.id, qty + 1)} aria-label={`${basket.more}: ${wine.name}`} className="grid size-10 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cal-2">
                              <PlusIcon width={16} height={16} />
                            </button>
                            <button type="button" onClick={() => cart.setQty(wine.id, 0)} className="ml-auto min-h-10 px-2 text-[0.85rem] text-pedra underline underline-offset-4 hover:text-tinto">
                              {basket.remove}
                              <span className="sr-only">: {wine.name}</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {lines.length ? (
                <>
                  <fieldset className="mt-6">
                    <legend className="fg-label mb-3 text-barro">{basket.delivery}</legend>
                    <div className="grid gap-2">
                      {option("pickup", basket.pickup, basket.pickupNote, basket.free)}
                      {option(
                        "ship",
                        basket.ship,
                        basket.shipNote,
                        cart.bottles >= ferragialDelivery.freeFromBottles ? basket.free : `${ferragialPrice(ferragialDelivery.shipping)} + IVA`,
                      )}
                    </div>
                  </fieldset>

                  <dl className="mt-6 grid gap-2 border-t border-tinta/10 pt-5 text-[0.95rem]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-pedra">
                        {basket.subtotal} ({cart.bottles === 1 ? basket.item : basket.items.replace("{n}", String(cart.bottles))})
                      </dt>
                      <dd className="tabular-nums">{ferragialPrice(cart.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-pedra">{basket.delivery}</dt>
                      <dd className="tabular-nums">{cart.shipping ? ferragialPrice(cart.shipping) : basket.free}</dd>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between gap-4">
                      <dt className="font-semibold">{basket.total}</dt>
                      <dd>
                        <span className="font-display text-[1.8rem] tabular-nums">{ferragialPrice(cart.total)}</span>
                        <span className="ml-2 text-[0.72rem] font-semibold tracking-[0.12em] text-pedra uppercase">{basket.plusVat}</span>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-1 text-xs text-pedra">{basket.vatNote}</p>

                  <label className="mt-6 block">
                    <span className="fg-label text-barro">{basket.name}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      maxLength={60}
                      className="mt-2 block h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-tinta/15 outline-none focus:ring-2 focus:ring-barro"
                    />
                  </label>
                  <label className="mt-4 flex min-h-11 items-start gap-3">
                    <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--color-tinto)]" />
                    <span className="text-[0.95rem]">{basket.adult}</span>
                  </label>
                  <p className="mt-5 text-[0.75rem] leading-relaxed text-pedra">{basket.demoNote}</p>
                </>
              ) : null}
            </div>

            {lines.length ? (
              <div className="border-t border-tinta/10 px-5 py-3 sm:px-7">
                {!adult ? <p className="mb-2 text-[0.8rem] leading-snug text-tinto">{basket.adultNeeded}</p> : null}
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <a
                    href={ready ? ferragialWhatsappHref(message) : undefined}
                    aria-disabled={!ready}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => !ready && e.preventDefault()}
                    className={`inline-flex h-13 items-center justify-center gap-2 rounded-full px-4 text-[0.76rem] font-semibold tracking-[0.1em] uppercase transition-colors ${
                      ready ? "bg-tinto text-cal hover:bg-mosto" : "cursor-not-allowed bg-tinta/15 text-tinta/50"
                    }`}
                  >
                    <ChatIcon width={18} height={18} />
                    {basket.whatsapp}
                    <span className="sr-only"> {copy.newTab}</span>
                  </a>
                  <a
                    href={ready ? ferragialMailHref(basket.subject, message) : undefined}
                    aria-disabled={!ready}
                    onClick={(e) => !ready && e.preventDefault()}
                    className={`inline-flex h-13 items-center justify-center gap-2 rounded-full px-4 text-[0.76rem] font-semibold tracking-[0.1em] uppercase ring-1 transition-colors ${
                      ready ? "ring-tinta/30 hover:bg-cal-2" : "cursor-not-allowed text-tinta/40 ring-tinta/10"
                    }`}
                  >
                    <MailIcon width={18} height={18} />
                    <span className="max-[479px]:sr-only">{basket.email}</span>
                  </a>
                </div>
                <p className="mt-2 text-center text-[0.72rem] font-semibold text-tinta">{copy.responsible}</p>
              </div>
            ) : null}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
