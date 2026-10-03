import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { googleReviewUrl } from "../src/lib/reviews/google-links.ts";

describe("Google review links", () => {
  it("links one review on Google Maps from its id and the place fid", () => {
    assert.equal(
      googleReviewUrl("ChZDSUhNMG9nS0VJQ0FnSUNDcjZfeU1BEAE", "0xd1ad1771e4933c1:0x814c3eabc9fe0a09"),
      "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNDcjZfeU1BEAE!2m1!1s0xd1ad1771e4933c1:0x814c3eabc9fe0a09!3m1!1s2@1:ChZDSUhNMG9nS0VJQ0FnSUNDcjZfeU1BEAE?hl=pt-PT",
    );
  });

  it("returns null without a valid fid or review id, so callers fall back to the place page", () => {
    assert.equal(googleReviewUrl("ChZDSUhNMG9nS0VJQ0FnSUNDcjZfeU1BEAE", null), null);
    assert.equal(googleReviewUrl("ChZDSUhNMG9nS0VJQ0FnSUNDcjZfeU1BEAE", "javascript:alert(1)"), null);
    assert.equal(googleReviewUrl("bad id/../x", "0xd1ad1771e4933c1:0x814c3eabc9fe0a09"), null);
  });
});
