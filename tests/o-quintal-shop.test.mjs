import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { clientSites, domainSegment, routeClientSite } from "../src/lib/client-sites.ts";
import {
  findOQuintalProduct,
  formatEuros,
  oQuintalCategories,
  oQuintalFromPrice,
  oQuintalProducts,
  oQuintalUnitPrice,
} from "../src/content/o-quintal/products.ts";
import { oQuintal } from "../src/content/o-quintal/facts.ts";
import {
  oQuintalCategoryIds,
  oQuintalDomainSegment,
  oQuintalHref,
  oQuintalSitemapEntries,
  oQuintalStaticParams,
  resolveOQuintalPath,
} from "../src/content/o-quintal/routes.ts";
import { addToCart, cartSubtotal, sanitizeCart } from "../src/lib/o-quintal/cart.ts";
import {
  buildCheckoutSessionParams,
  createCheckoutSession,
  orderEmailText,
  parseCheckoutRequest,
  priceOrder,
  stripeKeyAllowed,
  verifyStripeSignature,
} from "../src/lib/o-quintal/checkout.ts";

// Fixtures here are minimal and never rendered: no reviews, no real customers.

function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...filesUnder(path));
    else if (/\.(tsx?|css)$/.test(name)) out.push(path);
  }
  return out;
}

const ids = oQuintalProducts.map((item) => item.id);
const exists = (id) => ids.includes(id);

