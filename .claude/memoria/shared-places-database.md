---
name: shared-places-database
description: "Competitor stats live in ONE shared Supabase base per Google place, updated by one daily routine only if not updated that day; panels read it"
metadata:
  node_type: memory
  type: project
  originSessionId: b1e383ea-2ecc-40a4-9a74-e9ef8ce219f8
  modified: 2026-10-03T21:57:30.132Z
---

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
