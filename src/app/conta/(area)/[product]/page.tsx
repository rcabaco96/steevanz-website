import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/RecordDetail";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { ProductModule } from "@/components/modules/registry";
import { getProductCopy } from "@/content/product-copy";
import { isProductId } from "@/content/products";
import { getOwnProduct } from "@/lib/accounts/queries";
import { requireUser } from "@/lib/auth/session";

type Params = Promise<{ product: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { product } = await params;
  return { title: isProductId(product) ? getProductCopy(product, "pt").shortName : "Produto" };
}

export default async function AccountProductPage({ params }: { params: Params }) {
  const { product } = await params;
  if (!isProductId(product)) notFound();
  const user = await requireUser();
  const owned = await getOwnProduct(user.id, product);
  if (!owned || owned.status !== "active") notFound();
  const copy = getProductCopy(product, "pt");

  return (
    <>
      <BackLink href="/conta" label="Os meus produtos" />
      <AdminPageHeader title={copy.name} description={copy.tagline} />
      <ProductModule productId={product} userId={user.id} viewer="client" />
    </>
  );
}
