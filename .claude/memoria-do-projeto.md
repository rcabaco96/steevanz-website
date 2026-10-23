# Memória do projeto (regras do dono)

Regras, preferências e conhecimento acumulados com o dono ao longo do desenvolvimento (site Steevanz, sites de
clientes, menus digitais, chatbot, anúncios, leitor de reviews). Este ficheiro é carregado pelo CLAUDE.md, por isso
vale para qualquer conta do Claude neste repositório. Os ficheiros soltos estão em `.claude/memoria/` (copiar para
a pasta de memória do Claude Code para os voltar a ter como memória). Mais detalhe nas skills em `.claude/skills/`
(steevanz-marca, steevanz-sites-clientes, steevanz-anuncios, steevanz-chatbot, steevanz-entregas, …).

## Regras globais do dono (todos os projetos)



### Preços: nunca valores com IVA (regra absoluta, 2026-10-18)

Never show a price, total, saving or amount with VAT (IVA) calculated — no «com IVA» totals, no «IVA (23%)» lines,
no «X € + IVA = Y €». Always show the value without VAT and say it plainly: «+ IVA» / «acresce IVA» / «Preços sem IVA».
Applies to sites, proposals, quotes, decks, emails, carts, admin pages, ads and documents.

Why (owner's words): «isso é uma confusão maluca para toda a gente, e os negócios têm contabilidade organizada por isso
sabem que têm de pagar IVA. NUNCA SE METE VALORES COM CALCULO DO IVA.»

## mobile-first
_Steevanz website UI must be designed and verified mobile-first (360px and 320px), not desktop-first_

Every UI change on the Steevanz website is built mobile-first and checked at phone widths (320/360/390px) before desktop.

**Why:** The user explicitly said "atenção ao responsive do mobile, isto é mobile first não te esqueças" after the cart was first built desktop-first and had header overflow, cramped rows and a far-away checkout on phones.

**How to apply:** Design the phone layout first (stacked rows, ≥40px touch targets, no horizontal page scroll, key totals/CTAs reachable — e.g. sticky bottom bar), then enhance with sm:/lg: breakpoints. Verify with real screenshots at 360px (headless Edge via CDP works on this Windows machine) — watch the fixed WhatsApp button and the header icon row, which is near its width limit.

## google-business-profile
_Steevanz's own Google Business Profile and Google Cloud setup — owner account, support case ID, verification/duplicate status, OAuth project for «Ligar Google»_

- Steevanz's Google Business Profile: «Proprietário principal» is rogeriocabaco3@gmail.com
  (organisation «Steevanz» om-1736192456604764632 in Business Manager). Shown as «Cópia»
  (duplicate) and pending verification; the code went to the old phone 928 069 072, which no longer
  exists. New phone: 961 292 679.
- 2026-10-11: owner also submitted the form to change the profile phone to 961 292 679; apex
  steevanz.com DNS A 76.76.21.21 added at Amen (works, redirects to www).
- **GBP support case ID: 1-8398000041203** (opened 2026-10-11 by email via
  support.google.com/business/gethelp): change phone, verify by new number or video, resolve the
  duplicate status.
- Google Cloud project for «Ligar Google»: `steevanz-app` (number 116519460560), owner
  rogeriocabaco3@gmail.com; OAuth web client created; env vars GOOGLE_OAUTH_CLIENT_ID /
  GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_TOKEN_KEY set on Vercel (prod+preview) and .env.local.
  Account Management + Business Information APIs enabled; «Google My Business API» (v4, reviews and
  replies) needs the Basic API Access approval (form support.google.com/business/contact/api_default,
  not yet submitted as of 2026-10-11; needs a verified profile 60+ days).
- In the panel, «Ligar Google» shows «Em breve» via `googleConnectComingSoon` (src/lib/google/coming-soon.ts)
  until Google approves. Since 2026-10-11 the panel Google page shows «Em breve» to everyone (admins too),
  with a notice «em processo de verificação com a Google… em princípio na próxima semana»; only admins
  can test, by opening /api/google/connect?slug=<slug> directly. gcloud CLI installed, signed in as rogeriocabaco3@gmail.com.

Related: [[deploy-login-page-only]].

## copy-words
_Owner's word rules for site copy: no «NFC» (say «um toque» / «tecnologia Steevanz»), no «fidelização» in labels/headings, «Menu digital» not «Cardápio»_

Site copy rules from the owner (2026-10-11, launch eve):
- Never the word «NFC» anywhere users see. Say «um toque» or, when a name is needed, «tecnologia
  Steevanz» (EN «Steevanz technology»). Product names just drop it («Placas para reviews no Google»).
  Since 2026-10-11 not even in ids/URLs/HTML: product ids are google-review-plates, social-plates,
  digital-menu, family `plates`, components TapPlate/TapWaves; old ids only in `renamedProductIds`
  (aliases + redirects). DB tables nfc_plates/nfc_taps stay (internal).
- Never «fidelização» in family labels, menus, headings or titles — «é o que os clientes não querem».
  The `nfc` family is «Placas e cartões» (EN «Plates and cards»).
- The loyalty product is «Cartão de cliente digital» (short «Cartão de Cliente»), never «fidelização».
  («sem fidelização» meaning no lock-in contract is a different sense and stays.)
- «Menu digital», never «Cardápio digital».
- Contact phone: +351 961 292 679.

**Why:** owner's positioning for the public launch.
**How to apply:** check new copy (and agents' copy) against these before shipping. Related: [[never-invent-reviews]].

## never-invent-reviews
_Absolute rule — never create, generate or add fabricated reviews (demo data, seeds, examples, placeholders) anywhere in the Steevanz product_

Never invent reviews. Not for demos, seeds, screenshots, placeholder content, sample dashboards or marketing — no fabricated review text, ratings presented as customers' or fictional businesses with reviews.

**Why:** The user stated it is a rule that can never be broken ("não inventes reviews! nunca!") after the review dashboard shipped with a generated fictional café full of made-up reviews. Steevanz sells Google review products; fake reviews destroy trust and conflict with Google's policies the product promises to respect.

**How to apply:** Dashboards and features only ever show real imported Google reviews. To showcase the product, use a real business that consented (e.g. Steevanz's own profile). Empty states instead of sample data. Unit-test fixtures stay minimal, are never rendered or published, and should be mentioned to the user.

## shared-places-database
_Competitor stats live in ONE shared Supabase base per Google place, updated by one daily routine only if not updated that day; panels read it_

Concept set by the owner (2026-10-03), to keep in mind in every design about reviews/competition:
the numbers used by the competition table/statistics (rating, total, star distribution, pace,
% replied…) are kept in Supabase as a **shared database per Google place** (one record per place_id),
not recomputed per customer. Every customer's competition table reads those shared numbers.

- **One daily routine** updates every place in the base **only if it was not already updated that
  day** (by any path: the place's own customer pressing "Atualizar", a Google Business Profile sync,
  or the routine for another customer).
- In the panel, customers may update their own data or not; that update also refreshes the shared
  record, so other customers who have them as competitor benefit.
- A customer's own place is also a "place" in the base (it can be someone else's competitor).
- Whatever the source (local reader, Google Business Profile API, or Apify), always estimate prices
  **per distinct place**, not per customer, because places are shared.

**Why:** cost and speed scale with distinct places, not customers × 30 competitors; avoids reading
the same restaurant many times a day.

**How to apply:** design tables keyed by place_id (customers link to places), routines that skip
places updated today, and give cost estimates per distinct place. Related: [[mobile-first]],
[[never-invent-reviews]].

Reiterated 2026-10-04: **always look in Supabase first** whether the customer or competitor
already exists / was read recently, and never search or read Google again for it (reuse the stored
numbers). The reader's competitor search copies fresh snapshots instead of re-reading places read
since the last 10:00/19:00 slot; customer creation refuses an existing Google feature id.

## gamification-planned
_The reviews software will get a gamification layer (levels, challenges, rewards) tied to selling Steevanz services_

Decided by the owner on 2026-10-03: the review software (panel, competition tables, AI replies, NFC
plates) will get a **gamification plan on top**, global per customer, always tied to selling Steevanz
services — e.g. a reward when a level is reached, or a challenge that unlocks 1 free month of a
service to try it. A gamification deck (10–30 slides) was requested the same day.

**Why:** engagement + upsell of Steevanz services through the product itself.

**How to apply:** when designing features, foresee where they generate points/levels/challenges and
store the events/metrics per customer in Supabase; numbers never invented ([[never-invent-reviews]]);
see also [[shared-places-database]].

## reviews-no-gaps
_New reviews are always read continuing from the last one stored in Supabase — never just \"the newest N\" (no gaps)_

Owner rule (2026-10-04): when fetching new reviews (customers or competitors), always continue from
the **last review stored in Supabase** so there are never gaps; never fetch only "the most recent
10/N" when more arrived. With DataForSEO (newest→older only), depth = new reviews since the last
stored (Google total − stored count) rounded up to blocks of 10 + margin; if a gap remains, read
deeper until the reads overlap a stored review.

**Why:** missing reviews would corrupt stats, reply rates and the owner's trust.

**How to apply:** any review-fetching code (DataForSEO, Google official API, reader, Apify) must
compute its read window from the last stored review and verify overlap. Related:
[[shared-places-database]], [[never-invent-reviews]].

## paid-api-spend
_ABSOLUTE RULE — I never trigger anything that spends DataForSEO/Apify/any paid balance; paid actions happen only through the site's buttons, by the owner_

ABSOLUTE RULE (owner, 2026-10-04, "escrito na pedra"): I am forbidden to do anything that spends
balance on DataForSEO, Apify or any other paid API — no scripts, probes, tests, re-imports,
dispatches, "tiny" checks (not even 0.0006 $), no running routines/crons by hand that post paid
tasks. Paid actions happen ONLY when the owner presses a button on the site.

Allowed: free reads only (DataForSEO appendix/user_data for the balance, task_get / tasks_ready of
results already paid), Supabase reads/writes, and code changes. If something can only be checked by
spending, I say so and ask the owner to use the site's button instead.

**Why:** on 2026-10-04 I dispatched competitor reads that took the old account to −3.37 $ (a
depth bug + priority queue), and later sent a 0.0006 $ check without being asked. The owner
considers any spend by me a breach.

**How to apply:** before any external call, ask "does this cost money?" — if yes or unsure, don't.
The code's spending guard (src/lib/dataforseo/client.ts, DATA_FOR_SEO_MIN_BALANCE /
DATA_FOR_SEO_DAILY_LIMIT) protects the site's own requests; never bypass it. Related:
[[shared-places-database]], [[reviews-no-gaps]].

## deploy-login-page-only
_Since 2026-10-10 the new site is live on main (www.steevanz.com); old site kept on branch site-antigo; login-page preview still exists_

2026-10-10: on the owner's request, `login-page` was fast-forwarded into `main` and deployed to
production (www.steevanz.com). The previous production site is kept on branch `site-antigo`
(commit 0fe70b4). Production env mirrors the preview's, plus `NEXT_PUBLIC_SITE_URL=https://www.steevanz.com`
(the apex steevanz.com has no A record at the DNS host Amen, so only www works until the owner adds it;
Vercel already redirects apex → www). Supabase Auth site_url = https://www.steevanz.com. The local
reader's READER_SITE_URL = https://www.steevanz.com.

Earlier (2026-10-09) the rule was "only login-page gets deploys"; its preview
https://steevanz-git-login-page-rogeriocabaco3s-projects.vercel.app still exists (branch CRON_SECRET
override there). Redeploy via API `POST /v13/deployments` with `deploymentId` (add `target:
"production"` for prod), VERCEL_TOKEN from .env.local.

