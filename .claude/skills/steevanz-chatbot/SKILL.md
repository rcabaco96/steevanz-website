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
- **Test number** 937 967 281: open-wa only for internal tests, listen-only first, allowlist, never initiate,
  never «crazy tests» that could get it banned. Clients use the official WhatsApp Cloud API.

## Providers

| Value | What | Where it works |
|---|---|---|
| `mock` | Free rule-based answers (search + quotes) | Everywhere; the fallback for every error |
| `groq` | Groq free tier, `openai/gpt-oss-120b` (the account has no llama-3.3-70b) | Site + runner; needs `GROQ_API_KEY` + `CHATBOT_GROQ_ENABLED=1` on Vercel |
| `ollama` | Local `qwen2.5:7b` on the owner's PC | Only on that PC (runner or local dev) — never on Vercel |
| `real` | Paid AI for clients (Mistral EU recommended, or Groq paid) | Not built yet; needs the owner's switch |

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
| «How much is a haircut?» | Nothing found (free answers) | AI path gets the price table when no line matches; free answers stay limited |

Fixtures: `tests/fixtures/barbearia-fio-de-navalha*.txt` in several layouts (structured, flat, messy, WhatsApp).
When a new failure shows up with any client, add the question to these tests (or a new sector fixture) before
fixing it, and make it pass in every layout.

## Before publishing a chatbot change

eslint on changed files, `npx tsc --noEmit -p .`, `npm test`; migrations only with the owner's direct
authorisation (begin/commit + rollback file); commit without `public/home/brand/`.
