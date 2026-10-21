---
name: steevanz-chatbot
description: Rules and lessons for the Steevanz WhatsApp/site AI assistant (src/lib/chatbot, /admin/chatbot) — what the owner decided, what failed in tests and must never come back. Use before changing anything in the chatbot engine, its answers, providers, documents, admin or copy.
---

# Assistente IA (WhatsApp e site): regras e lições

Every fix lives in the shared engine (`src/lib/chatbot/*`), so it applies to every client and sector at once.
Never fix a client's case with a client-specific rule: generalise it and add it to the tests below.

## Decisões do dono (2026-10-20/21)

- **Never invent.** Prices, hours, dates, availability and policies come only from the business's information
  (knowledge entries, linked establishment/menu, documents). Otherwise «Não tenho essa informação» + offer of a
  person. Never «há vaga» at a given time (no access to the calendar): give opening hours and how to book.
- **No intro message** («Sou o assistente automático…») — removed for everyone on 2026-10-21, after being told about
  the AI Act art. 50 and RGPD. Don't bring it back without asking. A bare «Olá» still gets «Olá! Em que posso ajudar?».
- **Documents have no fixed structure.** A real business uploads whatever it has (messy PDF, Word, text pasted from
  Instagram/WhatsApp). Every piece of text must be findable whatever the layout: small passages + overlapping windows
  over the whole text; headings are only a bonus (`passages.ts`, `doc-answers.ts`). Never tune for one PDF layout.