**How to apply:** owner decision 2026-10-10: work directly on `main` (local checkout is on main);
every push to main deploys production at www.steevanz.com. login-page is no longer used.

## reader-always-for-clients
_Reader goal: optimise it as much as possible and keep it always available for clients' own reads; never pause client jobs_

The owner's standing goal (2026-10-09): always optimise the reader as much as possible, and it must
always be available for the clients (their own full/update reads). Pauses/back-offs may only slow
competitor work; client jobs keep running and retry within minutes.

**Why:** the owner was alarmed by a 10-minute global pause I added without explaining the trade-off
("não pedi nada disso"); they accepted pacing competitors but not the reader stopping for clients.

Later the same night the owner added: competitor work must not wait for the clients' reviews
either — "basta 1 separador para as reviews do cliente e os outros para a concorrência em
paralelo". So: one tab reserved for client full/update, the rest run competitor work in parallel.

**How to apply:** before adding any throttle, pause or slowdown to the reader, explain the trade-off
plainly first and keep client jobs out of it. Related: [[reader-mission]], [[reader-only-no-paid-sources]].

## reader-restart-manual
_I restart the local reader myself, only when reader code changed; no automatic self-restart (owner rejected it)_

When a change touches the reader (scripts/reader/** or src/lib code it imports), I restart it
myself after deploying — the owner shouldn't have to. Only when needed, and only when it's idle
(review_reader_status.busy false, no running jobs). How: stop the node processes whose command line
matches `scripts/reader/reader.mjs|run reader`, then `Start-Process cmd.exe -ArgumentList '/k',
'title Steevanz leitor de reviews && npm run reader' -WorkingDirectory C:\code\steevanz-website`, and
confirm a new pid in review_reader_status. The reader's Edge stays open and is reused.

**Why:** 2026-10-10 the owner asked "Tu devias conseguir fazer isso"; I built an automatic
self-restart and they rejected it as too complex: "faz tu manual só quando for necessário".

**How to apply:** after any reader change is merged and deployed, say whether a restart is needed
and do it. Related: [[reader-always-for-clients]], [[deploy-login-page-only]].

## reader-only-no-paid-sources
_DataForSEO and Apify are dropped for everyone; only our own reader fetches reviews/competitors; delete any leftover code_

Owner decision (2026-10-09): there is no DataForSEO nor Apify anymore, for any client. Any code
still referencing them (src/lib/dataforseo, apify-import/apify.ts, /api/dataforseo, cron paths,
admin UI, env DATA_FOR_SEO_*/APIFY_TOKEN) must be deleted. Reviews, history imports and competitor
discovery go only through our own reader (scripts/reader, which already has `competitor` and
`discover` job kinds).

