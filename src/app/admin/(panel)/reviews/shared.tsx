import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import Link from "next/link";
import { getProductCopy } from "@/content/product-copy";
import { isProductId, products } from "@/content/products";
import { accessLabels, accessState, type AccessState, type OwnerAccount } from "@/lib/admin/client-access";
import { authLinkValidity } from "@/lib/auth/link-validity";
import {
  deleteReviewBusiness,
  queueReaderReviews,
  removeBusinessAccess,
  saveBusinessAccess,
  saveCompetitorRadius,
  saveReviewBusiness,
  sendBusinessInvite,
  searchCompetitorsWithReader,
  toggleCompetitor,
} from "@/lib/admin/review-actions";
import { rediscoveryDue } from "@/lib/reviews/competitor-store";
import { competitorRadiusOptions, radiusLabel, toRadiusKm, withinRadius } from "@/lib/reviews/competitors";
import { formatDateTime } from "@/lib/reviews/format";
import { readerOfflineAfterHours, type JobRequester, type ReaderJobKind } from "@/lib/reviews/reader-queue";
import type { BusinessRow } from "@/lib/reviews/store";
import type { createServiceClient } from "@/lib/supabase/service";

type Client = ReturnType<typeof createServiceClient>;

export const businessColumns =
  "id, slug, name, google_maps_url, review_url, plates_installed_on, rating_total, reviews_total, last_synced_at, last_sync_error, alert_email, active_services, competitors_refreshed_at, competitor_radius_km, competitors_search_radius_km, category, full_synced_at, owner_id, contact_name, contact_phone, invite_sent_at, created_at";

export interface CompetitorAdminRow {
  id: string;
  business_id: string;
  name: string;
  category: string | null;
  distance_m: number | null;
  excluded: boolean;
}

export interface ReaderJobRow {
  id: string;
  business_id: string;
  kind: ReaderJobKind;
  status: "queued" | "running" | "done" | "failed";
  requested_by: JobRequester;
  requested_at: string;
  finished_at: string | null;
  reviews_done: number;
  reviews_new: number;
  error: string | null;
}

export const jobColumns = "id, business_id, kind, status, requested_by, requested_at, finished_at, reviews_done, reviews_new, error";

export const jobKindLabels: Record<ReaderJobKind, string> = {
  full: "Histórico completo",
  update: "Atualização",
  competitor: "Concorrente",
  competitor_replies: "Respostas do concorrente",
  discover: "Procura de concorrentes",
};
export const jobStatusLabels: Record<ReaderJobRow["status"], string> = { queued: "Na fila", running: "A ler", done: "Concluído", failed: "Falhou" };
const requesterLabels: Record<JobRequester, string> = { panel: "painel", cron: "rotina", admin: "admin" };

/** Reader state for the header; outside the components so render stays pure. */
function readerState(lastSeenAt: string | null): { online: boolean; offlineTooLong: boolean } {
  const age = lastSeenAt ? Date.now() - Date.parse(lastSeenAt) : Number.POSITIVE_INFINITY;
  return { online: age < 60_000, offlineTooLong: age > readerOfflineAfterHours * 3_600_000 };
}

