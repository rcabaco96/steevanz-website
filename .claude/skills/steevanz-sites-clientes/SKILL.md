---
name: steevanz-sites-clientes
description: The bar every client website Steevanz builds must reach (owner, 2026-10-22, after O Ermita) — cinematic scroll scenes with GSAP/Lenis/React Bits, the client's real media, and an identity of its own so no two sites look like templates of each other. Use before designing, building or reviewing any client site (src/app/(clientes)/*, src/components/clients/*).
---

# Sites de clientes — o padrão

Owner, 2026-10-22, about https://www.steevanz.com/o-ermita: «Este é o estilo e impacto que queremos para todos os
sites que fizermos! … É importante também que os sites não pareçam templates uns dos outros.»
The first Ermita version (photos with a slow drift and fade-ins) was rejected as «muito básico… nada a ver com react
bits, animations, transitions, GSAP». Fade-ins and a Ken Burns photo are NOT enough.

## O nível mínimo (every site)

- **Scenes, not sections.** At least 4–5 scroll-driven moments built with GSAP ScrollTrigger (pin + scrub) and Lenis,
  plus React Bits pieces (SplitText, ScrollReveal-style word lighting, ScrollVelocity, CountUp, Magnet…). Reference
  build: `src/components/clients/o-ermita/` — curtain/preloader, hero film that closes into a shape on scroll,
  sentence lit word by word, pinned horizontal story, a «signature» wall that assembles itself, a photo opening out
  of a mask until full screen, horizontal gallery, drifting word strips.
- **Moving hero.** A real video of the client's place (theirs, their hotel's, their own reels) whenever one exists;
  look for it on their site, Google profile, social media. Poster frame as the first paint (next/image priority).
- **Real media only**, the best available: search the client's own site and its parent business (e.g. the hotel of a
  hotel restaurant) for professional photos before settling for weak Google photos. Record every source in
  `public/media/clients/<slug>/LICENCAS.txt`; flag «a confirmar com o cliente» when the media comes from a related
  business.
- **Facts only from sources** (never invented dishes, prices, numbers, reviews). Numbers that animate must be real.

## Nunca um template

Each site gets its own concept taken from the client's world, decided before coding:
- **Signature motif** from the place itself (Ermita: the convent's arch and its azulejos; Fabio's: the roadside
  diner). The masks, transitions and patterns come from that motif — don't reuse the arch on another client.
- **Own palette and type pair** (Ermita: lime/cobalt/bronze, Cormorant + Montserrat). Never Steevanz colours, never
  copy another client's tokens.
- **Own scene set and order.** Reuse the techniques and helpers (SmoothScroll, SplitText, pin patterns), never the
  same sequence of scenes or layouts. If a new site starts to resemble an earlier one, change the concept.
- Write the concept in a comment at the top of `<Client>Site.tsx` (as ErmitaSite does).

## Sempre

- Mobile first: check 320/360/390 px and a short viewport (an iPhone with browser bars is ~660 px tall): nothing may
  overlap (the Ermita «Descer» cue ran into the buttons; it now hides under 820 px of height).
- Respect prefers-reduced-motion (everything readable, no pin, no film); text in the HTML without JavaScript.
- Animate transform/opacity/clip-path only; smooth on mid-range Android; no horizontal scroll.
- No pause buttons on carousels/marquees, no WhatsApp green, «Site por Steevanz» credit in the footer.
- Look at the result yourself (Playwright frames down the whole page, phone + desktop) before telling the owner it's
  done, and verify it live after publishing.
