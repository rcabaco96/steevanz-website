import type { Metadata } from "next";
import Link from "next/link";
import { AdminForm, SubmitButton } from "@/components/admin/AdminForm";
import { AdminPageHeader, adminInputClasses, adminLabelClasses, EmptyState, Panel } from "@/components/admin/ui";
import { ArrowUpRight } from "@/components/icons";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { createPlate, deleteReviewBusiness, refreshCompetitors, saveReviewBusiness, syncReviewsNow, toggleCompetitor, updatePlate } from "@/lib/admin/review-actions";
import { apifyToken } from "@/lib/reviews/apify";
import { competitorRadiusKm } from "@/lib/reviews/competitors";
import { formatDateTime } from "@/lib/reviews/format";
import type { BusinessRow } from "@/lib/reviews/store";
import { siteUrl } from "@/lib/site";
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

interface PlateRow {
  code: string;
  business_id: string;
  label: string;
  active: boolean;
}

function BusinessFields({ business }: { business?: BusinessRow }) {
  return (
    <>
      <input type="hidden" name="id" value={business?.id ?? ""} />
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
        <span className="text-xs font-normal text-subtle">Recebe um email quando entra uma review de 1 ou 2 estrelas.</span>
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
  const [{ data: businesses, error }, { data: plates, error: platesError }, { data: competitors, error: competitorsError }] = await Promise.all([
    client
      .from("review_businesses")
      .select("id, slug, name, google_maps_url, review_url, plates_installed_on, rating_total, reviews_total, last_synced_at, last_sync_error, alert_email, active_services, competitors_refreshed_at, category, created_at")
      .order("name"),
    client.from("nfc_plates").select("code, business_id, label, active").order("created_at"),
    client
      .from("competitors")
      .select("id, business_id, name, category, distance_m, is_self, excluded, pace_per_month")
      .eq("is_self", false)
      .order("distance_m"),
  ]);
  if (error || platesError || competitorsError) throw new Error(error?.message ?? platesError?.message ?? competitorsError?.message);
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
          const businessPlates = (plates as PlateRow[]).filter((plate) => plate.business_id === business.id);
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
                    </p>
                    {business.last_sync_error ? <p className="mt-1 text-danger">Erro: {business.last_sync_error}</p> : null}
                  </div>
                  <AdminForm action={syncReviewsNow} className="flex flex-col items-start gap-1 sm:items-end">
                    <input type="hidden" name="id" value={business.id} />
                    <SubmitButton variant="secondary" size="sm" pendingLabel="A importar… (até 5 min)">
                      Sincronizar agora
                    </SubmitButton>
                  </AdminForm>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-text">Placas</h3>
                  {businessPlates.length ? (
                    <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line">
                      {businessPlates.map((plate) => (
                        <li key={plate.code} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 flex-col gap-1">
                            <p className="font-medium text-text">
                              {plate.label}
                              {plate.active ? null : <span className="ml-2 text-xs font-normal text-subtle">(inativa)</span>}
                            </p>
                            <p className="flex flex-col gap-0.5 text-xs text-muted">
                              <span>
                                NFC: <code className="break-all select-all text-text">{`${siteUrl}/r/${plate.code}`}</code>
                              </span>
                              <span>
                                QR: <code className="break-all select-all text-text">{`${siteUrl}/r/${plate.code}?s=qr`}</code>
                              </span>
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <AdminForm action={updatePlate} hideMessage>
                              <input type="hidden" name="code" value={plate.code} />
                              <input type="hidden" name="intent" value={plate.active ? "deactivate" : "activate"} />
                              <SubmitButton variant="ghost" size="sm">
                                {plate.active ? "Desativar" : "Ativar"}
                              </SubmitButton>
                            </AdminForm>
                            <AdminForm action={updatePlate} hideMessage confirmMessage={`Remover a placa «${plate.label}» e os toques registados?`}>
                              <input type="hidden" name="code" value={plate.code} />
                              <input type="hidden" name="intent" value="delete" />
                              <SubmitButton variant="ghost" size="sm" className="text-danger">
                                Remover
                              </SubmitButton>
                            </AdminForm>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState>Ainda sem placas. Crie uma para obter o link a gravar no chip NFC.</EmptyState>
                  )}
                  <AdminForm action={createPlate} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <input type="hidden" name="business_id" value={business.id} />
                    <label className={`${adminLabelClasses} flex-1`}>
                      Nova placa
                      <input name="label" required maxLength={80} placeholder="Ex.: Balcão, Mesa 4, Montra" className={`${adminInputClasses} h-11`} />
                    </label>
                    <SubmitButton size="md">Criar placa</SubmitButton>
                  </AdminForm>
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
                    <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line">
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
                            <AdminForm action={toggleCompetitor} hideMessage>
                              <input type="hidden" name="id" value={row.id} />
                              <input type="hidden" name="excluded" value={row.excluded ? "false" : "true"} />
                              <SubmitButton variant="ghost" size="sm" className={row.excluded ? "" : "text-danger"}>
                                {row.excluded ? "Incluir" : "Excluir"}
                              </SubmitButton>
                            </AdminForm>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                  <AdminForm action={refreshCompetitors} className="flex flex-col items-start gap-1">
                    <input type="hidden" name="id" value={business.id} />
                    <SubmitButton variant="secondary" size="sm" pendingLabel="A procurar… (1–2 min)">
                      Procurar concorrentes agora
                    </SubmitButton>
                  </AdminForm>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text">Editar dados do negócio</summary>
                  <AdminForm action={saveReviewBusiness} className="mt-4 grid gap-4 sm:grid-cols-2">
                    <BusinessFields business={business} />
                    <div className="flex items-end">
                      <SubmitButton>Guardar</SubmitButton>
                    </div>
                  </AdminForm>
                  <AdminForm action={deleteReviewBusiness} confirmMessage={`Remover «${business.name}», as placas, os toques e as reviews importadas?`} className="mt-4">
                    <input type="hidden" name="id" value={business.id} />
                    <SubmitButton variant="ghost" size="sm" className="text-danger">
                      Remover negócio
                    </SubmitButton>
                  </AdminForm>
                </details>
              </div>
            </Panel>
          );
        })
      ) : (
        <EmptyState>Ainda não há negócios. Adicione o primeiro abaixo.</EmptyState>
      )}

      <Panel title="Novo negócio">
        <AdminForm action={saveReviewBusiness} className="grid gap-4 sm:grid-cols-2">
          <BusinessFields />
          <div className="flex items-end">
            <SubmitButton>Criar negócio</SubmitButton>
          </div>
        </AdminForm>
      </Panel>
    </>
  );
}
