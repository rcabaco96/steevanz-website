---
name: send-videos-720p-hq
description: "When sending a video to the owner for review, send a high-quality 720p copy (≤ 30 MB), not the low-bitrate «para enviar» file"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-22T11:38:20.309Z
---

To show the owner a video (SendUserFile, he watches on his iPhone), send a dedicated 720×1280 high-bitrate copy (e.g. H.264 CRF ~18 or ~5–6 Mbps, faststart, AAC), always under the 30 MB upload limit. Don't send the «(para enviar)» 8 Mbps-target 1080p file: it came out ~6.5 Mbps and looked soft after the app's recompression.

**Why:** 2026-10-22 he got the waitlist ad and said «Esse não tem qualidade wtf»; then «720p chega».

**How to apply:** for every review send, make `… (rever 720p).mp4` from the 1080p master and send that. Related: [[mobile-first]].
