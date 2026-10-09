import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coordinatesFromMapsUrl, parseSearchResult } from "../src/lib/reviews/maps-reader.ts";

// Shapes as Google Maps showed them on 2026-10-04 (business data only).
const fishTail = {
  name: "Fish Tail",
  href: "https://www.google.com/maps/place/Fish+Tail/data=!4m7!3m6!1s0xd1acd001e2cddb9:0x8f086e0aa6e844f4!8m2!3d37.0897563!4d-8.2467477!16s%2Fg%2F11vk2yntzp!19sChIJud0sHgDNGg0R9ETopgpuCI8",
  labels: ["4,8 estrelas", "Saber mais sobre a divulgação legal relativa às críticas públicas no Google Maps"],
  text: "Fish Tail Fish Tail 4,8 Restaurante japonês · R. das Telecomunicações 14 Aberto ⋅ Fecha às 23:00  Reservar mesa  Pedir online",
};

describe("parseSearchResult", () => {
  it("reads place id, feature id, coordinates, rating and category", () => {
    assert.deepEqual(parseSearchResult(fishTail), {
      placeId: "ChIJud0sHgDNGg0R9ETopgpuCI8",
      fid: "0xd1acd001e2cddb9:0x8f086e0aa6e844f4",
      title: "Fish Tail",
      lat: 37.0897563,
      lng: -8.2467477,
      rating: 4.8,
      reviewsCount: null,
      category: "Restaurante japonês",
      permanentlyClosed: false,
      temporarilyClosed: false,
    });
  });

  it("reads the review count when the layout shows it", () => {
    assert.equal(parseSearchResult({ ...fishTail, text: "Fish Tail 4,8(907) Restaurante japonês · R. X" }).reviewsCount, 907);
    assert.equal(parseSearchResult({ ...fishTail, labels: ["4,8 estrelas 1.339 críticas"] }).reviewsCount, 1339);
  });

  it("flags closed places and drops results without a place id", () => {
    assert.equal(parseSearchResult({ ...fishTail, text: `${fishTail.text} Encerrado permanentemente` }).permanentlyClosed, true);
    assert.equal(parseSearchResult({ ...fishTail, text: `${fishTail.text} Temporariamente encerrado` }).temporarilyClosed, true);
    assert.equal(parseSearchResult({ ...fishTail, href: "https://www.google.com/maps/place/Fish+Tail/data=!3d37.1!4d-8.2" }), null);
  });
});

describe("coordinatesFromMapsUrl", () => {
  it("prefers the place's own coordinates over the viewport", () => {
    assert.deepEqual(
      coordinatesFromMapsUrl("https://www.google.com/maps/place/X/@37.0882919,-8.2284152,18z/data=!4m6!3m5!1s0x1:0x2!8m2!3d37.0885304!4d-8.2291982"),
      { lat: 37.0885304, lng: -8.2291982 },
    );
    assert.deepEqual(coordinatesFromMapsUrl("https://www.google.com/maps/@37.1,-8.2,12z"), { lat: 37.1, lng: -8.2 });
    assert.equal(coordinatesFromMapsUrl("https://maps.app.goo.gl/abc"), null);
  });
});

describe("searchCardCategory", async () => {
  const { searchCardCategory } = await import("../src/lib/reviews/maps-reader.ts");
  it("finds the category after the rating, with or without a count and a price", () => {
    assert.equal(searchCardCategory(fishTail.text), "Restaurante japonês");
    assert.equal(searchCardCategory("Kebab Armação\n4,6(321) · €10–20\nRestaurante de kebab · R. Álvaro Gomes 4\nAberto ⋅ Fecha às 23:00"), "Restaurante de kebab");
    assert.equal(searchCardCategory("Kebab Armação 4,6(321) · €€ Restaurante de kebab · R. X"), "Restaurante de kebab");
    assert.equal(searchCardCategory("Kebab Armação\n4,6(1.321)\n10-20 €\nRestaurante de kebab · R. X"), "Restaurante de kebab");
    assert.equal(searchCardCategory("Barbearia X\n4,9(88)\nBarbearia · Rua Y 2"), "Barbearia");
  });

  it("gives up rather than guess (no rating, or an address in its place)", () => {
    assert.equal(searchCardCategory("Novo lugar\nRestaurante · R. X"), null);
    assert.equal(searchCardCategory("Lugar 4,5(10) · R. Direita 12"), null);
  });
});
