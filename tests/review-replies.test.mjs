import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { autoRemaining, defaultReplySettings, replyWindowStart, shouldAutoApprove, toneFingerprint } from "../src/lib/reviews/replies.ts";
import { applyAddress, composeDistinct, composeOptions, composeReply, replyKey, isEnglish, isOwnText, learnFromAnswer, ownTextKeys, snippetRetired } from "../src/lib/reviews/reply-rules.ts";

const settings = (changes = {}) => ({ ...defaultReplySettings, ...changes });

describe("automatic replies", () => {
  it("never approves when off", () => {
    assert.equal(shouldAutoApprove(settings({ autoMode: "off" }), 5), false);
  });

  it("approves only while the trial quota lasts", () => {
    assert.equal(shouldAutoApprove(settings({ autoMode: "limit", autoLimit: 10, autoUsed: 9 }), 5), true);
    assert.equal(shouldAutoApprove(settings({ autoMode: "limit", autoLimit: 10, autoUsed: 10 }), 5), false);
    assert.equal(autoRemaining(settings({ autoMode: "limit", autoLimit: 10, autoUsed: 4 })), 6);
    assert.equal(autoRemaining(settings({ autoMode: "always" })), null);
  });

  it("keeps 1–3★ reviews manual unless negatives are allowed", () => {
    for (const rating of [1, 2, 3]) {
      assert.equal(shouldAutoApprove(settings({ autoMode: "always" }), rating), false);
      assert.equal(shouldAutoApprove(settings({ autoMode: "always", autoNegative: true }), rating), true);
    }
    assert.equal(shouldAutoApprove(settings({ autoMode: "always" }), 4), true);
  });
});

describe("reply window", () => {
  it("only reaches 30 days before the setup, so old unanswered reviews are left out", () => {
    assert.equal(replyWindowStart("2026-10-03T12:00:00.000Z")?.toISOString(), "2026-09-03T12:00:00.000Z");
    assert.equal(replyWindowStart(null), null);
  });
});

describe("rule-based replies", () => {
  const review = (id, rating, text) => ({ id, rating, text });
  const own = (id, kind, sentiment, text, theme = null, extra = {}) => ({ id, kind, sentiment, theme, text, accepted: 0, rejected: 0, ...extra });

  it("picks the address form", () => {
    assert.equal(applyAddress("Obrigado pela {sua |tua |}review!", "voce"), "Obrigado pela sua review!");
    assert.equal(applyAddress("Obrigado pela {sua |tua |}review!", "tu"), "Obrigado pela tua review!");
    assert.equal(applyAddress("Obrigado pela {sua |tua |}review!", "neutro"), "Obrigado pela review!");
  });

  it("talks about the themes the review mentions and signs", () => {
    const result = composeReply({ review: review("r1", 5, "O atendimento foi impecável e muito simpático"), settings: settings({ length: "media", signature: "Rui" }), library: [] });
    assert.match(result.reasoning, /atendimento/);
    assert.ok(result.reply.endsWith("\n\nRui"));
    assert.ok(result.snippetIds.some((id) => id.startsWith("default:th-p-service")));
  });

  it("prefers the owner's own sentences over base sentences", () => {
    const library = [own("a", "opening", "positive", "Obrigadão, fico mesmo feliz!"), own("b", "theme", "positive", "A equipa é tudo para nós.", "service")];
    const result = composeReply({ review: review("r2", 5, "Atendimento cinco estrelas"), settings: settings(), library });
    assert.match(result.reply, /^Obrigadão, fico mesmo feliz! A equipa é tudo para nós\./);
    assert.match(result.reasoning, /2 frases suas/);
  });

  it("invites unhappy customers to the owner's contact and never uses base contact sentences without one", () => {
    const withContact = composeReply({ review: review("r3", 2, "Esperámos uma hora pela comida"), settings: settings({ negativeContact: "geral@cafe.pt" }), library: [] });
    assert.match(withContact.reply, /geral@cafe\.pt/);
    const without = composeReply({ review: review("r3", 2, "Esperámos uma hora pela comida"), settings: settings(), library: [] });
    assert.doesNotMatch(without.reply, /<contacto>|:\s*\./);
  });

  it("starts star-only replies with the owner's template but never repeats it word for word", () => {
    const template = "Obrigado pelas estrelas! Esperamos vê-lo em breve.";
    const result = composeReply({ review: review("r4", 5, null), settings: settings({ emptyPositive: template }), library: [] });
    assert.match(result.reply, /^Obrigado pelas estrelas! /);
    assert.equal(isOwnText(result.reply, "", new Set(ownTextKeys(template))), false);
  });

  it("answers English reviews with an English base reply", () => {
    assert.equal(isEnglish("The food was great and the staff were very friendly"), true);
    assert.equal(isEnglish("A comida estava ótima e o staff muito simpático"), false);
    assert.match(composeReply({ review: review("r5", 5, "The food was great and the staff were very friendly"), settings: settings(), library: [] }).reply, /^(Thank|Thanks|We really)/);
  });

  it("avoids sentences from a rejected draft and retires sentences rejected more than accepted", () => {
    const library = [own("a", "opening", "positive", "Frase A."), own("b", "opening", "positive", "Frase B.")];
    const first = composeReply({ review: review("r6", 5, "Gostei"), settings: settings(), library });
    const second = composeReply({ review: review("r6", 5, "Gostei"), settings: settings(), library, exclude: first.snippetIds });
    assert.notEqual(first.reply.split(" ")[1], second.reply.split(" ")[1]);
    assert.equal(snippetRetired({ accepted: 0, rejected: 2 }), true);
    assert.equal(snippetRetired({ accepted: 3, rejected: 2 }), false);
  });

  it("files the owner's answer: opening, theme, contact and closing, without the signature", () => {
    const learned = learnFromAnswer(
      "Obrigado pela visita! Lamentamos a espera, estamos a reforçar a equipa. Fale connosco para geral@cafe.pt. Até breve!\nRui",
      2,
      { signature: "Rui", negativeContact: "geral@cafe.pt" },
    );
    assert.deepEqual(
      learned.map((item) => [item.kind, item.theme, item.sentiment]),
      [
        ["opening", null, "negative"],
        ["theme", "waiting", "negative"],
        ["contact", null, "negative"],
        ["closing", null, "negative"],
      ],
    );
    assert.equal(learned[2].text, "Fale connosco para <contacto>.");
  });
});

