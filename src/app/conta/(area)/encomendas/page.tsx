import type { Metadata } from "next";
import Link from "next/link";
import { OrderList } from "@/components/account/OrderList";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { listOwnOrders } from "@/lib/accounts/queries";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Encomendas" };

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const orders = await listOwnOrders(user.id);

  return (
    <>
      <AdminPageHeader
        title="Encomendas"
        description="Pedidos feitos com esta conta. Depois de confirmados pela nossa equipa, os produtos ficam disponíveis em “Os meus produtos”."
        actions={
          <Link href="/carrinho" className={buttonClasses("secondary", "sm")}>
            Nova encomenda
          </Link>
        }
      />
      <OrderList orders={orders} empty="Ainda não fez nenhuma encomenda com esta conta." />
    </>
  );
}
