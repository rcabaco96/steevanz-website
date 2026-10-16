import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { confirmOrderAction } from "@/lib/video-menus/order-actions";
import { cartItemCount, itemsLabel, orderTime } from "@/lib/video-menus/ordering-rules";
import { getOrderByToken, type StaffOrder } from "@/lib/video-menus/ordering-store";
import { formatPriceCents } from "@/lib/video-menus/rules";

// An order, for the staff (owner, 2026-10-16): they scan the QR code on the table's phone with their
// own phone's camera (no app, no login) and land here: the table, the order's number and time, the
// lines with their notes, the total and «Confirmar pedido».
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Pedido", referrer: "no-referrer" };

async function loadOrder(token: string): Promise<StaffOrder | null> {
  try {
    return await getOrderByToken(token);
  } catch (error) {
    console.error("[ordering] order lookup failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

export default async function StaffOrderPage({ params }: PageProps<"/pedido/[token]">) {
  const order = await loadOrder((await params).token);
  if (!order) notFound();
  const confirmed = order.status === "confirmed";
  const count = cartItemCount(order.lines);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-3">
        {order.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- the menu's own logo address
          <img src={order.logo} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full bg-white object-cover" />
        ) : null}
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-muted">{order.business}</p>
      </header>

      <section className="card flex flex-col gap-1 p-5">
        <p className="text-sm font-semibold tracking-wide text-muted uppercase">{order.tableName}</p>
        <h1 className="display text-4xl text-text">Pedido #{order.number}</h1>
        <p className="text-sm text-muted">
          Feito às {orderTime(order.createdAt)} · {itemsLabel(count)}
        </p>
      </section>

      {confirmed ? (
        <p role="status" className="rounded-2xl bg-success-soft px-4 py-3 text-center text-base font-semibold text-success">
          Pedido confirmado ✓{order.confirmedAt ? ` às ${orderTime(order.confirmedAt)}` : ""}
        </p>
      ) : null}

      <section className="card overflow-hidden">
        <ul className="divide-y divide-line">
          {order.lines.map((line, index) => (
            <li key={index} className="flex items-start gap-3 px-5 py-3.5">
              <span className="min-w-9 text-lg font-bold text-text tabular-nums">{line.quantity}×</span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-text">{line.name}</p>
                {line.note ? (
                  <p className="mt-1 rounded-lg bg-gold-soft px-2.5 py-1.5 text-sm break-words text-gold-text">
                    <strong className="font-semibold">Nota:</strong> {line.note}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-sm text-muted tabular-nums">{formatPriceCents(line.priceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-line px-5 py-4">
          <span className="text-sm text-muted">Total</span>
          <span className="text-2xl font-bold text-text tabular-nums">{formatPriceCents(order.totalCents)}</span>
        </div>
      </section>

      {confirmed ? null : (
        <ActionForm action={confirmOrderAction} className="flex flex-col">
          <input type="hidden" name="token" value={order.token} />
          <SubmitButton size="lg" className="h-14 w-full text-lg" pendingLabel="A confirmar…">
            Confirmar pedido
          </SubmitButton>
        </ActionForm>
      )}
      <p className="text-center text-xs text-subtle">Menu digital Steevanz</p>
    </main>
  );
}
