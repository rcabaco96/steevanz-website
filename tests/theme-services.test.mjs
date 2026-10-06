import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { themeServices, themeServicesLimit } from "../src/lib/reviews/recommendations.ts";
import { themeIds } from "../src/lib/reviews/text.ts";

const problem = (id, overrides = {}) => ({ id, mentions: 8, verdict: "improve", negativeShare: 0.5, ...overrides });

describe("themeServices", () => {
  it("waiting time → digital waitlist, then online bookings", () => {
    assert.deepEqual(themeServices(problem("waiting")).map((service) => service.productId), ["waitlist", "bookings"]);
  });

  it("only when the theme shows a problem", () => {
    assert.deepEqual(themeServices(problem("waiting", { verdict: "strength", negativeShare: 0.05 })), []);
    assert.deepEqual(themeServices(problem("waiting", { verdict: "neutral", negativeShare: 0.1 })), []);
    // 25%+ negative counts as a problem even without "A melhorar".
    assert.equal(themeServices(problem("waiting", { verdict: "neutral", negativeShare: 0.25 })).length, 2);
    // Too few mentions to be sure.
    assert.deepEqual(themeServices(problem("waiting", { mentions: 2 })), []);
  });

  it("never more than two, never one the customer already has", () => {
    for (const id of themeIds) {
      const services = themeServices(problem(id));
      assert.ok(services.length >= 1 && services.length <= themeServicesLimit, id);
      assert.equal(new Set(services.map((service) => service.productId)).size, services.length, id);
      for (const service of services) assert.ok(service.body.length > 20, id);
    }
    assert.deepEqual(themeServices(problem("waiting"), ["waitlist"]).map((service) => service.productId), ["bookings"]);
    assert.deepEqual(themeServices(problem("quality"), ["ai-reviews"]), []);
  });
});
