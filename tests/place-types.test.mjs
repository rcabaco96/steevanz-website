import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cidFromFid } from "../src/lib/reviews/place-types.ts";

describe("Google place ids", () => {
  it("turns the feature id into the numeric cid", () => {
    assert.equal(cidFromFid("0xd1ad1771e4933c1:0x814c3eabc9fe0a09"), BigInt("0x814c3eabc9fe0a09").toString());
    assert.equal(cidFromFid("ChIJ"), null);
    assert.equal(cidFromFid(null), null);
  });
});
