import type { EstablishmentRow } from "@/lib/establishments/types";
import { pushCalled } from "./push";
import type { WaitlistEntryRow } from "./store";

/** What tells a customer it is their turn, besides the ticket page ringing: a notification on the phone. */
export async function notifyCalled(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<void> {
  await pushCalled(establishment, entry, origin);
}
