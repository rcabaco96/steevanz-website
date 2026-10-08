import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/RecordDetail";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { CounterScreen } from "@/components/modules/counter/CounterScreen";
import { requireAdmin } from "@/lib/admin/auth";
import { getProfile } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Balcão do cliente" };

export default async function AdminClientCounterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const profile = await getProfile(id);
  if (!profile) notFound();
  return (
    <>
      <BackLink href={`/admin/clientes/${profile.id}`} label={profile.full_name ?? profile.email} />
      <AdminPageHeader title="Balcão" description={`${profile.business_name ?? profile.email} · vista de administrador`} />
      <CounterScreen ownerId={profile.id} viewer="admin" basePath={`/admin/clientes/${profile.id}/balcao`} query={query} />
    </>
  );
}