- **Answers in the customer's language** (pt, en, es, fr, de, it); the business's text may be in another one.
- **Prices never with VAT calculated** (owner's absolute rule); the assistant does arithmetic only with the
  numbers in the excerpts and shows it (18 € − 2 € = 16 €).
- **Basics a client expects** (2026-10-21, «Estas coisas básicas têm de estar feitas»): follow-ups in context,
  a question back instead of «não sei» when the question is ambiguous, natural pt-PT, Portuguese on doubt.
- **Test number** 937 967 281: open-wa only for internal tests, listen-only first, allowlist, never initiate,
  never «crazy tests» that could get it banned. Clients use the official WhatsApp Cloud API.

## Providers

| Value | What | Where it works |
|---|---|---|
| `mock` | Free rule-based answers (search + quotes) | Everywhere; the fallback for every error |
| `groq` | Groq free tier, `openai/gpt-oss-120b` (the account has no llama-3.3-70b) | Site + runner; needs `GROQ_API_KEY` + `CHATBOT_GROQ_ENABLED=1` on Vercel |
| `ollama` | Local `qwen2.5:7b` on the owner's PC | Only on that PC (runner or local dev) — never on Vercel |
| `real` | **AI for clients: Mistral (EU)**, `mistral-small-latest` (= mistral-small-2603, sent with `reasoning_effort: "none"`), `llm/mistral.ts` | Site + runner, only with `answer_provider = 'real'` **and** `paid_answers_allowed` (admin-only «Autorizar IA paga» button in Definições); needs `MISTRAL_API_KEY` |

- Mistral account: free «Experiment» plan now (no card; Mistral may use requests to improve its models → test data
  only); paid «Scale» with a spending limit in Mistral's console when the first client arrives — the owner's
  decision, never ours. Caps by default inside the free plan: ≥ 1,1 s between requests (a turn waits ≤ 3 s, else
  free answers), 30/min, 500/day, per bot 15/min and 300/day, 1 M tokens/day (`CHATBOT_MISTRAL_*`).
  429 → pause (retry-after); 402/billing or 401 → off until restart; timeout 15 s; never a retry loop.
- 'real' without the owner's switch never reads the key nor calls anything (`paidNotAllowedProvider`): free
  answers + «falta o dono autorizar a IA paga» in «Experimentar». The runner re-chooses the provider when the
  switch changes (≤ 15 s).
- Groq and Ollama stay as test AIs. Comparison and costs: `docs/chatbot/COMPARACAO-IA.md`.
- The admin «Experimentar» runs on Vercel: say so when the owner tests Ollama there.
- gpt-oss: `reasoning_effort: "low"`, `include_reasoning: false`, room in `max_tokens`; it writes references as
  `【S5】` / `[S1, S3]` — `parseGroundedAnswer` must strip every form.
- Free tiers have daily limits: keep the caps; on 429/billing errors fall back to `mock`, never retry in a loop.
- Paid AI or any paid API: never call it from scripts or tests (CLAUDE.md). Free-tier checks: a handful of calls,
  key never printed.

## Lessons from tests (must keep passing)

| Question type | What went wrong | Rule now |
|---|---|---|
| «Que serviços tem?», «Quanto custa um corte?» with no structured data | «Não tenho essa informação» | Fall back to the document's price lines |
| «Abrem à segunda?» with no structured hours | «Não tenho o horário» | Fall back to the document's hours lines |
| «Dá para cortar amanhã?», «Abrem hoje?», weekday names | No intent → AI got prices only | Date/availability words → hours + closures + booking lines + today/target date |
| FAQ in a PDF | Question and answer cut apart | Keep a «…?» line with the answer that follows |
| «Posso ir com o meu cão?» | Plural/synonyms missed | Six-language concepts + plurals (cão/cães) |
| «Fazem tranças?» | Dumped a price table | Quote the one sentence that answers («Não fazemos: … tranças») |
| Student discount on a fade | AI said 15 € | Pass the discount line together with the price line; arithmetic only from excerpts |
| «Abrem no dia 8 de dezembro?» | AI contradicted itself | A date the excerpts don't name → «não tenho essa informação» |
| «How much is a haircut?» | Nothing found (free answers) | AI path gets the price table when no line matches; free answers ask back with examples |
| «Dá para cortar amanhã?» → «Quanto custa?» | «Não tenho essa informação»: every message read alone | `context.ts`: running topic of the customer's last messages; elliptic follow-ups borrow its subject/intent/day; the AI gets the history (6 msgs / 1 500 chars) and «follows the earlier question «…»» |
| «Quanto custa?» as first message | «Não sei» | Ask back with 3–4 real examples from the business's list («Depende do que procura. Por exemplo: …»); also when the AI says NO_ANSWER |
| «Abertura amanhã das 10:00…» (Groq) | Telegraphic, robotic | `prompt.ts` style rules: speak as the business, full sentences, «Sim/Não» first, 1–3 sentences, no Markdown, pt-PT (not Brazilian), no English words; good/bad examples with [placeholders] only |
| «Queria reservar uma mesa para segunda» | Detected as Spanish | New conversation: the default language wins unless another leads by 2 (or the message has nothing of it: «Hello», «Hola») |
| «Quero a segunda opção», «a segunda vez» | Read as Monday | Ordinal context words (opção, vez, terceira…) → not a weekday; right after a list, the option picked |
| Admin «Fonte:» | «B A R B E A R I A · …› A equipa tem quatro barbeiros» twice | «Documento: <título> — <secção>»: nearest real section title, no decorations, sentences or table captions, deduplicated |
| «Fazem degradê?» | Quoted the student discount line | Short question naming the start of price lines → those lines |
| Groq live test (2026-10-21) | «Sim, o degradê custa 18 €», booking sentence repeated every turn, «através do nosso link» with no link, «a partir da data de compra» invented | «Sim/Não» only for yes/no questions; answer only what was asked; never repeat a sentence; no details not written; `withoutEmptyLinks` drops link sentences without an address |
| Groq comparison (2026-10-21) | «Pode marcar em https://barbearia-fiodenavalha.pt/marcar» (invented; the document has reservas.fiodenavalha.example) | `withoutUnknownLinks`: an address the model was not given (prompt + history + excerpts, `seenText`) drops its sentence; only that → «não tenho essa informação». Prompt: addresses only as written |
| Groq comparison | «… remarcamos. [A12][A16]»; lists on one line («• A 16 € • B 18 €»); the booking sentence after every answer | Made-up references stripped; `bulletsOnLines`; `withoutRepeats` (a non-first sentence ≥ 80 % like one already sent goes) |
| `withoutEmptyLinks` check | Split «reservas.fiodenavalha.example.» at the dot and dropped the real link; a list before «veja o nosso site» vanished | `sentences()`: a sentence ends only at punctuation + space/end, and every line is its own sentence |
| «E para crianças?» (Groq) | Also offered the «pai e filho» combo | Prompt: never suggest a service, package or product not asked about |
| «Onde ficam?» | Free answers: «não sei» (phrase keyword «onde fica*» left «ficam» as a subject) | `intentWords` explains the message's own words for phrase keywords with «*»; the AI gets the address lines |
| Door/key-box code written in a house guide (phase B) | The line went to the AI with the excerpts | `leaksSecret` (guardrails) drops it from everything an AI receives, as `sanitizeReply` does from replies; the gate's `secrets` checks both |
| «Têm parque infantil?», «cadeira de bebé», «frutos secos» | «parque» alone found the car park; «bebé» the kids' menu | An idea in several words counts only whole (`phraseGroups`); a concept inside a longer phrase of another one doesn't count; phrases match without their small words too («blanchiment dents») |
| «Têm pratos vegetarianos?», «É sem glúten?» | Taken out as «the kind of question», nothing left to search | `subjectKeywords`: diet words make a menu question and stay the subject |
| «E sobremesas?», «E o check-out?», «avisar»/«aviso», «abertos»/«por abrir», «lãs» | «sobre» met «sobremesas»; checkin = checkout; verb forms apart; «lã» became the article «la» | «sem/sobre» stopwords; a shared beginning must leave ≤ 1 letter of the shorter word; verb endings meet (`inflectionRoot`), irregular participles, «check-in» one word, «lã» → «lana» |
| Wrapped and WhatsApp lines | «… no Largo da» + «Ribeira» cut as a title; «Dra.» ended a sentence; lines after «)» glued; «Surf? Ribeira…» | Lines ending in «de/da/ou…» go on; a line after «)»/«#» or a capitals title starts anew; abbreviations; one-word questions; middle-dot price lists; table column titles dropped |
| Flat documents (one line) | AI excerpts joined into one long item and cut; «Label:» inside a name split it | Runs joined only while short; flat text split after web addresses and before «Label:» only after a name, number or bracket |
| Long messages («O meu filho é alérgico a frutos secos. Há algum prato com frutos secos?») | No single sentence covered half → «não sei» | Two passages that cover ≥ 60 % together (`jointPick`); windows from a third for long messages; the AI keeps complementary lines below the score floor |
| «Fazem envios para a Madeira?», «Somos 12 para um aniversário, como reservamos?» | Best line left «Madeira» / the group rule out | The line with the missing words goes with the best one; booking answers add the booking rule about what else was asked |
| Menu, discount, «quem», «onde fica X» questions | Price lines that shared one word; the price list for «há desconto?»; a service line for «Quem faz…?» | Non-price menu questions prefer the sentence that says it; discount questions the discount lines; «quem» lines with names; «onde fica» lines with a distance; price questions always get price lines |
| Follow-ups: «Também há ao sábado?», «Dá para amanhã?», «Duram quanto tempo?», «E na loja…?» | Read as hours; topic lost; the topic's own line quoted again | Same-thing words keep the menu question; «can I + day» after a dish is a follow-up for the AI; a follow-up with its own words must be covered by them, the topic (same paragraph) only helps choose; a line just quoted counts less |
| «Hola, ¿se puede fumar…?», «Bom dia, …» | «¡Hola!» ignored the question; «boa noite» hid «só uma noite» | A greeting with a question is answered; greetings are removed whole, not word by word |
| «Posso devolver?» vs «quero o reembolso» | Every «devolução» went to the team | Policy questions are answered; only requests («quero», «want»…) hand off |
| Clinic: pain, swelling, bleeding, medication, «posso comer depois?» | Only a few symptom words | Six-language medical words → hand-off to the clinical team (112 in the reply), the AI is never called |
| «Os novelos já estão abertos?», «guardar até sábado», house guide without opening hours | Hours answers; the supermarket's hours as the business's | «aberto» after another subject isn't hours; «até + day» is a deadline; «Label:» lines of other places aren't the timetable; no «não tenho o horário» unless hours were asked |
| «Fazem consultas ao domicílio?» | «consultas» (everywhere in a clinic) gave half coverage | Coverage weighs a word found in > ⅛ of the document's passages by half |