**Why:** cost; the free reader is the product's source of truth (see [[reader-mission]]).

**How to apply:** never design a feature around a paid source or a "plan B" provider; when touching
reviews/competition code, remove paid-source branches rather than keep them. The no-spend rule in
[[paid-api-spend]] still applies to anything paid that remains.

## brand-line
_Steevanz brand line is «Tecnologia do futuro. Com os bons modos de antigamente.» (never «de sempre»/«do amanhã»)_

The Steevanz brand line is **«Tecnologia do futuro. Com os bons modos de antigamente.»** — two sentences, used together in taglines, heroes, footers, ad end cards and proposal signatures. In warm sign-offs («Até já, com os bons modos de antigamente.», the acceptance email) the second half may stand alone. Never «de sempre», never «Tecnologia do amanhã/simples».

**Why:** owner set «com os bons modos de antigamente» on 2026-10-15 («é sempre os bons modos de antigamente») and on 2026-10-18 made the full line «Tecnologia do futuro. Com os bons modos de antigamente.».

**How to apply:** all client-facing copy (site, proposals, decks, emails, ads). Rule also lives in the steevanz-marca skill. Related: [[copy-words]].

## supabase-migrations
_How DB migrations reach production (Management API + token in .env.local) and that each apply needs the owner's explicit OK_

