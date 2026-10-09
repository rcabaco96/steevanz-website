import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AdminPageHeader, EmptyState, Panel, StatusBadge } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { attentionStats, dashboardStats, type DashboardStats } from "@/lib/admin/queries";
import { formatSlotRange } from "@/lib/booking/format";
import { productLabel } from "@/lib/booking/labels";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Início" };

function ProductBars({ rows }: { rows: DashboardStats["byProduct"] }) {
  if (!rows.length) return <EmptyState>Ainda sem dados.</EmptyState>;
  const max = Math.max(...rows.map((row) => row.bookings + row.leads), 1);
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const total = row.bookings + row.leads;
        return (
          <li key={row.productId ?? "none"} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-text">{productLabel(row.productId)}</span>
              <span className="shrink-0 tabular-nums text-muted">
                <strong className="text-text">{total}</strong> · {row.bookings} marc. · {row.leads} ped.
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max((total / max) * 100, 2)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** One thing to do today: what it is, how many, and where to do it. */
function TodoRow({ count, label, detail, href, tone = "normal" }: { count: number; label: string; detail?: string; href: string; tone?: "normal" | "danger" }) {
  return (
    <li>
      <Link href={href} className="-mx-2 flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-surface-2">
        <span
          className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-xl px-2 text-lg font-semibold tabular-nums ${tone === "danger" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent-text"}`}
        >
          {count}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-text">{label}</span>
          {detail ? <span className="block text-sm text-muted">{detail}</span> : null}
        </span>
        <ArrowRight size={16} className="shrink-0 text-muted" />
      </Link>
    </li>
  );
}

function Figure({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="card card-interactive flex flex-col gap-0.5 p-4">
      <span className="display text-3xl tabular-nums">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, attention] = await Promise.all([dashboardStats(), attentionStats()]);
  const todos = [
    attention.pendingOrders
      ? { count: attention.pendingOrders, label: attention.pendingOrders === 1 ? "Encomenda por aceitar" : "Encomendas por aceitar", detail: "Aceitar ativa os produtos na conta do cliente.", href: "/admin/encomendas?status=pending" }
      : null,
    stats.bookings.byStatus.new
      ? { count: stats.bookings.byStatus.new, label: stats.bookings.byStatus.new === 1 ? "Demonstração por confirmar" : "Demonstrações por confirmar", detail: "Marcadas no site, ainda sem contacto.", href: "/admin/bookings?status=new" }
      : null,
    stats.leads.byStatus.new
      ? { count: stats.leads.byStatus.new, label: stats.leads.byStatus.new === 1 ? "Pedido de informação por responder" : "Pedidos de informação por responder", detail: "Formulários de contacto e listas de espera.", href: "/admin/leads?status=new" }
      : null,
    attention.readerOfflineHours !== null
      ? { count: attention.readerOfflineHours, label: "Horas sem sinal do leitor de reviews", detail: "Há leituras à espera. Ligue o leitor no computador do escritório.", href: "/admin/reviews", tone: "danger" as const }
      : null,
    attention.failedReads
      ? { count: attention.failedReads, label: attention.failedReads === 1 ? "Leitura de reviews falhou" : "Leituras de reviews falharam", detail: "Nas últimas 24 horas. O erro está na ficha do negócio.", href: "/admin/reviews", tone: "danger" as const }
      : null,
  ].filter((item) => item !== null);

  return (
    <>
      <AdminPageHeader title="Início" description="O que há para tratar e as próximas demonstrações." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel title="Para tratar">
          {todos.length ? (
            <ul className="-my-1 divide-y divide-line">
              {todos.map((todo) => (
                <TodoRow key={todo.href + todo.label} {...todo} />
              ))}
            </ul>
          ) : (
            <EmptyState>Nada por tratar. Encomendas, contactos e leituras de reviews estão em dia.</EmptyState>
          )}
        </Panel>

        <Panel
          title="Próximas demonstrações"
          actions={
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
              Ver todas <ArrowRight size={15} />
            </Link>
          }
        >
          {stats.upcoming.length ? (
            <ul className="-my-1 divide-y divide-line">
              {stats.upcoming.map((booking) => (
                <li key={booking.id}>
                  <Link href={`/admin/bookings/${booking.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text">{booking.name}</p>
                      <p className="truncate text-sm text-muted first-letter:uppercase">
                        {formatSlotRange(booking.slot_start, booking.slot_end, "pt", site.timeZone)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Sem demonstrações marcadas.</EmptyState>
          )}
        </Panel>
      </div>

      <section aria-label="Números" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Figure label="Clientes com produtos ativos" value={attention.activeClients} href="/admin/clientes" />
        <Figure label="Encomendas nos últimos 30 dias" value={attention.ordersLast30} href="/admin/encomendas" />
        <Figure label="Demonstrações marcadas nos últimos 30 dias" value={stats.bookings.last30} href="/admin/bookings" />
        <Figure label="Pedidos de informação nos últimos 30 dias" value={stats.leads.last30} href="/admin/leads" />
      </section>

      <Panel title="Interesse por produto">
        <p className="-mt-2 mb-4 text-sm text-muted">Demonstrações e pedidos de informação, por produto, desde sempre.</p>
        <ProductBars rows={stats.byProduct} />
      </Panel>
    </>
  );
}
