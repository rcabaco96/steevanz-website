import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { demoMenu } from "../src/content/demo-menu.ts";
import {
  formatPriceCents,
  initialsLogo,
  isLogoUrl,
  menuPaths,
  menuPublicPath,
  moveItem,
  parseInstagram,
  parsePriceCents,
  parseYouTubeId,
  priceInputValue,
  slugFromName,
  slugProblem,
  toVideoMenuData,
  youTubeThumbnail,
} from "../src/lib/video-menus/rules.ts";

describe("parseYouTubeId", () => {
  const id = "tzQOn3mU7EA";

  it("takes the id from every link format", () => {
    for (const link of [
      `https://www.youtube.com/shorts/${id}`,
      `https://youtube.com/shorts/${id}?si=abc123`,
      `youtube.com/shorts/${id}`,
      `https://m.youtube.com/shorts/${id}/`,
      `https://www.youtube.com/watch?v=${id}`,
      `https://www.youtube.com/watch?feature=share&v=${id}&t=10s`,
      `https://youtu.be/${id}`,
      `https://youtu.be/${id}?si=xyz`,
      `https://www.youtube.com/embed/${id}?rel=0`,
      `https://www.youtube-nocookie.com/embed/${id}`,
      `https://www.youtube.com/live/${id}`,
      `  ${id}  `,
    ]) {
      assert.equal(parseYouTubeId(link), id, link);
    }
  });

  it("refuses what isn't a YouTube video", () => {
    for (const text of ["", "hello", "tzQOn3mU7E", "tzQOn3mU7EAx", "https://vimeo.com/shorts/tzQOn3mU7EA", "https://www.youtube.com/@channel", "https://www.youtube.com/watch?v=short", "https://www.instagram.com/reel/abc/"]) {
      assert.equal(parseYouTubeId(text), null, text);
    }
  });

  it("gives the thumbnail from YouTube's image servers", () => {
    assert.equal(youTubeThumbnail(id), `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  });
});

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
  const dish = (id, position) => ({ id, menu_id: "m", video_id: `video${id.padStart(6, "0")}`, name: `Prato ${id}`, description: "", price_cents: 450 + position, position });
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

  it("shows a dish with only its own (Bunny) video and leaves out one with no video yet", () => {
    const own = { ...dish("d", 3), video_id: null, bunny_video_id: "66f1c8d2-bfc3-4bfa-a6c1-58e844e3ffde" };
    const none = { ...dish("e", 4), video_id: null };
    const links = [
      { collection_id: "c1", dish_id: "d", position: 0 },
      { collection_id: "c1", dish_id: "e", position: 1 },
    ];
    const data = toVideoMenuData(menu, [...dishes, own, none], [{ id: "c1", menu_id: "m", name: "Doces", position: 0, is_default: true }], links);
    assert.deepEqual(data.dishes.d, { bunny: own.bunny_video_id, name: "Prato d", description: "", price: 4.53 });
    assert.equal(data.dishes.e, undefined);
    assert.deepEqual(data.collections[0].dishes, ["d"]);
    assert.equal(toVideoMenuData(menu, [none], [], []), null);
  });

  it("rebuilds the static demo exactly from rows seeded like the migration", () => {
    const keys = Object.keys(demoMenu.dishes);
    const dishRows = keys.map((key, position) => {
      const item = demoMenu.dishes[key];
      return { id: key, menu_id: "m", video_id: item.video, name: item.name, description: item.description, price_cents: Math.round(item.price * 100), position };
    });
    const collectionRows = demoMenu.collections.map((collection, position) => ({ id: collection.id, menu_id: "m", name: collection.name, position, is_default: position === 0 }));
    const linkRows = demoMenu.collections.flatMap((collection) => collection.dishes.map((dish_id, position) => ({ collection_id: collection.id, dish_id, position })));
    const data = toVideoMenuData({ business_name: demoMenu.business, logo_url: demoMenu.logo, instagram: demoMenu.instagram }, dishRows, collectionRows, linkRows);
    assert.deepEqual(data, demoMenu);
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
