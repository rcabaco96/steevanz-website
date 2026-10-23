---
name: reader-always-for-clients
description: "Reader goal: optimise it as much as possible and keep it always available for clients' own reads; never pause client jobs"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-09T22:33:19.411Z
---

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
