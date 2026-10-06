import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { retryingFetch } from "../src/lib/supabase/retry-fetch.ts";

function flaky(failures, outcome = () => new Response("ok")) {
  const calls = [];
  const base = async (input, init) => {
    calls.push(init?.method ?? "GET");
    if (calls.length <= failures) throw new TypeError("fetch failed");
    return outcome(calls.length);
  };
  return { base, calls };
}

describe("retryingFetch", () => {
  it("tries a read again after a network drop", async () => {
    const { base, calls } = flaky(2);
    const response = await retryingFetch(base, [0, 0, 0])("https://x.supabase.co/rest/v1/t");
    assert.equal(await response.text(), "ok");
    assert.equal(calls.length, 3);
  });

  it("gives up after the last attempt with the original error", async () => {
    const { base, calls } = flaky(10);
    await assert.rejects(retryingFetch(base, [0, 0, 0])("https://x"), /fetch failed/);
    assert.equal(calls.length, 4);
  });

  it("tries a read again on a gateway error, not on other answers", async () => {
    const gateway = flaky(0, (n) => new Response("", { status: n === 1 ? 503 : 200 }));
    assert.equal((await retryingFetch(gateway.base, [0])("https://x")).status, 200);
    assert.equal(gateway.calls.length, 2);
    const missing = flaky(0, () => new Response("", { status: 404 }));
    assert.equal((await retryingFetch(missing.base, [0])("https://x")).status, 404);
    assert.equal(missing.calls.length, 1);
  });

  it("never repeats a write (the first may have gone through)", async () => {
    const { base, calls } = flaky(1);
    await assert.rejects(retryingFetch(base, [0, 0, 0])("https://x", { method: "POST" }), /fetch failed/);
    assert.equal(calls.length, 1);
  });
});
