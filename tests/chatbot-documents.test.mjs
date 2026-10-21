import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deflateRawSync } from "node:zlib";
import { demoLodging } from "../src/lib/chatbot/demo.ts";
import { documentKindOf, headingOf, htmlToText, splitIntoChunks } from "../src/lib/chatbot/documents.ts";
import { respond } from "../src/lib/chatbot/engine.ts";
import { docxToText, extractDocument, isPrivateHost } from "../src/lib/chatbot/extract.ts";
import { buildIndex, minimumChunkScore, searchChunks } from "../src/lib/chatbot/knowledge.ts";
import { chunksFrom } from "../src/lib/chatbot/rows.ts";
import { newConversationState } from "../src/lib/chatbot/types.ts";

/** A minimal .docx (zip with word/document.xml), built here so the test needs no fixture file. */
function makeDocx(xml) {
  const name = Buffer.from("word/document.xml");
  const data = deflateRawSync(Buffer.from(xml, "utf8"));
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt32LE(0, 42);
  const centralOffset = local.length + name.length + data.length;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(central.length + name.length, 12);
  end.writeUInt32LE(centralOffset, 16);
  return new Uint8Array(Buffer.concat([local, name, data, central, name, end]));
}

/** A minimal one-page PDF with Helvetica text and a correct cross-reference table. */
function makePdf(lines) {
  const content = `BT /F1 12 Tf 72 720 Td 16 TL ${lines.map((line) => `(${line}) Tj T*`).join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Uint8Array(Buffer.from(body, "latin1"));
}

const guide = `# Guia da casa

## Lixo e reciclagem
O caixote do lixo fica debaixo do lava-loiça. Os ecopontos estão no fim da rua.

## Aquecimento
Os radiadores ligam-se no botão branco ao lado da porta da sala.

## Praias
A praia fluvial fica a 10 minutos a pé, seguindo o caminho junto ao rio.`;

describe("chatbot documents: reading files", () => {
  it("recognises the file kinds", () => {
    assert.equal(documentKindOf("guia.pdf", "", new Uint8Array([0x25, 0x50, 0x44, 0x46])), "pdf");
    assert.equal(documentKindOf("guia.docx", "", new Uint8Array([0x50, 0x4b, 0x03, 0x04])), "docx");
    assert.equal(documentKindOf("notas.md", "", new Uint8Array()), "markdown");
    assert.equal(documentKindOf("notas.txt", "text/plain", new Uint8Array()), "text");
    assert.equal(documentKindOf("foto.jpg", "image/jpeg", new Uint8Array([0xff, 0xd8])), null);
  });

  it("reads Word: headings become sections, text and accents kept", () => {
    const xml =
      '<w:document><w:body>' +
      '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Check-out</w:t></w:r></w:p>' +
      '<w:p><w:r><w:t xml:space="preserve">Saída até às 11:00. </w:t></w:r><w:r><w:t>Deixe as chaves na mesa.</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:pStyle w:val="Ttulo2"/></w:pPr><w:r><w:t>Lixo &amp; reciclagem</w:t></w:r></w:p>' +
      "<w:p><w:r><w:t>Ecopontos no fim da rua.</w:t></w:r></w:p>" +
      "</w:body></w:document>";
    const text = docxToText(makeDocx(xml));
    assert.match(text, /^# Check-out/m);
    assert.match(text, /Saída até às 11:00\. Deixe as chaves na mesa\./);
    assert.match(text, /^## Lixo & reciclagem/m);
  });

  it("reads a PDF with the free pdf.js (unpdf)", async () => {
    const result = await extractDocument("menu.pdf", "application/pdf", makePdf(["Menu do dia", "Sopa de legumes 3 euros", "Bacalhau com natas 12 euros"]));
    assert.equal(result.kind, "pdf");
    assert.match(result.text, /Bacalhau com natas 12 euros/);
  });

  it("refuses unknown formats and empty documents with a clear message", async () => {
    await assert.rejects(extractDocument("foto.jpg", "image/jpeg", new Uint8Array([0xff, 0xd8, 0xff])), /Formato não suportado/);
    await assert.rejects(extractDocument("vazio.txt", "text/plain", new TextEncoder().encode("   ")), /vazio/);
  });

  it("reads a web page's text: headings kept, scripts and menus dropped", () => {
    const { title, text } = htmlToText(
      "<html><head><title>Casa &amp; Rio</title><script>var x=1</script></head><body><nav>Menu Início</nav><h2>Regras</h2><p>Silêncio a partir das 22:00.</p><ul><li>Não fumar</li></ul><footer>©</footer></body></html>",
    );
    assert.equal(title, "Casa & Rio");
    assert.match(text, /^## Regras/m);
    assert.match(text, /Silêncio a partir das 22:00\./);
    assert.match(text, /• Não fumar/);
    assert.ok(!text.includes("var x"));
    assert.ok(!text.includes("Início"));
  });

  it("never fetches private addresses", () => {
    for (const host of ["localhost", "127.0.0.1", "10.0.0.5", "192.168.1.1", "172.20.0.1", "169.254.169.254", "::1", "db.internal"]) assert.equal(isPrivateHost(host), true, host);
    assert.equal(isPrivateHost("www.example.com"), false);
  });
});

describe("chatbot documents: sections", () => {
  it("recognises section titles", () => {
    assert.deepEqual(headingOf("## Aquecimento"), { level: 2, text: "Aquecimento" });
    assert.deepEqual(headingOf("REGRAS DA CASA"), { level: 2, text: "REGRAS DA CASA" });
    assert.deepEqual(headingOf("Horário de verão:"), { level: 3, text: "Horário de verão" });
    assert.equal(headingOf("O check-out é até às 11:00."), null);
  });

  it("cuts a guide into titled sections", () => {
    const chunks = splitIntoChunks(guide, "Guia");
    assert.equal(chunks.length, 3);
    assert.equal(chunks[0].heading, "Guia › Guia da casa › Lixo e reciclagem");
    assert.match(chunks[1].body, /radiadores/);
    assert.equal(chunks[2].heading, "Guia › Guia da casa › Praias");
  });

  it("keeps long sections under the size ceiling", () => {
    const long = Array.from({ length: 80 }, (_, i) => `Frase número ${i} sobre a casa e os seus equipamentos.`).join(" ");
    const chunks = splitIntoChunks(`# Equipamentos\n${long}`, "Guia");
    assert.ok(chunks.length > 1);
    assert.ok(chunks.every((chunk) => chunk.body.length <= 1200));
    assert.ok(chunks.every((chunk) => chunk.heading === "Guia › Equipamentos"));
  });

  it("only uses sections of active documents", () => {
    const documents = [
      { id: "d1", title: "Guia", active: true, property: null, language: "pt" },
      { id: "d2", title: "Antigo", active: false, property: null, language: null },
    ];
    const chunks = chunksFrom(documents, [
      { id: "c1", document_id: "d1", position: 0, heading: "Guia", body: "Texto" },
      { id: "c2", document_id: "d2", position: 0, heading: "Antigo", body: "Texto velho" },
    ]);
    assert.deepEqual(chunks.map((chunk) => chunk.id), ["c1"]);
    assert.equal(chunks[0].language, "pt");
  });
});

