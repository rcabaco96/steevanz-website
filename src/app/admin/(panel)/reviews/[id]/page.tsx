import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, EmptyState, Panel } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { requireAdmin } from "@/lib/admin/auth";
import type { BusinessRow } from "@/lib/reviews/store";
import { createServiceClient } from "@/lib/supabase/service";
import { loadOwnerAccount } from "@/lib/admin/client-access";
import { listActiveProductIds } from "@/lib/admin/queries";
import { BusinessDetail, businessColumns, jobColumns, ReaderBanner, type CompetitorAdminRow, type ReaderJobRow } from "../shared";

export const metadata: Metadata = { title: "Negócio" };
export const maxDuration = 300;

const jobsShown = 8;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ReviewBusinessAdminPage({ params }: PageProps<"/admin/reviews/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const back = (
    <Link href="/admin/reviews" className="text-sm font-semibold text-muted hover:text-text">
      ← Voltar à lista
    </Link>
  );
  const client = createServiceClient();
  const business = uuidPattern.test(id)
    ? ((await client.from("review_businesses").select(businessColumns).eq("id", id).maybeSingle()).data as BusinessRow | null)
    : null;
  if (!business) {
    return (
      <>
        <AdminPageHeader title="Negócio" actions={back} />
        <EmptyState>Este negócio já não existe.</EmptyState>
      </>
    );
  }
  const [jobs, competitors, owner, ownerProducts] = await Promise.all([
    client.from("review_import_jobs").select(jobColumns).eq("business_id", business.id).order("requested_at", { ascending: false }).limit(jobsShown),
    client.from("competitors").select("id, business_id, name, category, distance_m, excluded").eq("business_id", business.id).eq("is_self", false).order("distance_m"),
    business.owner_id ? loadOwnerAccount(client, business.owner_id) : Promise.resolve(null),
    business.owner_id ? listActiveProductIds(business.owner_id) : Promise.resolve([] as string[]),
  ]);
  if (jobs.error) throw new Error(jobs.error.message);
  if (competitors.error) throw new Error(competitors.error.message);

  return (
    <>
      <AdminPageHeader
        title={business.name}
        description={`/painel/${business.slug}`}
        actions={
          <div className="flex items-center gap-4">
            {back}
            <Link href={`/painel/${business.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text hover:underline">
              Painel <ArrowUpRight size={15} />
            </Link>
          </div>
        }
      />
      <ReaderBanner client={client} />
      <Panel>
        <BusinessDetail business={business} jobs={(jobs.data ?? []) as ReaderJobRow[]} competitors={(competitors.data ?? []) as CompetitorAdminRow[]} owner={owner} ownerProducts={ownerProducts} />
      </Panel>
    </>
  );
}
