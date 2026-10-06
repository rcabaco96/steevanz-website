/** Waits between attempts after a network failure (the last attempt is the 4th). */
export const retryDelaysMs = [300, 1000, 2500];

const retriedStatuses = new Set([502, 503, 504]);

function methodOf(input: RequestInfo | URL, init?: RequestInit): string {
  return (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
}

/**
 * fetch that survives a short network drop on the way to Supabase ("fetch failed", reset
 * connections, a gateway hiccup): reads are tried again a few times before the error reaches the
 * page. Writes are never repeated, since the first one may have gone through.
 */
export function retryingFetch(baseFetch: typeof fetch = fetch, delays: readonly number[] = retryDelaysMs): typeof fetch {
  return async (input, init) => {
    const method = methodOf(input, init);
    if (method !== "GET" && method !== "HEAD") return baseFetch(input, init);
    for (let attempt = 0; ; attempt++) {
      const last = attempt >= delays.length;
      try {
        const response = await baseFetch(input, init);
        if (last || !retriedStatuses.has(response.status)) return response;
      } catch (error) {
        // An abort is on purpose, not a network failure.
        if (last || (error instanceof Error && error.name === "AbortError") || init?.signal?.aborted) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  };
}
