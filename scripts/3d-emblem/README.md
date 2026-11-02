# scripts/3d-emblem

These are the working tools behind the GROB 3D emblem. The method is in
[docs/3d-emblem-playbook.md](../../docs/3d-emblem-playbook.md); this file only says what runs what.

## Requirements

- Python 3.12 with `numpy pillow opencv-python-headless scipy trimesh`.
- Node 24.
- Edge or Chrome.
- `playwright-core`: the repo's own copy if present, otherwise the global `@playwright/cli` (see `lib/pw.mjs`).

The site's dev server must be running at `http://localhost:4380` for the `site-*`, `hero-*`, `still`, `perf` and
`console-check` scripts.

Run everything from the repo root, with a scratch folder `WORK` (outside the repo) laid out like this:

```
WORK/glb-in/<model>.glb    the AI model to evaluate or bake
WORK/out/...               renders, bakes, maps (created by the scripts)
```

## Pipeline

| Step | Command | Output |
| --- | --- | --- |
| Inspect an AI GLB | `node scripts/3d-emblem/inspect-glb.mjs WORK/glb-in/x.glb WORK/out/tex` | glTF JSON summary and extracted textures |
| Harness server (three.js from `node_modules`) | `node scripts/3d-emblem/serve.mjs WORK 4391` | `http://localhost:4391/compare.html`, `/bake.html` |
| Side-by-side renders | `python scripts/3d-emblem/mkjob.py '[["glb","glb","/glb/x.glb"],["v0","proc","v0"]]' > job.json` then `node scripts/3d-emblem/shoot.mjs WORK/out/a job.json` and `python scripts/3d-emblem/sheet.py out.jpg 2 a.png b.png` | PNG per view, plus contact sheets |
| Bake the GLB front | `node scripts/3d-emblem/bake-glb.mjs WORK/out/bake` (expects `WORK/glb-in/grob.glb`) | albedo, normal and 16-bit height passes |
| Register to the logo | `python scripts/3d-emblem/register.py WORK` | `out/bake/warp.npy` (ECC affine) |
| Field texture (keeps uncovered art) | `python scripts/3d-emblem/field-texture.py WORK` | `public/media/clients/grob/emblema-textura-campo.webp` and `out/maps/stems.png` |
| Relief maps | `python scripts/3d-emblem/bake-maps.py WORK 1536` | `out/maps/normal.webp` → copy to `emblema-relevo-normal.webp` |
| Sculpted bows mesh | `python scripts/3d-emblem/relief.py WORK 0.014 0.03 0.75 WORK/out/maps/emblema-relevo.bin 3.0` | uint16 mesh → copy to `public/media/clients/grob/emblema-relevo.bin` |
| Live poses (front, 3/4, explode, spin) | `node scripts/3d-emblem/site-pose.mjs WORK/out/fid site 1000 1200 1` | transparent PNGs from the real page (`window.__grobEmblem`) |
| **Brand gate** | `python scripts/3d-emblem/fidelity.py WORK/out/fid site-front.png` | IoU and ΔE table, plus heatmaps. Pass: inner median ΔE ≤ 1, p95 ≤ 3, IoU ≥ 0.995 |
| Hero before/after | `node scripts/3d-emblem/hero-shots.mjs WORK/out/hero after` | 1920 and 390 screenshots, 4 scroll states |
| First-paint still | `node scripts/3d-emblem/still.mjs WORK/out/hero/still-raw.png`, then crop to alpha and save `emblema-3d.webp` (710 px wide) | |
| Share image | put `emblem-3d.png` (the still crop) and `futsal-ataque.webp` next to `og/og.html`, then `node scripts/3d-emblem/og/render.mjs out.png`, then save as `og-site.jpg` (q88) | 1200×630 |
| Frame rate | `node scripts/3d-emblem/perf.mjs '[[1920,1080,false,1],[390,844,true,4]]' [no3d]` | fps, p95/p99 frame time and long tasks while scrubbing the hero (`no3d` hides the canvas for a baseline) |
| Console | `node scripts/3d-emblem/console-check.mjs` | grouped console messages and failed requests |

The harness variants `v1` and `v2` in `www/compare.js` are the *evaluation* materials (lit enamel). They are not
the shipped look. The shipped, brand-true materials live in `src/components/clients/grob/emblem/EmblemCanvas.tsx`,
so judge the final result with `site-pose.mjs` and `fidelity.py`.
