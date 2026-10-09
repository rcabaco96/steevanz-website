import webpush from "web-push";
import { kindWords } from "@/lib/establishments/kinds";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { parseSubscription } from "./push-rules";
import type { WaitlistEntryRow } from "./store";

// Web push for the queue (free: the browsers' own push services, signed with our VAPID key).
// Keys in the environment: NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.

let ready: boolean | null = null;
function configured(): boolean {
  if (ready !== null) return ready;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  ready = Boolean(publicKey && privateKey);
  if (ready) webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:rcabaco@steevanz.com", publicKey!, privateKey!);
  return ready;
}

/** "É a sua vez" as a notification on the phone that subscribed, even with the ticket page closed. */
export async function pushCalled(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<void> {
  const subscription = parseSubscription(entry.push_subscription);
  if (!subscription || !configured()) return;
  const words = kindWords[establishment.kind];
  const payload = JSON.stringify({
    title: `${establishment.name}: ${words.callAction.toLowerCase()}`,
    body: `Senha n.º ${entry.number}. ${words.ready}`,
    url: `${origin}/fila/${establishment.slug}/${entry.token}`,
    tag: `fila-${entry.token}`,
  });
  try {
    await webpush.sendNotification(subscription, payload, { TTL: 15 * 60, urgency: "high" });
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    // The phone unsubscribed or the subscription expired: forget it.
    if (status === 404 || status === 410) {
      await createServiceClient().from("waitlist_entries").update({ push_subscription: null }).eq("id", entry.id);
      return;
    }
    console.error("[waitlist] push failed:", status ?? (error instanceof Error ? error.message : error));
  }
}
