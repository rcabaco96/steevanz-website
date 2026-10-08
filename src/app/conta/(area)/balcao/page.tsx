import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/backoffice/ui";
import { CounterScreen } from "@/components/modules/counter/CounterScreen";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Balcão" };

export default async function AccountCounterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const query = await searchParams;
  return (
    <>
      <AdminPageHeader title="Balcão" description="A fila, as reservas de hoje e o cartão de cliente num só sítio, para usar durante o dia." />
      <CounterScreen ownerId={user.id} viewer="client" basePath="/conta/balcao" query={query} />
    </>
  );
}