Migrations in `supabase/migrations/` are applied to production (project `odvtklbxrqdugrtzjzye`) through the Supabase Management API: `POST https://api.supabase.com/v1/projects/odvtklbxrqdugrtzjzye/database/query` with `SUPABASE_ACCESS_TOKEN` from `.env.local` (read in a script, never printed), then a row `(version, name, statements)` in `supabase_migrations.schema_migrations`.

**Why:** the permission classifier blocks this unless the owner explicitly authorizes it (2026-10-15 the owner said «Autorizo a aplicares com cuidado, hipótese de dar rollback»).

**How to apply:** ask the owner first; read-only pre-check; write a rollback SQL first; wrap migration + schema_migrations insert in one `begin … commit`; verify counts after. See [[paid-api-spend]] for the separate no-spend rule.

## reader-mission
_Mission (2026-10-04) — our own free Google reviews reader, no login, 100% history, hosted free; paid providers ruled out_

Owner decision 2026-10-04: build our own reader; paid solutions (Apify, DataForSEO) are out of the
question, and no Google account may be signed in (not clients', not a Steevanz one).

Requirements the owner set:
- **100% of the history or nothing** (a partial import is not acceptable; if impossible, stop and rethink).
- An import of ~1000 reviews may take **up to ~15 minutes**.
- Hosting later on **Oracle Cloud Always Free** (owner creates the account when we get there); until
  then the reader runs on the owner's PC.
- Experiments may run from the owner's connection (risk of a temporary CAPTCHA accepted).

Plan: Phase 1 discovery tests (T1 wall per session vs IP, T2 continue token across sessions,
T3 sort/topic coverage, T4 google.com search panel / Maps lite, T5 safe pace) → Phase 2 build
(internal requests, exact dates, session rotation, no gaps, alerts) → Phase 3 Oracle Docker → Phase 4
wire the full-import button.

Known facts: without login the Maps page shows 5 reviews; our reader's batchexecute (qv9Egd) gets
~30 then a sign-in wall; listugcposts answers 403 code 7 without the page's session/key; the
google-reviews-scraper-pro repo (C:\code\google-reviews-scraper-pro, patched for pt consent + hl=en)
also stops at 5 and only has approximate dates. Related: [[paid-api-spend]], [[reviews-no-gaps]].

Hosting research (2026-10-06): Oracle Always Free was cut to 2 OCPU / 12 GB (June 2026); Hetzner
raised prices (CX23 5,49 €, CAX11 5,99 €); Contabo Cloud VPS 10 ≈ 4,50 € (4 vCPU/8 GB). Google
Maps flags datacenter IPs far more than residential ones, so the advice given: test free on Oracle
first, and if Google limits it, a home mini-PC (N100 16 GB ≈ 190–250 € once, ~1,5 €/month power).

Tabs at once (2026-10-04, owner): **4 on the owner's PC, 10 on the server** — set `READER_SLOTS=10`
in the hosted reader's environment (Phase 3); default without it is 4 (scripts/reader/config.mjs).

## site-redesign-2026
_Owner's decisions (2026-10-18) for the steevanz.com redesign — goals, audience, brand rules, scope, real clients allowed_

Redesign of steevanz.com started 2026-10-18 (home page first).

- Goal: look more innovative, with animations/transitions, an animated/3D feel (owner: «está muito parado»).
- Products: all with equal weight (Menu digital is the most innovative, but the Steevanz brand must have room).
- Audience: all sectors, not only restaurants.
- Brand never changes: plum #7a2d60, gold #cfa563, cream, Fraunces + Hanken Grotesk, «com os bons modos de antigamente» ([[brand-line]]).
- Scope: the home page first, then the rest.
- Real clients the owner said can be shown: Sporting, BMW, Crédito Agrícola, EIC, Agilflex, Dianaconta, plus Dolci e Salati. Owner 2026-10-18: «Podemos usar tudo dos nossos clientes» (names, logos, the Dolci menu and site, openly). What Steevanz did for each and the official logo files are still to be confirmed; never describe work that wasn't done ([[never-invent-reviews]]).

**Why:** the owner finds the current site static and the product distribution odd.
**How to apply:** design the new home under these rules; mobile first ([[mobile-first]]); smooth on mid-range Android.

## never-vat-totals
_ABSOLUTE: never show amounts with VAT calculated — only the value without VAT plus «+ IVA»; all projects_

Never show prices, totals, savings or amounts with IVA calculated (no «Total com IVA», no «IVA (23%)» line, no «X € + IVA = Y €»). Show the value without VAT and state «+ IVA» / «acresce IVA».

**Why:** owner, 2026-10-18: «isso é uma confusão maluca para toda a gente, e os negócios têm contabilidade organizada por isso sabem que têm de pagar IVA. NUNCA SE METE VALORES COM CALCULO DO IVA.» Applies to all projects (also in ~/.claude/CLAUDE.md).

**How to apply:** sites, carts, proposals, quotes, decks, acceptance emails, admin pages, ads. Rule also in the steevanz-marca skill. Related: [[copy-words]].

## mobile-media-first
_Site-wide mobile order for sections with media: heading+intro, then image/video, then buttons/rest_

On mobile (stacked layouts), every section with an image or video follows: 1) heading + short intro text, 2) the image/video, 3) the rest (buttons, lists, prices). Desktop can alternate media left/right. Model: the home's Menu digital section («O Menu digital que abre o apetite») on mobile.

