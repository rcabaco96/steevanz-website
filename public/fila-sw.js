// Service worker of the queue tickets (/fila/…): shows the "É a sua vez" notification sent by the
// server when the team calls, even with the ticket page closed, and opens the ticket when tapped.
// Kept small on purpose: no caching, no offline pages.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "É a sua vez";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "Dirija-se à entrada.",
      tag: data.tag || "fila",
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 150, 300, 150, 300],
      icon: "/apple-icon.png",
      badge: "/apple-icon.png",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url === url);
      if (open) return open.focus();
      return self.clients.openWindow(url);
    }),
  );
});
