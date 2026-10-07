import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubscriptionBadge } from "@/components/account/badges";
import { BackLink } from "@/components/admin/RecordDetail";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { ProductModule } from "@/components/modules/registry";
import { getProductCopy } from "@/content/product-copy";
import { isProductId } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { getClientProduct, getProfile } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Módulo de cliente" };

export default async function AdminClientModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; product: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { id, product } = await params;
  const query = await searchParams;
  if (!isProductId(product)) notFound();
  const [profile, owned] = await Promise.all([getProfile(id), getClientProduct(id, product)]);
  if (!profile || !owned) notFound();
  const copy = getProductCopy(product, "pt");

  return (
    <>
      <BackLink href={`/admin/clientes/${profile.id}`} label={profile.full_name ?? profile.email} />
      <AdminPageHeader title={copy.name} description={`${profile.business_name ?? profile.email} · vista de administrador`} actions={<SubscriptionBadge status={owned.status} />} />
      <ProductModule productId={product} userId={profile.id} viewer="admin" basePath={`/admin/clientes/${profile.id}/${product}`} query={query} />
    </>
  );
}
