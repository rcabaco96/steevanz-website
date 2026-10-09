import webpush from "web-push";
import { kindWords } from "@/lib/establishments/kinds";
import { iconUrl } from "@/lib/establishments/logo-rules";
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

/** "sent", "gone" (the phone unsubscribed: forgotten), "off" (no subscription or no keys) or "failed". */
export type PushResult = "sent" | "gone" | "off" | "failed";

/**
 * One notification to the ticket's phone. The icon is the establishment's (logo or initials; on
 * iPhone the notification shows the home-screen icon instead), the badge the small white bell
 * Android puts in the status bar.
 */
async function sendToEntry(
  establishment: EstablishmentRow,
  entry: WaitlistEntryRow,
  origin: string,
  message: { title: string; body: string; tag: string },
  ttlSeconds: number,
): Promise<PushResult> {
  const subscription = parseSubscription(entry.push_subscription);
  if (!subscription || !configured()) return "off";
  const payload = JSON.stringify({
    ...message,
    url: `${origin}/fila/${establishment.slug}/${entry.token}`,
    icon: `${origin}${iconUrl(establishment.slug, 192, establishment.logo_path)}`,
    badge: `${origin}/fila-badge.png`,
  });
  try {
    await webpush.sendNotification(subscription, payload, { TTL: ttlSeconds, urgency: "high" });
    return "sent";
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    // The phone unsubscribed or the subscription expired: forget it.
    if (status === 404 || status === 410) {
      await createServiceClient().from("waitlist_entries").update({ push_subscription: null }).eq("id", entry.id);
      return "gone";
    }
    console.error("[waitlist] push failed:", status ?? (error instanceof Error ? error.message : error));
    return "failed";
  }
}

/** "É a sua vez" as a notification on the phone that subscribed, even with the ticket page closed. */
export async function pushCalled(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<void> {
  const words = kindWords[establishment.kind];
  await sendToEntry(
    establishment,
    entry,
    origin,
    { title: `${establishment.name}: ${words.callAction.toLowerCase()}`, body: `Senha n.º ${entry.number}. ${words.ready}`, tag: `fila-${entry.token}` },
    15 * 60,
  );
}

/** The ticket page's "Enviar notificação de teste": proves the notifications reach this phone. */
export async function pushTest(establishment: EstablishmentRow, entry: WaitlistEntryRow, origin: string): Promise<PushResult> {
  return sendToEntry(
    establishment,
    entry,
    origin,
    { title: "Notificações ativas", body: `${establishment.name}: é assim que recebe o aviso quando for a sua vez.`, tag: `fila-teste-${entry.token}` },
    60,
  );
}
