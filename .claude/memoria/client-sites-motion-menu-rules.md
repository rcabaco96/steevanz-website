---
name: client-sites-motion-menu-rules
description: Client sites scroll smoothly to the top on reload/route change; a video menu never repeats a video (incl. twin footage); site and menu previews always differ
metadata:
  type: feedback
---

Three owner rules (2026-10-23) for every client site and video menu:
1. On every page reload or route change, scroll smoothly back to the top (the sites' SmoothScroll helper; # links left alone).
2. Never the same video twice in one menu — also not the same footage uploaded twice under different ids; compare thumbnails before publishing.
3. The site's and the menu's link-preview images are never the same (menu = phones with the menu open).

**Why:** owner: «Sempre que se atualizar a página ou mudar de rota deves fazer um scroll smooth para o início da página»; «nunca usar os mesmos vídeos no mesmo menu digital. Vi que fizeste isso para o menu do lobo do mar»; «as imagens de metadados do site e do menu digital de um cliente nunca podem ser as mesmas».

**How to apply:** in `.claude/skills/steevanz-sites-clientes`. Related: [[client-sites-standard]], [[client-metadata-always]].