describe("O Quintal: catalogue integrity (src/content/o-quintal/products.ts)", () => {
  it("has unique, URL-safe ids that point back to o-quintal.com", () => {
    assert.equal(new Set(ids).size, ids.length);
    for (const item of oQuintalProducts) {
      assert.match(item.id, /^[a-z0-9-]+$/, item.id);
      assert.equal(item.sourceUrl, `https://www.o-quintal.com/${item.id}`);
      if (item.sourceImage) assert.match(item.sourceImage, /^https:\/\/cdnx\.jumpseller\.com\/oquintal\/image\//);
    }
  });

  it("uses only known categories, and every category has products", () => {
    const known = oQuintalCategories.map((entry) => entry.id);
    assert.deepEqual([...known].sort(), [...oQuintalCategoryIds].sort());
    for (const item of oQuintalProducts) assert.ok(known.includes(item.category), item.id);
    for (const category of known) assert.ok(oQuintalProducts.some((item) => item.category === category), category);
  });

  it("stores prices as whole, positive cents or null, with a note for the owner when null", () => {
    for (const item of oQuintalProducts) {
      if (item.priceCents === null) assert.ok(item.priceNote, `${item.id} has no price and no note`);
      else assert.ok(Number.isInteger(item.priceCents) && item.priceCents > 0, item.id);
      for (const choice of item.option?.choices ?? []) {
        if (choice.priceCents !== undefined && choice.priceCents !== null) assert.ok(Number.isInteger(choice.priceCents) && choice.priceCents > 0, `${item.id}/${choice.id}`);
      }
      if (item.option) assert.equal(new Set(item.option.choices.map((c) => c.id)).size, item.option.choices.length, item.id);
    }
  });

  it("keeps the prices read from o-quintal.com (spot checks)", () => {
    assert.equal(findOQuintalProduct("banana").priceCents, 149);
    assert.equal(findOQuintalProduct("tamara-medjool").priceCents, 1650);
    assert.equal(findOQuintalProduct("caixa-5-duzias-ovos").priceCents, 1500);
    assert.equal(findOQuintalProduct("3-kg-pera-rocha-oeste").priceCents, 500);
    assert.equal(findOQuintalProduct("pera-abacate").priceCents, null);
  });

  it("formats euros the Portuguese way", () => {
    assert.equal(formatEuros(149), "1,49 €");
    assert.equal(formatEuros(2000), "20,00 €");
    assert.equal(formatEuros(5), "0,05 €");
  });
});

describe("O Quintal: price lookup by id", () => {
  it("returns the catalogue's price, or the chosen option's", () => {
    const basket = findOQuintalProduct("cabaz-de-frescos-legumes-e-frutas");
    assert.equal(oQuintalUnitPrice(basket, "misto"), 2500);
    assert.equal(oQuintalUnitPrice(basket, "grande"), 4500);
    assert.equal(oQuintalUnitPrice(basket, "fruta-legumes"), null, "a choice without a price is not purchasable");
    assert.equal(oQuintalUnitPrice(basket, null), null, "a product with options needs a choice");
    assert.equal(oQuintalUnitPrice(basket, "nope"), null);
    const eggs = findOQuintalProduct("caixa-5-duzias-ovos");
    assert.equal(oQuintalUnitPrice(eggs, "xl"), 1500, "choices without their own price use the product's");
    const banana = findOQuintalProduct("banana");
    assert.equal(oQuintalUnitPrice(banana, null), 149);
    assert.equal(oQuintalUnitPrice(banana, "x"), null, "a choice on a product without options is refused");
  });

  it("shows «desde» for products whose options differ in price", () => {
    assert.deepEqual(oQuintalFromPrice(findOQuintalProduct("cabaz-de-frescos-legumes-e-frutas")), { cents: 2000, varies: true });
    assert.deepEqual(oQuintalFromPrice(findOQuintalProduct("banana")), { cents: 149, varies: false });
    assert.equal(oQuintalFromPrice(findOQuintalProduct("papaia")), null);
  });
});

describe("O Quintal: checkout request validation (zod)", () => {
  const ok = (lines, extra = {}) => parseCheckoutRequest({ lines, fulfilment: "delivery", ...extra });

  it("accepts integer quantities from 1 to 99", () => {
    assert.equal(ok([{ id: "banana", quantity: 1 }]).ok, true);
    assert.equal(ok([{ id: "banana", quantity: 99 }]).ok, true);
  });

  it("refuses 0, negative, decimal, over 99, text and missing quantities", () => {
    for (const quantity of [0, -1, 1.5, 100, "2", null, undefined, Number.NaN, Infinity]) {
      assert.equal(ok([{ id: "banana", quantity }]).ok, false, String(quantity));
    }
  });

  it("refuses empty carts, unknown fulfilment and prices sent by the browser are ignored", () => {
    assert.equal(ok([]).ok, false);
    assert.equal(parseCheckoutRequest({ lines: [{ id: "banana", quantity: 1 }], fulfilment: "drone" }).ok, false);
    assert.equal(parseCheckoutRequest(null).ok, false);
    const parsed = ok([{ id: "banana", quantity: 2, priceCents: 1, unitCents: 1 }]);
    assert.equal(parsed.ok, true);
    const priced = priceOrder(parsed.request.lines);
    assert.equal(priced.order.lines[0].unitCents, 149, "the browser's price is never used");
    assert.equal(priced.order.subtotalCents, 298);
  });
});

describe("O Quintal: pricing an order on the server", () => {
  it("prices from the catalogue and merges duplicate lines", () => {
    const result = priceOrder([
      { id: "banana", quantity: 2 },
      { id: "cabaz-de-frescos-legumes-e-frutas", choice: "misto", quantity: 1 },
      { id: "banana", quantity: 1 },
    ]);
    assert.equal(result.ok, true);
    assert.equal(result.order.lines.length, 2);
    assert.equal(result.order.lines[0].quantity, 3);
    assert.equal(result.order.lines[1].name, "Cabaz de Frescos (frutas e legumes) — Cabaz Misto");
    assert.equal(result.order.subtotalCents, 3 * 149 + 2500);
  });

  it("refuses unknown products, products without price and merged quantities over 99", () => {
    assert.equal(priceOrder([{ id: "nao-existe", quantity: 1 }]).ok, false);
    assert.equal(priceOrder([{ id: "papaia", quantity: 1 }]).ok, false);
    assert.equal(priceOrder([{ id: "cabaz-de-frescos-legumes-e-frutas", choice: "fruta-legumes", quantity: 1 }]).ok, false);
    assert.equal(
      priceOrder([
        { id: "banana", quantity: 60 },
        { id: "banana", quantity: 60 },
      ]).ok,
      false,
    );
  });
});

describe("O Quintal: Stripe Checkout Session (fake client, no network)", () => {
  const order = priceOrder([
    { id: "banana", quantity: 2 },
    { id: "caixa-5-duzias-ovos", choice: "xl", quantity: 1 },
  ]).order;

  it("builds the payload with catalogue prices in euros, no tax lines", () => {
    const params = buildCheckoutSessionParams(order, { shopBase: "https://example.test/o-quintal", fulfilment: "delivery", deliveryFeeCents: null });
    assert.equal(params.mode, "payment");
    assert.equal(params["line_items[0][price_data][currency]"], "eur");
    assert.equal(params["line_items[0][price_data][unit_amount]"], "149");
    assert.equal(params["line_items[0][quantity]"], "2");
    assert.equal(params["line_items[1][price_data][unit_amount]"], "1500");
    assert.equal(params["line_items[1][price_data][product_data][name]"], "Caixa de 5 dúzias de ovos — 5 dúzias tamanho XL");
    assert.equal(params.success_url, "https://example.test/o-quintal/encomenda/sucesso?sessao={CHECKOUT_SESSION_ID}");
    assert.equal(params.cancel_url, "https://example.test/o-quintal/encomenda/cancelada");
    assert.equal(params["shipping_address_collection[allowed_countries][0]"], "PT");
    assert.equal(params["metadata[loja]"], "o-quintal");
    assert.ok(!Object.keys(params).some((key) => /tax|automatic_tax/.test(key)));
    assert.ok(!Object.keys(params).some((key) => key.startsWith("shipping_options")), "no delivery fee until the owner sets one");
  });

  it("adds the delivery fee only when one is set, and no address for pickup", () => {
    const withFee = buildCheckoutSessionParams(order, { shopBase: "https://x.test", fulfilment: "delivery", deliveryFeeCents: 350 });
    assert.equal(withFee["shipping_options[0][shipping_rate_data][fixed_amount][amount]"], "350");
    const pickup = buildCheckoutSessionParams(order, { shopBase: "https://x.test", fulfilment: "pickup", deliveryFeeCents: 350 });
    assert.ok(!Object.keys(pickup).some((key) => key.startsWith("shipping")));
  });

  it("sends the form to Stripe's endpoint with the secret key and returns the hosted URL", async () => {
    const calls = [];
    const fakeFetch = async (url, init) => {
      calls.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ id: "cs_test_1", url: "https://checkout.stripe.test/c/pay/cs_test_1" }) };
    };
    const params = buildCheckoutSessionParams(order, { shopBase: "https://x.test", fulfilment: "pickup", deliveryFeeCents: null });
    const url = await createCheckoutSession(params, "sk_test_fake", fakeFetch);
    assert.equal(url, "https://checkout.stripe.test/c/pay/cs_test_1");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.stripe.com/v1/checkout/sessions");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.headers.Authorization, "Bearer sk_test_fake");
    assert.equal(new URLSearchParams(calls[0].init.body).get("line_items[0][price_data][unit_amount]"), "149");
  });

  it("throws Stripe's message when the session can't be created", async () => {
    const fakeFetch = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "Invalid API Key" } }) });
    await assert.rejects(createCheckoutSession({}, "sk_test_bad", fakeFetch), /Invalid API Key/);
  });

  it("only accepts test keys outside production", () => {
    assert.equal(stripeKeyAllowed(undefined, "preview"), false);
    assert.equal(stripeKeyAllowed("sk_test_x", "preview"), true);
    assert.equal(stripeKeyAllowed("sk_live_x", "preview"), false);
    assert.equal(stripeKeyAllowed("sk_live_x", undefined), false);
    assert.equal(stripeKeyAllowed("sk_live_x", "production"), true);
    assert.equal(stripeKeyAllowed("pk_test_x", "production"), false);
  });
});