**Why:** owner, 2026-10-20 — first asked «vídeos sempre primeiro», then corrected with a screenshot: «afinal sobre a estrutura em mobile mete sempre como este».

**How to apply:** any new or edited section with media on www.steevanz.com. Also in the steevanz-marca skill. Related: [[mobile-first]].

## chatbot-test-number
_WhatsApp chatbot pilot uses open-wa ONLY for testing on the owner's test number 937 967 281; extreme care, never risk a ban_

Chatbot (2026-10-20): open-wa is only for testing; paying clients get the official WhatsApp Cloud API. Test number: 937 967 281 (+351937967281). Owner: «muito cuidado com isso!!! Não faças testes malucos que possam bloquear o número».

**Why:** an unofficial-automation ban would lose the number.

**How to apply:** never pair/start sessions myself (owner pairs via QR); listen-only first; when replying, only to an owner-approved allowlist; never initiate chats, no broadcasts/groups; human-like delays, low hourly/daily caps; all automated tests use the fake adapter, never real WhatsApp. Keep the number out of git/public code. Related: [[paid-api-spend]].

## no-whatsapp-green
_Never use WhatsApp green (#25D366 or similar) anywhere on the Steevanz site — WhatsApp buttons/icons use the Steevanz plum_

Never put WhatsApp green on the Steevanz site: no green buttons, badges, cards or icons for WhatsApp. Use the brand plum (`--accent`) with white/cream; the `--color-whatsapp` token points to the accent.

**Why:** the owner said it before and had to repeat it angrily on 2026-10-22 («Pára de meter o Whatsapp a verde no site. Já disse para nunca o fazeres») after green showed up on the contact page, the docs help button and the experimental home floating bar.

**How to apply:** before shipping any page or component with a WhatsApp link, grep for green (#25d366, bg-whatsapp with a green token, Tailwind green-*). Tell agents explicitly in briefs that build site UI. Ads/videos that mimic a chat UI are a separate case (a neutral green bubble was accepted there), but site UI never. Related: [[brand-line]], [[copy-words]].

## send-videos-720p-hq
_When sending a video to the owner for review, send a high-quality 720p copy (≤ 30 MB), not the low-bitrate «para enviar» file_

To show the owner a video (SendUserFile, he watches on his iPhone), send a dedicated 720×1280 high-bitrate copy (e.g. H.264 CRF ~18 or ~5–6 Mbps, faststart, AAC), always under the 30 MB upload limit. Don't send the «(para enviar)» 8 Mbps-target 1080p file: it came out ~6.5 Mbps and looked soft after the app's recompression.

**Why:** 2026-10-22 he got the waitlist ad and said «Esse não tem qualidade wtf»; then «720p chega».

**How to apply:** for every review send, make `… (rever 720p).mp4` from the 1080p master and send that. Related: [[mobile-first]].

## no-carousel-pause-button
_Never add a pause/play button to carousels or marquees on Steevanz sites; hover-pause and reduced-motion static are fine_

No visible pause/play button on carousels/marquees (logo strips, sliders) on the Steevanz site or client sites.

**Why:** 2026-10-22 an agent added one to the clients carousel citing WCAG 2.2.2; the owner: «Não quero botão de pausa dos carrosséis. Adiciona isso como regra, não faz sentido.»

**How to apply:** keep pause-on-hover and a static layout under `prefers-reduced-motion`, but never a button. Say so in briefs to agents building UI. Also in .claude/skills/steevanz-marca. Related: [[no-whatsapp-green]].

## client-sites-standard
_Every client site must match O Ermita's cinematic level (GSAP/Lenis/React Bits scroll scenes, real video) and never look like a template of another client's site_

Client websites must reach the level of https://www.steevanz.com/o-ermita (2nd version, 2026-10-22): scroll scenes with GSAP pin/scrub + Lenis + React Bits, a moving hero from the client's real video, the best real photos found (incl. parent business), facts only from sources. And each site needs its own concept (signature motif, palette, fonts, scene set) so sites never look like templates of each other.

**Why:** owner rejected the first Ermita as «muito básico… nada a ver com react bits, animations, transitions, GSAP»; after the rebuild: «Este é o estilo e impacto que queremos para todos os sites… É importante também que os sites não pareçam templates uns dos outros.»

**How to apply:** follow `.claude/skills/steevanz-sites-clientes` before any client-site work and put its rules in agent briefs; check phone short viewports (~660 px) for overlaps. Related: [[mobile-first]], [[no-carousel-pause-button]], [[no-whatsapp-green]].

## client-metadata-always
_Every client site and its video menu must ship with their own link previews (OG/Twitter 1200x630, icons from the client's logo), verified live_

For every client site AND its video menu (/menu/<slug>): own Open Graph/Twitter metadata with a 1200×630 image in the client's identity, icons from the client's logo, JSON-LD with real data; menu gets an `ownPreviews` entry in src/app/(publico)/menu/[slug]/page.tsx with its OWN image — phones with the menu open (grid + a dish full screen), never the site's image — and a menu logo from the real logo. Say «Menu digital», never «ementa em vídeo». Verify live with curl (og tags + image 200).

**Why:** owner, 2026-10-23: «mete a imagem de metadados do menu digital deles diferente, com um telemóvel mesmo com o menu aberto… Adiciona isto como regra»; «diz menu digital em vez de ementa em vídeo». And 2026-10-22, after Lobo do Mar: «Não te esqueças dos metadados para o site e o menu! Adiciona como regra para qualquer site que façamos!»

**How to apply:** part of the definition of done for any client site; details in `.claude/skills/steevanz-sites-clientes` (section Metadados). Related: [[client-sites-standard]].

## client-sites-motion-menu-rules
_Client sites scroll smoothly to the top on reload/route change; a video menu never repeats a video (incl. twin footage); site and menu previews always differ_

Three owner rules (2026-10-23) for every client site and video menu:
1. On every page reload or route change, scroll smoothly back to the top (the sites' SmoothScroll helper; # links left alone).
2. Never the same video twice in one menu — also not the same footage uploaded twice under different ids; compare thumbnails before publishing.
3. The site's and the menu's link-preview images are never the same (menu = phones with the menu open).

**Why:** owner: «Sempre que se atualizar a página ou mudar de rota deves fazer um scroll smooth para o início da página»; «nunca usar os mesmos vídeos no mesmo menu digital. Vi que fizeste isso para o menu do lobo do mar»; «as imagens de metadados do site e do menu digital de um cliente nunca podem ser as mesmas».

**How to apply:** in `.claude/skills/steevanz-sites-clientes`. Related: [[client-sites-standard]], [[client-metadata-always]].
