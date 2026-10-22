import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { businessCardBandCopy, goals, guideBandCopy, heroReelCopy, homeAdBands, howCopy, loyaltyCopy, novoCopy, platesCopy } from "../src/content/novo-home.ts";
import { clientLogos } from "../src/content/client-logos.ts";
import { productAds } from "../src/content/product-ads.ts";
import { getProduct } from "../src/content/products.ts";

// The home page, «/» (pt) and «/en» (en): routes, components and content.
const dir = "src/components/novo";
const pageFiles = [
  "src/app/(pt)/page.tsx",
  "src/app/(intl)/[lang]/page.tsx",
  "src/content/novo-home.ts",
  ...readdirSync(dir)
    .filter((name) => /\.(tsx?|css)$/.test(name))
    .map((name) => join(dir, name)),
].map((path) => ({ path, text: readFileSync(path, "utf8") }));

describe("home page («/» and «/en»)", () => {
  it("has the four steps of «Como trabalhamos», in order", () => {
    assert.deepEqual(
      howCopy.pt.steps.map((step) => step.title),
      ["Queixe-se", "Oiça soluções", "Escolha a sua", "Nós tratamos do resto"],
    );
    assert.equal(howCopy.en.steps.length, 4);
  });

  it("keeps the brand line as the two sentences", () => {
    assert.deepEqual([...novoCopy.pt.brandLine], ["Tecnologia do futuro.", "Com os bons modos de antigamente."]);
    assert.deepEqual([...novoCopy.en.brandLine], ["Technology of the future.", "With good old-fashioned manners."]);
    for (const { path, text } of pageFiles) {
      const line = (text.match(/bons modos de antigamente/gi) ?? []).length;
      const future = (text.match(/Tecnologia do futuro/g) ?? []).length;
      assert.ok(line <= future, `${path}: «bons modos de antigamente» without «Tecnologia do futuro.»`);
    }
  });

  it("no longer has «Um dia no seu negócio», the phone hero or the brand film", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /Um dia no seu negócio|DayJourney|BrandVideo|heroClips/, path);
    }
    assert.equal(existsSync("src/app/(pt)/novo"), false, "/novo redirects to «/» from next.config.ts");
  });

  it("never uses forbidden words, invented ratings or VAT maths", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /de sempre/i, path);
      assert.doesNotMatch(text, /★|\d[.,]\d\s*estrelas/i, path);
      assert.doesNotMatch(text, /com IVA|IVA \(\d|IVA incluído|incl\.? VAT|including VAT|VAT included/i, path);
    }
  });

  it("reads the plates price from products.ts and shows it «+ IVA»", () => {
    const banner = readFileSync(join(dir, "PlatesBanner.tsx"), "utf8");
    assert.match(banner, /getProduct\("google-review-plates"\)/);
    assert.doesNotMatch(banner, /\b(29|25|23|20)\s*€/);
    assert.equal(platesCopy.pt.vat, "+ IVA");
    assert.equal(platesCopy.en.vat, "+ VAT");
    assert.equal(loyaltyCopy.en.vat, "+ VAT");
    assert.equal(novoCopy.en.showcase.vat, "+ VAT");
    assert.doesNotMatch(JSON.stringify(platesCopy), /\d\s*€|€\s*\d/);
  });

  it("shows the Menu digital ad (web version and poster in public/) and the old hero's plate scene", () => {
    for (const ad of Object.values(productAds)) for (const file of [ad.src, ad.poster]) assert.ok(existsSync(join("public", file)), file);
    assert.match(readFileSync(join(dir, "MenuShowcase.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync(join(dir, "LoyaltyBanner.tsx"), "utf8"), /<AdVideo/);
    assert.match(readFileSync(join(dir, "AdBand.tsx"), "utf8"), /<AdVideo/);
    for (const id of ["digital-menu", "loyalty", "guest-guide", "business-card", "keychain", "waitlist", "bookings", "ai-chatbot"]) assert.ok(productAds[id], id);
    assert.match(readFileSync("src/components/pages/ProductPage.tsx", "utf8"), /<AdVideo/);
    assert.match(readFileSync("src/components/media/AdVideo.tsx", "utf8"), /preload="none"/);
    assert.match(readFileSync(join(dir, "PlatesBanner.tsx"), "utf8"), /<HeroTapScene/);
  });

  it("shows the waitlist and bookings prices as final, no longer «Preço indicativo» (owner, 2026-10-21)", () => {
    for (const id of ["waitlist", "bookings"]) assert.equal(getProduct(id).priceIsProvisional, false, id);
    assert.equal(getProduct("waitlist").priceFrom, 19);
    assert.equal(getProduct("bookings").priceFrom, 29);
  });

  it("has no Dolci e Salati case section and no «fidelização» in the loyalty band", () => {
    for (const { path, text } of pageFiles) assert.doesNotMatch(text, /novo-case|copy\.dolci/, path);
    assert.doesNotMatch(JSON.stringify(loyaltyCopy), /fideliza|\d\s*€|€\s*\d/i);
    for (const { copy } of homeAdBands) assert.doesNotMatch(JSON.stringify(copy), /fideliza|\d\s*€|€\s*\d/i);
  });

  it("never shows a «published» toast in the plate scenes (the stars on the form fill: owner, 2026-10-20)", () => {
    for (const name of ["HeroTapScene", "ReviewTapScene"]) {
      const tsx = readFileSync(`src/components/visuals/${name}.tsx`, "utf8");
      const css = readFileSync(`src/components/visuals/${name}.module.css`, "utf8");
      assert.doesNotMatch(tsx, /toast/, name);
      assert.doesNotMatch(css, /\.toast/, name);
    }
  });

  it("has no prices or FAQ section, and no FAQ structured data", () => {
    const home = readFileSync(join(dir, "NovoHome.tsx"), "utf8");
    assert.doesNotMatch(home, /PricesFaq|novo-prices/);
    for (const page of ["src/app/(pt)/page.tsx", "src/app/(intl)/[lang]/page.tsx"]) assert.doesNotMatch(readFileSync(page, "utf8"), /faqJsonLd/);
    // Section order: the hero, clients, Menu digital, loyalty card, the bands with an ad video (homeAdBands), the plates right
    // after the last section with a video (owner, 2026-10-22), then the goals, below every band with a video (owner rule),
    // sectors, how we work, final call.
    const order = ["<Hero ", "<ClientStrip", 'id="novo-menu"', "<LoyaltyBanner", "{homeAdBands", "<AdBand", "<PlatesBanner", 'id="novo-goals"', "<SectorSolutions", "<HowWeWork", 'id="novo-final"'];
    const positions = order.map((needle) => home.indexOf(needle));
    assert.ok(positions.every((pos) => pos > 0), JSON.stringify(positions));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
    assert.equal((home.match(/<AdBand\b/g) ?? []).length, 1, "every ad band comes from homeAdBands");
    // The bands with an ad, in order (a band shows only when its product has an ad in product-ads.ts).
    assert.deepEqual(
      homeAdBands.map((band) => band.productId),
      ["guest-guide", "business-card", "keychain", "waitlist", "bookings", "ai-chatbot"],
    );
    const shown = homeAdBands.filter((band) => productAds[band.productId]).map((band) => band.productId);
    assert.deepEqual(shown, ["guest-guide", "business-card", "keychain", "waitlist", "bookings", "ai-chatbot"]);
    assert.equal(new Set(homeAdBands.map((band) => band.headingId)).size, homeAdBands.length, "unique heading ids");
    assert.match(home, /tone=\{index % 2 === 0 \? "gold" : "rose"\}/);
    assert.match(home, /media=\{index % 2 === 0 \? "left" : "right"\}/);
  });

  it("is the same page at «/en», «/es», «/fr», «/de» and «/it», and the old home is gone (owner, 2026-10-20)", () => {
    const intl = readFileSync("src/app/(intl)/[lang]/page.tsx", "utf8");
    assert.match(intl, /<NovoHome locale=\{locale\}/);
    assert.match(intl, /novoHomeMetadata\(await localeOf\(params\)\)/);
    assert.match(intl, /websiteJsonLd\(locale\)/);
    assert.match(readFileSync("src/app/(pt)/page.tsx", "utf8"), /<NovoHome locale="pt"/);
    for (const old of ["src/components/pages/HomePage.tsx", "src/content/home.ts", "src/components/marketing/Marquee.tsx"]) {
      assert.equal(existsSync(old), false, old);
    }
    for (const locale of ["en", "es", "fr", "de", "it"]) {
      assert.equal(goals[locale].length, goals.pt.length, locale);
      assert.deepEqual(goals[locale].map((goal) => goal.id), goals.pt.map((goal) => goal.id), locale);
      const ids = (list) => list.map((goal) => goal.products.map((product) => product.id));
      assert.deepEqual(ids(goals[locale]), ids(goals.pt), locale);
    }
    // Owner, 2026-10-20: the online shop belongs only to «Vender mais».
    const withShop = goals.pt.filter((goal) => goal.products.some((product) => product.id === "online-shop")).map((goal) => goal.id);
    assert.deepEqual(withShop, ["sell"]);
  });

  it("has the slogan «encontram, compram e voltam» in the title and the hero", () => {
    assert.equal(novoCopy.pt.hero.titleAccent, "encontram, compram e voltam.");
    assert.match(novoCopy.pt.metaTitle, /encontram, compram e voltam/);
    assert.match(novoCopy.en.metaTitle, /find you, buy from you and come back/);
    for (const { path, text } of pageFiles) assert.doesNotMatch(text, /escolhem e voltam/, path);
  });

  it("has the hero chosen on 2026-10-22: real businesses in loops, phone order title → strips → buttons, in six languages", () => {
    const hero = readFileSync(join(dir, "Hero.tsx"), "utf8");
    const css = readFileSync(join(dir, "hero.module.css"), "utf8");
    const reel = readFileSync(join(dir, "HeroReel.tsx"), "utf8");
    // Mobile order (owner rule): heading and intro, then the footage, then the buttons, then the brand line and «S.».
    const order = ['id="novo-hero-title"', "copy.hero.subtitle", "<HeroReel", "copy.hero.primary", "copy.hero.secondary", "markS", "copy.brandLine[0]"];
    const positions = order.map((needle) => hero.indexOf(needle));
    assert.ok(positions.every((pos) => pos > 0), JSON.stringify(positions));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
    assert.match(hero, /data-hero-dark/);
    // The phone strips zig-zag: the middle one has its image on the right and its card on the left.
    assert.match(css, /\.shot1 \.media \{\s*left: auto;\s*right: 0;/);
    assert.match(css, /\.shot1 \.chip \{\s*right: auto;\s*left: 2\.5cqi;/);
    // Decorative footage: hidden from screen readers, no sound, nothing loaded before the page is idle, posters only
    // with reduced motion or Save-Data, paused off screen.
    assert.match(reel, /aria-hidden="true"/);
    assert.match(hero, /preload="none"/);
    assert.match(hero, /\bmuted\b/);
    assert.match(reel, /prefers-reduced-motion: reduce/);
    assert.match(reel, /saveData/);
    assert.match(reel, /requestIdleCallback/);
    assert.match(reel, /IntersectionObserver/);
    assert.match(css, /@media \(prefers-reduced-motion: no-preference\)/);
    // Small loops and posters in public/home/hero, with their licences recorded.
    const licences = readFileSync("public/home/LICENCAS.txt", "utf8");
    for (const id of ["restaurante", "cabeleireiro-alojamento", "clinica"]) {
      for (const variant of ["col", "strip"]) {
        const video = `public/home/hero/${id}-${variant}.mp4`;
        assert.ok(existsSync(video), video);
        assert.ok(statSync(video).size <= 600 * 1024, `${video} is over 600 KB`);
        assert.ok(existsSync(`public/home/hero/${id}-${variant}.webp`), `${id}-${variant}.webp`);
        assert.ok(hero.includes(`-${variant}.mp4`), `the ${variant} loops in Hero.tsx`);
      }
      assert.ok(licences.includes(`- ${id}-*`), `${id} in LICENCAS.txt`);
    }
    // The cards in the six languages, the same fictional businesses, no prices, no «NFC», no «fidelização», and
    // the review card is only the form (no reviewer, count or average).
    const locales = ["pt", "en", "es", "fr", "de", "it"];
    assert.deepEqual(Object.keys(heroReelCopy), locales);
    for (const locale of locales) {
      const copy = heroReelCopy[locale];
      // Three sectors, each with its two names (owner, 2026-10-22).
      assert.equal(copy.places.length, 3, locale);
      for (const place of copy.places) assert.equal(place.length, 2, locale);
      assert.equal(copy.review.business, "Café da Praça", locale);
      assert.equal(copy.booking.business, "Salão Flor de Lis", locale);
      assert.equal(copy.guide.business, "Casa das Ondas", locale);
      assert.equal(copy.clinic.business, "Clínica Sorriso Atlântico", locale);
      assert.deepEqual(Object.keys(copy), Object.keys(heroReelCopy.pt), locale);
      for (const key of Object.keys(copy)) assert.deepEqual(Object.keys(copy[key]), Object.keys(heroReelCopy.pt[key]), `${locale}.${key}`);
      const text = JSON.stringify(copy);
      assert.doesNotMatch(text, /€|\bEUR\b|\bNFC\b|fideliza|★|\d[.,]\d|avalia(ç|c)ões|\breviews\b/i, locale);
      // The guest guide shows the Wi-Fi and the times, never a door or key-box code.
      assert.doesNotMatch(JSON.stringify(copy.guide), /c[oó]dig|\bcode\b|\bcodice\b|\bCode\b|PIN|cofre|key ?box/i, locale);
    }
    assert.deepEqual(heroReelCopy.pt.places, [["Café", "Restaurante"], ["Cabeleireiros", "Alojamento local"], ["Clínicas", "Consultórios"]]);
    assert.equal(heroReelCopy.it.booking.kicker, "Prenoti un servizio");
    // The salon | rental loop swaps its cards with the scene on screen; without video the salon's card shows.
    assert.match(hero, /data-scene-b=/);
    assert.match(reel, /dataset\.scene/);
    assert.match(css, /\.reel\[data-scene="b"\] \.sceneOnly/);
    // No Menu digital card in the salon | rental column: the menu dish belongs to the café | restaurant moment.
    assert.match(hero, /cardMenu\} \$\{h\.moment0b\}/);
    assert.doesNotMatch(hero, /cardMenu\} \$\{h\.moment1\}/);
  });

  it("sends every product call to its product page with «Conhecer …», never straight to a demo", () => {
    for (const { path, text } of pageFiles) {
      assert.doesNotMatch(text, /\/menu\/|demoMenuHref|Ver um menu|alojamento-template/, path);
    }
    assert.match(novoCopy.pt.showcase.cta, /^Conhecer /);
    assert.match(platesCopy.pt.cta, /^Conhecer /);
    assert.match(loyaltyCopy.pt.cta, /^Conhecer /);
    assert.equal(guideBandCopy.pt.cta, "Conhecer o guia");
    assert.equal(businessCardBandCopy.pt.cta, "Conhecer os cartões");
    for (const { copy } of homeAdBands) {
      assert.match(copy.pt.cta, /^Conhecer /);
      assert.match(copy.en.cta, /^Discover /);
      assert.match(copy.it.cta, /^Scopra /);
      assert.equal(copy.en.vat, "+ VAT");
      assert.equal(copy.de.vat, "zzgl. MwSt.");
    }
    for (const cta of [novoCopy.en.showcase.cta, platesCopy.en.cta, loyaltyCopy.en.cta]) assert.match(cta, /^Discover /);
    assert.doesNotMatch(readFileSync("src/components/pages/SectorPage.tsx", "utf8"), /SectorExamples|alojamento-template/);
    assert.doesNotMatch(readFileSync("src/content/sectors.ts", "utf8"), /alojamento-template|examples:/);
  });

  it("gives every product page «Agendar demonstração» in the hero and at the end", () => {
    const page = readFileSync("src/components/pages/ProductPage.tsx", "utf8");
    assert.ok((page.match(/t\.common\.bookDemo/g) ?? []).length >= 3);
    assert.match(page, /<CtaBand[\s\S]*primaryLabel=\{t\.common\.bookDemo\}/);
  });

  it("opens the plates ad in a window from a «Ver o vídeo (27 s)» button, loading nothing before the tap (owner, 2026-10-22)", () => {
    const banner = readFileSync(join(dir, "PlatesBanner.tsx"), "utf8");
    assert.match(banner, /<AdVideoModalButton locale=\{locale\} productId=\{product\.id\} label=\{copy\.video\} \/>/);
    assert.deepEqual(
      Object.values(platesCopy).map((copy) => copy.video),
      ["Ver o vídeo", "Watch the video", "Ver el vídeo", "Voir la vidéo", "Video ansehen", "Guardi il video"],
    );
    const dialog = readFileSync("src/components/media/AdVideoDialog.tsx", "utf8");
    const video = dialog.match(/<video\s+ref=[\s\S]*?\/>/)?.[0] ?? "";
    assert.ok(video, "the window has a <video>");
    assert.doesNotMatch(video, /\b(src|poster|autoPlay)=/, "no source, poster or autoplay before the button is pressed");
    assert.match(video, /preload="none"/);
    assert.match(dialog, /<dialog/);
    assert.match(dialog, /showModal\(\)/);
    assert.match(dialog, /aria-label=\{copy\.close\}/);
    assert.match(dialog, /removeAttribute\("src"\)/, "closing drops the source");
    // Every ad's length, as written in product-ads.ts, matches its file (the mp4 «mvhd» box).
    for (const [id, ad] of Object.entries(productAds)) {
      const file = readFileSync(join("public", ad.src));
      const at = file.indexOf("mvhd");
      const v1 = file[at + 4] === 1;
      const scale = file.readUInt32BE(at + (v1 ? 24 : 16));
      const length = v1 ? Number(file.readBigUInt64BE(at + 28)) : file.readUInt32BE(at + 20);
      assert.equal(ad.seconds, Math.round(length / scale), id);
    }
    assert.equal(productAds["google-review-plates"].seconds, 27);
  });

  it("shows the clients as a band with an endless logo carousel, readable once, still under reduced motion (owner, 2026-10-22)", () => {
    // Eyebrow, title (the accent in italic) and one line in six languages; truthful: «2021» is the About page's date.
    for (const copy of Object.values(novoCopy)) {
      for (const key of ["eyebrow", "titleStart", "titleAccent", "lead"]) assert.ok(copy.clients[key], key);
      assert.match(copy.clients.lead, /2021/);
    }
    assert.equal(novoCopy.pt.clients.titleStart + " " + novoCopy.pt.clients.titleAccent, "Grandes marcas e negócios locais confiam em nós.");
    // The big three first; adding a client is one line in client-logos.ts.
    assert.deepEqual(clientLogos.slice(0, 3).map((logo) => logo.id), ["sporting", "bmw", "credito-agricola"]);
    for (const logo of clientLogos) assert.ok(existsSync(join("public", logo.src)), logo.src);
    const strip = readFileSync(join(dir, "ClientStrip.tsx"), "utf8");
    assert.match(strip, /hidden=\{copyIndex > 0\}/, "only the first copy is read");
    assert.match(strip, /aria-hidden=\{hidden \|\| undefined\}/);
    assert.match(strip, /alt=\{hidden \? "" : logo\.name\}/);
    assert.doesNotMatch(strip, /MarqueePause|pauseLabel/, "no pause button on carousels (owner)");
    const css = readFileSync(join(dir, "novo.module.css"), "utf8");
    assert.match(css, /\.marquee:hover \.marqueeRow \{\s*animation-play-state: paused;/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.marqueeGroup\[aria-hidden\] \{\s*display: none;/);
  });
});
