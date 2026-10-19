"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addToCart,
  cartItemCount,
  cartTotalCents,
  changeLine,
  dishCounts,
  itemsLabel,
  maxLineQuantity,
  maxNoteLength,
  orderBarLabel,
  orderingErrorMessage,
  orderPath,
  orderStatusLabel,
  orderTime,
  tableChannel,
  type CartLine,
  type OrderingError,
  type TableOrder,
  type TableState,
} from "@/lib/video-menus/ordering-rules";
import { bunnyThumbnail, type MenuDish } from "@/lib/video-menus/rules";
import { hideIfBroken, pictureGuard } from "../safe-picture";

import { orderBridge, type TableOrderingConfig } from "../AddToOrder";
import { listenToBroadcast } from "./realtime";

// Ordering at the table (owner, 2026-10-16): loaded only on a table's page (/m/<token>). Everyone at
// the table shares one cart: each change goes to the server, which answers the new state and tells
// the other phones (Realtime Broadcast) to fetch it. Taps show at once (the change is drawn before
// the server's answer, with the same rules), and the newest state from the server always wins.

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
const money = (cents: number) => euro.format(cents / 100);
/** Without Realtime (or while it reconnects), the state is fetched this often. */
const pollMs = 15_000;
const notePauseMs = 600;
const sheetMs = 260;

type Change = { id: number; kind: "add"; dish: string } | { id: number; kind: "set"; line: string; quantity?: number; note?: string };
type View = { kind: "cart" } | { kind: "confirm" } | { kind: "order"; token: string };

interface Answer {
  state?: TableState;
  placed?: { number: number; token: string };
  error?: OrderingError;
}

