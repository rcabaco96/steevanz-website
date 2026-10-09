import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isShortMapsLink, parseMapsPlaceLink } from "../src/lib/reviews/maps-link.ts";

describe("parseMapsPlaceLink", () => {
  it("takes the LAST place of a link that carries the places visited before", () => {
    const link =
      "https://www.google.com/maps/place/La+Terrazza+del+Mare/@37.0891052,-8.2447537,17z/data=!4m14!1m7!3m6!1s0xd1acc1f57e60f9f:0xdc7e8c70247eccc1!2sMcDonald's+-+Albufeira!8m2!3d37.091375!4d-8.243051!16s%2Fg%2F11b6xf2x6k!3m5!1s0xd1acc2320613189:0x7f15843ead7247d7!8m2!3d37.0864922!4d-8.2463351!16s%2Fg%2F11gdzyczq0?entry=ttu";
    const place = parseMapsPlaceLink(link);
    assert.equal(place.name, "La Terrazza del Mare");
    assert.equal(place.fid, "0xd1acc2320613189:0x7f15843ead7247d7");
    assert.equal(place.lat, 37.0864922);
    assert.equal(place.lng, -8.2463351);
    assert.equal(
      place.cleanUrl,
      "https://www.google.com/maps/place/La+Terrazza+del+Mare/@37.0864922,-8.2463351,17z/data=!4m6!3m5!1s0xd1acc2320613189:0x7f15843ead7247d7!8m2!3d37.0864922!4d-8.2463351!16s%2Fg%2F11gdzyczq0",
    );
  });

  it("decodes accented names", () => {
    const place = parseMapsPlaceLink(
      "https://www.google.com/maps/place/Restaurante+Japon%C3%AAs+KingYo/@37.0882919,-8.2284152,18z/data=!4m6!3m5!1s0xd1acdcaf56a5a53:0xd09a04caf1c7ec58!8m2!3d37.0885304!4d-8.2291982!16s%2Fg%2F11v3fjz8jc",
    );
    assert.equal(place.name, "Restaurante Japonês KingYo");
    assert.equal(place.fid, "0xd1acdcaf56a5a53:0xd09a04caf1c7ec58");
  });

  it("refuses links that are not a place", () => {
    assert.equal(parseMapsPlaceLink("https://www.google.com/maps/@37.1,-8.2,12z"), null);
    assert.equal(parseMapsPlaceLink("https://www.google.com/maps/search/sushi/@37.1,-8.2,12z"), null);
    assert.equal(parseMapsPlaceLink("not a link"), null);
  });

  it("knows the short links that need a redirect", () => {
    assert.equal(isShortMapsLink("https://maps.app.goo.gl/abc123"), true);
    assert.equal(isShortMapsLink("https://www.google.com/maps/place/X"), false);
  });
});

describe("plate links", async () => {
  const { placeIdFromFid, plateLink, writeReviewLink } = await import("../src/lib/reviews/maps-link.ts");
  it("computes Google's place id from the Maps feature id (pairs Google gave on 2026-10-04)", () => {
    const known = [
      ["0xd1acc2320613189:0x7f15843ead7247d7", "ChIJiTFhICPMGg0R10dyrT6EFX8"],
      ["0xd1acdcaf56a5a53:0xd09a04caf1c7ec58", "ChIJU1pq9crNGg0RWOzH8coEmtA"],
      ["0xd1acd001e2cddb9:0x8f086e0aa6e844f4", "ChIJud0sHgDNGg0R9ETopgpuCI8"],
      ["0xd1acdd2d7e5185d:0x85d0b5d8a952b074", "ChIJXRjl19LNGg0RdLBSqdi10IU"],
    ];
    for (const [fid, placeId] of known) assert.equal(placeIdFromFid(fid), placeId, fid);
    assert.equal(placeIdFromFid("not a fid"), null);
  });

  it("the plate opens Google's write-a-review window", () => {
    assert.equal(writeReviewLink("ChIJud0sHgDNGg0R9ETopgpuCI8"), "https://search.google.com/local/writereview?placeid=ChIJud0sHgDNGg0R9ETopgpuCI8");
    assert.equal(plateLink({ fid: "0xd1acc2320613189:0x7f15843ead7247d7" }), "https://search.google.com/local/writereview?placeid=ChIJiTFhICPMGg0R10dyrT6EFX8");
  });
});

describe("place names with an address", async () => {
  const { nameFromPage, stripAddress } = await import("../src/lib/reviews/maps-link.ts");
  const kingKebab =
    "https://www.google.com/maps/place/King+Kebab+Arma%C3%A7%C3%A3o+P%C3%AAra%2C+R.+%C3%81lvaro+Gomes+lote+4+loja+C%2C+8365-111+Arma%C3%A7%C3%A3o+de+P%C3%AAra/@37.1032799,-8.3609201,17z/data=!4m6!3m5!1s0xd1ad1b960c347b7:0x1533ce0fcd97cf8e!8m2!3d37.1032799!4d-8.3609201!16s%2Fg%2F11fq12kdjx";

  it("keeps the name only when the link carries the address (2026-10-09, King Kebab)", () => {
    const place = parseMapsPlaceLink(kingKebab);
    assert.equal(place.name, "King Kebab Armação Pêra");
    assert.equal(place.fid, "0xd1ad1b960c347b7:0x1533ce0fcd97cf8e");
    assert.ok(place.cleanUrl.startsWith("https://www.google.com/maps/place/King+Kebab+Arma%C3%A7%C3%A3o+P%C3%AAra/@"));
  });

  it("cuts at the street or the postal code, never a name with a plain comma", () => {
    assert.equal(stripAddress("Café Central, Rua Direita 12, Faro"), "Café Central");
    assert.equal(stripAddress("Pastelaria Doce, Av. da Liberdade 3"), "Pastelaria Doce");
    assert.equal(stripAddress("O Lugar, Albufeira, 8200-001 Albufeira"), "O Lugar");
    assert.equal(stripAddress("Bar, Restaurante & Grill"), "Bar, Restaurante & Grill");
    assert.equal(stripAddress("Fish Tail"), "Fish Tail");
  });

  it("the reader corrects a stored name+address from the page title, never an admin's name", () => {
    const stored = "King Kebab Armação Pêra, R. Álvaro Gomes lote 4 loja C, 8365-111 Armação de Pêra";
    assert.equal(nameFromPage(stored, "King Kebab Armação Pêra"), "King Kebab Armação Pêra");
    assert.equal(nameFromPage(stored, "  King Kebab   Armação Pêra "), "King Kebab Armação Pêra");
    assert.equal(nameFromPage("King Kebab Armação Pêra", "King Kebab Armação Pêra"), null);
    assert.equal(nameFromPage("King Kebab (centro)", "King Kebab Armação Pêra"), null);
    assert.equal(nameFromPage(stored, null), null);
    assert.equal(nameFromPage(stored, "Resultados"), null);
  });
});
