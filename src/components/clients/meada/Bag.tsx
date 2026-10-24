"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MeadaCopy } from "@/content/meada/copy";
import { meadaPhotos, meadaPrice, meadaWhatsappHref } from "@/content/meada/facts";
import { useCart } from "./cart";
import { BagIcon, ChatIcon, CloseIcon, MinusIcon, PlusIcon } from "./icons";

// The basket: the pieces, how many, the total of the pieces WITHOUT VAT with «+ IVA» (never an amount with VAT
// worked out: owner's absolute rule), pick-up or delivery, gift wrapping and a name. It writes the order as a WhatsApp
// message for the visitor to send; nothing is stored, nothing is paid. The demo says what a real Steevanz online shop
// does instead (payment on the site with MB WAY, Multibanco or card). Phones: a sheet from the bottom; large screens:
// a drawer on the right. After «Encomendar», a small note says the piece is in the basket.
export function Bag({ copy }: { copy: MeadaCopy }) {
  const { bag, shop } = copy;
  const cart = useCart();
  const reduced = useReducedMotion();
  const [delivery, setDelivery] = useState<"pickup" | "shipping">("pickup");
  const [gift, setGift] = useState(false);
  const [name, setName] = useState("");
  const [hiddenKey, setHiddenKey] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The note after «Encomendar»: shown for a few seconds.
  const toast = cart.lastAdded && cart.lastAdded.n !== hiddenKey ? { id: cart.lastAdded.id, key: cart.lastAdded.n } : null;
  useEffect(() => {
    if (!cart.lastAdded) return;
    const n = cart.lastAdded.n;
    const hide = window.setTimeout(() => setHiddenKey(n), 2800);
    return () => window.clearTimeout(hide);
  }, [cart.lastAdded]);

  const { open, setOpen } = cart;
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const lines = shop.list.filter((p) => cart.lines[p.id]).map((p) => ({ product: p, qty: cart.lines[p.id] }));
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const who = name.trim() ? bag.messageName.replace("{nome}", name.trim()) : "";
  const message = bag.message
    .replace("{nome}", who)
    .replace("{linhas}", lines.map((l) => `• ${l.qty} × ${l.product.name} (${meadaPrice(l.product.price)} + IVA cada)`).join("\n"))
    .replace("{total}", meadaPrice(total))
    .replace("{entrega}", delivery === "pickup" ? bag.pickup : bag.shipping)
    .replace("{oferta}", gift ? bag.giftLine : "");
  const toastProduct = toast ? shop.list.find((p) => p.id === toast.id) : null;
  const radio =
    "flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 ring-1 ring-tinta/12 transition-colors peer-checked:bg-cru peer-checked:ring-fio peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fio";

  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[55] flex justify-center px-4">
        <AnimatePresence>
          {toastProduct && !cart.open ? (
            <m.div
              key={toast?.key}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full bg-grafite py-2 pr-2 pl-5 text-sm text-algodao shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]"
            >
              <span aria-hidden="true" className="font-mono text-fio">✕</span>
              <span className="min-w-0 flex-1 truncate">{bag.added.replace("{nome}", toastProduct.name)}</span>
              <button type="button" onClick={() => cart.setOpen(true)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-fio px-4 font-mono text-[0.72rem] tracking-[0.1em] uppercase">
                <BagIcon width={15} height={15} />
                {copy.nav.bag} · {cart.count}
              </button>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cart.open ? (
          <m.div key="bag" className="fixed inset-0 z-[65]" initial={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.5 }}>
            <m.button
              type="button"
              aria-label={bag.close}
              tabIndex={-1}
              onClick={() => cart.setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
              className="absolute inset-0 bg-grafite/55 backdrop-blur-[2px]"
            />
            <m.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="md-bag-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.65, 0, 0.2, 1] }}
              className="md-drawer-scroll absolute inset-x-0 bottom-0 flex max-h-[94svh] flex-col overflow-y-auto rounded-t-[1.6rem] bg-algodao text-tinta sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[26rem] sm:rounded-none sm:rounded-l-[1.6rem]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-dashed border-fio/35 bg-algodao px-5 py-3">
                <h2 id="md-bag-title" className="font-display text-2xl">
                  {bag.title}
                </h2>
                <button ref={closeRef} type="button" onClick={() => cart.setOpen(false)} aria-label={bag.close} className="grid size-11 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cru">
                  <CloseIcon />
                </button>
              </div>

              <div className="flex-1 px-5 pt-4 pb-6">
                {lines.length === 0 ? (
                  <p className="py-10 text-center text-cinza">{bag.empty}</p>
                ) : (
                  <>
                    <ul className="divide-y divide-dashed divide-tinta/15">
                      {lines.map(({ product, qty }) => {
                        const photo = meadaPhotos[product.image];
                        return (
                          <li key={product.id} className="flex gap-3 py-3">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-cru">
                              <Image src={photo.src} alt="" width={photo.width} height={photo.height} sizes="64px" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: product.focus }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="leading-snug">{product.name}</p>
                              <p className="mt-0.5 font-mono text-[0.78rem] text-cinza tabular-nums">
                                {meadaPrice(product.price)} {shop.plusVat}
                              </p>
                              <div className="mt-2 flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(product.id, qty - 1)}
                                  aria-label={`${qty === 1 ? bag.remove : bag.less}: ${product.name}`}
                                  className="grid size-10 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cru"
                                >
                                  <MinusIcon width={16} height={16} />
                                </button>
                                <span className="w-8 text-center font-mono tabular-nums" aria-label={`${qty}`}>
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(product.id, qty + 1)}
                                  aria-label={`${bag.more}: ${product.name}`}
                                  className="grid size-10 place-items-center rounded-full ring-1 ring-tinta/15 hover:bg-cru"
                                >
                                  <PlusIcon width={16} height={16} />
                                </button>
                              </div>
                            </div>
                            <p className="shrink-0 pt-0.5 text-right font-mono tabular-nums">{meadaPrice(product.price * qty)}</p>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-2 flex items-baseline justify-between gap-4 border-t-2 border-dashed border-fio/50 pt-4">
                      <p className="font-display text-lg">{bag.subtotal}</p>
                      <p className="text-right font-mono tabular-nums">
                        <span className="text-xl font-medium">{meadaPrice(total)}</span> <span className="text-xs tracking-[0.1em] text-cinza">{shop.plusVat}</span>
                      </p>
                    </div>

                    <fieldset className="mt-6">
                      <legend className="md-label mb-3 text-fio">{bag.deliveryLabel}</legend>
                      <div className="grid gap-2">
                        {(["pickup", "shipping"] as const).map((option) => (
                          <label key={option} className="relative block">
                            <input type="radio" name="md-entrega" checked={delivery === option} onChange={() => setDelivery(option)} className="peer sr-only" />
                            <span className={radio}>
                              <span aria-hidden="true" className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full ring-2 ${delivery === option ? "ring-fio" : "ring-tinta/30"}`}>
                                {delivery === option ? <span className="size-2 rounded-full bg-fio" /> : null}
                              </span>
                              <span>
                                <span className="block leading-snug">{option === "pickup" ? bag.pickup : bag.shipping}</span>
                                <span className="mt-0.5 block text-[0.82rem] text-cinza">{option === "pickup" ? bag.pickupNote : bag.shippingNote}</span>
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3">
                      <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="size-5 accent-[var(--color-fio)]" />
                      <span>{bag.gift}</span>
                    </label>

                    <div className="mt-4">
                      <label htmlFor="md-nome" className="md-label mb-2 block text-fio">
                        {bag.nameLabel} <span className="tracking-normal normal-case text-cinza">{bag.nameOptional}</span>
                      </label>
                      <input
                        id="md-nome"
                        type="text"
                        autoComplete="given-name"
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={bag.namePlaceholder}
                        className="h-12 w-full rounded-full bg-cru px-5 text-base placeholder:text-cinza/70 focus:bg-white focus:outline-2 focus:outline-fio"
                      />
                    </div>

                    <a
                      href={meadaWhatsappHref(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-fio px-6 font-mono text-[0.82rem] tracking-[0.12em] text-algodao uppercase transition-colors hover:bg-fio-2"
                    >
                      <ChatIcon width={18} height={18} />
                      {bag.send}
                      <span className="sr-only"> {copy.newTab}</span>
                    </a>
                  </>
                )}
                <p className="mt-5 rounded-2xl bg-cru px-4 py-3 text-xs leading-relaxed text-cinza">{bag.demoNote}</p>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
