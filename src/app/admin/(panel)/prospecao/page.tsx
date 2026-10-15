import type { Metadata } from "next";
import Link from "next/link";
import { ContactsTabs } from "@/components/admin/ContactsTabs";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/admin/auth";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { deleteProspectSearch, queueProspectSearch, updateProspect } from "@/lib/prospects/actions";
import { opportunityLabels, prospectStatusLabels, prospectStatuses, reasons, siteKind, type Opportunity } from "@/lib/prospects/rules";
import { customerPlaceIds, listProspects, listSearches, parseProspectFilters, ratingFilterLabels, reviewFilterLabels, sortLabels, type ProspectRow, type ProspectSearchRow } from "@/lib/prospects/store";

export const metadata: Metadata = { title: "Encontrar clientes" };

const searchStatus: Record<ProspectSearchRow["status"], { label: string; tone: string }> = {
  queued: { label: "Na fila", tone: "bg-surface-2 text-muted" },
  running: { label: "A pesquisar", tone: "bg-accent-soft text-accent-text" },
  done: { label: "Concluída", tone: "bg-success-soft text-success" },
  failed: { label: "Falhou", tone: "bg-danger-soft text-danger" },
};

const opportunityTone: Record<Opportunity | "none", string> = {
  none: "bg-surface-2 text-muted",
  site: "bg-accent-soft text-accent-text",
  modules: "bg-success-soft text-success",
};

/** A search queued for minutes without being picked up: the prospector is probably off. */
function waitingTooLong(searches: ProspectSearchRow[], now: number): boolean {
  return !searches.some((search) => search.status === "running") && searches.some((search) => search.status === "queued" && now - Date.parse(search.created_at) > 3 * 60_000);
}

