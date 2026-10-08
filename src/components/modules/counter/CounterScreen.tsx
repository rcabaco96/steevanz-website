import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { brandStyle } from "@/components/public/BrandFrame";
import { ProductGlyph } from "@/components/icons";
import { BookingsCounter } from "./BookingsCounter";
import { CardCounter } from "./CardCounter";
import { Clock } from "./Clock";
import { QueueCounter } from "./QueueCounter";
import { AutoRefresh } from "../shared/AutoRefresh";
import { JoinChime } from "../waitlist/JoinChime";
import { requestOrigin } from "@/lib/booking/request";
import type { ModuleProduct } from "@/lib/establishments/access";
import { ownerCounterSpaces } from "@/lib/establishments/counter";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { readableTextOn } from "@/lib/establishments/kinds";
import { loadBundle } from "@/lib/establishments/store";
import { ensureBookingPage, todayAgenda } from "@/lib/modules/bookings/store";
import { availableRewards, ensureProgram, getCard, recentCards, searchCards } from "@/lib/modules/loyalty/store";
import { currentSettings, loadQueue } from "@/lib/modules/waitlist/store";

const tabs: Record<ModuleProduct, { id: string; label: string; icon: "queue" | "calendar" | "stamp" }> = {
  waitlist: { id: "fila", label: "Fila", icon: "queue" },
  bookings: { id: "reservas", label: "Reservas", icon: "calendar" },
  loyalty: { id: "cartao", label: "Cartão", icon: "stamp" },
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** The space's colour for the counter, also as the accent of the shared forms (new booking, add to queue…). */
function counterStyle(establishment: EstablishmentRow): CSSProperties {
  const brand = establishment.accent_color;
  const rgb = /^#[0-9a-f]{6}$/i.test(brand) ? [1, 3, 5].map((index) => parseInt(brand.slice(index, index + 2), 16)).join(" ") : null;
  return {
    ...brandStyle(establishment),
    "--accent": brand,
    "--accent-hover": `color-mix(in oklab, ${brand} 85%, black)`,
    "--accent-soft": `color-mix(in oklab, ${brand} 14%, transparent)`,
    "--accent-contrast": readableTextOn(brand),
    ...(rgb ? { "--glow": rgb } : {}),
  } as CSSProperties;
}

/**
 * The counter: one screen per space for the products used all day (queue, today's bookings,
 * loyalty card), made for the shop's phone or tablet. Settings and history stay in each module.
 */
export async function CounterScreen({
  establishment,
  products,
  viewer,
  query,
  now,
}: {
  establishment: EstablishmentRow;
  products: ModuleProduct[];
  viewer: "client" | "admin";
  query: Record<string, string | string[] | undefined>;
  now: number;
}) {

  const requested = products.find((product) => tabs[product].id === first(query.vista));
  const active = requested ?? products[0];
  const basePath = `/conta/balcao/${establishment.slug}`;
  const moduleHref = (product: ModuleProduct, view?: string) =>
    `${viewer === "admin" ? `/admin/clientes/${establishment.owner_id}/${product}` : `/conta/${product}`}?${new URLSearchParams({ loja: establishment.slug, ...(view ? { vista: view } : {}) })}`;

  const bundle = await loadBundle(establishment);
  const hasQueue = products.includes("waitlist");
  const hasBookings = products.includes("bookings");
  const [queueData, bookingData, spaces] = await Promise.all([
    hasQueue
      ? currentSettings(establishment, bundle).then(async (settings) => ({ settings, queue: await loadQueue(establishment, settings) }))
      : Promise.resolve(null),
    hasBookings ? ensureBookingPage(establishment).then(async (page) => ({ page, today: await todayAgenda(establishment, page) })) : Promise.resolve(null),
    viewer === "client" ? ownerCounterSpaces(establishment.owner_id) : Promise.resolve([]),
  ]);

  const waitingCount = queueData?.queue.live.filter((entry) => entry.status === "waiting").length ?? 0;
  const newest = queueData?.queue.live.filter((entry) => entry.status === "waiting").sort((a, b) => Date.parse(b.joined_at) - Date.parse(a.joined_at))[0];
  const toArrive = bookingData?.today.bookings.filter((booking) => booking.status === "confirmed").length ?? 0;
  const badge: Partial<Record<ModuleProduct, number>> = { waitlist: waitingCount, bookings: toArrive };

  let content: ReactNode = null;
  if (active === "waitlist" && queueData) {
    content = <QueueCounter bundle={bundle} settings={queueData.settings} queue={queueData.queue} />;
  } else if (active === "bookings" && bookingData) {
    const { today, page } = bookingData;
    content = <BookingsCounter bundle={bundle} page={page} date={today.date} bookings={today.bookings} delays={today.delays} late={today.late} next={today.next} />;
  } else if (active === "loyalty") {
    const term = first(query.q).trim().slice(0, 60);
    const [program, cards, qrCard] = await Promise.all([
      ensureProgram(establishment),
      term ? searchCards(establishment.id, term) : recentCards(establishment.id, 8),
      getCard(establishment.id, first(query.qr)),
    ]);
    const rewards = await availableRewards(cards.map((card) => card.id));
    content = (
      <CardCounter
        establishment={establishment}
        program={program}
        cards={cards}
        rewards={rewards}
        term={term}
        basePath={basePath}
        qrCard={qrCard}
        qrUrl={qrCard ? `${await requestOrigin()}/cartao/${establishment.slug}/${qrCard.token}` : null}
        settingsHref={moduleHref("loyalty", "definicoes")}
      />
    );
  }

  // Live: fast while the queue matters (and for the sound of new entries), slower for bookings only.
  const refreshMs = hasQueue ? 8000 : active === "bookings" ? 30_000 : 0;
  const tabHref = (product: ModuleProduct) => (product === products[0] ? basePath : `${basePath}?vista=${tabs[product].id}`);

  return (
    <div style={counterStyle(establishment)} className="min-h-dvh bg-bg-soft pb-28 sm:pb-12">
      {refreshMs ? <AutoRefresh intervalMs={refreshMs} /> : null}
      <header className="sticky top-0 z-30 border-b border-line bg-bg-soft/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-4">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg font-bold"
            style={{ background: establishment.accent_color, color: readableTextOn(establishment.accent_color) }}
          >
            {establishment.name.trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold leading-tight text-text">{establishment.name}</h1>
            {spaces.length > 1 ? (
              <Link href="/conta/balcao" className="text-xs font-medium text-muted hover:text-text">
                Balcão · trocar de espaço
              </Link>
            ) : (
              <p className="text-xs text-muted">Balcão</p>
            )}
          </div>
          <Clock timeZone={establishment.time_zone} initial={now} />
          <Link
            href={moduleHref(active)}
            aria-label="Definições e histórico"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <svg aria-hidden="true" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="10" cy="12" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </Link>
        </div>
        {products.length > 1 ? (
          <nav aria-label="Produtos" className="mx-auto hidden w-full max-w-3xl gap-1 px-4 pb-3 sm:flex">
            {products.map((product) => (
              <Link
                key={product}
                href={tabHref(product)}
                aria-current={product === active ? "page" : undefined}
                className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors ${
                  product === active ? "bg-surface-inverse text-inverse" : "text-muted hover:bg-surface-2 hover:text-text"
                }`}
              >
                <ProductGlyph icon={tabs[product].icon} size={17} />
                {tabs[product].label}
                {badge[product] ? (
                  <span className={`min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums ${product === active ? "bg-[var(--brand)] text-[var(--brand-text)]" : "bg-surface-2 text-text"}`}>
                    {badge[product]}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-5">
        {hasQueue ? (
          <div className="-mb-2 flex justify-end">
            <JoinChime latest={newest?.id ?? null} />
          </div>
        ) : null}
        {content}
      </main>

      {products.length > 1 ? (
        <nav
          aria-label="Produtos"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
        >
          <div className="grid" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
            {products.map((product) => (
              <Link
                key={product}
                href={tabHref(product)}
                aria-current={product === active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${product === active ? "text-text" : "text-muted"}`}
              >
                {product === active ? <span aria-hidden="true" className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-[var(--brand)]" /> : null}
                <span className="relative">
                  <ProductGlyph icon={tabs[product].icon} size={22} />
                  {badge[product] ? (
                    <span className="absolute -top-1.5 -right-3 min-w-5 rounded-full bg-[var(--brand)] px-1 text-center text-[0.68rem] leading-5 tabular-nums text-[var(--brand-text)]">
                      {badge[product]}
                    </span>
                  ) : null}
                </span>
                {tabs[product].label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
