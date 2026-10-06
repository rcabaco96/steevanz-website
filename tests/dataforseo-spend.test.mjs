import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dfsPaths, dfsUserMessage, DataForSeoError, estimateTaskCost, spendProblem } from "../src/lib/dataforseo/client.ts";

const limits = { reserve: 5, daily: 3 };

describe("estimateTaskCost", () => {
  it("reviews: 0.00075 $ per 10 on the normal queue, double on priority", () => {
    assert.equal(estimateTaskCost(dfsPaths.reviewsPost, { depth: 680, priority: 1 }).toFixed(4), "0.0510");
    assert.equal(estimateTaskCost(dfsPaths.reviewsPost, { depth: 680, priority: 2 }).toFixed(4), "0.1020");
    // The KingYo batch: 27 502 reviews on priority ≈ 4.13 $.
    assert.equal(estimateTaskCost(dfsPaths.reviewsPost, { depth: 27510, priority: 2 }).toFixed(2), "4.13");
  });

  it("maps and business info", () => {
    assert.equal(estimateTaskCost(dfsPaths.mapsPost, { priority: 2 }), 0.0012);
    assert.equal(estimateTaskCost(dfsPaths.mapsLive, {}), 0.002);
    assert.equal(estimateTaskCost(dfsPaths.businessInfoLive, {}), 0.0054);
  });
});

describe("spendProblem", () => {
  it("lets a request through when the reserve and today's limit allow it", () => {
    assert.equal(spendProblem({ balance: 46.6, spentToday: 0.5 }, 0.1, limits), null);
  });

  it("refuses anything that would leave less than the reserve (and a negative balance always)", () => {
    assert.match(spendProblem({ balance: 5.05, spentToday: 0 }, 0.1, limits), /mínimo de segurança/);
    assert.match(spendProblem({ balance: -3.374, spentToday: 0 }, 0.0006, limits), /-3,37 \$/);
  });

  it("refuses what would pass today's limit", () => {
    assert.match(spendProblem({ balance: 46.6, spentToday: 2.95 }, 0.1, limits), /limite de gastos de hoje/);
    // The batch that emptied the account would have been stopped on both counts.
    assert.notEqual(spendProblem({ balance: 0.85, spentToday: 0.2 }, 4.13, limits), null);
  });

  it("the panel shows the guard's own message", () => {
    const message = spendProblem({ balance: 1, spentToday: 0 }, 0.1, limits);
    assert.equal(dfsUserMessage(new DataForSeoError("budget", message)), message);
  });
});
