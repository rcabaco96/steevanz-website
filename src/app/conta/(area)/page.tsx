import type { Metadata } from "next";
import Link from "next/link";
import { SubscriptionBadge } from "@/components/account/badges";
import { AdminPageHeader, EmptyState } from "@/components/backoffice/ui";
import { ArrowRight, ProductGlyph } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, isProductId } from "@/content/products";
import { listOwnProducts } from "@/lib/accounts/queries";
import { getOwnProfile, requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Os meus produtos" };

export default async function AccountHomePage() {
  const user = await requireUser();
  const [profile, owned] = await Promise.all([getOwnProfile(), listOwnProducts(user.id)]);
  const items = owned.filter((row) => isProductId(row.product_id));
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <>
      <AdminPageHeader
        title={firstName ? `Olá, ${firstName}` : "Os meus produtos"}
        description={profile?.business_name ?? "Gestão dos produtos Steevanz que comprou."}
      />
      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((row) => {
            if (!isProductId(row.product_id)) return null;
            const product = getProduct(row.product_id);
            const copy = getProductCopy(row.product_id, "pt");
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-text">
                    <ProductGlyph icon={product.icon} size={20} />
                  </span>
                  <SubscriptionBadge status={row.status} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-text">{copy.name}</h2>
                  <p className="text-sm text-muted">{copy.tagline}</p>
                </div>
                {row.status === "active" ? (
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text">
                    Gerir
                    <ArrowRight size={16} />
                  </span>
                ) : (
                  <span className="mt-auto text-sm text-subtle">Acesso suspenso. Fale connosco para reativar.</span>
                )}
              </>
            );
            return (
              <li key={row.id} className="flex">
                {row.status === "active" ? (
                  <Link href={`/conta/${row.product_id}`} className="card card-interactive flex w-full flex-col gap-4 p-5 sm:p-6">
                    {content}
                  </Link>
                ) : (
                  <div className="card flex w-full flex-col gap-4 p-5 opacity-80 sm:p-6">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col gap-4">
          <EmptyState>
            Ainda não tem produtos ativos. Depois de fazer uma encomenda e a nossa equipa a confirmar, os produtos aparecem aqui.
          </EmptyState>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/produtos" className={buttonClasses("primary", "md")}>
              Ver produtos
            </Link>
            <Link href="/conta/encomendas" className={buttonClasses("secondary", "md")}>
              As minhas encomendas
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
