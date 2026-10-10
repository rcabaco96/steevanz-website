import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePlaceProfile, profileScore } from "../src/lib/reviews/maps-reader.ts";

/** A place payload as Maps sends it, with only the positions the parser reads. */
function payload(fields) {
  const place = new Array(260).fill(null);
  place[11] = "Exemplo";
  for (const [index, value] of Object.entries(fields)) place[Number(index)] = value;
  return `)]}'\n${JSON.stringify([null, null, null, null, null, null, place])}`;
}

describe("parsePlaceProfile", () => {
  it("reads the photos and the filled profile fields", () => {
    const read = parsePlaceProfile(
      payload({ 37: [null, 1308], 57: [null, "Exemplo (Proprietário)"], 7: ["https://example.pt", "example.pt"], 178: [["289 000 000"]], 203: [[["segunda-feira"]]], 154: [["Texto do dono"]] }),
    );
    assert.equal(read.photos, 1308);
    assert.deepEqual(read.profile, { claimed: true, website: true, phone: true, hours: true, description: true });
    assert.equal(profileScore(read.profile), 1);
  });

  it("marks missing fields and an unknown photo count", () => {
    const read = parsePlaceProfile(payload({ 178: [["289 000 000"]] }));
    assert.equal(read.photos, null);
    assert.deepEqual(read.profile, { claimed: false, website: false, phone: true, hours: false, description: false });
    assert.equal(profileScore(read.profile), 0.2);
  });

  it("reads the rating Google shows, and none on a place without reviews", () => {
    assert.equal(parsePlaceProfile(payload({ 4: [null, null, null, null, null, null, null, 4.5, null, null, null, null, null, null, 1] })).rating, 4.5);
    assert.equal(parsePlaceProfile(payload({})).rating, null);
  });

  it("ignores answers that are not a place", () => {
    assert.equal(parsePlaceProfile("not json"), null);
    assert.equal(parsePlaceProfile(`)]}'\n[1,2,3]`), null);
  });
});

describe("place category", () => {
  it("reads the main Google category of the place", () => {
    assert.equal(parsePlaceProfile(payload({ 13: ["Restaurante de doner kebab", "Restaurante"] })).category, "Restaurante de doner kebab");
    assert.equal(parsePlaceProfile(payload({})).category, null);
  });

  it("reads all the place's Google categories, main first, without repeats", () => {
    const read = parsePlaceProfile(payload({ 13: ["Treinador pessoal", " Ginásio ", "ginásio", null, "", "Health club"] }));
    assert.equal(read.category, "Treinador pessoal");
    assert.deepEqual(read.categories, ["Treinador pessoal", "Ginásio", "Health club"]);
    assert.deepEqual(parsePlaceProfile(payload({})).categories, []);
  });
});