Fixtures: `tests/fixtures/<business>.txt` + `<business>-whatsapp.txt` for each sector (barbearia, restaurante,
alojamento, clinica, loja, salao — fictional, marked at the top), played in 4 layouts (structured, flat, messy, WhatsApp).
Conversations: `tests/fixtures/dialogues/<sector>.json`, played by `tests/chatbot-conversations.test.mjs` (free
answers + what a fake AI receives) in every layout — the quality gate. When a new failure shows up with any
client, add the dialogue there (or a new sector file) before fixing it, and make it pass in every layout.
Turn fields: `notInDocument` (must be «não tenho essa informação», counted as an invention otherwise), `onlyWithAi`
(a reason, or `{ reason, layouts }`: free answers not asserted, AI excerpts still are), spec `secrets` (never in a reply
or an AI request). Each sector needs ≥ 95 % of turns right with free answers (onlyWithAi counts against) and 0
inventions (a price/time not in the document, an answer where it has none, a secret). `CHATBOT_GATE_SUMMARY=1`
prints the table per sector; `CHATBOT_GATE_ONLY=<file>` plays one file.
Live check with Groq's free tier: at most a few dozen calls, ~25 s apart (our 9 000 tokens/min ceiling), key never printed.

## Before publishing a chatbot change

eslint on changed files, `npx tsc --noEmit -p .`, `npm test`; migrations only with the owner's direct
authorisation (begin/commit + rollback file); commit without `public/home/brand/`.
