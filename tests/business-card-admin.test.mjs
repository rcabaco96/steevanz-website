import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { getBusinessCard } from "../src/content/business-cards.ts";
import { buildVCard } from "../src/lib/business-card/vcard.ts";
import {
  buildTagDestination,
  cardSlugProblem,
  cardWithFallback,
  cleanSocials,
  isSafeHttpUrl,
  normalizePhone,
  normalizeSocial,
  normalizeWebUrl,
  parseCardForm,
  rowToCard,
  safeTagDestination,
  splitName,
  suggestSlug,
  tagCodeProblem,
  tagDestinationInputs,
} from "../src/lib/business-cards/rules.ts";

// Business cards and keychain tags edited in the admin (owner, 2026-10-20): addresses, the contact file
// from database rows, the fallback to the content file before the migration, and redirects that only
// ever go to http(s).

const row = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "rogerio-cabaco",
  active: true,
  locale: "pt",
  client_name: "Steevanz",
  name: "Rogério Cabaço",
  given_name: null,
  family_name: null,
  role: "CEO & Founder",
  company: "Steevanz",
  phone: "+351 961 292 679",
  phone2: null,
  whatsapp: "+351 961 292 679",
  email: "rcabaco@steevanz.com",
  website: "https://www.steevanz.com",
  socials: [
    { network: "instagram", url: "https://www.instagram.com/steevanz_" },
    { network: "linkedin", url: "https://www.linkedin.com/company/steevanz" },
  ],
  address: null,
  maps_url: null,
  photo_url: "/assinatura/foto.png",
  note: "interna",
  created_at: "2026-10-20T00:00:00Z",
  updated_at: "2026-10-20T00:00:00Z",
};

const emptyForm = {
  name: "",
  slug: "",
  locale: "pt",
  client_name: "",
  given_name: "",
  family_name: "",
  role: "",
  company: "",
  phone: "",
  phone2: "",
  whatsapp: "",
  email: "",
  website: "",
  address: "",
  maps_url: "",
  note: "",
  socials: {},
  active: true,
};

describe("card and tag addresses", () => {
  it("suggests an address from the name, without accents", () => {
    assert.equal(suggestSlug("Rogério Cabaço"), "rogerio-cabaco");
    assert.equal(suggestSlug("  Café & Bar do Zé!  "), "cafe-bar-do-ze");
    assert.equal(suggestSlug("Straße"), "strasse");
    assert.equal(suggestSlug("a".repeat(80)).length, 60);
    assert.equal(suggestSlug("x".repeat(39) + " yy", 40), "x".repeat(39));
  });

  it("accepts lowercase words with single hyphens only", () => {
    for (const ok of ["rogerio-cabaco", "ab", "maria-2", "a1b2"]) assert.equal(cardSlugProblem(ok), null, ok);
    for (const bad of ["", "a", "Rogerio", "rogério", "-abc", "abc-", "a--b", "a b", "a/b", "../x", "a_b", "x".repeat(61)]) assert.ok(cardSlugProblem(bad), bad);
    assert.equal(tagCodeProblem("cafe-central"), null);
    assert.ok(tagCodeProblem("x".repeat(41)));
    assert.ok(tagCodeProblem("javascript:alert(1)"));
  });
});

