import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, EmptyState, adminInputClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { listClients, type AdminSearchParams } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<AdminSearchParams> }) {
  await requireAdmin();
  const { q } = await searchParams;
  const term = (typeof q === "string" ? q : "").trim().slice(0, 80);
  const clients = await listClients(term);

  return (
    <>
      <AdminPageHeader title="Clientes" description={`${clients.length} ${clients.length === 1 ? "conta" : "contas"}`} />
      <form method="get" action="/admin/clientes" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={term}
          aria-label="Pesquisar clientes"
          placeholder="Nome, email, negócio, NIF…"
          className={`${adminInputClasses} h-11 flex-1`}
        />
        <button type="submit" className={buttonClasses("primary", "md")}>
          Pesquisar
        </button>
      </form>

      {clients.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                href={`/admin/clientes/${client.id}`}
                className="grid grid-cols-1 gap-2 px-4 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[1fr_auto_9rem] sm:items-center sm:gap-4 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">
                    {client.full_name ?? client.email}
                    {client.business_name ? <span className="font-normal text-muted"> · {client.business_name}</span> : null}
                  </p>
                  <p className="truncate text-sm text-muted">{client.email}</p>
                </div>
                <span className="text-sm text-muted">
                  <strong className="font-semibold tabular-nums text-text">{client.activeProducts}</strong>{" "}
                  {client.activeProducts === 1 ? "produto ativo" : "produtos ativos"}
                  {client.panels ? (
                    <>
                      {" · "}
                      <strong className="font-semibold tabular-nums text-text">{client.panels}</strong> {client.panels === 1 ? "painel" : "painéis"}
                    </>
                  ) : null}
                </span>
                <span className="text-sm text-subtle tabular-nums sm:text-right">{lisbonTimestamp(client.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>{term ? "Nenhuma conta encontrada." : "Ainda não há contas de cliente."}</EmptyState>
      )}
    </>
  );
}
