import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPriceCents,
  initialsLogo,
  isLogoUrl,
  menuPaths,
  menuPublicPath,
  moveItem,
  parseInstagram,
  parsePriceCents,
  priceInputValue,
  slugFromName,
  slugProblem,
  toVideoMenuData,
} from "../src/lib/video-menus/rules.ts";

describe("prices", () => {
  it("reads euros typed the Portuguese way or not", () => {
    const cases = {
      "4,50": 450,
      "4,5": 450,
      "4.50": 450,
      "4.5": 450,
      "4": 400,
      "0": 0,
      "4,50 €": 450,
      "€ 12": 1200,
      "12 EUR": 1200,
      "1.250,00": 125000,
      "1,250.00": 125000,
      "1.250": 125000,
      "1 250,5": 125050,
      "10000": 1000000,
    };
    for (const [text, cents] of Object.entries(cases)) assert.equal(parsePriceCents(text), cents, text);
  });

  it("refuses what isn't a price", () => {
    for (const text of ["", "abc", "-3", "4,555", "4,5,0", "1.25.0", "10000,01", "4 50x", ","]) {
      assert.equal(parsePriceCents(text), null, text);
    }
  });

  it("writes prices in pt-PT", () => {
    assert.equal(formatPriceCents(450).replace(/\s/g, " "), "4,50 €");
    assert.equal(formatPriceCents(125000).replace(/\s/g, " "), "1250,00 €");
    assert.equal(priceInputValue(450), "4,50");
    assert.equal(priceInputValue(1200), "12,00");
    assert.equal(parsePriceCents(priceInputValue(1590)), 1590);
  });
});

describe("slugs", () => {
  it("suggests the address from the name", () => {
    assert.equal(slugFromName("Dolci e Salati"), "dolci-e-salati");
    assert.equal(slugFromName("  Café do Zé & Filhos!  "), "cafe-do-ze-filhos");
    assert.equal(slugFromName("Pão Quente — Açaí"), "pao-quente-acai");
    assert.equal(slugFromName("a".repeat(80)).length, 60);
  });

  it("says why an address can't be used", () => {
    assert.equal(slugProblem("dolci-e-salati"), null);
    assert.equal(slugProblem("raza17raza"), null);
    assert.match(slugProblem(""), /Indique/);
    assert.match(slugProblem("a"), /2 caracteres/);
    assert.match(slugProblem("a".repeat(61)), /60/);
    for (const slug of ["Café", "-cafe", "cafe-", "ca--fe", "ca fe", "ca_fe"]) assert.ok(slugProblem(slug), slug);
  });

  it("keeps the demo at its old address", () => {
    assert.equal(menuPublicPath("raza17raza"), "/raza17raza");
    assert.equal(menuPublicPath("cafe-central"), "/menu/cafe-central");
    assert.deepEqual(menuPaths("raza17raza"), ["/raza17raza", "/menu/raza17raza"]);
    assert.deepEqual(menuPaths("cafe-central"), ["/menu/cafe-central"]);
  });
});

describe("instagram and logo", () => {
  it("takes the handle from a handle or a link", () => {
    assert.equal(parseInstagram(""), null);
    assert.equal(parseInstagram("@dolciesalati.ap"), "dolciesalati.ap");
    assert.equal(parseInstagram("https://www.instagram.com/dolciesalati.ap/?igsh=abc"), "dolciesalati.ap");
    assert.equal(parseInstagram("instagram.com/cafe_central"), "cafe_central");
    assert.equal(parseInstagram("café central"), undefined);
  });

  it("accepts site paths and https links only", () => {
    assert.ok(isLogoUrl("/media/clients/dolci-e-salati-logo.png"));
    assert.ok(isLogoUrl("https://example.supabase.co/storage/v1/object/public/menu-logos/a/b.png"));
    for (const url of ["http://example.com/a.png", "//evil.com/a.png", "javascript:alert(1)", "data:image/png;base64,AA", "logo.png"]) assert.equal(isLogoUrl(url), false, url);
  });

  it("draws the initials when there's no logo", () => {
    const logo = initialsLogo("Café Central");
    assert.match(logo, /^data:image\/svg\+xml,/);
    assert.match(decodeURIComponent(logo), />CC</);
  });
});

