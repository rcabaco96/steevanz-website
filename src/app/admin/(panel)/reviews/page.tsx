import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, adminInputClasses, adminLabelClasses, EmptyState, Panel } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { listClients } from "@/lib/admin/queries";
import { deleteReviewBusiness, refreshCompetitors, saveReviewBusiness, syncReviewsNow, toggleCompetitor } from "@/lib/admin/review-actions";
import { apifyToken } from "@/lib/reviews/apify";
import { competitorRadiusKm } from "@/lib/reviews/competitors";
import { formatDateTime } from "@/lib/reviews/format";
import type { BusinessRow } from "@/lib/reviews/store";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Reviews" };
export const maxDuration = 300;

interface CompetitorAdminRow {
  id: string;
  business_id: string;
  name: string;
  category: string | null;
  distance_m: number | null;
  excluded: boolean;
  pace_per_month: number | null;
}

interface ClientOption {
  id: string;
  label: string;
}

function BusinessFields({ business, clients }: { business?: BusinessRow; clients: ClientOption[] }) {
  return (
    <>
      <input type="hidden" name="id" value={business?.id ?? ""} />
      <label className={`${adminLabelClasses} sm:col-span-2`}>
        Conta do cliente
        <select name="owner_id" defaultValue={business?.owner_id ?? ""} className={`${adminInputClasses} h-11`}>
          <option value="">Sem conta (só os admins veem o painel)</option>
          {clients.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal text-subtle">Só esta conta (e os admins) consegue abrir o painel. O cliente tem de criar conta primeiro.</span>
      </label>
      <label className={adminLabelClasses}>
        Nome do negócio
        <input name="name" required maxLength={160} defaultValue={business?.name} placeholder="Café Central" className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Endereço do painel
        <span className="flex items-center gap-1">
          <span className="text-sm text-subtle">/painel/</span>
          <input name="slug" maxLength={60} defaultValue={business?.slug} placeholder="cafe-central" className={`${adminInputClasses} h-11`} />
        </span>
      </label>
      <label className={`${adminLabelClasses} sm:col-span-2`}>
        Link do negócio no Google Maps
        <input
          name="google_maps_url"
          type="url"
          required
          defaultValue={business?.google_maps_url}
          placeholder="https://maps.app.goo.gl/… ou https://www.google.com/maps/place/…"
          className={`${adminInputClasses} h-11`}
        />
        <span className="text-xs font-normal text-subtle">Usado para importar as reviews.</span>
      </label>
      <label className={`${adminLabelClasses} sm:col-span-2`}>
        Link de avaliação
        <input
          name="review_url"
          type="url"
          required
          defaultValue={business?.review_url}
          placeholder="https://g.page/r/…/review"
          className={`${adminInputClasses} h-11`}
        />
        <span className="text-xs font-normal text-subtle">Para onde as placas levam o cliente (Perfil da Empresa → Pedir avaliações).</span>
      </label>
      <label className={adminLabelClasses}>
        Placas instaladas em
        <input name="plates_installed_on" type="date" defaultValue={business?.plates_installed_on ?? ""} className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Email para alertas
        <input
          name="alert_email"
          type="email"
          defaultValue={business?.alert_email ?? ""}
          placeholder="dono@negocio.pt"
          className={`${adminInputClasses} h-11`}
        />
        <span className="text-xs font-normal text-subtle">Recebe um email quando entra uma review negativa (1 a 3 estrelas).</span>
      </label>
      <fieldset className="flex flex-col gap-2 sm:col-span-2">
        <legend className="mb-1 text-sm font-medium text-muted">Serviços Steevanz que já tem</legend>
        <span className="-mt-1 mb-1 text-xs text-subtle">O painel não sugere ao cliente o que ele já contratou.</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {products.map((product) => (
            <label key={product.id} className="flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm text-text has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/50">
              <input
                type="checkbox"
                name="active_services"
                value={product.id}
                defaultChecked={business?.active_services?.includes(product.id)}
                className="h-4.5 w-4.5 accent-accent"
              />
              {getProductCopy(product.id, "pt").shortName}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export default async function ReviewsAdminPage() {
  await requireAdmin();
  const client = createServiceClient();
  const [{ data: businesses, error }, profiles] = await Promise.all([
    client
      .from("review_businesses")
      .select("id, slug, name, google_maps_url, review_url, plates_installed_on, rating_total, reviews_total, last_synced_at, last_sync_error, alert_email, active_services, competitors_refreshed_at, category, full_synced_at, owner_id, created_at")
      .order("name"),
    listClients(""),
  ]);
  if (error) throw new Error(error.message);
  const clients: ClientOption[] = profiles.map((profile) => ({
    id: profile.id,
    label: [profile.business_name || profile.full_name, profile.email].filter(Boolean).join(" · "),
  }));
  const clientLabels = new Map(clients.map((option) => [option.id, option.label]));
  // One query per business: up to 100 competitors each would overflow a single 1000-row page.
  const competitorLists = await Promise.all(
    (businesses ?? []).map((business) =>
      client
        .from("competitors")
        .select("id, business_id, name, category, distance_m, is_self, excluded, pace_per_month")
        .eq("business_id", business.id)
        .eq("is_self", false)
        .order("distance_m"),
    ),
  );
  const failedList = competitorLists.find((list) => list.error);
  if (failedList?.error) throw new Error(failedList.error.message);
  const competitors = competitorLists.flatMap((list) => list.data ?? []);
  const hasApify = Boolean(apifyToken());

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description="Negócios com placas NFC, os links das placas e a importação das reviews do Google."
      />

      {!hasApify ? (
        <p className="rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          Falta o APIFY_TOKEN nas variáveis de ambiente: a importação de reviews não vai funcionar.
        </p>
      ) : null}

      {(businesses as BusinessRow[]).length ? (
        (businesses as BusinessRow[]).map((business) => {
          return (
            <Panel
              key={business.id}
              title={business.name}
              actions={
                <Link href={`/painel/${business.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text hover:underline">
                  Painel <ArrowUpRight size={15} />
                </Link>
              }
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3 rounded-2xl bg-surface-2/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm">
                    <p className="text-text">
                      {business.rating_total !== null ? `${String(business.rating_total).replace(".", ",")}★ · ${business.reviews_total ?? "?"} reviews no Google` : "Ainda sem reviews importadas"}
                    </p>
                    <p className="text-subtle">
                      {business.last_synced_at ? `Última sincronização: ${formatDateTime(business.last_synced_at)}` : "Nunca sincronizado"}
                      {business.full_synced_at ? ` · histórico completo lido a ${formatDateTime(business.full_synced_at)} (repete todos os meses)` : ""}
                    </p>
                    {business.last_sync_error ? <p className="mt-1 text-danger">Erro: {business.last_sync_error}</p> : null}
                    <p className="mt-1 text-subtle">
                      {business.owner_id ? `Conta: ${clientLabels.get(business.owner_id) ?? "conta removida"}` : "Sem conta de cliente: só os admins veem o painel."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <ActionForm action={syncReviewsNow} className="flex flex-col items-start gap-1 sm:items-end">
                      <input type="hidden" name="id" value={business.id} />
                      <input type="hidden" name="mode" value="refresh" />
                      <SubmitButton variant="secondary" size="sm" pendingLabel="A importar…">
                        Sincronizar agora
                      </SubmitButton>
                    </ActionForm>
                    <ActionForm
                      action={syncReviewsNow}
                      confirmMessage="Ler outra vez todo o histórico de reviews? Usa mais crédito do Apify; serve para apanhar respostas a reviews antigas."
                      className="flex flex-col items-start gap-1 sm:items-end"
                    >
                      <input type="hidden" name="id" value={business.id} />
                      <input type="hidden" name="mode" value="full" />
                      <SubmitButton variant="ghost" size="sm" pendingLabel="A reimportar… (até 5 min)">
                        Reimportar tudo
                      </SubmitButton>
                    </ActionForm>
                  </div>
                </div>


                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-text">Concorrência</h3>
                    <p className="text-sm text-subtle">
                      {business.competitors_refreshed_at
                        ? `Mesma categoria${business.category ? ` (${business.category})` : ""}, num raio de ${String(competitorRadiusKm).replace(".", ",")} km. Procurados a ${formatDateTime(business.competitors_refreshed_at)}; atualizados todas as semanas.`
                        : "Ainda não procurados. Acontece automaticamente na segunda-feira, ou agora com o botão."}
                    </p>
                  </div>
                  {(competitors as CompetitorAdminRow[]).some((row) => row.business_id === business.id) ? (
                    <details className="group">
                      <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-accent-text [&::-webkit-details-marker]:hidden">
                        Ver os {(competitors as CompetitorAdminRow[]).filter((row) => row.business_id === business.id).length} concorrentes
                        <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                      </summary>
                    <ul className="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line">
                      {(competitors as CompetitorAdminRow[])
                        .filter((row) => row.business_id === business.id)
                        .map((row) => (
                          <li key={row.id} className={`flex items-center justify-between gap-3 p-3 ${row.excluded ? "opacity-60" : ""}`}>
                            <div className="flex min-w-0 flex-col">
                              <p className={`font-medium text-text ${row.excluded ? "line-through" : ""}`}>{row.name}</p>
                              <p className="text-xs text-subtle">
                                {row.category ?? "Sem categoria"} · {row.distance_m ?? "?"} m
                                {row.pace_per_month !== null ? ` · ${String(Number(row.pace_per_month).toFixed(1)).replace(".", ",")} reviews/mês` : ""}
                              </p>
                            </div>
                            <ActionForm action={toggleCompetitor} hideMessage>
                              <input type="hidden" name="id" value={row.id} />
                              <input type="hidden" name="excluded" value={row.excluded ? "false" : "true"} />
                              <SubmitButton variant="ghost" size="sm" className={row.excluded ? "" : "text-danger"}>
                                {row.excluded ? "Incluir" : "Excluir"}
                              </SubmitButton>
                            </ActionForm>
                          </li>
                        ))}
                    </ul>
                    </details>
                  ) : null}
                  <ActionForm action={refreshCompetitors} className="flex flex-col items-start gap-1">
                    <input type="hidden" name="id" value={business.id} />
                    <SubmitButton variant="secondary" size="sm" pendingLabel="A procurar… (1–2 min)">
                      Procurar concorrentes agora
                    </SubmitButton>
                  </ActionForm>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text">Editar dados do negócio</summary>
                  <ActionForm action={saveReviewBusiness} className="mt-4 grid gap-4 sm:grid-cols-2">
                    <BusinessFields business={business} clients={clients} />
                    <div className="flex items-end">
                      <SubmitButton>Guardar</SubmitButton>
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteReviewBusiness} confirmMessage={`Remover «${business.name}», as placas, os toques e as reviews importadas?`} className="mt-4">
                    <input type="hidden" name="id" value={business.id} />
                    <SubmitButton variant="ghost" size="sm" className="text-danger">
                      Remover negócio
                    </SubmitButton>
                  </ActionForm>
                </details>
              </div>
            </Panel>
          );
        })
      ) : (
        <EmptyState>Ainda não há negócios. Adicione o primeiro abaixo.</EmptyState>
      )}

      <Panel title="Novo negócio">
        <ActionForm action={saveReviewBusiness} className="grid gap-4 sm:grid-cols-2">
          <BusinessFields clients={clients} />
          <div className="flex items-end">
            <SubmitButton>Criar negócio</SubmitButton>
          </div>
        </ActionForm>
      </Panel>
    </>
  );
}
