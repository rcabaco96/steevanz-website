"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { orderPath } from "./ordering-rules";
import { confirmOrder } from "./ordering-store";

// The staff's page of an order (/pedido/<token>, opened from the order's QR code): no login, the
// order's secret token is the key. «Confirmar pedido» tells the table's phones at once.

export async function confirmOrderAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const token = formData.get("token");
  if (typeof token !== "string") return { ok: false, message: "Pedido não encontrado." };
  try {
    const confirmed = await confirmOrder(token);
    revalidatePath(orderPath(token));
    return { ok: true, message: confirmed ? "Pedido confirmado. A mesa já vê a confirmação." : "Este pedido já estava confirmado." };
  } catch (error) {
    console.error("[ordering] confirm failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível confirmar. Tente outra vez." };
  }
}