describe("O Quintal: webhook signature and order email", () => {
  const secret = "whsec_test_secret";
  const body = JSON.stringify({ type: "checkout.session.completed" });
  const sign = (t, payload = body, key = secret) => createHmac("sha256", key).update(`${t}.${payload}`).digest("hex");

  it("accepts a valid, recent signature", () => {
    const now = 1_800_000_000;
    assert.equal(verifyStripeSignature(body, `t=${now},v1=${sign(now)}`, secret, now), true);
    assert.equal(verifyStripeSignature(body, `t=${now},v1=deadbeef,v1=${sign(now)}`, secret, now + 10), true);
  });

  it("refuses tampered bodies, wrong secrets, old timestamps and malformed headers", () => {
    const now = 1_800_000_000;
    assert.equal(verifyStripeSignature(body + " ", `t=${now},v1=${sign(now)}`, secret, now), false);
    assert.equal(verifyStripeSignature(body, `t=${now},v1=${sign(now, body, "other")}`, secret, now), false);
    assert.equal(verifyStripeSignature(body, `t=${now},v1=${sign(now)}`, secret, now + 301), false);
    assert.equal(verifyStripeSignature(body, "garbage", secret, now), false);
    assert.equal(verifyStripeSignature(body, null, secret, now), false);
    assert.equal(verifyStripeSignature(body, `t=${now},v1=${sign(now)}`, "", now), false);
  });

  it("writes the order email from the session, without tax lines", () => {
    const text = orderEmailText(
      {
        id: "cs_test_1",
        amount_total: 1798,
        metadata: { loja: "o-quintal", entrega: "Entrega ao domicílio", itens_1: "2× Banana (kg); 1× Caixa", itens_2: " de 5 dúzias de ovos" },
        customer_details: { name: "Cliente Teste", email: "teste@example.test", phone: "+351000000000" },
        collected_information: { shipping_details: { name: "Cliente Teste", address: { line1: "Rua A, 1", postal_code: "1000-001", city: "Lisboa" } } },
      },
      formatEuros,
    );
    assert.match(text, /- 2× Banana \(kg\)/);
    assert.match(text, /- 1× Caixa de 5 dúzias de ovos/);
    assert.match(text, /Total pago: 17,98 €/);
    assert.match(text, /Morada: Cliente Teste, Rua A, 1, 1000-001 Lisboa/);
    assert.doesNotMatch(text, /\bIVA\b/);
  });
});

