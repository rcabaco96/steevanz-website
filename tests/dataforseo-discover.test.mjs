import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchOwnPlace, placeFromMapsItem, searchZone } from "../src/lib/dataforseo/discover.ts";
import { selectCompetitors } from "../src/lib/reviews/competitors.ts";

const item = (overrides = {}) => ({
  type: "maps_search",
  title: " Fuji ",
  place_id: "ChIJ-fuji",
  category: "Restaurante japonês",
  address: "Albufeira",
  rating: { value: 4.46, votes_count: 426 },
  rating_distribution: { 1: 10, 2: 6, 3: 20, 4: 90, 5: 300 },
  latitude: 37.0904,
  longitude: -8.2219,
  work_hours: { current_status: "close" },
  ...overrides,
});

const transport = (result) => {
  const calls = [];
  return {
    calls,
    post: async (path, tasks) => {
      calls.push({ path, tasks });
      return { tasks: [{ status_code: 20000, result }] };
    },
    get: async () => ({ tasks: [] }),
  };
};

describe("placeFromMapsItem", () => {
  it("maps a DataForSEO place to the selection/snapshot shape", () => {
    const place = placeFromMapsItem(item(), "Restaurante japonês");
    assert.equal(place.placeId, "ChIJ-fuji");
    assert.equal(place.title, "Fuji");
    assert.equal(place.categoryName, "Restaurante japonês");
    assert.equal(place.totalScore, 4.5);
    assert.equal(place.reviewsCount, 426);
    assert.deepEqual(place.location, { lat: 37.0904, lng: -8.2219 });
    assert.deepEqual(place.reviewsDistribution, { oneStar: 10, twoStar: 6, threeStar: 20, fourStar: 90, fiveStar: 300 });
    assert.equal(place.permanentlyClosed, false);
    assert.equal(place.temporarilyClosed, false);
    assert.equal(place.searchString, "Restaurante japonês");
    assert.match(place.url, /place_id:ChIJ-fuji/);
  });

  it("flags closed places and drops places without an id", () => {
    assert.equal(placeFromMapsItem(item({ work_hours: { current_status: "closed_forever" } })).permanentlyClosed, true);
    assert.equal(placeFromMapsItem(item({ work_hours: { current_status: "temporarily_closed" } })).temporarilyClosed, true);
    assert.equal(placeFromMapsItem(item({ place_id: null })), null);
  });

  it("feeds selectCompetitors: same category first, self and closed places out", () => {
    const self = { placeId: "ChIJ-self", category: "Restaurante japonês", lat: 37.0885, lng: -8.2292 };
    const places = [
      item({ place_id: "ChIJ-self" }),
      item({ place_id: "ChIJ-pizza", title: "Pizza", category: "Pizaria", rating: { value: 4, votes_count: 2000 } }),
      item(),
      item({ place_id: "ChIJ-gone", work_hours: { current_status: "closed_forever" } }),
      item({ place_id: "ChIJ-far", latitude: 38.7, longitude: -9.1 }),
    ].map((raw) => placeFromMapsItem(raw, "Restaurante japonês"));
    assert.deepEqual(
      selectCompetitors(self, places).map((candidate) => candidate.placeId),
      ["ChIJ-fuji", "ChIJ-pizza"],
    );
  });
});

describe("live requests", () => {
  it("searchZone asks Maps around the point and keeps businesses only", async () => {
    const dfs = transport([{ items: [item(), { type: "maps_paid_item", place_id: "ad" }] }]);
    const places = await searchZone("Restaurante japonês", 37.08853, -8.22919, dfs);
    assert.deepEqual(places.map((place) => place.placeId), ["ChIJ-fuji"]);
    assert.equal(dfs.calls[0].path, "serp/google/maps/live/advanced");
    assert.equal(dfs.calls[0].tasks[0].location_coordinate, "37.08853,-8.22919,12z");
  });

  it("fetchOwnPlace prefers the place_id, else the cid", async () => {
    const dfs = transport([{ items: [item()] }]);
    assert.equal((await fetchOwnPlace({ placeId: "ChIJ-fuji", cid: "1" }, dfs)).placeId, "ChIJ-fuji");
    await fetchOwnPlace({ cid: "15031331975988767832" }, dfs);
    assert.deepEqual(dfs.calls.map((call) => call.tasks[0].keyword), ["place_id:ChIJ-fuji", "cid:15031331975988767832"]);
    assert.equal(await fetchOwnPlace({}, dfs), null);
  });
});
