---
name: reader-mission
description: "Mission (2026-10-04) — our own free Google reviews reader, no login, 100% history, hosted free; paid providers ruled out"
metadata:
  node_type: memory
  type: project
  originSessionId: b1e383ea-2ecc-40a4-9a74-e9ef8ce219f8
  modified: 2026-10-06T12:34:44.254Z
---

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
