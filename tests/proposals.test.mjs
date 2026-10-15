import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getProposal, proposals } from "../src/content/proposals/index.ts";
import { clientEmail, ownerEmail, processAcceptance, proposalTables } from "../src/lib/proposals/accept.ts";
import { formatDate, formatEuros, isExpired, lineTotal, proposalTotals, validUntil, vatOf } from "../src/lib/proposals/totals.ts";
import { checkNif, isValidEmail, isValidPortugueseNif, normalizePostalCode, validateAcceptance } from "../src/lib/proposals/validation.ts";

const dolci = getProposal("dolci-salati-695graik");
const plain = (text) => text.replace(/ | /g, " ");

function form(overrides = {}) {
  const data = new FormData();
  const values = {
    company: "Dolci e Salati, Lda.",
    nif: "503 504 564",
    address: "Rua de Exemplo, 10",
    postalCode: "1200-195",
    city: "Lisboa",
    contact: "Maria Silva",
    email: "Faturas@Exemplo.pt",
    phone: "+351 912 345 678",
    notes: "",
    accept: "on",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) if (value !== undefined) data.set(key, value);
  return data;
}

describe("proposal registry", () => {
  it("finds the Dolci e Salati proposal by its id and nothing else", () => {
    assert.equal(dolci?.clientName, "Dolci e Salati");
    assert.equal(getProposal("dolci-salati"), null);
    assert.equal(getProposal(""), null);
  });

  it("has unique, unguessable ids", () => {
    const ids = proposals.map((proposal) => proposal.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) assert.match(id, /^[a-z0-9-]+-[A-Za-z0-9_-]{6,}$/);
  });

  it("never mentions YouTube or NFC", () => {
    const text = JSON.stringify(proposals);
    assert.doesNotMatch(text, /youtube/i);
    assert.doesNotMatch(text, /\bNFC\b/);
  });
});

describe("proposal totals", () => {
  it("applies the line discount", () => {
    const plates = dolci.oneOff[1];
    assert.deepEqual(lineTotal(plates), { grossCents: 30000, discountCents: 7500, netCents: 22500 });
  });

  it("matches the quote sent to Dolci e Salati", () => {
    const totals = proposalTotals(dolci);
    assert.deepEqual(totals.oneOff, { subtotalCents: 57500, vatCents: 13225, totalCents: 70725 });
    assert.deepEqual(totals.monthly, { subtotalCents: 4500, vatCents: 1035, totalCents: 5535 });
    assert.deepEqual(totals.dueOnAcceptance, { subtotalCents: 62000, vatCents: 14260, totalCents: 76260 });
  });

  it("rounds VAT on the subtotal to the cent", () => {
    assert.equal(vatOf(1, 23), 0);
    assert.equal(vatOf(3, 23), 1);
    assert.equal(vatOf(999, 23), 230);
  });

  it("never lets a discount make a line negative", () => {
    assert.equal(lineTotal({ description: "x", quantity: 1, unitCents: 100, discount: { description: "y", amountCents: 500 } }).netCents, 0);
  });

  it("formats euros like the quote", () => {
    assert.equal(plain(formatEuros(35000)), "350 €");
    assert.equal(plain(formatEuros(13225)), "132,25 €");
    assert.equal(plain(formatEuros(5535)), "55,35 €");
  });

  it("is valid for 30 days, until the end of 14/11/2026 in Lisbon", () => {
    assert.equal(validUntil(dolci), "2026-11-14");
    assert.equal(formatDate(dolci.date), "15/10/2026");
    assert.equal(isExpired(dolci, new Date("2026-11-14T23:30:00Z")), false); // 23:30 in Lisbon (winter time)
    assert.equal(isExpired(dolci, new Date("2026-11-15T00:30:00Z")), true);
  });
});

