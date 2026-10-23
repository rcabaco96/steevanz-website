---
name: client-metadata-always
description: "Every client site and its video menu must ship with their own link previews (OG/Twitter 1200x630, icons from the client's logo), verified live"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-22T22:16:33.323Z
---

For every client site AND its video menu (/menu/<slug>): own Open Graph/Twitter metadata with a 1200×630 image in the client's identity, icons from the client's logo, JSON-LD with real data; menu gets an `ownPreviews` entry in src/app/(publico)/menu/[slug]/page.tsx with its OWN image — phones with the menu open (grid + a dish full screen), never the site's image — and a menu logo from the real logo. Say «Menu digital», never «ementa em vídeo». Verify live with curl (og tags + image 200).

**Why:** owner, 2026-10-23: «mete a imagem de metadados do menu digital deles diferente, com um telemóvel mesmo com o menu aberto… Adiciona isto como regra»; «diz menu digital em vez de ementa em vídeo». And 2026-10-22, after Lobo do Mar: «Não te esqueças dos metadados para o site e o menu! Adiciona como regra para qualquer site que façamos!»

**How to apply:** part of the definition of done for any client site; details in `.claude/skills/steevanz-sites-clientes` (section Metadados). Related: [[client-sites-standard]].
