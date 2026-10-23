---
name: no-whatsapp-green
description: "Never use WhatsApp green (#25D366 or similar) anywhere on the Steevanz site — WhatsApp buttons/icons use the Steevanz plum"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-22T10:55:11.306Z
---

Never put WhatsApp green on the Steevanz site: no green buttons, badges, cards or icons for WhatsApp. Use the brand plum (`--accent`) with white/cream; the `--color-whatsapp` token points to the accent.

**Why:** the owner said it before and had to repeat it angrily on 2026-10-22 («Pára de meter o Whatsapp a verde no site. Já disse para nunca o fazeres») after green showed up on the contact page, the docs help button and the experimental home floating bar.

**How to apply:** before shipping any page or component with a WhatsApp link, grep for green (#25d366, bg-whatsapp with a green token, Tailwind green-*). Tell agents explicitly in briefs that build site UI. Ads/videos that mimic a chat UI are a separate case (a neutral green bubble was accepted there), but site UI never. Related: [[brand-line]], [[copy-words]].