/** The table's cart and orders, its changes drawn at once, and its phones kept in step. */
function useTableCart({ token, channel, realtime, dishes }: TableOrderingConfig & { dishes: Record<string, MenuDish> }) {
  const [server, setServer] = useState<TableState | null>(null);
  const [changes, setChanges] = useState<Change[]>([]);
  const [problem, setProblem] = useState<string | null>(null);
  const [off, setOff] = useState<OrderingError | null>(null);
  const version = useRef(-1);
  const nextId = useRef(1);
  const fetching = useRef(false);
  const again = useRef(false);
  const joined = useRef(false);
  const endpoint = `/api/mesa/${token}`;

  const accept = useCallback((state: TableState | undefined) => {
    if (!state || state.version < version.current) return;
    version.current = state.version;
    setServer(state);
  }, []);

  // The last problem, for a few seconds.
  const problemTimer = useRef<number | undefined>(undefined);
  const say = useCallback((error: OrderingError | string) => {
    setProblem(orderingErrorMessage(error));
    window.clearTimeout(problemTimer.current);
    problemTimer.current = window.setTimeout(() => setProblem(null), 3500);
  }, []);
  useEffect(() => () => window.clearTimeout(problemTimer.current), []);

  const refresh = useCallback(async () => {
    if (fetching.current) {
      again.current = true;
      return;
    }
    fetching.current = true;
    try {
      do {
        again.current = false;
        const response = await fetch(endpoint, { cache: "no-store" });
        const answer = (await response.json().catch(() => ({}))) as Answer;
        if (response.ok) {
          setOff(null);
          accept(answer.state);
        } else if (answer.error === "ordering_off" || answer.error === "table_missing") {
          setOff(answer.error);
        }
      } while (again.current);
    } catch {
      // Offline for a moment: the next signal or poll tries again.
    } finally {
      fetching.current = false;
    }
  }, [endpoint, accept]);

  const send = useCallback(
    async (body: Record<string, unknown>, change?: Change): Promise<Answer | null> => {
      if (change) setChanges((list) => [...list, change]);
      try {
        const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
        const answer = (await response.json().catch(() => ({}))) as Answer;
        accept(answer.state);
        if (!response.ok) {
          if (answer.error === "ordering_off" || answer.error === "table_missing") setOff(answer.error);
          say(answer.error ?? "bad_request");
          return null;
        }
        return answer;
      } catch {
        say("network");
        return null;
      } finally {
        if (change) setChanges((list) => list.filter((candidate) => candidate.id !== change.id));
      }
    },
    [endpoint, accept, say],
  );

  // The first state, the signals of the other phones, a fetch when back on the page and, without
  // Realtime, every little while.
  useEffect(() => {
    const first = window.setTimeout(() => void refresh(), 0);
    const stop = realtime
      ? listenToBroadcast({
          url: realtime.url,
          apiKey: realtime.key,
          topic: tableChannel(channel),
          onEvent: (event, payload) => {
            if (event !== "changed") return;
            const next = (payload as { v?: number | null } | null)?.v;
            if (typeof next === "number" && next <= version.current) return;
            void refresh();
          },
          onStatus: (now) => {
            // (Re)joined: whatever was missed meanwhile.
            if (now && !joined.current) void refresh();
            joined.current = now;
          },
        })
      : () => {};
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible" && !joined.current) void refresh();
    }, pollMs);
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(first);
      stop();
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh, realtime, channel]);

  // What the phone shows: the server's cart with this phone's changes still on their way.
  const lines = useMemo(() => {
    let current = server?.lines ?? [];
    for (const change of changes) {
      if (change.kind === "add") {
        const dish = dishes[change.dish];
        const result = addToCart(current, { id: change.dish, name: dish?.name ?? "", priceCents: Math.round((dish?.price ?? 0) * 100) }, `pending-${change.id}`);
        if ("lines" in result) current = result.lines;
      } else {
        const result = changeLine(current, change.line, { quantity: change.quantity, note: change.note });
        if ("lines" in result) current = result.lines;
      }
    }
    return current;
  }, [server, changes, dishes]);

  const linesRef = useRef(lines);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const add = useCallback(
    (dishId: string) => {
      const dish = dishes[dishId];
      if (!dish) return;
      const check = addToCart(linesRef.current, { id: dishId, name: dish.name, priceCents: Math.round(dish.price * 100) }, "check");
      if ("error" in check) {
        say(check.error);
        return;
      }
      const id = nextId.current++;
      void send({ op: "add", dish: dishId }, { id, kind: "add", dish: dishId });
    },
    [dishes, send, say],
  );

  const change = useCallback(
    (line: string, update: { quantity?: number; note?: string }) => {
      if (line.startsWith("pending-")) return;
      const check = changeLine(linesRef.current, line, update);
      if ("error" in check) {
        say(check.error);
        return;
      }
      const id = nextId.current++;
      void send({ op: "set", line, ...update }, { id, kind: "set", line, ...update });
    },
    [send, say],
  );

  const placeOrder = useCallback(async () => {
    const answer = await send({ op: "order" });
    return answer?.placed ?? null;
  }, [send]);

  return { ready: server !== null, lines, orders: server?.orders ?? [], add, change, placeOrder, problem, off, busy: changes.length > 0 };
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function StatusChip({ order }: { order: TableOrder }) {
  const confirmed = order.status === "confirmed";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${confirmed ? "bg-success-soft text-success" : "bg-gold-soft text-gold-text"}`}
    >
      {confirmed ? "Confirmado ✓" : "À espera"}
    </span>
  );
}

/** The order's QR code (drawn here: the library comes only when it's needed). */
function OrderQr({ token }: { token: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void import("qrcode").then(async (QRCode) => {
      const url = `${window.location.origin}${orderPath(token)}`;
      const drawn = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#1d1220", light: "#ffffff" } });
      if (live) setSvg(drawn);
    });
    return () => {
      live = false;
    };
  }, [token]);
  return (
    <div className="mx-auto aspect-square w-[min(68vw,16rem)] rounded-2xl bg-white p-3 shadow-sm ring-1 ring-line">
      {svg ? (
        <div role="img" aria-label="Código QR do pedido" className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-full w-full animate-pulse rounded-xl bg-surface-2" />
      )}
    </div>
  );
}

/** A line of the cart: − quantity +, remove, and its note (the field always shown; owner, 2026-10-16). */
function LineRow({ line, dish, onChange }: { line: CartLine; dish: MenuDish | undefined; onChange: (line: string, update: { quantity?: number; note?: string }) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const pending = line.id.startsWith("pending-");
  const picture = dish ? bunnyThumbnail(dish.bunny, dish.bunnyThumbnail) : null;
  const note = draft ?? line.note;
  const saveNote = (value: string) => {
    window.clearTimeout(timer.current);
    if (value.trim() !== line.note) onChange(line.id, { note: value });
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-start gap-3">
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element -- the dish's video picture (Bunny)
          <img ref={hideIfBroken} src={picture} alt="" width={44} height={60} {...pictureGuard} className="h-15 w-11 shrink-0 rounded-lg bg-surface-2 object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug font-semibold text-text">{line.name || dish?.name}</p>
          <p className="text-xs text-muted">{money(line.priceCents)} cada</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-text tabular-nums">{money(line.priceCents * line.quantity)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-full border border-line">
          <button
            type="button"
            disabled={pending}
            onClick={() => onChange(line.id, { quantity: line.quantity - 1 })}
            aria-label={line.quantity > 1 ? `Menos um: ${line.name}` : `Tirar do pedido: ${line.name}`}
            className="grid h-10 w-10 place-items-center rounded-full text-lg font-semibold text-text disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-7 text-center text-sm font-bold text-text tabular-nums" aria-live="polite">
            {line.quantity}
          </span>
          <button
            type="button"
            disabled={pending || line.quantity >= maxLineQuantity}
            onClick={() => onChange(line.id, { quantity: line.quantity + 1 })}
            aria-label={`Mais um: ${line.name}`}
            className="grid h-10 w-10 place-items-center rounded-full text-lg font-semibold text-text disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => onChange(line.id, { quantity: 0 })}
          className="ml-auto h-10 rounded-full px-3 text-sm font-semibold text-muted hover:text-danger disabled:opacity-40"
        >
          Remover
        </button>
      </div>
      <label className="flex flex-col gap-1">
        <span className="sr-only">Nota para {line.name}</span>
        <input
            value={note}
            disabled={pending}
            maxLength={maxNoteLength}
            placeholder="Nota (ex.: sem cebola)"
            enterKeyHint="done"
            onFocus={() => setDraft(line.note)}
            onChange={(event) => {
              const value = event.target.value;
              setDraft(value);
              window.clearTimeout(timer.current);
              timer.current = window.setTimeout(() => saveNote(value), notePauseMs);
            }}
            onBlur={(event) => {
              saveNote(event.target.value);
              setDraft(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") (event.target as HTMLInputElement).blur();
            }}
            className="h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-text outline-none focus:border-[var(--menu-accent)] disabled:opacity-60"
          />
        {/* The count only while typing. */}
        {draft !== null ? (
          <span className="text-right text-[11px] text-subtle tabular-nums">
            {note.length}/{maxNoteLength}
          </span>
        ) : null}
      </label>
    </li>
  );
}

/**
 * The order bar (fixed at the bottom once there's something in the cart, or an order placed) and the
 * order view it opens: the lines, the total, «Fazer pedido», the QR code of an order and «Já pedido».
 */
export default function TableOrdering(props: TableOrderingConfig & { dishes: Record<string, MenuDish> }) {
  const { tableName, dishes } = props;
  const cart = useTableCart(props);
  const [view, setView] = useState<View | null>(null);
  const [closing, setClosing] = useState(false);
  const [placing, setPlacing] = useState(false);
  const sheetEntry = useRef(false);
  const count = cartItemCount(cart.lines);
  const total = cartTotalCents(cart.lines);

  // The «Adicionar» buttons: their counts, and their taps.
  useEffect(() => orderBridge.register(cart.add), [cart.add]);
  useEffect(() => orderBridge.setCounts(dishCounts(cart.lines)), [cart.lines]);
  useEffect(() => () => orderBridge.setCounts({}), []);

  const open = (next: View) => {
    setView(next);
    if (!sheetEntry.current) {
      window.history.pushState({ orderSheet: true }, "");
      sheetEntry.current = true;
    }
  };
  const hide = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setView(null);
      setClosing(false);
    }, sheetMs);
  }, []);
  const close = useCallback(() => {
    if (sheetEntry.current) window.history.back();
    else hide();
  }, [hide]);
  useEffect(() => {
    const onPop = () => {
      if (!sheetEntry.current) return;
      sheetEntry.current = false;
      hide();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hide]);
  // The page behind stays still; Esc closes.
  useEffect(() => {
    if (!view) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [view, close]);

  const shownProblem = cart.problem;

  const submit = async () => {
    setPlacing(true);
    const placed = await cart.placeOrder();
    setPlacing(false);
    if (placed) setView({ kind: "order", token: placed.token });
    else setView({ kind: "cart" });
  };

  if (cart.off) return null;

  const orders = cart.orders;
  const shownOrder = view?.kind === "order" ? orders.find((order) => order.token === view.token) : undefined;
  const latest = orders[0];

  return (
    <>
      {shownProblem && !view ? (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4">
          <p className="menu-order-toast max-w-sm rounded-2xl bg-text px-4 py-2.5 text-center text-sm font-medium text-bg shadow-lg">{shownProblem}</p>
        </div>
      ) : null}

      {count > 0 || latest ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md">
            {count > 0 ? (
              <button
                type="button"
                onClick={() => open({ kind: "cart" })}
                className="menu-order-bar pointer-events-auto flex h-14 w-full items-center gap-3 rounded-full px-5 text-left font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] active:scale-[0.98]"
                style={{ background: "var(--menu-accent)" }}
              >
                <BagIcon />
                <span key={count} className="menu-add-pop min-w-0 flex-1 truncate">
                  {orderBarLabel(count, total)}
                </span>
                <span aria-hidden="true" className="text-sm opacity-90">
                  Ver
                </span>
              </button>
            ) : latest ? (
              <button
                type="button"
                onClick={() => open({ kind: "order", token: latest.token })}
                className="menu-order-bar pointer-events-auto flex h-14 w-full items-center gap-3 rounded-full border border-line bg-bg px-5 text-left font-semibold text-text shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
              >
                <span className="min-w-0 flex-1 truncate">Pedido #{latest.number}</span>
                <StatusChip order={latest} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {view ? (
        <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label={`Pedido da ${tableName}`}>
          <button
            type="button"
            aria-label="Fechar o pedido"
            onClick={close}
            className="menu-sheet-backdrop absolute inset-0 bg-black/45"
            style={{ opacity: closing ? 0 : 1, transition: `opacity ${sheetMs}ms ease` }}
          />
          <div
            className="menu-order-sheet absolute inset-x-0 bottom-0 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-bg shadow-2xl"
            style={{ transform: closing ? "translateY(100%)" : undefined, transition: `transform ${sheetMs}ms cubic-bezier(0.32, 0.72, 0, 1)` }}
          >
            <div className="flex items-center gap-3 px-5 pt-4 pb-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--menu-accent)" }}>
                  {tableName}
                </p>
                <h2 className="display text-xl text-text">{view.kind === "order" ? "O seu pedido" : "Pedido da mesa"}</h2>
              </div>
              <button type="button" onClick={close} aria-label="Fechar" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-text">
                <CloseIcon />
              </button>
            </div>

            {view.kind === "order" ? (
              <div className="flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {shownOrder ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <p className="display text-4xl text-text">Pedido #{shownOrder.number}</p>
                    {shownOrder.status === "confirmed" ? (
                      <p className="menu-add-pop w-full rounded-2xl bg-success-soft px-4 py-3 text-base font-semibold text-success">{orderStatusLabel("confirmed")}</p>
                    ) : (
                      <p className="text-base font-semibold text-text">Mostre este código ao funcionário</p>
                    )}
                    <OrderQr token={shownOrder.token} />
                    <p className="text-xs text-muted">
                      {orderTime(shownOrder.createdAt)} · {itemsLabel(cartItemCount(shownOrder.lines))} · {money(shownOrder.totalCents)}
                    </p>
                    <ul className="w-full divide-y divide-line rounded-2xl border border-line text-left">
                      {shownOrder.lines.map((line, index) => (
                        <li key={index} className="flex gap-3 px-4 py-2.5 text-sm">
                          <span className="font-bold text-text tabular-nums">{line.quantity}×</span>
                          <span className="min-w-0 flex-1">
                            <span className="text-text">{line.name}</span>
                            {line.note ? <span className="block text-xs break-words text-muted">Nota: {line.note}</span> : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => setView({ kind: "cart" })} className="h-12 w-full rounded-full border border-line font-semibold text-text">
                      {count ? `Voltar ao pedido (${itemsLabel(count)})` : "Pedir mais"}
                    </button>
                  </div>
                ) : (
                  <div className="h-80 animate-pulse rounded-2xl bg-surface-2" />
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  <p className="-mt-1 mb-1 text-xs text-muted">Todos nesta mesa veem e alteram este pedido.</p>
                  {!cart.ready ? (
                    <div className="my-3 flex flex-col gap-3">
                      <div className="h-16 animate-pulse rounded-2xl bg-surface-2" />
                      <div className="h-16 animate-pulse rounded-2xl bg-surface-2" />
                    </div>
                  ) : cart.lines.length ? (
                    <ul className="divide-y divide-line">
                      {cart.lines.map((line) => (
                        <LineRow key={line.id} line={line} dish={dishes[line.dish]} onChange={cart.change} />
                      ))}
                    </ul>
                  ) : (
                    <p className="my-6 rounded-2xl bg-surface-2/60 px-4 py-5 text-center text-sm text-muted">Ainda não há pratos no pedido. Toque em «Adicionar» nos pratos do menu.</p>
                  )}

                  {orders.length ? (
                    <section className="mt-4 mb-4 border-t border-line pt-4">
                      <h3 className="mb-2 text-sm font-semibold text-text">Já pedido</h3>
                      <ul className="flex flex-col gap-2">
                        {orders.map((order) => (
                          <li key={order.id}>
                            <button
                              type="button"
                              onClick={() => setView({ kind: "order", token: order.token })}
                              className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-line px-4 py-2.5 text-left"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-text">Pedido #{order.number}</span>
                                <span className="block text-xs text-muted">
                                  {orderTime(order.createdAt)} · {itemsLabel(cartItemCount(order.lines))} · {money(order.totalCents)}
                                </span>
                              </span>
                              <StatusChip order={order} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>

                <div className="border-t border-line px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  {shownProblem ? (
                    <p role="status" className="mb-2 rounded-xl bg-danger/10 px-3 py-2 text-center text-sm text-danger">
                      {shownProblem}
                    </p>
                  ) : null}
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-sm text-muted">Total · {itemsLabel(count)}</span>
                    <span className="text-xl font-bold text-text tabular-nums">{money(total)}</span>
                  </div>
                  {view.kind === "confirm" ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-center text-sm text-text">
                        Enviar o pedido de {itemsLabel(count)} ({money(total)})?
                      </p>
                      <div className="flex gap-2">
                        <button type="button" disabled={placing} onClick={() => setView({ kind: "cart" })} className="h-13 flex-1 rounded-full border border-line font-semibold text-text disabled:opacity-50">
                          Voltar
                        </button>
                        <button
                          type="button"
                          disabled={placing || !count || cart.busy}
                          onClick={submit}
                          className="h-13 flex-[1.4] rounded-full font-semibold text-white disabled:opacity-60"
                          style={{ background: "var(--menu-accent)" }}
                        >
                          {placing ? "A enviar…" : "Confirmar pedido"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!count || cart.busy}
                      onClick={() => setView({ kind: "confirm" })}
                      className="h-13 w-full rounded-full text-base font-semibold text-white disabled:opacity-50"
                      style={{ background: "var(--menu-accent)" }}
                    >
                      Fazer pedido
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
