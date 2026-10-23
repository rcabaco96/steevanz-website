---
name: reviews-no-gaps
description: "New reviews are always read continuing from the last one stored in Supabase — never just \"the newest N\" (no gaps)"
metadata:
  node_type: memory
  type: project
  originSessionId: b1e383ea-2ecc-40a4-9a74-e9ef8ce219f8
  modified: 2026-10-03T22:44:16.117Z
---

Owner rule (2026-10-04): when fetching new reviews (customers or competitors), always continue from
the **last review stored in Supabase** so there are never gaps; never fetch only "the most recent
10/N" when more arrived. With DataForSEO (newest→older only), depth = new reviews since the last
stored (Google total − stored count) rounded up to blocks of 10 + margin; if a gap remains, read
deeper until the reads overlap a stored review.

**Why:** missing reviews would corrupt stats, reply rates and the owner's trust.

**How to apply:** any review-fetching code (DataForSEO, Google official API, reader, Apify) must
compute its read window from the last stored review and verify overlap. Related:
[[shared-places-database]], [[never-invent-reviews]].