describe("chatbot documents: search and answers", () => {
  const chunks = splitIntoChunks(guide, "Guia").map((chunk, index) => ({ id: `c${index}`, documentId: "g", documentTitle: "Guia", heading: chunk.heading, body: chunk.body }));
  const index = buildIndex({ entries: [], items: [], chunks });

  it("ranks the right section first (BM25 + titles + concepts)", () => {
    assert.equal(searchChunks(index, "Onde ponho o lixo?")[0].doc.chunk.id, "c0");
    assert.equal(searchChunks(index, "Como ligo os radiadores?")[0].doc.chunk.id, "c1");
    // Another language, through the six-language concepts.
    assert.equal(searchChunks(index, "Is there a beach nearby?")[0].doc.chunk.id, "c2");
  });

  it("finds nothing for unrelated questions", () => {
    const hits = searchChunks(index, "Qual é a capital da Mongólia?").filter((hit) => hit.score >= minimumChunkScore && hit.coverage >= 0.5);
    assert.equal(hits.length, 0);
  });

  it("answers from a document and says which one (for the admin)", async () => {
    const now = new Date("2026-10-20T12:30:00Z");
    const result = await respond({
      bot: demoLodging,
      conversation: { ...newConversationState(), greeted: true, language: "pt" },
      history: [],
      message: { body: "Onde fica o supermercado mais perto?", at: now.getTime() },
      now,
    });
    assert.match(result.replies[0], /400 metros/);
    assert.equal(result.sources[0].documentTitle, "Guia da casa (exemplo)");
    assert.match(result.sources[0].heading, /Supermercado e farmácia/);
  });

  it("business answers still win over documents", async () => {
    const now = new Date("2026-10-20T12:30:00Z");
    const result = await respond({
      bot: demoLodging,
      conversation: { ...newConversationState(), greeted: true, language: "pt" },
      history: [],
      message: { body: "A que horas é o check-out?", at: now.getTime() },
      now,
    });
    assert.match(result.replies[0], /11:00/);
    assert.deepEqual(result.sources, []);
  });
});
