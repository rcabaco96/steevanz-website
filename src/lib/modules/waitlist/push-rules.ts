// Web push subscriptions from the ticket page. Pure module: also used by the tests.

export interface PushSubscriptionJson {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** The browsers' push services. The server posts to the endpoint, so nothing else is accepted. */
const pushHosts = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /^push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/];

/** A subscription from the ticket page, checked (shape, size and push service), or null. */
export function parseSubscription(value: unknown): PushSubscriptionJson | null {
  if (!value || typeof value !== "object") return null;
  const { endpoint, keys } = value as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  if (typeof endpoint !== "string" || endpoint.length > 1000 || typeof keys?.p256dh !== "string" || typeof keys?.auth !== "string") return null;
  if (keys.p256dh.length > 200 || keys.auth.length > 100) return null;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !pushHosts.some((host) => host.test(url.hostname))) return null;
  return { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
}
