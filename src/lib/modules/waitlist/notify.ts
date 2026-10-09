import { sendOwnerEmail } from "@/lib/booking/email";
import { kindWords } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { pushCalled } from "./push";
import type { WaitlistEntryRow } from "./store";

/** Everything that tells a customer it is their turn, besides the ticket page ringing: push and email. */
export async function notifyCalled(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<void> {
  await Promise.all([pushCalled(establishment, entry, origin), emailCalled(establishment, entry, origin)]);
}

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