describe("toVideoMenuData", () => {
  const menu = { business_name: "Café Central", logo_url: null, instagram: "cafecentral" };
  const dish = (id, position) => ({ id, menu_id: "m", video_id: null, bunny_video_id: `bunny-${id}`, name: `Prato ${id}`, description: "", price_cents: 450 + position, position });
  const dishes = [dish("b", 1), dish("a", 0), dish("c", 2)];

  it("puts the default collection first, drops empty ones and keeps each one's order", () => {
    const collections = [
      { id: "c1", menu_id: "m", name: "Bebidas", position: 0, is_default: false },
      { id: "c2", menu_id: "m", name: "Brunch", position: 1, is_default: true },
      { id: "c3", menu_id: "m", name: "Vazia", position: 2, is_default: false },
    ];
    const links = [
      { collection_id: "c1", dish_id: "c", position: 1 },
      { collection_id: "c1", dish_id: "a", position: 0 },
      { collection_id: "c2", dish_id: "b", position: 0 },
      { collection_id: "c2", dish_id: "gone", position: 1 },
    ];
    const data = toVideoMenuData(menu, dishes, collections, links);
    assert.deepEqual(Object.keys(data.dishes), ["a", "b", "c"]);
    assert.equal(data.dishes.a.price, 4.5);
    assert.deepEqual(
      data.collections.map((collection) => [collection.name, collection.dishes]),
      [
        ["Brunch", ["b"]],
        ["Bebidas", ["a", "c"]],
      ],
    );
    assert.match(data.logo, /^data:image\/svg\+xml,/);
    assert.equal(data.instagram, "cafecentral");
  });

  it("shows every dish in «Todos» when no collection has any, and nothing without dishes", () => {
    const data = toVideoMenuData(menu, dishes, [], []);
    assert.deepEqual(data.collections, [{ id: "todos", name: "Todos", dishes: ["a", "b", "c"] }]);
    assert.equal(toVideoMenuData(menu, [], [], []), null);
  });

  it("shows only dishes with their own (Bunny) video: none with a YouTube video only, none without a video yet", () => {
    const own = { ...dish("d", 3), bunny_video_id: "66f1c8d2-bfc3-4bfa-a6c1-58e844e3ffde", bunny_thumbnail: "thumb_540.jpg" };
    const youTube = { ...dish("e", 4), video_id: "tzQOn3mU7EA", bunny_video_id: null };
    const none = { ...dish("f", 5), bunny_video_id: null };
    const links = ["d", "e", "f"].map((dish_id, position) => ({ collection_id: "c1", dish_id, position }));
    const data = toVideoMenuData(menu, [...dishes, own, youTube, none], [{ id: "c1", menu_id: "m", name: "Doces", position: 0, is_default: true }], links);
    assert.deepEqual(data.dishes.d, { bunny: own.bunny_video_id, bunnyThumbnail: "thumb_540.jpg", name: "Prato d", description: "", price: 4.53 });
    assert.equal(data.dishes.e, undefined);
    assert.equal(data.dishes.f, undefined);
    assert.deepEqual(data.collections[0].dishes, ["d"]);
    assert.equal(toVideoMenuData(menu, [youTube, none], [], []), null);
  });
});

describe("moveItem", () => {
  it("swaps with the neighbour and stops at the ends", () => {
    assert.deepEqual(moveItem(["a", "b", "c"], 1, -1), ["b", "a", "c"]);
    assert.deepEqual(moveItem(["a", "b", "c"], 1, 1), ["a", "c", "b"]);
    assert.deepEqual(moveItem(["a", "b", "c"], 0, -1), ["a", "b", "c"]);
    assert.deepEqual(moveItem(["a", "b", "c"], 2, 1), ["a", "b", "c"]);
  });
});

describe("video menus: old Bunny videos are deleted a day later", async () => {
  const { bunnyDeletionDue, bunnyDeletionGraceHours, bunnyDeletionSearch, bunnyDeletionTitle } = await import("../src/lib/video-menus/bunny-cleanup-rules.ts");
  it("marks a video with the moment it may go, and finds it only after that", () => {
    const now = new Date("2026-10-19T12:00:00Z");
    const title = bunnyDeletionTitle(new Date(now.getTime() + bunnyDeletionGraceHours * 3_600_000));
    assert.ok(title.includes(bunnyDeletionSearch));
    assert.equal(bunnyDeletionDue(title, now), false);
    assert.equal(bunnyDeletionDue(title, new Date("2026-10-20T11:59:59Z")), false);
    assert.equal(bunnyDeletionDue(title, new Date("2026-10-20T12:00:00Z")), true);
  });
  it("never deletes a video with any other title", () => {
    const later = new Date("2030-01-01T00:00:00Z");
    for (const title of [undefined, null, "", "Trattoria da Nonna · Pizza", "steevanz: apagar depois de amanhã"]) assert.equal(bunnyDeletionDue(title, later), false);
  });
});