describe("values typed in the card form", () => {
  it("formats Portuguese numbers and keeps foreign ones with their country code", () => {
    assert.equal(normalizePhone("961292679"), "+351 961 292 679");
    assert.equal(normalizePhone("961 292 679"), "+351 961 292 679");
    assert.equal(normalizePhone("+351961292679"), "+351 961 292 679");
    assert.equal(normalizePhone("00351 210 000 000"), "+351 210 000 000");
    assert.equal(normalizePhone("+34 600 000 000"), "+34 600 000 000");
    assert.equal(normalizePhone(""), "");
    assert.equal(normalizePhone("12345"), null);
    assert.equal(normalizePhone("600 000 000 0"), null, "no country code and not Portuguese");
    assert.equal(normalizePhone("abc"), null);
  });

  it("adds https:// to web addresses and refuses other schemes", () => {
    assert.equal(normalizeWebUrl("www.steevanz.com"), "https://www.steevanz.com");
    assert.equal(normalizeWebUrl("https://steevanz.com/a?b=1"), "https://steevanz.com/a?b=1");
    assert.equal(normalizeWebUrl(""), "");
    for (const bad of ["javascript:alert(1)", "data:text/html,hi", "ftp://x.com", "https://user:pw@x.com", "not a url", "https://nodot"]) assert.equal(normalizeWebUrl(bad), null, bad);
  });

  it("turns account names into profile addresses", () => {
    assert.equal(normalizeSocial("instagram", "@steevanz_"), "https://www.instagram.com/steevanz_");
    assert.equal(normalizeSocial("instagram", "dolciesalati.ap"), "https://www.instagram.com/dolciesalati.ap");
    assert.equal(normalizeSocial("tiktok", "steevanz"), "https://www.tiktok.com/@steevanz");
    assert.equal(normalizeSocial("linkedin", "linkedin.com/company/steevanz"), "https://linkedin.com/company/steevanz");
    assert.equal(normalizeSocial("x", "javascript:alert(1)"), null);
  });

  it("checks the whole form and tidies it", () => {
    const parsed = parseCardForm({
      ...emptyForm,
      name: " Ana Sousa ",
      slug: "Ana-Sousa",
      phone: "912345678",
      email: "ANA@Empresa.PT",
      website: "empresa.pt",
      address: "Rua A, 1\n\n1000-000 Lisboa\n",
      socials: { instagram: "@ana", facebook: "" },
    });
    assert.ok(parsed.ok);
    assert.equal(parsed.value.name, "Ana Sousa");
    assert.equal(parsed.value.slug, "ana-sousa");
    assert.equal(parsed.value.phone, "+351 912 345 678");
    assert.equal(parsed.value.email, "ana@empresa.pt");
    assert.equal(parsed.value.website, "https://empresa.pt");
    assert.equal(parsed.value.address, "Rua A, 1\n1000-000 Lisboa");
    assert.deepEqual(parsed.value.socials, [{ network: "instagram", url: "https://www.instagram.com/ana" }]);
    assert.equal(parsed.value.whatsapp, null);
  });

  it("explains the first problem", () => {
    assert.match(parseCardForm(emptyForm).message, /nome/);
    assert.match(parseCardForm({ ...emptyForm, name: "Ana", slug: "a" }).message, /Endereço/);
    assert.match(parseCardForm({ ...emptyForm, name: "Ana", slug: "ana", locale: "xx" }).message, /língua/);
    assert.match(parseCardForm({ ...emptyForm, name: "Ana", slug: "ana", email: "ana@" }).message, /email/);
    assert.match(parseCardForm({ ...emptyForm, name: "Ana", slug: "ana", website: "javascript:alert(1)" }).message, /website/);
    assert.match(parseCardForm({ ...emptyForm, name: "Ana", slug: "ana", maps_url: "http://maps.google.com" }).message, /mapa/);
  });
});

describe("cards from database rows", () => {
  it("gives the same contact file as the content file's card", () => {
    const fromFile = getBusinessCard("rogerio-cabaco");
    const fromRow = rowToCard(row);
    assert.equal(buildVCard(fromRow), buildVCard({ ...fromFile, photo: undefined }));
    assert.equal(fromRow.givenName, "Rogério");
    assert.equal(fromRow.familyName, "Cabaço");
    assert.equal(fromRow.photo?.src, "/assinatura/foto.png");
    assert.equal("note" in fromRow, false, "the internal note never reaches the page");
  });

  it("writes the second phone, the address and the stored contact names", () => {
    const card = rowToCard({ ...row, phone2: "+351 210 000 000", address: "Rua A, 1\n1000-000 Lisboa", given_name: "Rogério", family_name: "Ramalho Cabaço" });
    const vcf = buildVCard(card).replace(/\r\n /g, "");
    assert.match(vcf, /\r\nTEL;TYPE=WORK,VOICE:\+351210000000\r\n/);
    assert.match(vcf, /\r\nADR;TYPE=WORK:;;Rua A\\, 1\\, 1000-000 Lisboa;;;;\r\n/);
    assert.match(vcf, /\r\nN:Ramalho Cabaço;Rogério;;;\r\n/);
  });

  it("drops unknown networks, unsafe links and an unsafe photo", () => {
    const card = rowToCard({
      ...row,
      socials: [{ network: "myspace", url: "https://x.com" }, { network: "x", url: "javascript:alert(1)" }, "junk", { network: "instagram", url: "https://instagram.com/a" }],
      website: "javascript:alert(1)",
      photo_url: "//evil.example/p.jpg",
      locale: "xx",
    });
    assert.deepEqual(card.socials, [{ network: "instagram", url: "https://instagram.com/a" }]);
    assert.equal(card.website, undefined);
    assert.equal(card.photo, undefined);
    assert.equal(card.locale, "pt");
    assert.deepEqual(cleanSocials(null), []);
  });

  it("splits a name into given and family names", () => {
    assert.deepEqual(splitName("Maria da Silva Santos"), { givenName: "Maria da Silva", familyName: "Santos" });
    assert.deepEqual(splitName("Madonna"), { givenName: "Madonna", familyName: "" });
  });
});