describe("NIF and VAT numbers", () => {
  it("checks the Portuguese NIF check digit", () => {
    for (const nif of ["503504564", "500000000", "123456789", "999999990", "980000009"]) assert.equal(isValidPortugueseNif(nif), true, nif);
    for (const nif of ["503504565", "123456780", "012345678", "400000000", "12345678"]) assert.equal(isValidPortugueseNif(nif), false, nif);
  });

  it("accepts spaces, dots and the PT prefix", () => {
    assert.deepEqual(checkNif("503 504 564"), { ok: true, value: "503504564", portuguese: true });
    assert.deepEqual(checkNif("PT503.504.564"), { ok: true, value: "503504564", portuguese: true });
    assert.deepEqual(checkNif("pt 503504564"), { ok: true, value: "503504564", portuguese: true });
  });

  it("explains what is wrong", () => {
    assert.match(checkNif("12345").message, /9 dígitos/);
    assert.match(checkNif("503504565").message, /não é válido/);
    assert.match(checkNif("ABC").message, /código do país/);
    assert.match(checkNif("").message, /Indique o NIF/);
  });

  it("accepts a foreign VAT number with its country prefix", () => {
    assert.deepEqual(checkNif("ES B12345678"), { ok: true, value: "ES B12345678", portuguese: false });
    assert.deepEqual(checkNif("fr12345678901"), { ok: true, value: "FR 12345678901", portuguese: false });
    assert.equal(checkNif("ESABCDEFG").ok, false);
    assert.equal(checkNif("PTB1234567").ok, false);
  });
});

describe("postal code and email", () => {
  it("wants 0000-000, and fixes a missing hyphen", () => {
    assert.equal(normalizePostalCode("1200-195"), "1200-195");
    assert.equal(normalizePostalCode(" 1200 195 "), "1200-195");
    assert.equal(normalizePostalCode("1200195"), "1200-195");
    assert.equal(normalizePostalCode("1200-19"), null);
    assert.equal(normalizePostalCode("1200"), null);
    assert.equal(normalizePostalCode("ABCD-123"), null);
  });

  it("checks the email", () => {
    assert.equal(isValidEmail("nome@empresa.pt"), true);
    assert.equal(isValidEmail("a.b+c@sub.empresa.com"), true);
    for (const email of ["nome@empresa", "nome empresa@x.pt", "@empresa.pt", "nome@.pt", "nome@empresa.p"]) assert.equal(isValidEmail(email), false, email);
  });
});

describe("acceptance form", () => {
  it("accepts a complete form and normalises it", () => {
    const result = validateAcceptance(form({ postalCode: "1200195" }));
    assert.equal(result.ok, true);
    assert.equal(result.data.nif, "503504564");
    assert.equal(result.data.postalCode, "1200-195");
    assert.equal(result.data.email, "faturas@exemplo.pt");
  });

  it("gives a clear message for every missing field, and keeps the values", () => {
    const result = validateAcceptance(form({ company: " ", nif: "", address: "", postalCode: "", city: "", contact: "", email: "", phone: "", accept: undefined }));
    assert.equal(result.ok, false);
    assert.deepEqual(Object.keys(result.errors).sort(), ["accept", "address", "city", "company", "contact", "email", "nif", "phone", "postalCode"]);
    assert.match(result.errors.accept, /leu e aceita/);
    assert.equal(result.values.notes, "");
  });

  it("rejects a wrong NIF, postal code and email", () => {
    const result = validateAcceptance(form({ nif: "503504565", postalCode: "12-34", email: "nope" }));
    assert.equal(result.ok, false);
    assert.match(result.errors.nif, /não é válido/);
    assert.equal(result.errors.postalCode, "Escreva o código postal no formato 0000-000.");
    assert.match(result.errors.email, /email/);
    assert.equal(result.values.nif, "503504565");
  });

  it("lets a foreign company use its own postal code", () => {
    const result = validateAcceptance(form({ nif: "ES B12345678", postalCode: "28001", city: "Madrid" }));
    assert.equal(result.ok, true);
    assert.equal(result.data.postalCode, "28001");
    assert.equal(result.data.nifIsPortuguese, false);
  });
});

