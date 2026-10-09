import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { describe, it } from "node:test";
import { createState, decryptSecret, encryptSecret, parseTokenKey, sameState, signState, verifyState } from "../src/lib/google/crypto.ts";
import { buildAuthUrl, emailFromIdToken, googleOAuthConfig, googleOAuthMissing, grantedScopes, redirectUriFor } from "../src/lib/google/oauth.ts";

const key = randomBytes(32);
const otherKey = randomBytes(32);
const now = Date.parse("2026-10-03T12:00:00Z");

describe("token encryption", () => {
  it("round-trips with the same key and business id, in the iv.tag.ciphertext format", () => {
    const stored = encryptSecret("token-1", key, "b1");
    assert.equal(stored.split(".").length, 3);
    assert.notEqual(stored, encryptSecret("token-1", key, "b1"));
    assert.equal(decryptSecret(stored, key, "b1"), "token-1");
  });

  it("refuses another key, another business id or a tampered value", () => {
    const stored = encryptSecret("token-1", key, "b1");
    assert.throws(() => decryptSecret(stored, otherKey, "b1"));
    assert.throws(() => decryptSecret(stored, key, "b2"));
    const [iv, tag, data] = stored.split(".");
    const flipped = Buffer.from(data, "base64");
    flipped[0] ^= 1;
    assert.throws(() => decryptSecret([iv, tag, flipped.toString("base64")].join("."), key, "b1"));
    assert.throws(() => decryptSecret("not-encrypted", key, "b1"));
  });

  it("accepts only a 32-byte base64 key", () => {
    assert.equal(parseTokenKey(key.toString("base64"))?.length, 32);
    assert.equal(parseTokenKey(randomBytes(16).toString("base64")), null);
    assert.equal(parseTokenKey(""), null);
    assert.equal(parseTokenKey(undefined), null);
  });
});

describe("OAuth state", () => {
  it("verifies a signed state and keeps the slug", () => {
    const token = signState(createState("slug-a", now), key);
    assert.equal(verifyState(token, key, now)?.slug, "slug-a");
    assert.equal(verifyState(token, key, now + 9 * 60_000)?.slug, "slug-a");
  });

  it("rejects expired, foreign-key, tampered and malformed states", () => {
    const token = signState(createState("slug-a", now), key);
    assert.equal(verifyState(token, key, now + 10 * 60_000), null);
    assert.equal(verifyState(token, otherKey, now), null);
    const [body, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ s: "slug-b", n: "x", e: now / 1000 + 600 })).toString("base64url");
    assert.equal(verifyState(`${forged}.${signature}`, key, now), null);
    assert.equal(verifyState(`${body}.${signature}.x`, key, now), null);
    assert.equal(verifyState("", key, now), null);
    assert.equal(verifyState(null, key, now), null);
  });

  it("gives every state its own nonce", () => {
    assert.notEqual(createState("slug-a", now).nonce, createState("slug-a", now).nonce);
  });

  it("compares the returned state with the cookie", () => {
    const token = signState(createState("slug-a", now), key);
    assert.equal(sameState(token, token), true);
    assert.equal(sameState(token, signState(createState("slug-a", now), key)), false);
    assert.equal(sameState(token, undefined), false);
    assert.equal(sameState(null, token), false);
  });
});

describe("OAuth request", () => {
  it("asks for offline access to business.manage plus the email", () => {
    const url = new URL(buildAuthUrl({ clientId: "client-1", redirectUri: redirectUriFor("http://localhost:3000"), state: "s1" }));
    assert.equal(url.origin + url.pathname, "https://accounts.google.com/o/oauth2/v2/auth");
    const params = url.searchParams;
    assert.equal(params.get("redirect_uri"), "http://localhost:3000/api/google/callback");
    assert.equal(params.get("scope"), "openid email https://www.googleapis.com/auth/business.manage");
    assert.equal(params.get("access_type"), "offline");
    assert.equal(params.get("prompt"), "consent");
    assert.equal(params.get("include_granted_scopes"), "true");
    assert.equal(params.get("response_type"), "code");
    assert.equal(params.get("state"), "s1");
  });

  it("is configured only with the client id, secret and a valid key", () => {
    const env = { GOOGLE_OAUTH_CLIENT_ID: "id", GOOGLE_OAUTH_CLIENT_SECRET: "secret", GOOGLE_TOKEN_KEY: key.toString("base64") };
    assert.notEqual(googleOAuthConfig(env), null);
    assert.equal(googleOAuthConfig({ ...env, GOOGLE_OAUTH_CLIENT_SECRET: "" }), null);
    assert.equal(googleOAuthConfig({ ...env, GOOGLE_TOKEN_KEY: "short" }), null);
  });

  it("names what is missing (for admins), never the values", () => {
    const env = { GOOGLE_OAUTH_CLIENT_ID: "id", GOOGLE_OAUTH_CLIENT_SECRET: "secret", GOOGLE_TOKEN_KEY: key.toString("base64") };
    assert.deepEqual(googleOAuthMissing(env), []);
    assert.deepEqual(googleOAuthMissing({}), ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_TOKEN_KEY"]);
    const [invalid] = googleOAuthMissing({ ...env, GOOGLE_TOKEN_KEY: "short" });
    assert.match(invalid, /^GOOGLE_TOKEN_KEY \(inválida/);
    assert.ok(!invalid.includes("short"));
  });

  it("reads the email from the id_token and the granted scopes", () => {
    const payload = Buffer.from(JSON.stringify({ email: "Owner@Example.com" })).toString("base64url");
    assert.equal(emailFromIdToken(`h.${payload}.s`), "owner@example.com");
    assert.equal(emailFromIdToken("bad"), null);
    assert.equal(emailFromIdToken(undefined), null);
    assert.deepEqual(grantedScopes("openid  email"), ["openid", "email"]);
    assert.deepEqual(grantedScopes(undefined), []);
  });
});
