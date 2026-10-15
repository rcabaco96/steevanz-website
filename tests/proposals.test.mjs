import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getProposal, proposals } from "../src/content/proposals/index.ts";
import { clientEmail, ownerEmail, processAcceptance, proposalTables } from "../src/lib/proposals/accept.ts";
import {
  annualLineCents,
  annualLineSavingsCents,
  annualSavingsLabel,
  dueLabel,
  dueOnAcceptance,
  formatDate,
  formatEuros,
  isExpired,
  lineTotal,
  planLabel,
  planOptions,
  proposalTotals,
  validUntil,
  twelveMonthsCents,
  vatOf,
} from "../src/lib/proposals/totals.ts";
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
    plan: "annual",
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
  });

  it("prices the annual plan at 12 months for the price of 10", () => {
    const totals = proposalTotals(dolci);
    assert.deepEqual(totals.annual, { subtotalCents: 45000, vatCents: 10350, totalCents: 55350 });
    assert.deepEqual(totals.annualSavings, { subtotalCents: 9000, vatCents: 2070, totalCents: 11070 });
    assert.deepEqual(
      dolci.monthly.map((line) => annualLineCents(dolci, line)),
      [15000, 30000],
    );
  });

  it("shows what the annual plan saves on each monthly line and in total", () => {
    assert.deepEqual(
      dolci.monthly.map((line) => [twelveMonthsCents(line), annualLineCents(dolci, line), annualLineSavingsCents(dolci, line)]),
      [
        [18000, 15000, 3000],
        [36000, 30000, 6000],
      ],
    );
    assert.equal(plain(annualSavingsLabel(dolci)), "poupa 90 € + IVA por ano (110,70 € com IVA)");
    assert.equal(annualSavingsLabel({ ...dolci, annual: undefined }), null);
    assert.equal(annualLineSavingsCents({ ...dolci, annual: undefined }, dolci.monthly[0]), 0);
  });

  it("charges on acceptance the one-off items plus the first year or the first month", () => {
    assert.deepEqual(dueOnAcceptance(dolci, "annual"), { subtotalCents: 102500, vatCents: 23575, totalCents: 126075 });
    assert.deepEqual(dueOnAcceptance(dolci, "monthly"), { subtotalCents: 62000, vatCents: 14260, totalCents: 76260 });
    assert.equal(dueLabel(dolci, "annual"), "itens únicos + 1.º ano");
    assert.equal(dueLabel(dolci, "monthly"), "itens únicos + 1.ª mensalidade");
  });

  it("offers the annual plan first, and only when the proposal has it", () => {
    assert.deepEqual(planOptions(dolci), ["annual", "monthly"]);
    const monthlyOnly = { ...dolci, annual: undefined };
    assert.deepEqual(planOptions(monthlyOnly), ["monthly"]);
    assert.equal(proposalTotals(monthlyOnly).annual, null);
    assert.deepEqual(dueOnAcceptance(monthlyOnly, "annual"), dueOnAcceptance(dolci, "monthly"));
    assert.deepEqual(planOptions({ ...dolci, monthly: [] }), []);
    assert.equal(plain(planLabel(dolci, "annual")), "Anual, pago adiantado (2 meses grátis): 450 € + IVA/ano");
    assert.equal(plain(planLabel(dolci, "monthly")), "Mensal: 45 € + IVA/mês");
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
    assert.equal(plain(formatEuros(102500)), "1 025 €");
    assert.equal(plain(formatEuros(126075)), "1 260,75 €");
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
  it("asks for the payment plan when the proposal offers a choice, and reads only its name", () => {
    assert.equal(validateAcceptance(form(), ["annual", "monthly"]).data.plan, "annual");
    assert.equal(validateAcceptance(form({ plan: "monthly" }), ["annual", "monthly"]).data.plan, "monthly");
    for (const plan of [undefined, "", "yearly", "450"]) {
      const result = validateAcceptance(form({ plan }), ["annual", "monthly"]);
      assert.equal(result.ok, false, String(plan));
      assert.match(result.errors.plan, /como prefere pagar/);
    }
    assert.equal(validateAcceptance(form({ plan: undefined }), ["monthly"]).data.plan, "monthly");
    assert.equal(validateAcceptance(form({ plan: "annual" }), ["monthly"]).data.plan, "monthly");
  });

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
    assert.equal(plain(rows.Mensalidades), "Anual, pago adiantado (2 meses grátis): 450 € + IVA/ano");
    assert.equal(plain(rows["Na adjudicação"]), "1 260,75 € com IVA (itens únicos + 1.º ano)");
    assert.ok(owner.intro.some((line) => plain(line).includes("1 025 € + IVA 235,75 € = 1 260,75 €")));
    assert.equal(plain(rows.Poupança), "poupa 90 € + IVA por ano (110,70 € com IVA)");
    assert.deepEqual(
      owner.tables[2].rows.map((row) => plain(row[0]).split("\n")[1]),
      ["em vez de 180 €: poupa 30 €", "em vez de 360 €: poupa 60 €"],
    );
    assert.equal(owner.adminUrl, "https://www.steevanz.com/proposta/dolci-salati-695graik");
    const tables = owner.tables.map((table) => ({ title: table.title, foot: table.foot.map(([label, value]) => [label, plain(value)]) }));
    assert.deepEqual(tables[0].foot.at(-1), ["Total com IVA", "707,25 €"]);
    assert.deepEqual(tables[1].foot.at(-1), ["Total com IVA", "55,35 €/mês"]);
    assert.deepEqual(tables[2].foot.at(-1), ["Total com IVA", "553,50 €/ano"]);

    assert.equal(later.length, 1);
    const client = later[0];
    assert.deepEqual(client.to, ["faturas@exemplo.pt"]);
    assert.equal(client.from, undefined); // mail@steevanz.com
    assert.equal(client.replyTo, "rcabaco@steevanz.com");
    assert.match(client.heading, /Obrigado, Dolci e Salati! Está feito\./);
    assert.ok(client.intro.some((line) => /entra em contacto em breve/.test(line)));
    assert.ok(client.intro.some((line) => plain(line).includes("1.º ano (plano anual, 2 meses grátis): 1 025 € + IVA 235,75 € = 1 260,75 €")));
    assert.match(plain(client.rows.find((row) => row.label === "Mensalidades").value), /Anual/);
    assert.match(client.note, /bons modos de antigamente/);
    assert.ok(client.intro.some((line) => plain(line).includes("poupa 90 € + IVA por ano (110,70 € com IVA)")));
  });

  it("bills the first month when the client picks the monthly plan", async () => {
    const { sent, later, deps: d } = deps();
    await processAcceptance(dolci, form({ plan: "monthly" }), { status: "idle" }, d);
    const rows = Object.fromEntries(sent[0].rows.map((row) => [row.label, row.value]));
    assert.equal(plain(rows.Mensalidades), "Mensal: 45 € + IVA/mês");
    assert.equal(plain(rows["Na adjudicação"]), "762,60 € com IVA (itens únicos + 1.ª mensalidade)");
    assert.equal(sent[0].tables.length, 2);
    assert.equal(rows.Poupança, null);
    assert.ok(later[0].intro.some((line) => plain(line).includes("1.ª mensalidade: 620 € + IVA 142,60 € = 762,60 €")));
  });

  it("ignores amounts sent with the form", async () => {
    const { sent, deps: d } = deps();
    const data = form();
    data.set("total", "1");
    data.set("unitCents", "1");
    await processAcceptance(dolci, data, { status: "idle" }, d);
    assert.equal(plain(Object.fromEntries(sent[0].rows.map((row) => [row.label, row.value]))["Na adjudicação"]), "1 260,75 € com IVA (itens únicos + 1.º ano)");
  });

  it("does not thank the client when the owner email fails", async () => {
    const { later, deps: d } = deps(false);
    const state = await processAcceptance(dolci, form(), { status: "idle" }, d);
    assert.equal(state.status, "error");
    assert.equal(state.code, "send_failed");
    assert.equal(state.values.company, "Dolci e Salati, Lda.");
    assert.equal(state.plan, "annual");
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
