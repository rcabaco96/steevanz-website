import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { importSecondsLeft, parseDistribution, parseMapsReviewPage } from "../src/lib/reviews/maps-reader.ts";

/** Same nesting as Google Maps' review response, with placeholder values only. */
function response(reviews, next) {
  const items = reviews.map((r) => {
    const review = [];
    review[0] = r.id;
    review[1] = [null, null, r.micros, r.micros, [null, null, null, null, null, [null, null, null, null, null, 12, null, null, null, null, [r.guide ? "Guia local · 12 críticas" : "12 críticas"]]]];
    const body = [];
    body[0] = [r.rating];
    body[14] = ["pt"];
    body[15] = r.text ? [[r.text]] : null;
    review[2] = body;
    if (r.reply) {
      const reply = [];
      reply[1] = r.replyMicros;
      reply[14] = [[r.reply]];
      review[3] = reply;
    }
    return [review];
  });
  const payload = JSON.stringify([null, next, items]);
  return `)]}'\n\n100\n${JSON.stringify([["wrb.fr", "qv9Egd", payload, null, null, null, "generic"]])}\n25\n[["e",4]]\n`;
}

describe("Google Maps review pages", () => {
  it("keeps only the stored fields, with exact dates and the owner reply", () => {
    const page = parseMapsReviewPage(
      response([{ id: "Ci9abcdefghijk", rating: 4, micros: 1790189562344636, text: "x", reply: "y", replyMicros: 1790204684000000, guide: true }], "next:10"),
    );
    assert.equal(page.next, "next:10");
    assert.deepEqual(page.reviews[0], {
      review_id: "Ci9abcdefghijk",
      rating: 4,
      text: "x",
      language: "pt",
      published_at: "2026-09-23T18:52:42.344Z",
      owner_reply: "y",
      owner_replied_at: "2026-09-23T23:04:44.000Z",
      reviewer_review_count: 12,
      reviewer_is_local_guide: true,
    });
  });

  it("marks the last page and skips malformed reviews", () => {
    const page = parseMapsReviewPage(response([{ id: "Ci9abcdefghijk", rating: 9, micros: 1 }], null));
    assert.equal(page.next, null);
    assert.equal(page.reviews.length, 0);
    assert.equal(parseMapsReviewPage("not a review response"), null);
  });

  it("reads the star distribution bars", () => {
    assert.deepEqual(parseDistribution(["5 estrelas,452 críticas", "4 estrelas,89 críticas", "3 estrelas,33 críticas", "2 estrelas,32 críticas", "1 estrelas,73 críticas"]), {
      1: 73, 2: 32, 3: 33, 4: 89, 5: 452,
    });
    assert.equal(parseDistribution(["5 estrelas,452 críticas"]), null);
  });

  it("estimates the time left from the measured time per page", () => {
    assert.equal(importSecondsLeft({ reviewsExpected: 679, reviewsDone: 0, pagesDone: 0, avgPageMs: null }), 52);
    assert.equal(importSecondsLeft({ reviewsExpected: 679, reviewsDone: 300, pagesDone: 30, avgPageMs: 500 }), 19);
    assert.equal(importSecondsLeft({ reviewsExpected: null, reviewsDone: 0, pagesDone: 0, avgPageMs: null }), null);
  });
});