describe("never suggest the owner's own text", () => {
  const own = (id, kind, text, theme = null) => ({ id, kind, sentiment: "positive", theme, text, accepted: 0, rejected: 0 });

  it("compares ignoring case, accents, punctuation, emojis and the signature line", () => {
    const keys = new Set(ownTextKeys("Obrigado pela visita! Até breve 😊\nRui"));
    assert.equal(isOwnText("obrigado pela visita, ate breve!", "", keys), true);
    assert.equal(isOwnText("Obrigado pela visita! Até breve!\n\nRui", "Rui", keys), true);
    assert.equal(isOwnText("Obrigado pela visita! Volte sempre!", "", keys), false);
  });

  it("swaps sentences when the composition would be exactly what the owner wrote", () => {
    const library = [own("a", "opening", "Obrigado pela visita!"), own("b", "closing", "Até breve!"), own("c", "closing", "Volte sempre!")];
    const input = { review: { id: "x", rating: 5, text: "Gostei muito" }, settings: { ...defaultReplySettings }, library };
    for (const written of ["Obrigado pela visita! Até breve!", "Obrigado pela visita! Volte sempre!"]) {
      const result = composeDistinct(input, new Set(ownTextKeys(written)));
      assert.ok(result);
      assert.equal(isOwnText(result.reply, "", new Set(ownTextKeys(written))), false);
    }
  });
});

describe("tones", () => {
  it("the same form answers are the same tone, in any order; signature, contact and automatic replies do not count", () => {
    const a = { ...defaultReplySettings, tone: ["proximo", "caloroso"], autoMode: "off" };
    const b = { ...defaultReplySettings, tone: ["caloroso", "proximo"], autoMode: "always", signature: "  " };
    assert.equal(toneFingerprint(a), toneFingerprint(b));
    assert.notEqual(toneFingerprint(a), toneFingerprint({ ...a, addressForm: "tu" }));
    assert.equal(toneFingerprint(a), toneFingerprint({ ...a, negativeContact: "geral@cafe.pt", signature: "Rui" }));
    assert.notEqual(toneFingerprint(a), toneFingerprint({ ...a, emptyPositive: "Obrigado!" }));
  });
});

describe("alternatives (Outra resposta)", () => {
  const input = (rating, text) => ({ review: { id: "alt", rating, text }, settings: { ...defaultReplySettings }, library: [] });

  for (const [label, rating, text] of [
    ["positive with a theme", 5, "Atendimento muito simpático"],
    ["positive without a theme", 5, "Gostei muito"],
    ["negative with a theme", 2, "Esperámos imenso tempo"],
    ["star-only positive", 5, null],
    ["star-only negative", 1, null],
  ]) {
    it(`gives 5 different texts for a ${label} review, never one already shown`, () => {
      const shown = new Set([replyKey(composeReply(input(rating, text)).reply)]);
      const options = composeOptions(input(rating, text), new Set(), shown, 5);
      assert.equal(options.length, 5);
      const keys = options.map((option) => replyKey(option.reply));
      assert.equal(new Set(keys).size, 5);
      for (const key of keys) assert.equal(shown.has(key), false);
    });
  }
});

describe("learning from the owner's answer", () => {
  it("keeps a thanking first sentence as the opening even when it mentions a theme", () => {
    const learned = learnFromAnswer("Muito obrigado pela confiança e pelas palavras simpáticas! Foi um prazer trabalhar consigo.", 5, { signature: "", negativeContact: "" });
    assert.equal(learned[0].kind, "opening");
  });

  it("files contact invitations in positive replies as closings", () => {
    const learned = learnFromAnswer("Obrigado! Para qualquer novo projeto, fale connosco: geral@x.pt.", 5, { signature: "", negativeContact: "geral@x.pt" });
    assert.equal(learned[1].kind, "closing");
  });
});
