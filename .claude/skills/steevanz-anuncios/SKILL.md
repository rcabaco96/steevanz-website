---
name: steevanz-anuncios
description: How Steevanz Instagram ad videos are made and what the owner approved or rejected — format, rhythm, text timing, transitions, end card, music, real product footage, delivery. Use when making or changing any Steevanz video, reel, animated logo or motion piece. Read steevanz-marca too.
---

# Anúncios em vídeo Steevanz

Learned over the Menu digital, Sites and Cartão de cliente ads (2026-10-16/17). Apply all of it from the first render.

## Projeto

- Remotion (React) project. It lived in the session scratchpad (`…/scratchpad/ad-video`); the persistent copy is
  `C:\code\steevanz-ads` (without node_modules: run `npm install` there first). Build: `node tools/build.mjs` (menu),
  `node tools/build.mjs sites`, `node tools/build.mjs cartao`; voice swap: `node tools/build.mjs voz` with
  `voz/linhas/01.wav…`. Music/SFX timings and voice lines share one timeline file, so sound always matches picture.
- Remotion's ffmpeg: `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe`.

## Formato e entrega

- 9:16, **720×1280** by default (owner: «720p chega»), 30 fps, H.264 + AAC, -14 LUFS, peak ≤ -1 dB.
- Instagram safe zones: nothing important in the top 250 px or bottom 340 px (at 1080×1920; scale down for 720p).
- Deliver **one** video unless asked for variants. Show a short key-frame check or a draft before long renders.
- Files: «Steevanz - Anuncio <Produto>.mp4»; older versions to `versao-anterior/`. Send with a notification.
  Remind the owner to download the file to hear the sound (previews play muted).

## Ritmo e texto

- Fast cuts only in the opening hook (first 2–3 s). After that every text stays readable **≥ 1,5–2 s**; transitions
  about 0,4–0,6 s; texts enter and leave fluidly (eased rise or fade), never overlapping.
- **Payoff beats breathe**: a confirmation («Pedido confirmado ✓»), a reward, a reveal and the logo get 1,5–2 s+.
  Build-ups can be fast.
- Max ~6 words per screen; key word in a gold box or Fraunces italic.
- Length is flexible (20–30 s); don't pad.

## Estilo aprovado

- Reference: the «Laboratório da IA — Showreel por dentro» frames: 3D-tilted floating phones/screens, small uppercase
  kickers above big titles, highlight boxes, chips popping in one by one, dark-plum and cream scenes alternating.
- Real product footage that MOVES (verify with a frame diff — a still image in the «AGORA/STEEVANZ» phone ruined a cut once).
  Dish videos come from Bunny (pull zone needs a Referer header).
- Comparisons work well (ANTES vs STEEVANZ).

## Rejeitado pelo dono (não repetir)

- Illustrated characters or cartoon scenes («bonecos são horríveis»).
- Light streaks/beams across the screen («esse risco»).
- Flashes, white/gold flash frames, camera shake.
- A big price on the end card; the phone number in videos.
- Pointless transitions (the gold dot «Agora imagine…» scene).
- Repeating the brand name next to the logo («Steevanz. A Steevanz resolve.» → just «Steevanz. resolve.»).
- Anything in front of the product: blurred foreground phones or hands (`ForePhone`), objects over the phone screen
  («continua com isto à frente», 2026-10-21). The phone and its screen stay fully visible.
- Composited cards/objects that look pasted: wrong size for the hand, fingers cut or with light fringes, crooked
  shapes. Match the real object's size and keep the real fingers on top (business card ad v3–v5).

## Cartão final

The «Steevanz» letters type in one by one, the gold dot plays (drops/bounces) on the beat; a short line above
(e.g. «O seu menu, a mexer.»); a solid pill CTA («PEÇA A SUA DEMONSTRAÇÃO» / «PEÇA O SEU SITE» / «PEÇA O SEU CARTÃO»);
small text under it with the product, «desde …» and «steevanz.com»; the brand line «Tecnologia do futuro. Com os bons
modos de antigamente.» subtle (both sentences).

## Música e som

- Current house track: «Feel Good – It Feels So Good» by Easy_Eva (Pixabay, no Content ID) — used on all three ads.
- Match it to each video: the lift lands on the main reveal, hits on cuts, resolution on the logo.
- Our own SFX (whoosh, tap, soft glass tick, stamp thunk, ding, sizzle) sit under the music; keep them tasteful.
- The owner worries about «sounding like an ad»: prefer native-feeling sound (real food sounds, his own voice).

## Logótipo animado

The «S.» drawn like a pen from the top-right terminal to the end, then the dot falls like a drop (stretch, squash,
ripple), a soft glow, then it erases along the same path for a seamless loop (GIF + MP4 1080×1080).
Instagram profile pictures can't be animated: use it as a pinned reel or in email signatures.