/** The reader's heartbeat and queue, at the top of the list and of each business. */
export async function ReaderBanner({ client }: { client: Client }) {
  const [readerResult, queuedResult] = await Promise.all([
    client.from("review_reader_status").select("id, last_seen_at, busy").order("last_seen_at", { ascending: false }).limit(1).maybeSingle<{ id: string; last_seen_at: string; busy: boolean }>(),
    client.from("review_import_jobs").select("id", { count: "exact", head: true }).eq("status", "queued").eq("provider", "reader"),
  ]);
  if (readerResult.error) throw new Error(readerResult.error.message);
  const reader = readerResult.data;
  const state = readerState(reader?.last_seen_at ?? null);
  const queued = queuedResult.count ?? 0;
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${state.offlineTooLong ? "border-danger/30 bg-danger-soft text-danger" : "border-line bg-surface-2/60 text-text"}`}>
      <p className="font-semibold">Leitor de reviews: {state.online ? (reader?.busy ? "ligado, a ler" : "ligado") : "desligado"}</p>
      <p className={state.offlineTooLong ? "" : "text-subtle"}>
        {reader ? `Último sinal a ${formatDateTime(reader.last_seen_at)} (${reader.id})` : "Nunca se ligou"} · {queued} {queued === 1 ? "pedido" : "pedidos"} na fila
      </p>
      <p className={state.offlineTooLong ? "" : "text-subtle"}>
        Lê as reviews e a concorrência de graça no computador do escritório («npm run reader»). Com {readerOfflineAfterHours} h sem sinal, chega um email.
      </p>
    </div>
  );
}

function ReaderJobs({ jobs }: { jobs: ReaderJobRow[] }) {
  if (!jobs.length) return <p className="text-sm text-subtle">Ainda não há pedidos ao leitor para este negócio.</p>;
  return (
    <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line">
      {jobs.map((job) => (
        <li key={job.id} className="flex flex-col gap-0.5 p-3 text-sm">
          <p className="flex flex-wrap items-center gap-x-2 text-text">
            <span className="font-medium">{jobKindLabels[job.kind]}</span>
            <span className={job.status === "failed" ? "text-danger" : job.status === "done" ? "text-accent-text" : "text-muted"}>{jobStatusLabels[job.status]}</span>
          </p>
          <p className="text-xs text-subtle">
            Pedido pelo {requesterLabels[job.requested_by]} a {formatDateTime(job.requested_at)}
            {job.finished_at ? ` · terminado a ${formatDateTime(job.finished_at)}` : ""}
            {job.reviews_done ? ` · ${job.reviews_done} reviews lidas${job.reviews_new ? `, ${job.reviews_new} novas` : ""}` : ""}
          </p>
          {job.error ? <p className="text-xs break-words text-subtle">{job.error}</p> : null}
        </li>
      ))}
    </ul>
  );
}

const accessTones: Record<AccessState, string> = {
  no_email: "bg-danger-soft text-danger",
  not_invited: "bg-gold-soft text-gold-text",
  invited: "bg-accent-soft text-accent-text",
  active: "bg-success-soft text-success",
};

export function AccessBadge({ state }: { state: AccessState }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${accessTones[state]}`}>{accessLabels[state]}</span>;
}

/** Who can open the panel: the owner's contact, the account (created with the email) and the invite. */
function ClientAccess({ business, owner, ownerProducts }: { business: BusinessRow; owner: OwnerAccount | null; ownerProducts: string[] }) {
  const state = accessState(business, owner);
  const productNames = ownerProducts.filter(isProductId).map((id) => getProductCopy(id, "pt").shortName);
  return (
    <section aria-labelledby="acesso-title" className="flex flex-col gap-4 rounded-2xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="acesso-title" className="font-semibold text-text">
          Acesso do cliente
        </h2>
        <AccessBadge state={state} />
      </div>
      <p className="-mt-2 text-sm text-muted">
        {state === "no_email"
          ? "Só os admins veem o painel. Com o email do dono, a conta fica criada sem lhe enviar nada."
          : state === "not_invited"
            ? `Conta criada para ${owner?.email ?? "o dono"}. Envie o convite quando o negócio for cliente.`
            : state === "invited"
              ? `Convite enviado a ${owner?.email ?? "o dono"} em ${business.invite_sent_at ? formatDateTime(business.invite_sent_at) : "–"}. O link vale ${authLinkValidity}; reenvie se expirar.`
              : `${owner?.email ?? "O dono"} já entrou no painel (último acesso: ${owner?.lastSignInAt ? formatDateTime(owner.lastSignInAt) : "–"}).`}
      </p>
      <ActionForm key={`${business.contact_name ?? ""}:${business.contact_phone ?? ""}:${business.owner_id ?? ""}`} action={saveBusinessAccess} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={business.id} />
        <label className={adminLabelClasses}>
          Nome do dono
          <input name="contact_name" maxLength={120} defaultValue={business.contact_name ?? ""} className={`${adminInputClasses} h-11`} />
        </label>
        <label className={adminLabelClasses}>
          Telefone
          <input name="contact_phone" type="tel" maxLength={40} defaultValue={business.contact_phone ?? ""} className={`${adminInputClasses} h-11`} />
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Email
          {owner ? (
            <input value={owner.email} readOnly disabled className={`${adminInputClasses} h-11 opacity-70`} />
          ) : (
            <input name="email" type="email" maxLength={200} placeholder="dono@negocio.pt" className={`${adminInputClasses} h-11`} />
          )}
          <span className="text-xs font-normal text-subtle">
            {owner ? "Para trocar de email, retire o acesso e volte a pôr o email novo." : "Opcional. Se já existir uma conta com este email, é essa que fica ligada."}
          </span>
        </label>
        <div className="sm:col-span-2">
          <SubmitButton variant="secondary" size="sm">
            {owner ? "Guardar contacto" : "Guardar"}
          </SubmitButton>
        </div>
      </ActionForm>
      {business.owner_id ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 text-sm text-muted">
          <span>
            Produtos ativos do cliente: <strong className="font-semibold text-text">{productNames.length ? productNames.join(", ") : "nenhum (só o painel)"}</strong>
          </span>
          <Link href={`/admin/clientes/${business.owner_id}`} className="font-semibold text-accent-text hover:underline">
            Gerir produtos do cliente
          </Link>
        </p>
      ) : null}
      {owner ? (
        <div className="flex flex-wrap items-start gap-2 border-t border-line pt-4">
          <ActionForm action={sendBusinessInvite} className="flex flex-col items-start gap-1">
            <input type="hidden" name="id" value={business.id} />
            <SubmitButton size="sm" pendingLabel="A enviar…">
              {state === "not_invited" ? "Enviar convite" : "Reenviar convite"}
            </SubmitButton>
          </ActionForm>
          <ActionForm action={removeBusinessAccess} confirmMessage={`Retirar o acesso de ${owner.email} a este painel? A conta continua a existir.`} className="flex flex-col items-start gap-1">
            <input type="hidden" name="id" value={business.id} />
            <SubmitButton variant="ghost" size="sm" className="text-danger">
              Retirar acesso
            </SubmitButton>
          </ActionForm>
        </div>
      ) : null}
    </section>
  );
}