describe("fallback to the content file before the migration", () => {
  const fileCard = getBusinessCard("rogerio-cabaco");
  const missing = new Error("missing table");
  const isMissing = (error) => error === missing;

  it("uses the content file while the table doesn't exist", async () => {
    assert.equal(await cardWithFallback(() => Promise.reject(missing), fileCard, isMissing), fileCard);
    assert.equal(await cardWithFallback(() => Promise.reject(missing), undefined, isMissing), null);
  });

  it("uses the database once it answers, even to say there is no such card", async () => {
    const fromDb = await cardWithFallback(() => Promise.resolve({ ...row, role: "Fundador" }), fileCard, isMissing);
    assert.equal(fromDb.role, "Fundador");
    assert.equal(await cardWithFallback(() => Promise.resolve(null), fileCard, isMissing), null, "inactive or deleted in the admin: no fallback");
  });

  it("keeps the file's card on other failures, and throws without one (never a cached 404)", async () => {
    const outage = new Error("timeout");
    const logged = [];
    assert.equal(await cardWithFallback(() => Promise.reject(outage), fileCard, isMissing, (error) => logged.push(error)), fileCard);
    assert.deepEqual(logged, [outage]);
    await assert.rejects(cardWithFallback(() => Promise.reject(outage), undefined, isMissing), outage);
  });

  it("seeds the migration with the content file's card", () => {
    const sql = readFileSync(new URL("../supabase/migrations/20261020210000_business_cards_keychains.sql", import.meta.url), "utf8");
    for (const value of [fileCard.slug, fileCard.name, fileCard.role, fileCard.email, fileCard.website, fileCard.phone, fileCard.photo.src, ...fileCard.socials.map((social) => social.url)]) {
      assert.ok(sql.includes(value), value);
    }
    assert.match(sql, /enable row level security/);
    assert.match(sql, /on conflict \(slug\) do nothing/);
  });
});

describe("keychain tag destinations and redirects", () => {
  it("builds WhatsApp, Instagram and web destinations", () => {
    assert.deepEqual(buildTagDestination("whatsapp", { whatsapp: "961 292 679", message: "", instagram: "", url: "" }), { ok: true, value: "https://wa.me/351961292679" });
    assert.deepEqual(buildTagDestination("whatsapp", { whatsapp: "+34 600 000 000", message: "Olá & bem-vindo", instagram: "", url: "" }), {
      ok: true,
      value: "https://wa.me/34600000000?text=Ol%C3%A1%20%26%20bem-vindo",
    });
    assert.deepEqual(buildTagDestination("instagram", { whatsapp: "", message: "", instagram: "@steevanz_", url: "" }), { ok: true, value: "https://www.instagram.com/steevanz_" });
    assert.deepEqual(buildTagDestination("instagram", { whatsapp: "", message: "", instagram: "https://instagram.com/steevanz_/?hl=pt", url: "" }), { ok: true, value: "https://www.instagram.com/steevanz_" });
    assert.deepEqual(buildTagDestination("website", { whatsapp: "", message: "", instagram: "", url: "steevanz.com" }), { ok: true, value: "https://steevanz.com" });
  });

  it("refuses destinations that aren't http(s)", () => {
    const none = { whatsapp: "", message: "", instagram: "", url: "" };
    for (const url of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html;base64,PHNjcmlwdD4=", "vbscript:x", "file:///etc/passwd", "https://user:pw@evil.example"]) {
      assert.equal(buildTagDestination("custom", { ...none, url }).ok, false, url);
    }
    assert.equal(buildTagDestination("whatsapp", { ...none, whatsapp: "123" }).ok, false);
    assert.equal(buildTagDestination("instagram", { ...none, instagram: "https://evil.example/steevanz_" }).ok, false);
  });

  it("checks the stored destination again on every tap", () => {
    assert.equal(safeTagDestination("whatsapp", "https://wa.me/351961292679"), "https://wa.me/351961292679");
    assert.equal(safeTagDestination("instagram", "https://www.instagram.com/steevanz_"), "https://www.instagram.com/steevanz_");
    assert.equal(safeTagDestination("custom", "http://example.com/x"), "http://example.com/x");
    for (const [type, url] of [
      ["custom", "javascript:alert(1)"],
      ["website", "data:text/html,<script>alert(1)</script>"],
      ["custom", " javascript:alert(1)"],
      ["custom", "https://user:pw@example.com"],
      ["whatsapp", "https://evil.example/351961292679"],
      ["instagram", "https://instagram.com.evil.example/x"],
      ["other", "https://example.com"],
      ["custom", `https://example.com/${"a".repeat(1000)}`],
    ]) {
      assert.equal(safeTagDestination(type, url), null, `${type} ${url}`);
    }
    assert.equal(isSafeHttpUrl("https://localhost:3000/x"), true);
  });

  it("refills the form from a saved destination", () => {
    assert.deepEqual(tagDestinationInputs("whatsapp", "https://wa.me/351961292679?text=Ol%C3%A1"), { whatsapp: "+351 961 292 679", message: "Olá", instagram: "", url: "" });
    assert.deepEqual(tagDestinationInputs("instagram", "https://www.instagram.com/steevanz_"), { whatsapp: "", message: "", instagram: "steevanz_", url: "" });
    assert.deepEqual(tagDestinationInputs("website", "https://steevanz.com"), { whatsapp: "", message: "", instagram: "", url: "https://steevanz.com" });
  });
});
