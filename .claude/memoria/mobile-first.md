---
name: mobile-first
description: "Steevanz website UI must be designed and verified mobile-first (360px and 320px), not desktop-first"
metadata:
  node_type: memory
  type: feedback
  originSessionId: b1e383ea-2ecc-40a4-9a74-e9ef8ce219f8
  modified: 2026-10-02T15:25:47.599Z
---

Every UI change on the Steevanz website is built mobile-first and checked at phone widths (320/360/390px) before desktop.

**Why:** The user explicitly said "atenção ao responsive do mobile, isto é mobile first não te esqueças" after the cart was first built desktop-first and had header overflow, cramped rows and a far-away checkout on phones.

**How to apply:** Design the phone layout first (stacked rows, ≥40px touch targets, no horizontal page scroll, key totals/CTAs reachable — e.g. sticky bottom bar), then enhance with sm:/lg: breakpoints. Verify with real screenshots at 360px (headless Edge via CDP works on this Windows machine) — watch the fixed WhatsApp button and the header icon row, which is near its width limit.
