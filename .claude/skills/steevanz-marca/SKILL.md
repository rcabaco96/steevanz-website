---
name: steevanz-marca
description: The Steevanz house rules for anything customer-facing — site pages, product copy, proposals, ads, social posts, logos, images. Brand colours, fonts, wordmark, tone, forbidden words, prices source, what may never be invented, which clients may be shown. Use before writing copy or designing anything for Steevanz or its clients.
---

# Marca Steevanz — regras da casa

These were decided with the owner over many rounds. Apply them without being asked; changing any of
them needs the owner's confirmation.

## Identidade (nunca muda)

- **Colours:** plum `#7a2d60` (main), gold `#cfa563` (highlights, the dot), cream `#fbf7f1` (backgrounds),
  near-black `#1d1220` (text); supporting: dark plum `#5e1f49`, soft rose `#f4e4ee`, soft gold `#f6ead3`.
  Tokens live in `src/app/globals.css`.
- **Fonts:** Fraunces 500 (titles; the key word in *italic* or inside a gold box) and Hanken Grotesk (text).
- **Wordmark:** «Steevanz» followed by a gold dot «.». The short mark is «S.» (owner's favourite profile versions: dark-plum
  or plum background, cream S, gold dot).
- **Brand line (owner, 2026-10-18):** «Tecnologia do futuro.» / «Com os bons modos de antigamente.» — the two sentences together
  in taglines, heroes, footers, end cards and proposal signatures. In a warm sign-off («Até já, com os bons modos de
  antigamente.») the second half may stand alone. Never «de sempre», never «do amanhã»/«simples» in place of «do futuro».
- **Look:** warm and light, crafted. Not a dark «tech» look.

## Palavras

- Never write «NFC». Say «um toque», «tecnologia Steevanz» or «toque ou QR».
- The product is «Menu digital». The loyalty product is «Cartão de cliente digital».
- No «fidelização» in labels or buttons.
- pt-PT, warm and clear, «o/a senhor(a)» register in the site («o seu negócio»), short sentences.
- Phone 961 292 679 on the site and proposals, but NOT in ad videos (owner, 2026-10-17).

## Verdade (regras absolutas)

- Never invent reviews, star ratings, review counts, testimonials, customer numbers, percentages or results — not even
  in demos, mockups or templates. Show the «Deixe a sua avaliação» form, never fake stars.
- Never claim a feature that doesn't exist in the code (e.g. the client does NOT edit the menu alone today: Steevanz
  sets it up). Verify in the code before promising.
- Never describe client work that wasn't done.
- **Never amounts with IVA calculated** (owner, 2026-10-18, absolute, all projects): no «Total com IVA», no «IVA (23%)»
  line, no «X € + IVA = Y €». Show the value without VAT and say «+ IVA» / «acresce IVA» / «Preços sem IVA». Businesses
  have organised accounting and know they pay VAT; VAT maths only confuses everyone.
- Prices come from `src/content/products.ts` only. Menu digital: «desde 20 € por placa (15 € a partir de 10) + 30 €/mês
  pelo menu em vídeo». Landing page 350 € + 15 €/mês; site 700 € + 25 €/mês.

## Clientes que se podem mostrar

Owner, 2026-10-18: «Podemos usar tudo dos nossos clientes» — Sporting, BMW, Crédito Agrícola, EIC, Agilflex, Dianaconta,
Dolci e Salati (its video menu /raza17raza and landing page /dolci-salati are real Steevanz work). Official logo files for
the big brands are still to be supplied; what Steevanz did for each is to be confirmed before describing it.

## Imagens e música

- Photos, videos and music must be licensed for commercial use and ads (Pixabay Content License is fine; skip Pixabay
  tracks marked Content ID or with a PRO). Record sources in a LICENCAS.txt next to the work.
- Real product screens over illustrations. No illustrated people («bonecos»).

## Ecrãs

- Mobile first: check 320/360/390 px before desktop; smooth on mid-range Android (animate transform/opacity only).
- **Mobile order for every section with media** (owner, 2026-10-20, whole site; model: the home's Menu digital section):
  1) heading + short intro text, 2) the image/video, 3) the rest (buttons, lists, prices). Desktop may alternate sides.
