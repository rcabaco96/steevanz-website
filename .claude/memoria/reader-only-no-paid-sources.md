---
name: reader-only-no-paid-sources
description: DataForSEO and Apify are dropped for everyone; only our own reader fetches reviews/competitors; delete any leftover code
metadata:
  node_type: memory
  type: project
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-09T17:13:42.998Z
---

Owner decision (2026-10-09): there is no DataForSEO nor Apify anymore, for any client. Any code
still referencing them (src/lib/dataforseo, apify-import/apify.ts, /api/dataforseo, cron paths,
admin UI, env DATA_FOR_SEO_*/APIFY_TOKEN) must be deleted. Reviews, history imports and competitor
discovery go only through our own reader (scripts/reader, which already has `competitor` and
`discover` job kinds).

**Why:** cost; the free reader is the product's source of truth (see [[reader-mission]]).

**How to apply:** never design a feature around a paid source or a "plan B" provider; when touching
reviews/competition code, remove paid-source branches rather than keep them. The no-spend rule in
[[paid-api-spend]] still applies to anything paid that remains.
