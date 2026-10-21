import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { adTabsLabel, homeAdVideo, productAds } from "../src/content/product-ads.ts";

// Products with more than one ad video (content/product-ads.ts, `variants`): tabs on the product page
// (components/media/AdVideoTabs), one variant on the home band (owner, 2026-10-22, the online bookings).
const locales = ["pt", "en", "es", "fr", "de", "it"];

function seconds(path) {
  const file = readFileSync(join("public", path));
  const at = file.indexOf("mvhd");
  const v1 = file[at + 4] === 1;
  const scale = file.readUInt32BE(at + (v1 ? 24 : 16));
  const length = v1 ? Number(file.readBigUInt64BE(at + 28)) : file.readUInt32BE(at + 20);
  return Math.round(length / scale);
}

describe("product ads with tabs", () => {
  it("gives the bookings two videos, «Restaurante» first and «Cabeleireiro», with tabs in 6 languages", () => {
    const ad = productAds.bookings;
    assert.deepEqual(
      ad.variants.map((variant) => variant.id),
      ["restaurant", "salon"],
    );
    assert.deepEqual(
      ad.variants.map((variant) => locales.map((locale) => variant.tab[locale])),
      [
        ["Restaurante", "Restaurant", "Restaurante", "Restaurant", "Restaurant", "Ristorante"],
        ["Cabeleireiro", "Hair salon", "Peluquería", "Salon de coiffure", "Friseursalon", "Parrucchiere"],
      ],
    );
    assert.deepEqual(
      ad.variants.map((variant) => variant.src),
      ["/home/reservas-anuncio-720.mp4", "/home/reservas-cabeleireiro-anuncio-720.mp4"],
    );
    for (const variant of ad.variants) {
      for (const file of [variant.src, variant.poster]) assert.ok(existsSync(join("public", file)), file);
      for (const locale of locales) assert.ok(variant.label[locale]?.length > 40, `${variant.id} ${locale}`);
      if ("seconds" in variant) assert.equal(variant.seconds, seconds(variant.src), variant.id);
    }
    assert.match(ad.variants[1].label.pt, /cabeleireir/);
    assert.match(ad.variants[1].label.pt, /Corte \+ brushing/);
    // The ad's own video (everything that shows a single one) is the first tab's.
    assert.equal(ad.src, ad.variants[0].src);
    assert.equal(ad.poster, ad.variants[0].poster);
    for (const locale of locales) assert.ok(adTabsLabel[locale], locale);
  });

  it("shows the hair salon on the home band and leaves the single-ad products as they were", () => {
    assert.equal(homeAdVideo(productAds.bookings).src, "/home/reservas-cabeleireiro-anuncio-720.mp4");
    for (const [id, ad] of Object.entries(productAds)) {
      if (id === "bookings") continue;
      assert.equal(ad.variants, undefined, id);
      assert.equal(homeAdVideo(ad), ad, id);
    }
    const band = readFileSync("src/components/novo/AdBand.tsx", "utf8");
    assert.match(band, /homeAdVideo\(productAds\[productId\]!\)/);
    assert.match(licences(), /reservas-cabeleireiro-anuncio-720 \(\.mp4 e \.jpg\)[\s\S]*Reservas Online Cabeleireiro\.mp4[\s\S]*Marcação em 30 segundos\./);
  });

  it("renders accessible tabs with only the active video on the product page", () => {
    const tabs = readFileSync("src/components/media/AdVideoTabs.tsx", "utf8");
    assert.match(tabs, /role="tablist"/);
    assert.match(tabs, /role="tab"/);
    assert.match(tabs, /role="tabpanel"/);
    assert.match(tabs, /aria-selected=\{selected\}/);
    assert.match(tabs, /ArrowRight/);
    assert.match(tabs, /ArrowLeft/);
    // One <AdVideo>, keyed by the active variant: the others are never rendered, so never downloaded.
    assert.equal((tabs.match(/<AdVideo\b/g) ?? []).length, 1);
    assert.match(tabs, /<AdVideo key=\{current\.id\}/);
    assert.match(tabs, /removeAttribute\("src"\)/, "switching drops the previous video's source");
    const page = readFileSync("src/components/pages/ProductPage.tsx", "utf8");
    assert.match(page, /<AdVideoTabs/);
  });
});

function licences() {
  return readFileSync("public/home/LICENCAS.txt", "utf8");
}