function ProspectItem({ prospect, customer }: { prospect: ProspectRow; customer: boolean }) {
  const why = reasons(prospect);
  const products = why.filter((reason) => !reason.note);
  const notes = why.filter((reason) => reason.note);
  const input = `${adminInputClasses} h-10 text-sm`;
  return (
    <li className="flex flex-col gap-3 py-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-text">{prospect.name}</span>
          {customer ? <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">Já é cliente</span> : null}
        </p>
        <p className="text-sm text-muted">
          {[
            prospect.category,
            prospect.reviews ? (prospect.rating ? `${prospect.rating.toFixed(1).replace(".", ",")} ★` : null) : "sem reviews",
            prospect.reviews ? `${prospect.reviews} ${prospect.reviews === 1 ? "review" : "reviews"}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {prospect.address ? <p className="truncate text-sm text-subtle">{prospect.address}</p> : null}
        {products.length ? (
          <ul aria-label="O que lhe podemos vender" className="mt-2 flex flex-wrap items-center gap-1.5">
            <li className="text-xs font-medium text-muted">Podemos vender:</li>
            {products.map((reason) => (
              <li key={reason.text} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${opportunityTone[reason.opportunity ?? "none"]}`}>
                {reason.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-subtle">Nada óbvio a vender: tem boa nota e muitas reviews.</p>
        )}
        {notes.length ? <p className="mt-1 text-xs text-subtle">{notes.map((reason) => reason.text).join(" · ")}</p> : null}
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {prospect.phone ? (
            <a href={`tel:${prospect.phone.replace(/\s+/g, "")}`} className="font-medium text-accent-text">
              {prospect.phone}
            </a>
          ) : null}
          {prospect.email ? (
            <a href={`mailto:${prospect.email}`} className="font-medium text-accent-text">
              {prospect.email}
            </a>
          ) : null}
          {prospect.website ? (
            <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">
              {{ own: "Site", social: "Página (rede social ou diretório)", booking: "Página de reservas", none: "Site" }[siteKind(prospect.website)]}
            </a>
          ) : null}
          {prospect.maps_url ? (
            <a href={prospect.maps_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">
              Google Maps
            </a>
          ) : null}
        </p>
      </div>
      <ActionForm action={updateProspect} hideMessage resetKey={prospect.updated_at} className="flex shrink-0 flex-wrap items-center gap-2 lg:w-[22rem]">
        <input type="hidden" name="place_id" value={prospect.place_id} />
        <select name="status" defaultValue={prospect.status} aria-label={`Estado de ${prospect.name}`} className={`${input} w-36`}>
          {prospectStatuses.map((status) => (
            <option key={status} value={status}>
              {prospectStatusLabels[status]}
            </option>
          ))}
        </select>
        <input name="notes" defaultValue={prospect.notes ?? ""} maxLength={2000} aria-label={`Notas sobre ${prospect.name}`} placeholder="Notas" className={`${input} min-w-0 flex-1`} />
        <SubmitButton size="sm" variant="secondary">
          Guardar
        </SubmitButton>
      </ActionForm>
    </li>
  );
}

export default async function AdminProspectingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const asked = parseProspectFilters(await searchParams);
  const searches = await listSearches();
  // Each search on its own: without a choice, the latest one (or every business with «Todas»).
  const filters = { ...asked, search: asked.search || searches.find((search) => search.status === "done")?.id || "all" };
  const current = searches.find((search) => search.id === filters.search);
  const [prospects, customers] = await Promise.all([listProspects(filters), customerPlaceIds()]);
  // eslint-disable-next-line react-hooks/purity -- server component, rendered per request
  const stalled = waitingTooLong(searches, Date.now());
  const input = `${adminInputClasses} h-11`;
  const exportQuery = new URLSearchParams(
    Object.entries({ pesquisa: filters.search === "all" ? "todas" : filters.search, estado: filters.status, oportunidade: filters.opportunity, contacto: filters.contact, reviews: filters.reviews, nota: filters.rating, ordem: filters.sort === "best" ? "" : filters.sort, q: filters.q }).filter(([, value]) => value),
  ).toString();

  return (
    <>
      <AdminPageHeader
        title="Contactos"
        description="Demonstrações marcadas no site, pedidos de informação e negócios a contactar."
        actions={
          <a href={`/admin/export/prospects${exportQuery ? `?${exportQuery}` : ""}`} className={buttonClasses("secondary", "sm")}>
            Exportar CSV
          </a>
        }
      />
      <ContactsTabs current="prospects" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Nova pesquisa">
          <p className="-mt-2 mb-4 text-sm text-muted">
            Negócios do Google Maps para contactar: nome, telefone, email do site, nota e reviews. A pesquisa corre no computador do escritório e demora alguns minutos.
          </p>
          <ActionForm action={queueProspectSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={adminLabelClasses}>
              O quê
              <input name="query" required minLength={2} maxLength={80} placeholder="barbearias" className={input} />
            </label>
            <label className={adminLabelClasses}>
              Onde
              <input name="area" required minLength={2} maxLength={80} placeholder="Porto" className={input} />
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
                  <Link href={`/admin/prospecao?pesquisa=${search.id}`} className="min-w-0">
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
                        confirmMessage={`Apagar a pesquisa «${search.query} · ${search.area}»? Os negócios que só ela encontrou e ainda estão como «Novo», sem notas, também saem. Os que já foram trabalhados ficam.`}
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

      <Panel title={`${current ? `${current.query} · ${current.area}` : "Todas as pesquisas"} · ${prospects.length} ${prospects.length === 1 ? "negócio" : "negócios"}`}>
        <form method="get" action="/admin/prospecao" className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select name="pesquisa" defaultValue={filters.search === "all" ? "todas" : filters.search} aria-label="Pesquisa" className={input}>
            {searches
              .filter((search) => search.status === "done")
              .map((search) => (
                <option key={search.id} value={search.id}>
                  {search.query} · {search.area} ({search.results ?? 0})
                </option>
              ))}
            <option value="todas">Todas as pesquisas</option>
          </select>
          <input type="search" name="q" defaultValue={filters.q} placeholder="Nome ou morada" aria-label="Pesquisar negócios por nome, morada ou categoria" className={input} />
          <select name="oportunidade" defaultValue={filters.opportunity} aria-label="Oportunidade" className={input}>
            <option value="">Oportunidade: todas</option>
            {(Object.keys(opportunityLabels) as Opportunity[]).map((key) => (
              <option key={key} value={key}>
                {opportunityLabels[key]}
              </option>
            ))}
          </select>
          <select name="estado" defaultValue={filters.status} aria-label="Estado" className={input}>
            <option value="">Estado: todos</option>
            {prospectStatuses.map((status) => (
              <option key={status} value={status}>
                {prospectStatusLabels[status]}
              </option>
            ))}
          </select>
          <select name="contacto" defaultValue={filters.contact} aria-label="Contacto" className={input}>
            <option value="">Contacto: todos</option>
            <option value="phone">Contacto: com telefone</option>
            <option value="email">Contacto: com email</option>
          </select>
          <select name="reviews" defaultValue={filters.reviews} aria-label="Número de reviews" className={input}>
            <option value="">Reviews: todas</option>
            {Object.entries(reviewFilterLabels).map(([value, label]) => (
              <option key={value} value={value}>
                Reviews: {label}
              </option>
            ))}
          </select>
          <select name="nota" defaultValue={filters.rating} aria-label="Nota no Google" className={input}>
            <option value="">Nota: todas</option>
            {Object.entries(ratingFilterLabels).map(([value, label]) => (
              <option key={value} value={value}>
                Nota: {label}
              </option>
            ))}
          </select>
          <select name="ordem" defaultValue={filters.sort} aria-label="Ordenar" className={input}>
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                Ordenar: {label}
              </option>
            ))}
          </select>
          <button type="submit" className={buttonClasses("primary", "md")}>
            Filtrar
          </button>
        </form>
        {prospects.length ? (
          <ul className="-my-4 divide-y divide-line">
            {prospects.map((prospect) => (
              <ProspectItem key={prospect.place_id} prospect={prospect} customer={customers.has(prospect.place_id)} />
            ))}
          </ul>
        ) : (
          <EmptyState>Sem negócios para estes filtros.</EmptyState>
        )}
        <p className="mt-4 text-xs text-subtle">
          Só dados públicos de empresas (Google Maps e o site de cada negócio). Contacte pelo telefone ou email da empresa; nada de envios em massa.
        </p>
      </Panel>
    </>
  );
}
