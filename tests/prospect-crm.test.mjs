import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDays,
  compareProspects,
  isDate,
  isDue,
  lisbonToday,
  listKey,
  niceDate,
  noAnswer,
  sectorOf,
  spreadsheet,
  stageChange,
  vcard,
  whatsappLink,
  whatsappMessage,
  whatsappNumber,
} from "../src/lib/prospects/crm.ts";
import { verdictFromLink, verdictFromProbe } from "../src/lib/prospects/site-check.ts";

describe("CRM dates", () => {
  it("uses the Lisbon calendar day", () => {
    assert.equal(lisbonToday(new Date("2026-10-23T23:30:00Z")), "2026-10-24");
    assert.equal(lisbonToday(new Date("2026-01-15T23:30:00Z")), "2026-01-15");
  });

  it("adds days across months and years", () => {
    assert.equal(addDays("2026-10-30", 3), "2026-11-02");
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  });

  it("names days like a person would", () => {
    const today = "2026-10-23";
    assert.equal(niceDate("2026-10-23", today), "Hoje");
    assert.equal(niceDate("2026-10-24", today), "Amanhã");
    assert.equal(niceDate("2026-10-22", today), "Ontem");
    assert.equal(niceDate("2026-10-27", today), "Ter., 27 out.");
    assert.equal(niceDate("2027-01-04", today), "Seg., 4 jan. 2027");
  });

  it("only accepts real dates", () => {
    assert.ok(isDate("2026-02-28"));
    assert.ok(!isDate("2026-02-30"));
    assert.ok(!isDate("26-02-01"));
  });
});

describe("CRM pipeline", () => {
  const today = "2026-10-23";

  it("is due from the next contact day on, unless the conversation is over", () => {
    assert.ok(isDue({ status: "contacted", next_contact: "2026-10-23" }, today));
    assert.ok(isDue({ status: "new", next_contact: "2026-10-01" }, today));
    assert.ok(!isDue({ status: "contacted", next_contact: "2026-10-24" }, today));
    assert.ok(!isDue({ status: "customer", next_contact: "2026-10-01" }, today));
    assert.ok(!isDue({ status: "new", next_contact: null }, today));
  });

  it("«Contactado» brings a next contact in 3 days, closing clears it", () => {
    assert.deepEqual(stageChange({ next_contact: null }, "contacted", today), { status: "contacted", next_contact: "2026-10-26" });
    assert.deepEqual(stageChange({ next_contact: "2026-11-02" }, "contacted", today), { status: "contacted", next_contact: "2026-11-02" });
    assert.deepEqual(stageChange({ next_contact: "2026-11-02" }, "lost", today), { status: "lost", next_contact: null });
    assert.deepEqual(stageChange({ next_contact: "2026-11-02" }, "meeting", today), { status: "meeting", next_contact: "2026-11-02" });
  });

  it("«Não atendeu» counts the attempt and calls again tomorrow", () => {
    assert.deepEqual(noAnswer({ attempts: 2 }, today), { attempts: 3, next_contact: "2026-10-24" });
  });

  it("puts due businesses first, closed ones last, broken sites before no site", () => {
    const rows = [
      { name: "fechado", status: "lost", next_contact: null, attempts: 0, reviews: 900, site_status: "down", worked_at: null },
      { name: "sem site", status: "new", next_contact: null, attempts: 0, reviews: 800, site_status: "none", worked_at: null },
      { name: "em baixo", status: "new", next_contact: null, attempts: 0, reviews: 10, site_status: "down", worked_at: null },
      { name: "hoje", status: "contacted", next_contact: today, attempts: 0, reviews: 1, site_status: "ok", worked_at: null },
    ];
    assert.deepEqual(
      rows.sort(compareProspects("prio", today)).map((row) => row.name),
      ["hoje", "em baixo", "sem site", "fechado"],
    );
  });
});

describe("CRM sectors", () => {
  it("groups Google categories like the Armação de Pêra list", () => {
    assert.equal(sectorOf("Barbeiro"), "Barbearias");
    assert.equal(sectorOf("Salão de cabeleireiro"), "Cabeleireiros");
    assert.equal(sectorOf("Restaurante de brunch"), "Restauração");
    assert.equal(sectorOf("Espresso bar"), "Cafés e pastelarias");
    assert.equal(sectorOf("Bar de cocktails"), "Bares");
    assert.equal(sectorOf("Salão de Unhas"), "Estética e beleza");
    assert.equal(sectorOf("Agência Imobiliária"), "Imobiliárias");
    assert.equal(sectorOf("Operador de barcos turísticos"), "Atividades e turismo");
    assert.equal(sectorOf("Florista"), "Lojas");
    assert.equal(sectorOf("Adega"), "Outros");
    assert.equal(sectorOf(null), "Outros");
  });

  it("treats zones typed differently as the same list", () => {
    assert.equal(listKey(" Armação  de Pêra "), listKey("armação de pêra"));
  });
});

