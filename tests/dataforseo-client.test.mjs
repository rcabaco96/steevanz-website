import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DataForSeoError, dfsErrorKind, dfsTaskPending, dfsUserMessage } from "../src/lib/dataforseo/client.ts";
import { parsePostbackUrl, postbackRefTag, postbackToken, postbackUrl, verifyPostbackToken } from "../src/lib/dataforseo/token.ts";

describe("DataForSEO postback token", () => {
  const secret = "s3cret";
  const job = { job: "11111111-2222-3333-4444-555555555555" };

  it("only accepts the token of the same job and secret", () => {
    const token = postbackToken(job, secret);
    assert.match(token, /^[0-9a-f]{64}$/);
    assert.equal(verifyPostbackToken(job, token, secret), true);
    assert.equal(verifyPostbackToken({ job: "other" }, token, secret), false);
    assert.equal(verifyPostbackToken(job, token, "other"), false);
    assert.equal(verifyPostbackToken(job, token.slice(1), secret), false);
    assert.equal(verifyPostbackToken(job, null, secret), false);
    assert.equal(verifyPostbackToken({ zone: job.job }, token, secret), false);
  });

  it("builds and reads back postback URLs with what the read must reach", () => {
    const url = postbackUrl("https://example.test/", job, secret, { reach: 1759000000000, check: 30 });
    assert.ok(url.startsWith("https://example.test/api/dataforseo/postback?job="));
    const parsed = parsePostbackUrl(url);
    assert.deepEqual(parsed.ref, job);
    assert.equal(parsed.token, postbackToken(job, secret));
    assert.deepEqual(parsed.extras, { reach: 1759000000000, check: 30 });
    assert.deepEqual(parsePostbackUrl(postbackUrl("https://example.test", { zone: "b1" }, secret)).extras, { reach: null, check: null });
    assert.equal(postbackRefTag({ zone: "b1" }), "zone:b1");
    assert.equal(postbackRefTag(job), job.job);
    assert.equal(parsePostbackUrl("https://example.test/api/dataforseo/postback").ref, null);
  });
});

describe("DataForSEO errors", () => {
  it("classifies status codes", () => {
    assert.equal(dfsErrorKind(40602), "pending");
    assert.equal(dfsErrorKind(40601), "pending");
    assert.equal(dfsErrorKind(40102), "no_results");
    assert.equal(dfsErrorKind(40100), "auth");
    assert.equal(dfsErrorKind(401), "auth");
    assert.equal(dfsErrorKind(40200), "balance");
    assert.equal(dfsErrorKind(40202), "rate_limit");
    assert.equal(dfsErrorKind(50000), "server");
    assert.equal(dfsErrorKind(40501), "invalid");
    assert.equal(dfsTaskPending(40602), true);
    assert.equal(dfsTaskPending(20000), false);
  });

  it("explains failures in Portuguese", () => {
    assert.match(dfsUserMessage(new DataForSeoError("balance", "x", 40200)), /sem saldo/);
    assert.match(dfsUserMessage(new DataForSeoError("invalid", "x", 40501)), /código 40501/);
    assert.match(dfsUserMessage(new Error("x")), /Tente outra vez/);
  });
});
