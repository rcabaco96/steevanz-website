// A minimal client for Supabase Realtime Broadcast (Phoenix protocol over a WebSocket): joins one
// public channel, keeps it alive and reconnects. Only the table pages load it (the whole supabase-js
// would weigh several times more for this one job). It carries no data: only «changed», after which
// the phone fetches the table's state from the server.

const heartbeatMs = 25_000;
const retryMs = [1000, 2000, 5000, 10_000];

interface PhoenixMessage {
  topic: string;
  event: string;
  payload: { status?: string; event?: string; payload?: unknown } & Record<string, unknown>;
  ref: string | null;
}

/**
 * Listens to `topic`: `onEvent` for each broadcast, `onStatus(true)` once joined and `(false)` when
 * the connection drops (then it tries again). Returns the function that stops it.
 */
export function listenToBroadcast({
  url,
  apiKey,
  topic,
  onEvent,
  onStatus,
}: {
  url: string;
  apiKey: string;
  topic: string;
  onEvent: (event: string, payload: unknown) => void;
  onStatus: (joined: boolean) => void;
}): () => void {
  let socket: WebSocket | null = null;
  let heartbeat: number | undefined;
  let retry: number | undefined;
  let attempts = 0;
  let ref = 0;
  let stopped = false;
  const channel = `realtime:${topic}`;
  const endpoint = `${url.replace(/^http/, "ws").replace(/\/$/, "")}/realtime/v1/websocket?apikey=${encodeURIComponent(apiKey)}&vsn=1.0.0`;

  const send = (message: Omit<PhoenixMessage, "ref"> & { join_ref?: string }) => {
    if (socket?.readyState !== WebSocket.OPEN) return;
    ref += 1;
    socket.send(JSON.stringify({ ...message, ref: String(ref) }));
  };

  const scheduleRetry = () => {
    if (stopped || retry !== undefined) return;
    const wait = retryMs[Math.min(attempts, retryMs.length - 1)];
    attempts += 1;
    retry = window.setTimeout(() => {
      retry = undefined;
      connect();
    }, wait);
  };

  const drop = () => {
    window.clearInterval(heartbeat);
    heartbeat = undefined;
    if (socket) {
      socket.onopen = socket.onmessage = socket.onclose = socket.onerror = null;
      try {
        socket.close();
      } catch {
        // already closed
      }
    }
    socket = null;
  };

  function connect() {
    if (stopped) return;
    drop();
    let current: WebSocket;
    try {
      current = new WebSocket(endpoint);
    } catch {
      scheduleRetry();
      return;
    }
    socket = current;
    let joinRef = "";
    current.onopen = () => {
      send({ topic: channel, event: "phx_join", payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: false }, access_token: apiKey } });
      joinRef = String(ref);
      heartbeat = window.setInterval(() => send({ topic: "phoenix", event: "heartbeat", payload: {} }), heartbeatMs);
    };
    current.onmessage = (message) => {
      let data: PhoenixMessage;
      try {
        data = JSON.parse(String(message.data));
      } catch {
        return;
      }
      if (data.topic !== channel) return;
      if (data.event === "phx_reply" && data.ref === joinRef) {
        if (data.payload.status === "ok") {
          attempts = 0;
          onStatus(true);
        } else {
          onStatus(false);
          drop();
          scheduleRetry();
        }
      } else if (data.event === "broadcast" && typeof data.payload.event === "string") {
        onEvent(data.payload.event, data.payload.payload);
      } else if (data.event === "phx_error" || data.event === "phx_close") {
        onStatus(false);
        drop();
        scheduleRetry();
      }
    };
    current.onclose = () => {
      onStatus(false);
      drop();
      scheduleRetry();
    };
    current.onerror = () => {
      // onclose follows.
    };
  }

  // Back on the page (a phone often closes the connection in the background): at once.
  const onVisible = () => {
    if (document.visibilityState !== "visible" || stopped) return;
    if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
      window.clearTimeout(retry);
      retry = undefined;
      attempts = 0;
      connect();
    }
  };
  document.addEventListener("visibilitychange", onVisible);
  connect();

  return () => {
    stopped = true;
    window.clearTimeout(retry);
    document.removeEventListener("visibilitychange", onVisible);
    drop();
  };
}
