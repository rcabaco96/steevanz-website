---
name: reader-restart-manual
description: "I restart the local reader myself, only when reader code changed; no automatic self-restart (owner rejected it)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-09T23:13:35.625Z
---

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
