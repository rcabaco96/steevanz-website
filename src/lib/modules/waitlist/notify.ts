import { sendOwnerEmail } from "@/lib/booking/email";
import { kindWords } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";
import type { WaitlistEntryRow } from "./store";

/** "É a sua vez" by email, for customers who left one (the ticket page rings on its own). */
export async function emailCalled(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<void> {
  if (!entry.email) return;
  const words = kindWords[establishment.kind];
  await sendOwnerEmail({
    to: [entry.email],
    subject: `${establishment.name}: ${words.callAction.toLowerCase()}`,
    heading: words.ready,
    rows: [
      { label: "Onde", value: establishment.name },
      { label: "Senha", value: `N.º ${entry.number}` },
    ],
    adminUrl: `${origin}/fila/${establishment.slug}/${entry.token}`,
    linkLabel: "Abrir a minha senha",
  });
}