describe("accepting a proposal (emails mocked)", () => {
  const now = new Date("2026-10-16T09:05:00Z");
  function deps(sendResult = true) {
    const sent = [];
    const later = [];
    return {
      sent,
      later,
      deps: {
        send: async (email) => {
          sent.push(email);
          return sendResult;
        },
        sendLater: (email) => later.push(email),
        now,
        origin: "https://www.steevanz.com",
        ownerAddress: "rcabaco@steevanz.com",
      },
    };
  }

  it("emails the owner with the billing data and the quote, then confirms to the client", async () => {
    const { sent, later, deps: d } = deps();
    const state = await processAcceptance(dolci, form({ notes: "Faturar em nome da sociedade." }), { status: "idle" }, d);
    assert.deepEqual(state, { status: "success" });
    assert.equal(sent.length, 1);
    const owner = sent[0];
    assert.equal(owner.subject, "Nova adjudicação · Dolci e Salati · ORC-2026-001");
    assert.equal(owner.replyTo, "faturas@exemplo.pt");
    assert.equal(owner.to, undefined); // the default owner inbox
    const rows = Object.fromEntries(owner.rows.map((row) => [row.label, row.value]));
    assert.equal(rows.NIF, "503504564");
    assert.equal(rows["Código postal"], "1200-195");
    assert.equal(rows["Data e hora"], "16/10/2026, 10:05");
    assert.equal(rows.Observações, "Faturar em nome da sociedade.");
    assert.equal(owner.adminUrl, "https://www.steevanz.com/proposta/dolci-salati-695graik");
    const tables = owner.tables.map((table) => ({ title: table.title, foot: table.foot.map(([label, value]) => [label, plain(value)]) }));
    assert.deepEqual(tables[0].foot.at(-1), ["Total com IVA", "707,25 €"]);
    assert.deepEqual(tables[1].foot.at(-1), ["Total com IVA", "55,35 €/mês"]);

    assert.equal(later.length, 1);
    const client = later[0];
    assert.deepEqual(client.to, ["faturas@exemplo.pt"]);
    assert.equal(client.from, undefined); // mail@steevanz.com
    assert.equal(client.replyTo, "rcabaco@steevanz.com");
    assert.match(client.heading, /Obrigado, Dolci e Salati! Está feito\./);
    assert.ok(client.intro.some((line) => /entra em contacto em breve/.test(line)));
  });

  it("does not thank the client when the owner email fails", async () => {
    const { later, deps: d } = deps(false);
    const state = await processAcceptance(dolci, form(), { status: "idle" }, d);
    assert.equal(state.status, "error");
    assert.equal(state.code, "send_failed");
    assert.equal(state.values.company, "Dolci e Salati, Lda.");
    assert.equal(later.length, 0);
  });

  it("sends nothing on validation errors and counts the attempts", async () => {
    const { sent, deps: d } = deps();
    const first = await processAcceptance(dolci, form({ nif: "1" }), { status: "idle" }, d);
    const second = await processAcceptance(dolci, form({ nif: "1" }), first, d);
    assert.equal(first.code, "validation");
    assert.equal(second.attempt, 2);
    assert.equal(sent.length, 0);
  });

  it("pretends success to bots and sends nothing", async () => {
    const { sent, later, deps: d } = deps();
    const state = await processAcceptance(dolci, form({ company_website: "http://spam.example" }), { status: "idle" }, d);
    assert.deepEqual(state, { status: "success" });
    assert.equal(sent.length + later.length, 0);
  });

  it("refuses an expired proposal", async () => {
    const { sent, deps: d } = deps();
    const state = await processAcceptance(dolci, form(), { status: "idle" }, { ...d, now: new Date("2026-12-01T10:00:00Z") });
    assert.equal(state.code, "expired");
    assert.equal(sent.length, 0);
  });

  it("builds the email tables with the discount line", () => {
    const [oneOff] = proposalTables(dolci);
    assert.deepEqual(
      oneOff.rows.map((row) => row.map(plain)),
      [
        ["Landing page", "1", "350 €"],
        ["Placas de mesa · Menu digital", "15 × 20 €", "300 €"],
        ["Desconto de quantidade (a partir de 10 placas: 15 €/un.)", "", "− 75 €"],
      ],
    );
  });

  it("keeps the client email free of the billing internals", () => {
    const billing = validateAcceptance(form()).data;
    const email = clientEmail(dolci, billing, { origin: "https://www.steevanz.com" }, "rcabaco@steevanz.com");
    assert.equal(email.subject, "Proposta adjudicada · Dolci e Salati · ORC-2026-001");
    assert.ok(ownerEmail(dolci, billing, { now, origin: "https://www.steevanz.com" }).rows.length > email.rows.length);
  });
});