describe("CRM WhatsApp and contact cards", () => {
  it("only offers WhatsApp to numbers that can have it", () => {
    assert.equal(whatsappNumber("+351 927 491 856"), "351927491856");
    assert.equal(whatsappNumber("927 491 856"), "351927491856");
    assert.equal(whatsappNumber("+351 282 314 551"), null);
    assert.equal(whatsappNumber("+44 7700 900123"), "447700900123");
    assert.equal(whatsappNumber(null), null);
  });

  it("fills the message with the business and the sentence for its website", () => {
    const settings = {
      whatsapp_template: "Olá! {situacao} Posso mostrar um exemplo ao {negocio}?",
      whatsapp_none: "Vi que o {negocio} não tem site.",
      whatsapp_down: "O site do {negocio} não abre.",
      whatsapp_ai: "",
      whatsapp_outdated: "",
      whatsapp_other: "Vi o {negocio} no Google.",
    };
    assert.equal(whatsappMessage(settings, { name: "Zé Leiteiro", site_status: "none" }), "Olá! Vi que o Zé Leiteiro não tem site. Posso mostrar um exemplo ao Zé Leiteiro?");
    assert.equal(whatsappMessage(settings, { name: "Bar X", site_status: "ai" }), "Olá! Posso mostrar um exemplo ao Bar X?");
    assert.equal(whatsappMessage(settings, { name: "Bar X", site_status: null }), "Olá! Vi o Bar X no Google. Posso mostrar um exemplo ao Bar X?");
    assert.equal(whatsappLink("+351 927 491 856", "Olá & até já"), "https://wa.me/351927491856?text=Ol%C3%A1%20%26%20at%C3%A9%20j%C3%A1");
    assert.equal(whatsappLink("+351 282 314 551", "Olá"), null);
  });

  it("saves the business on the phone as «Nome · Lead Steevanz»", () => {
    const card = vcard({
      name: "Bar; Cristal, Lda",
      phone: "+351 928 042 293",
      email: "contato@barcristal.com",
      other_emails: ["outro@barcristal.com"],
      website: "http://www.barcristal.com/",
      address: "R. Dom João II 2, 8365-132 Armação de Pêra",
      maps_url: "https://maps.google.com/?cid=1",
      category: "Bar de cocktails",
    });
    assert.match(card, /^BEGIN:VCARD\r\nVERSION:3\.0\r\n/);
    assert.match(card, /\r\nFN:Bar\\; Cristal\\, Lda · Lead Steevanz\r\n/);
    assert.match(card, /\r\nTEL;TYPE=CELL:\+351928042293\r\n/);
    assert.match(card, /\r\nEMAIL;TYPE=INTERNET,WORK:outro@barcristal\.com\r\n/);
    assert.match(card, /\r\nADR;TYPE=WORK:;;R\. Dom João II 2\\, 8365-132 Armação de Pêra;;;;\r\n/);
    assert.match(card, /\r\nNOTE:Bar de cocktails\\nGoogle Maps: https:\/\/maps\.google\.com\/\?cid=1\r\n/);
    assert.match(card, /END:VCARD$/);
    assert.match(vcard({ name: "Café", phone: "+351 282 315 900", email: null, other_emails: [], website: null, address: null, maps_url: null, category: null }), /TEL;TYPE=WORK,VOICE:\+351282315900/);
  });

  it("copies to Excel as tab-separated lines, without tabs or line breaks inside cells", () => {
    const text = spreadsheet([
      {
        name: "Zé\tLeiteiro",
        category: "Restaurante",
        sector: "Restauração",
        site_status: "none",
        site_reasons: ["Sem site no Google"],
        phone: "+351 282 314 551",
        email: null,
        other_emails: [],
        website: null,
        address: "R. das Portas do Mar 15",
        rating: 4.6,
        reviews: 2111,
        maps_url: null,
        status: "contacted",
        next_contact: "2026-10-26",
        attempts: 2,
        notes: "Ligar\nàs 15h",
      },
    ]);
    const [head, line] = text.split("\n");
    assert.equal(head.split("\t").length, 16);
    assert.deepEqual(line.split("\t"), ["Zé Leiteiro", "Restaurante", "Restauração", "Sem site próprio", "Sem site no Google", "+351 282 314 551", "", "", "R. das Portas do Mar 15", "4,6", "2111", "", "Contactado", "26/10/2026", "2", "Ligar às 15h"]);
  });
});

