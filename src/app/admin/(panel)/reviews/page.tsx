import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/icons";
import { requireAdmin } from "@/lib/admin/auth";
import { toRadiusKm } from "@/lib/reviews/competitors";
import type { BusinessRow } from "@/lib/reviews/store";
import { createServiceClient } from "@/lib/supabase/service";
import { accessState, loadOwnerAccount } from "@/lib/admin/client-access";
import { AccessBadge, businessColumns, jobColumns, jobKindLabels, jobStatusLabels, ReaderBanner, type ReaderJobRow } from "./shared";

export const metadata: Metadata = { title: "Reviews" };

/** One row per business; everything else lives on /admin/reviews/[id]. */
export default async function ReviewsAdminPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireAdmin();
  const createdId = (await searchParams).criado;
  const client = createServiceClient();
  const { data, error } = await client.from("review_businesses").select(businessColumns).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const businesses = (data ?? []) as BusinessRow[];
  const ids = businesses.map((business) => business.id);
  const ownerIds = [...new Set(businesses.flatMap((business) => (business.owner_id ? [business.owner_id] : [])))];
  const [competitorCounts, jobsResult, owners] = await Promise.all([
    Promise.all(
      // Counted as the client sees them: within the radius an admin chose.
      businesses.map((business) =>
        client
          .from("competitors")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id)
          .eq("is_self", false)
          .eq("excluded", false)
          .or(`distance_m.is.null,distance_m.lte.${toRadiusKm(business.competitor_radius_km) * 1000}`),
      ),
    ),
    ids.length
      ? client.from("review_import_jobs").select(jobColumns).in("business_id", ids).order("requested_at", { ascending: false }).limit(Math.min(1000, ids.length * 10))
      : Promise.resolve({ data: [], error: null }),
    Promise.all(ownerIds.map(async (ownerId) => [ownerId, await loadOwnerAccount(client, ownerId)] as const)),
  ]);
  const ownerOf = new Map(owners);
  if (jobsResult.error) throw new Error(jobsResult.error.message);
  const latestJob = new Map<string, ReaderJobRow>();
  for (const job of (jobsResult.data ?? []) as ReaderJobRow[]) if (!latestJob.has(job.business_id)) latestJob.set(job.business_id, job);
  const competitorsOf = new Map(ids.map((id, index) => [id, competitorCounts[index].count ?? 0]));
  // Just created from «Novo negócio».
  const created = typeof createdId === "string" ? businesses.find((business) => business.id === createdId) : undefined;
  const createdJob = created ? latestJob.get(created.id) : undefined;

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description="Negócios com placas NFC, o link das placas, a importação das reviews e a concorrência."
        actions={
          <Link href="/admin/reviews/novo" className={buttonClasses("primary", "md")}>
            + Novo negócio
          </Link>
        }
      />
      {created ? (
        <p role="status" className="rounded-2xl border border-success/30 bg-success-soft px-4 py-3 text-sm text-success">
          Negócio criado: <strong>{created.name}</strong> (/painel/{created.slug}).
          {createdJob && (createdJob.status === "queued" || createdJob.status === "running") ? " A primeira importação (reviews e concorrência) está na fila do leitor." : ""}
        </p>
      ) : null}
      <ReaderBanner client={client} />

      {businesses.length ? (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-line text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Negócio</th>
                <th className="px-4 py-3 font-medium">Acesso</th>
                <th className="px-4 py-3 font-medium">Nota</th>
                <th className="px-4 py-3 font-medium">Reviews</th>
                <th className="px-4 py-3 font-medium">Concorrentes</th>
                <th className="px-4 py-3 font-medium">Último pedido ao leitor</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {businesses.map((business) => {
                const job = latestJob.get(business.id);
                return (
                  <tr key={business.id} className="align-top hover:bg-surface-2/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/reviews/${business.id}`} className="font-semibold text-text hover:underline">
                        {business.name}
                      </Link>
                      <p className="text-xs text-subtle">/painel/{business.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AccessBadge state={accessState(business, business.owner_id ? ownerOf.get(business.owner_id) : null)} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-text">{business.rating_total !== null ? `${String(business.rating_total).replace(".", ",")}★` : "–"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-text">{business.reviews_total ?? "–"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-text">{business.competitors_refreshed_at ? competitorsOf.get(business.id) : "–"}</td>
                    <td className="px-4 py-3">
                      {job ? (
                        <>
                          <p className="text-text">
                            {jobKindLabels[job.kind]} ·{" "}
                            <span className={job.status === "failed" ? "text-danger" : job.status === "done" ? "text-accent-text" : "text-muted"}>{jobStatusLabels[job.status]}</span>
                          </p>
                          <p className="text-xs text-subtle">{new Date(job.finished_at ?? job.requested_at).toLocaleString("pt-PT", { timeZone: "Europe/Lisbon", dateStyle: "short", timeStyle: "short" })}</p>
                        </>
                      ) : (
                        <span className="text-subtle">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                        <Link href={`/admin/reviews/${business.id}`} className="font-semibold text-accent-text hover:underline">
                          Gerir
                        </Link>
                        <Link href={`/painel/${business.slug}`} target="_blank" className="inline-flex items-center gap-1 font-semibold text-muted hover:text-text">
                          Painel <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>Ainda não há negócios. Use «Novo negócio» para adicionar o primeiro.</EmptyState>
      )}
    </>
  );
}