function BusinessFields({ business }: { business: BusinessRow }) {
  return (
    <>
      <input type="hidden" name="id" value={business.id} />
      <label className={adminLabelClasses}>
        Nome do negócio
        <input name="name" required maxLength={160} defaultValue={business.name} className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Endereço do painel
        <span className="flex items-center gap-1">
          <span className="text-sm text-subtle">/painel/</span>
          <input name="slug" maxLength={60} defaultValue={business.slug} className={`${adminInputClasses} h-11`} />
        </span>
      </label>
      <label className={`${adminLabelClasses} sm:col-span-2`}>
        Link do negócio no Google Maps
        <input name="google_maps_url" type="url" required defaultValue={business.google_maps_url} className={`${adminInputClasses} h-11`} />
        <span className="text-xs font-normal text-subtle">Usado para importar as reviews.</span>
      </label>
      <label className={`${adminLabelClasses} sm:col-span-2`}>
        Link da placa NFC
        <input name="review_url" type="url" required defaultValue={business.review_url} className={`${adminInputClasses} h-11`} />
        <span className="text-xs font-normal text-subtle">Para onde as placas levam o cliente: a janela «Escrever uma crítica» do Google.</span>
      </label>
      <label className={adminLabelClasses}>
        Placas instaladas em
        <input name="plates_installed_on" type="date" defaultValue={business.plates_installed_on ?? ""} className={`${adminInputClasses} h-11`} />
      </label>
      <label className={adminLabelClasses}>
        Email para alertas
        <input name="alert_email" type="email" defaultValue={business.alert_email ?? ""} placeholder="dono@negocio.pt" className={`${adminInputClasses} h-11`} />
        <span className="text-xs font-normal text-subtle">Recebe um email quando entra uma review negativa (1 a 3 estrelas).</span>
      </label>
      {business.owner_id ? (
        <p className="text-sm text-muted sm:col-span-2">
          Serviços Steevanz que já tem: vêm dos produtos ativos da conta do cliente (ver «Acesso do cliente»). O painel não sugere o que ele já contratou.
        </p>
      ) : (
        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-muted">Serviços Steevanz que já tem</legend>
          <span className="-mt-1 mb-1 text-xs text-subtle">
            O painel não sugere ao cliente o que ele já contratou. Quando o negócio tiver conta de cliente, passam a vir dos produtos dessa conta.
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {products.map((product) => (
              <label key={product.id} className="flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm text-text has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/50">
                <input type="checkbox" name="active_services" value={product.id} defaultChecked={business.active_services?.includes(product.id)} className="h-4.5 w-4.5 accent-accent" />
                {getProductCopy(product.id, "pt").shortName}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </>
  );
}

/** Everything about one business: summary, reader jobs, competitors, editing and removal. */
export function BusinessDetail({
  business,
  jobs,
  competitors,
  owner,
  ownerProducts,
}: {
  business: BusinessRow;
  jobs: ReaderJobRow[];
  competitors: CompetitorAdminRow[];
  owner: OwnerAccount | null;
  ownerProducts: string[];
}) {
  const radius = toRadiusKm(business.competitor_radius_km);
  const searchedRadius = toRadiusKm(business.competitors_search_radius_km);
  return (
    <div className="flex flex-col gap-6">
      <ClientAccess business={business} owner={owner} ownerProducts={ownerProducts} />
      <div className="flex flex-col gap-3 rounded-2xl bg-surface-2/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="text-text">
            {business.rating_total !== null ? `${String(business.rating_total).replace(".", ",")}★ · ${business.reviews_total ?? "?"} reviews no Google` : "Ainda sem reviews importadas"}
          </p>
          <p className="text-subtle">
            {business.last_synced_at ? `Última sincronização: ${formatDateTime(business.last_synced_at)}` : "Nunca sincronizado"}
            {business.full_synced_at ? ` · histórico lido a ${formatDateTime(business.full_synced_at)}` : ""}
          </p>
          {business.last_sync_error ? <p className="mt-1 text-danger">Erro: {business.last_sync_error}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <ActionForm action={queueReaderReviews} className="flex flex-col items-start gap-1 sm:items-end">
            <input type="hidden" name="id" value={business.id} />
            <input type="hidden" name="kind" value="update" />
            <SubmitButton variant="secondary" size="sm" pendingLabel="A pedir…">
              Pedir atualização ao leitor
            </SubmitButton>
          </ActionForm>
          <ActionForm action={queueReaderReviews} className="flex flex-col items-start gap-1 sm:items-end">
            <input type="hidden" name="id" value={business.id} />
            <input type="hidden" name="kind" value="full" />
            <SubmitButton variant="ghost" size="sm" pendingLabel="A pedir…">
              Pedir histórico completo ao leitor
            </SubmitButton>
          </ActionForm>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-text">Pedidos ao leitor</h2>
        <ReaderJobs jobs={jobs} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-text">Concorrência</h2>
          <p className="text-sm text-subtle">
            {business.competitors_refreshed_at
              ? `Categoria${business.category ? ` «${business.category}»` : ""}, procurados num raio de ${radiusLabel(toRadiusKm(business.competitors_search_radius_km))} a ${formatDateTime(business.competitors_refreshed_at)}.${searchedRadius !== radius ? ` O raio mudou para ${radiusLabel(radius)}: a nova procura está na fila do leitor.` : rediscoveryDue(business) ? " Passaram 90 dias: vale a pena procurar outra vez." : ""}`
              : "Ainda não procurados: o leitor procura-os na primeira importação, ou agora com o botão."}
          </p>
        </div>
        <ActionForm key={radius} action={saveCompetitorRadius} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="id" value={business.id} />
          <label className={adminLabelClasses}>
            Raio da concorrência
            <select name="competitor_radius_km" defaultValue={radius} className={`${adminInputClasses} h-11 w-36`}>
              {competitorRadiusOptions.map((option) => (
                <option key={option} value={option}>
                  {radiusLabel(option)}
                </option>
              ))}
            </select>
          </label>
          <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
            Guardar raio
          </SubmitButton>
          <span className="basis-full text-xs text-subtle">Só os admins mudam o raio. Com um raio diferente, o leitor procura os concorrentes outra vez (grátis).</span>
        </ActionForm>
        {competitors.length ? (
          <details className="group">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-accent-text [&::-webkit-details-marker]:hidden">
              Ver os {competitors.length} concorrentes
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <ul className="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line">
              {competitors.map((row) => (
                <li key={row.id} className={`flex items-center justify-between gap-3 p-3 ${row.excluded || !withinRadius(row.distance_m, radius) ? "opacity-60" : ""}`}>
                  <div className="flex min-w-0 flex-col">
                    <p className={`font-medium text-text ${row.excluded ? "line-through" : ""}`}>{row.name}</p>
                    <p className="text-xs text-subtle">
                      {row.category ?? "Sem categoria"} · {row.distance_m ?? "?"} m
                      {withinRadius(row.distance_m, radius) ? "" : ` · fora do raio de ${radiusLabel(radius)}, não aparece ao cliente`}
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
        <ActionForm action={searchCompetitorsWithReader} className="flex flex-col items-start gap-1">
          <input type="hidden" name="id" value={business.id} />
          <SubmitButton variant="secondary" size="sm" pendingLabel="A pedir…">
            Procurar concorrentes com o leitor
          </SubmitButton>
        </ActionForm>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-text">Editar dados do negócio</summary>
        <ActionForm key={JSON.stringify([business.name, business.slug, business.google_maps_url, business.review_url, business.plates_installed_on, business.alert_email, business.active_services])} action={saveReviewBusiness} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BusinessFields business={business} />
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
  );
}