describe("website label", () => {
  it("tells from the link alone when there is no site of its own", () => {
    assert.deepEqual(verdictFromLink(null), { status: "none", reasons: ["Sem site no Google"] });
    assert.deepEqual(verdictFromLink("https://www.facebook.com/churrasqueiraocasarao"), { status: "none", reasons: ["Sem site próprio: o Google aponta para Facebook"] });
    assert.equal(verdictFromLink("http://casco-de-rolha.blogspot.com/2026/01/post.html")?.status, "none");
    assert.equal(verdictFromLink("https://sardinhaassadada.eatbu.com/?lang=pt#")?.status, "none");
    assert.equal(verdictFromLink("https://www.clinicahubbtogether.pt/"), null);
  });

  const page = (body, head = '<meta name="viewport" content="width=device-width">') => `<!doctype html><html><head><title>Casa</title>${head}</head><body>${body}</body></html>`;
  const plenty = "<p>Bem-vindo ao nosso restaurante, com peixe fresco todos os dias e vista para o mar.</p>";

  it("marks sites that do not open, error or show no site as down", () => {
    assert.deepEqual(verdictFromProbe({ failure: "dns" }, 2026), { status: "down", reasons: ["site não abre (domínio em baixo ou expirado)"] });
    assert.deepEqual(verdictFromProbe({ status: 404, finalUrl: "https://x.pt/", html: page(plenty) }, 2026), { status: "down", reasons: ["site dá erro (404)"] });
    assert.equal(verdictFromProbe({ status: 200, finalUrl: "https://x.pt/", html: page("<h1>This domain is for sale</h1>") }, 2026).reasons[0], "o domínio está estacionado (página de parking, sem site)");
    assert.equal(verdictFromProbe({ status: 200, finalUrl: "https://x.pt/", html: "<html><head><title>Welcome to OpenResty!</title></head><body>x</body></html>" }, 2026).status, "down");
    assert.equal(verdictFromProbe({ status: 200, finalUrl: "https://x.pt/", html: page("") }, 2026).reasons[0], "a página inicial abre em branco");
  });

  it("does not call an app that draws itself with scripts blank", () => {
    assert.equal(verdictFromProbe({ status: 200, finalUrl: "https://x.pt/", html: page('<div id="root"></div><script src="/app.js"></script>') }, 2026).status, "ok");
  });

  it("marks old, insecure or non-mobile sites as out of date and keeps every reason", () => {
    const verdict = verdictFromProbe(
      {
        status: 200,
        finalUrl: "http://www.portugal-immobilier.com/",
        html: page(`${plenty}<footer>© 2018 Portugal Immobilier</footer><script src="/js/jquery-1.11.3.min.js"></script>`, '<meta name="generator" content="WordPress 4.7.2">'),
      },
      2026,
    );
    assert.equal(verdict.status, "outdated");
    assert.deepEqual(verdict.reasons, [
      "o site abre sem HTTPS (o browser mostra «não seguro»)",
      "WordPress muito antigo (4.7)",
      "código antigo (jQuery 1.x)",
      "sem versão para telemóvel",
      "o rodapé ainda diz © 2018",
    ]);
    assert.equal(verdictFromProbe({ badCertificate: true, status: 200, finalUrl: "http://banga-sol.com/", html: page(plenty) }, 2026).reasons[0], "o certificado de segurança não é válido (o browser mostra «não seguro»)");
  });

  it("only says «made with AI» when the site says so itself", () => {
    assert.deepEqual(verdictFromProbe({ status: 200, finalUrl: "https://restaurantedavi.com/", html: page(`${plenty}<script src="https://cdn.gpteng.co/lovable.js"></script><meta content="lovable.dev">`) }, 2026), {
      status: "ai",
      reasons: ["feito com Lovable (IA)"],
    });
  });

  it("leaves a sound, recent site alone", () => {
    assert.deepEqual(verdictFromProbe({ status: 200, finalUrl: "https://x.pt/", html: page(`${plenty}<footer>© 2025</footer>`) }, 2026), { status: "ok", reasons: [] });
  });
});
