import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/backoffice/ui";
import { requestOrigin } from "@/lib/booking/request";
import type { ModuleProduct } from "@/lib/establishments/access";
import { ownerCounterSpaces } from "@/lib/establishments/counter";
import { loadBundle } from "@/lib/establishments/store";
import { ensureBookingPage, todayAgenda } from "@/lib/modules/bookings/store";
import { availableRewards, ensureProgram, getCard, recentCards, searchCards } from "@/lib/modules/loyalty/store";
import { currentSettings, loadQueue } from "@/lib/modules/waitlist/store";
import { AutoRefresh } from "../shared/AutoRefresh";
import { ModuleNav, pickEstablishment, queryValue, type ModuleQuery } from "../shared/ModuleNav";
import { JoinChime } from "../waitlist/JoinChime";
import { BookingsCounter } from "./BookingsCounter";
import { CardCounter } from "./CardCounter";
import { QueueCounter } from "./QueueCounter";

const tabs: Record<ModuleProduct, { id: string; label: string }> = {
  waitlist: { id: "fila", label: "Fila" },
  bookings: { id: "reservas", label: "Reservas de hoje" },
  loyalty: { id: "cartao", label: "Cartão" },
};

/**
 * The Balcão: what needs a tap during the day (queue, today's bookings, loyalty card) for one space,
 * as tabs in the backoffice. Settings, history and stats stay in each module. `basePath` is the
 * client area's or the admin's page; `ownerId` is the client whose spaces it shows.
 */
export async function CounterScreen({ ownerId, viewer, basePath, query }: { ownerId: string; viewer: "client" | "admin"; basePath: string; query: ModuleQuery }) {
  const spaces = await ownerCounterSpaces(ownerId);
  const establishment = pickEstablishment(
    spaces.map((space) => space.establishment),
    query,
  );
  if (!establishment) {
    return <EmptyState>Ainda não há espaços com a lista de espera, as reservas online ou o cartão de fidelização ativos.</EmptyState>;
  }
  const products = spaces.find((space) => space.establishment.id === establishment.id)!.products;
  const active = products.find((product) => tabs[product].id === queryValue(query, "vista")) ?? products[0];
  const moduleHref = (product: ModuleProduct, view?: string) =>
    `${viewer === "admin" ? `/admin/clientes/${ownerId}/${product}` : `/conta/${product}`}?${new URLSearchParams({ loja: establishment.slug, ...(view ? { vista: view } : {}) })}`;
  // Links inside a tab keep the space (when there are several) and the tab.
  const keep = { ...(spaces.length > 1 ? { loja: establishment.slug } : {}), vista: tabs[active].id };

  const bundle = await loadBundle(establishment);
  const hasQueue = products.includes("waitlist");
  const [queueData, bookingData] = await Promise.all([
    hasQueue ? currentSettings(establishment, bundle).then(async (settings) => ({ settings, queue: await loadQueue(establishment, settings) })) : null,
    products.includes("bookings") ? ensureBookingPage(establishment).then(async (page) => ({ page, today: await todayAgenda(establishment, page) })) : null,
  ]);
  const waiting = queueData?.queue.live.filter((entry) => entry.status === "waiting") ?? [];
  const newest = [...waiting].sort((a, b) => Date.parse(b.joined_at) - Date.parse(a.joined_at))[0];
  const badge: Partial<Record<ModuleProduct, number>> = {
    waitlist: waiting.length,
    bookings: bookingData?.today.bookings.filter((booking) => booking.status === "confirmed").length ?? 0,
  };

  let content: ReactNode = null;
  if (active === "waitlist" && queueData) {
    content = <QueueCounter bundle={bundle} settings={queueData.settings} queue={queueData.queue} />;
  } else if (active === "bookings" && bookingData) {
    const { today, page } = bookingData;
    content = <BookingsCounter bundle={bundle} page={page} date={today.date} bookings={today.bookings} delays={today.delays} late={today.late} next={today.next} />;
  } else if (active === "loyalty") {
    const term = queryValue(query, "q").trim().slice(0, 60);
    const [program, cards, qrCard] = await Promise.all([
      ensureProgram(establishment),
      term ? searchCards(establishment.id, term) : recentCards(establishment.id, 8),
      getCard(establishment.id, queryValue(query, "qr")),
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
        keep={keep}
        qrCard={qrCard}
        qrUrl={qrCard ? `${await requestOrigin()}/cartao/${establishment.slug}/${qrCard.token}` : null}
        settingsHref={moduleHref("loyalty", "definicoes")}
      />
    );
  }

  // Live: fast while the queue matters (also for the sound of new entries), slower for bookings only.
  const refreshMs = hasQueue ? 8000 : active === "bookings" ? 30_000 : 0;

  return (
    <div className="flex flex-col gap-6">
      {refreshMs ? <AutoRefresh intervalMs={refreshMs} /> : null}
      <ModuleNav
        basePath={basePath}
        establishments={spaces.map((space) => space.establishment)}
        current={establishment}
        views={products.map((product) => ({ ...tabs[product], badge: badge[product] }))}
        view={tabs[active].id}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={moduleHref(active)} className="text-sm font-semibold text-accent-text hover:underline">
          Definições e histórico
        </Link>
        {hasQueue ? <JoinChime latest={newest?.id ?? null} /> : null}
      </div>
      {content}
    </div>
  );
}