describe("O Quintal: the browser's cart (src/lib/o-quintal/cart.ts)", () => {
  it("cleans what was stored: unknown ids, unpriced products, bad quantities, duplicates", () => {
    const lines = sanitizeCart([
      { id: "banana", quantity: 2 },
      { id: "banana", choice: null, quantity: 3 },
      { id: "papaia", quantity: 1 },
      { id: "nao-existe", quantity: 1 },
      { id: "laranja", quantity: 1000 },
      { id: "limao", quantity: -4 },
      "lixo",
      null,
    ]);
    assert.deepEqual(lines, [
      { id: "banana", choice: null, quantity: 5 },
      { id: "laranja", choice: null, quantity: 99 },
      { id: "limao", choice: null, quantity: 1 },
    ]);
    assert.deepEqual(sanitizeCart("x"), []);
  });

  it("adds, caps at 99 and totals from the catalogue", () => {
    let lines = addToCart([], "banana", null, 98);
    lines = addToCart(lines, "banana", null, 5);
    assert.equal(lines[0].quantity, 99);
    lines = addToCart(lines, "cabaz-de-frescos-legumes-e-frutas", "misto", 1);
    assert.equal(cartSubtotal(lines), 99 * 149 + 2500);
  });
});

describe("O Quintal: pages and preview path", () => {
  it("is registered as a client site without a domain yet, matched by the proxy", () => {
    const site = clientSites.find((entry) => entry.id === "o-quintal");
    assert.ok(site);
    assert.equal(site.base, "/o-quintal");
    assert.deepEqual(site.hosts, []);
    assert.deepEqual(routeClientSite("www.steevanz.com", "/o-quintal/loja"), { kind: "noindex", site: "o-quintal" });
    assert.equal(routeClientSite("www.steevanz.com", "/o-quintalx"), null);
    assert.match(readFileSync("src/proxy.ts", "utf8"), /"\/o-quintal",\s*"\/o-quintal\/:path\*"/);
    assert.equal(domainSegment, oQuintalDomainSegment);
  });

  it("resolves the shop's pages and nothing else", () => {
    assert.deepEqual(resolveOQuintalPath(undefined, exists), { mode: "preview", page: { kind: "home" } });
    assert.deepEqual(resolveOQuintalPath(["loja"], exists), { mode: "preview", page: { kind: "shop", category: null } });
    assert.deepEqual(resolveOQuintalPath(["loja", "fruta"], exists), { mode: "preview", page: { kind: "shop", category: "fruta" } });
    assert.deepEqual(resolveOQuintalPath(["produto", "banana"], exists), { mode: "preview", page: { kind: "product", id: "banana" } });
    assert.deepEqual(resolveOQuintalPath(["dominio", "carrinho"], exists), { mode: "domain", page: { kind: "cart" } });
    assert.deepEqual(resolveOQuintalPath(["encomenda", "sucesso"], exists), { mode: "preview", page: { kind: "success" } });
    assert.deepEqual(resolveOQuintalPath(["encomenda", "cancelada"], exists), { mode: "preview", page: { kind: "cancel" } });
    for (const bad of [["loja", "carne"], ["produto", "nao-existe"], ["produto"], ["carrinho", "x"], ["encomenda"], ["x"], ["loja", "fruta", "x"], ["%E0%A4%A"]]) {
      assert.equal(resolveOQuintalPath(bad, exists), null, bad.join("/"));
    }
    assert.equal(oQuintalHref("preview", { kind: "product", id: "banana" }), "/o-quintal/produto/banana");
    assert.equal(oQuintalHref("domain", { kind: "home" }), "/");
    const params = oQuintalStaticParams(ids);
    assert.equal(params.length, 2 * (1 + 1 + oQuintalCategoryIds.length + ids.length + 3));
    for (const { path } of params) assert.ok(resolveOQuintalPath(path, exists), path.join("/"));
    assert.ok(!oQuintalSitemapEntries(ids).some((entry) => /carrinho|encomenda/.test(entry.url)));
  });

  it("stays out of the Steevanz sitemap and robots", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/all-routes.ts", "src/app/robots.ts"]) {
      assert.doesNotMatch(readFileSync(file, "utf8"), /quintal/i, file);
    }
  });
});

