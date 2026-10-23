---
name: paid-api-spend
description: "ABSOLUTE RULE — I never trigger anything that spends DataForSEO/Apify/any paid balance; paid actions happen only through the site's buttons, by the owner"
metadata:
  node_type: memory
  type: feedback
  originSessionId: b1e383ea-2ecc-40a4-9a74-e9ef8ce219f8
  modified: 2026-10-04T11:43:19.635Z
---

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
