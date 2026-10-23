---
name: no-carousel-pause-button
description: Never add a pause/play button to carousels or marquees on Steevanz sites; hover-pause and reduced-motion static are fine
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-22T12:21:51.611Z
---

No visible pause/play button on carousels/marquees (logo strips, sliders) on the Steevanz site or client sites.

**Why:** 2026-10-22 an agent added one to the clients carousel citing WCAG 2.2.2; the owner: «Não quero botão de pausa dos carrosséis. Adiciona isso como regra, não faz sentido.»

**How to apply:** keep pause-on-hover and a static layout under `prefers-reduced-motion`, but never a button. Say so in briefs to agents building UI. Also in .claude/skills/steevanz-marca. Related: [[no-whatsapp-green]].
