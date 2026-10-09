import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inferAddressForm,
  inferContact,
  inferEmojis,
  inferLength,
  inferReplySettings,
  inferSignature,
  inferStarOnlyReply,
  isPortugueseReply,
  learnableOwnerReply,
  ownerReplySnippets,
  signatureCandidate,
  stripSignature,
} from "../src/lib/reviews/owner-replies.ts";

// Rule 1: no invented reviews. These are only shapes of reply texts to exercise the rules.
const reply = (text, rating = 5, reviewText = "texto", reviewId = String(Math.random())) => ({ reviewId, rating, reviewText, reply: text });
const settings = { signature: "", negativeContact: "" };

describe("owner replies on Google: language and what is learned", () => {
  it("tells Portuguese replies, also short thank-yous", () => {
    assert.equal(isPortugueseReply("Muito obrigado 🙏"), true);
    assert.equal(isPortugueseReply("Boa tarde, obrigado pela visita e pelas palavras simpáticas"), true);
    assert.equal(isPortugueseReply("Thankyou so much for kind words 🙏"), false);
    assert.equal(isPortugueseReply("Thankyou Sir"), false);
    assert.equal(isPortugueseReply("🙏"), false);
  });

  it("skips very short replies", () => {
    assert.equal(learnableOwnerReply("Muito obrigado 🙏"), false);
    assert.equal(learnableOwnerReply("Obrigado pela visita, esperamos voltar a vê-lo em breve!"), true);
    assert.equal(learnableOwnerReply("Thank you so much for the visit, see you again soon!"), false);
    assert.deepEqual(ownerReplySnippets(reply("Obrigado!"), settings, null), []);
  });

  it("splits a reply into sentences without its signature", () => {
    const snippets = ownerReplySnippets(reply("Obrigado pela visita!\nO atendimento é a nossa prioridade.\n— Equipa X"), settings, "— Equipa X");
    assert.deepEqual(
      snippets.map((snippet) => [snippet.kind, snippet.text]),
      [
        ["opening", "Obrigado pela visita!"],
        ["theme", "O atendimento é a nossa prioridade."],
      ],
    );
  });

  it("turns the settings contact into the placeholder", () => {
    const snippets = ownerReplySnippets(reply("Lamentamos muito o sucedido. Fale connosco pelo 912345678.", 2), { signature: "", negativeContact: "912345678" }, null);
    assert.equal(snippets.at(-1).kind, "contact");
    assert.equal(snippets.at(-1).text, "Fale connosco pelo <contacto>.");
  });
});

describe("owner replies on Google: signature", () => {
  it("takes a last line or a trailing dash name", () => {
    assert.equal(signatureCandidate("Obrigado pela visita!\nEquipa X"), "Equipa X");
    assert.equal(signatureCandidate("Obrigado pela visita! — Rui"), "— Rui");
    assert.equal(signatureCandidate("Obrigado pela visita!\nVolte sempre"), null);
    assert.equal(signatureCandidate("Boa tarde,\nObrigado pela visita."), null);
    assert.equal(signatureCandidate("Obrigado pela visita!"), null);
  });

  it("needs at least 3 replies and a third of the substantial ones", () => {
    const signed = (text) => `${text}\nEquipa X`;
    assert.equal(inferSignature([signed("Obrigado pela visita, até breve!"), signed("Obrigado pelas palavras, até breve!")]), null);
    assert.equal(inferSignature([signed("Obrigado pela visita, até breve!"), signed("Obrigado pelas palavras, até breve!"), signed("Que bom ler isto, obrigado!")]), "Equipa X");
    const many = Array.from({ length: 12 }, (_, index) => `Obrigado pela visita número ${index}, até breve!`);
    assert.equal(inferSignature([...many, signed("a"), signed("b"), signed("c")]), null);
  });

  it("strips it from a reply", () => {
    assert.equal(stripSignature("Obrigado!\nEquipa X", "Equipa X"), "Obrigado!");
    assert.equal(stripSignature("Obrigado! — Rui", "Rui"), "Obrigado!");
    assert.equal(stripSignature("Obrigado!", null), "Obrigado!");
  });
});

describe("owner replies on Google: form answers", () => {
  const long = (words) => `Muito obrigado ${words} pela visita ao nosso espaço`;

  it("infers the address form only when clear", () => {
    assert.equal(inferAddressForm([long("pela tua"), long("pela tua"), long("pela tua")]), "tu");
    assert.equal(inferAddressForm([long("pela sua"), long("pela sua"), long("e")]), "voce");
    assert.equal(inferAddressForm([long("e"), long("e"), long("e"), long("e"), long("e")]), "neutro");
    assert.equal(inferAddressForm([long("pela tua"), long("pela sua"), long("e")]), null);
    // Too few replies with 6+ words: nothing is guessed.
    assert.equal(inferAddressForm([long("pela tua"), long("pela tua"), "Muito obrigado"]), null);
  });

  it("infers the length from the typical number of sentences", () => {
    assert.equal(inferLength(["Obrigado!", "Obrigado! Até breve.", "Muito obrigado."]), "curta");
    const four = "Obrigado! Gostámos muito. O atendimento conta. Até breve.";
    assert.equal(inferLength([four, four, "Obrigado!"]), "media");
    assert.equal(inferLength([four, four]), null);
  });

  it("infers emojis from replies to positive reviews", () => {
    assert.equal(inferEmojis(["Muito obrigado 🙏", "Obrigado", "Obrigado"]), true);
    assert.equal(inferEmojis(["Muito obrigado 🙏", "Obrigado", "Obrigado", "Obrigado"]), false);
    assert.equal(inferEmojis(["Muito obrigado 🙏"]), null);
  });

  it("infers a contact repeated in replies to negatives", () => {
    assert.equal(inferContact(["Fale connosco: geral@exemplo.pt", "Escreva para geral@exemplo.pt", "Lamentamos."]), "geral@exemplo.pt");
    assert.equal(inferContact(["Ligue 912 345 678", "Ligue 912345678"]), "912 345 678");
    assert.equal(inferContact(["Fale connosco: geral@exemplo.pt", "Lamentamos."]), null);
  });

  it("infers the reply to star-only reviews the owner repeats", () => {
    assert.equal(inferStarOnlyReply(["Muito obrigado 🙏", "Muito obrigado", "Obrigado"]), "Muito obrigado 🙏");
    assert.equal(inferStarOnlyReply(["Muito obrigado", "Obrigado"]), null);
  });

  it("puts it together, Portuguese replies only for the address form and length", () => {
    const replies = [
      reply("Muito obrigado 🙏", 5, null),
      reply("Muito obrigado 🙏", 5, null),
      reply("Muito obrigado", 5, "texto"),
      reply("Thankyou so much 🙏", 5, "text"),
      reply("Boa tarde,\nDesculpe o inconveniente, na próxima vez cuidaremos de você.", 3, "texto"),
    ];
    const inference = inferReplySettings(replies);
    assert.equal(inference.replies, 5);
    assert.equal(inference.portuguese, 4);
    assert.equal(inference.learnable, 1);
    assert.deepEqual(inference.suggested, { length: "curta", emojis: true, emptyPositive: "Muito obrigado 🙏" });
  });

  it("suggests nothing without replies", () => {
    assert.deepEqual(inferReplySettings([]), { replies: 0, portuguese: 0, learnable: 0, suggested: {} });
  });
});