describe("O Quintal: content rules", () => {
  const files = [
    ...filesUnder("src/components/clients/o-quintal"),
    ...filesUnder("src/content/o-quintal"),
    ...filesUnder("src/app/(clientes)/o-quintal"),
    ...filesUnder("src/app/api/o-quintal"),
    ...filesUnder("src/lib/o-quintal"),
  ].map((path) => ({ path, text: readFileSync(path, "utf8") }));

  it("never shows ratings or reviews, and never VAT maths", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /aggregateRating|ratingValue|reviewCount|testemunho|avaliaç/i, path);
      assert.doesNotMatch(text, /com IVA|IVA \(|vatCents|\+ IVA =/, path);
    }
  });

  it("never writes «NFC», never uses Steevanz's stylesheet or shell, never WhatsApp green", () => {
    for (const { path, text } of files) {
      assert.doesNotMatch(text, /\bNFC\b/, path);
      assert.doesNotMatch(text, /globals\.css|SiteShell|WhatsAppButton|root-metadata/, path);
      assert.doesNotMatch(text, /#25d366|#128c7e|#075e54/i, path);
    }
  });

  it("does not touch the Steevanz cart's storage", () => {
    for (const { path, text } of files) assert.doesNotMatch(text, /steevanz-cart/, path);
  });

  it("uses its own media files, recorded in LICENCAS.txt", () => {
    assert.equal(oQuintal.name, "O Quintal");
    for (const src of Object.values(oQuintal.media)) {
      assert.ok(src.startsWith("/media/clients/o-quintal/"), src);
      assert.ok(existsSync(join("public", src)), src);
    }
    assert.ok(existsSync("public/media/clients/o-quintal/LICENCAS.txt"));
  });
});
