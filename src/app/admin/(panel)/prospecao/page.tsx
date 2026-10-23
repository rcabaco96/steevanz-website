import type { Metadata } from "next";
import Link from "next/link";
import { ContactsTabs } from "@/components/admin/ContactsTabs";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { deleteProspectSearch, queueProspectSearch } from "@/lib/prospects/actions";
import { listSearches, type ProspectSearchRow } from "@/lib/prospects/store";

export const metadata: Metadata = { title: "Encontrar clientes" };

const searchStatus: Record<ProspectSearchRow["status"], { label: string; tone: string }> = {
  queued: { label: "Na fila", tone: "bg-surface-2 text-muted" },
  running: { label: "A pesquisar", tone: "bg-accent-soft text-accent-text" },
  done: { label: "Concluída", tone: "bg-success-soft text-success" },
  failed: { label: "Falhou", tone: "bg-danger-soft text-danger" },
};

/** A search queued for minutes without being picked up: the prospector is probably off. */
function waitingTooLong(searches: ProspectSearchRow[], now: number): boolean {
  return !searches.some((search) => search.status === "running") && searches.some((search) => search.status === "queued" && now - Date.parse(search.created_at) > 3 * 60_000);
}

export default async function AdminProspectingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  // «Procurar novos» in the CRM comes here with the list's zone already filled in.
  const area = String((Array.isArray(params.onde) ? params.onde[0] : params.onde) ?? "").slice(0, 80);
  const searches = await listSearches(30);
  // eslint-disable-next-line react-hooks/purity -- server component, rendered per request
  const stalled = waitingTooLong(searches, Date.now());
  const input = `${adminInputClasses} h-11`;

  return (
    <>
      <AdminPageHeader title="Contactos" description="Demonstrações marcadas no site, pedidos de informação e negócios a contactar." />
      <ContactsTabs current="prospects" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Nova pesquisa">
          <p id="nova-pesquisa" className="-mt-2 mb-4 scroll-mt-28 text-sm text-muted">
            Negócios do Google Maps para contactar: nome, telefone, email do site, nota e reviews. A pesquisa corre no computador do escritório e demora alguns minutos. Os negócios
            entram no CRM, na lista da zona («Onde»), com a situação do site já vista; os que já lá estavam não se repetem e ficam com a fase e as notas.
          </p>
          <ActionForm action={queueProspectSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={adminLabelClasses}>
              O quê
              <input name="query" required minLength={2} maxLength={80} placeholder="barbearias" autoFocus={Boolean(area)} className={input} />
            </label>
            <label className={adminLabelClasses}>
              Onde
              <input name="area" required minLength={2} maxLength={80} placeholder="Porto" defaultValue={area} className={input} />
            </label>
            <label className={adminLabelClasses}>
              Até quantos negócios
              <select name="max_results" defaultValue="60" className={input}>
                {[30, 60, 120, 300].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <SubmitButton size="md" pendingLabel="A pôr na fila…">
                Pesquisar
              </SubmitButton>
            </div>
          </ActionForm>
        </Panel>

        <Panel title="Últimas pesquisas">
          {stalled ? (
            <p className="mb-3 rounded-xl bg-gold-soft px-3 py-2 text-sm text-gold-text">
              Há pesquisas na fila há mais de 3 minutos. O programa de pesquisa parece desligado: no computador do escritório, abra o Docker e corra «npm run prospector».
            </p>
          ) : null}
          {searches.length ? (
            <ul className="-my-2 divide-y divide-line">
              {searches.map((search) => (
                <li key={search.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/crm?lista=${encodeURIComponent(search.area)}`} className="min-w-0">
                    <span className="block truncate font-semibold text-text">
                      {search.query} · {search.area}
                    </span>
                    <span className="block truncate text-xs text-subtle">
                      {lisbonTimestamp(search.created_at)}
                      {search.results !== null ? ` · ${search.results} negócios, ${search.new_results ?? 0} novos` : ""}
                      {search.error ? ` · ${search.error}` : ""}
                    </span>
                  </Link>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${searchStatus[search.status].tone}`}>{searchStatus[search.status].label}</span>
                    {search.status !== "running" ? (
                      <ActionForm
                        action={deleteProspectSearch}
                        confirmMessage={`Apagar a pesquisa «${search.query} · ${search.area}»? Os negócios que só ela encontrou e em que ainda ninguém mexeu no CRM também saem. Os que já foram trabalhados ficam.`}
                        className="contents"
                      >
                        <input type="hidden" name="search_id" value={search.id} />
                        <SubmitButton size="sm" variant="ghost" className="!px-2 !text-danger" ariaLabel={`Apagar a pesquisa ${search.query} em ${search.area}`}>
                          Apagar
                        </SubmitButton>
                      </ActionForm>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Ainda não há pesquisas. Comece por um tipo de negócio e uma cidade.</EmptyState>
          )}
        </Panel>
      </div>
      <p className="text-xs text-subtle">
        Só dados públicos de empresas (Google Maps e o site de cada negócio). Contacte pelo telefone ou email da empresa; nada de envios em massa.
      </p>
    </>
  );
}
