# 3D emblem playbook (vector → layered 3D, AI image→3D, and how to combine them)

Written 2026-11-02 while building the GROB emblem (`src/components/clients/grob/emblem/`). Read the brand rule
first. It overrides everything else in this file.

## 0. Brand rule (non-negotiable)

Viewed from the front, the emblem must read exactly like the club's official logo: the same colours, shapes,
proportions and details. Reflections, glare, environment tint or tone mapping must never shift a face colour or
hide an element. The owner put it this way: «é a identidade da marca, não podes mudar coisas».

- Front faces are unlit. Use `MeshBasicMaterial({ map: logo, toneMapped: false })`, so the texture comes out at its
  exact sRGB value.
- Relief can only modulate those faces as a small signed term that is zero on flat surfaces
  (`1 + k·(dot(n, L) − L.z)`, k ≈ 0.06). The light is fixed to the emblem, so nothing sweeps across the colours
  while it spins.
- Metal shine belongs only on bevel walls, edges and the back plate. Any part of a bevel that faces the front shows
  the logo colour (`smoothstep(0.3, 0.62, normal.z)` mix).
- Bevels sit inside the vector contour (`bevelOffset = −bevelSize`). From the front, every piece keeps the logo's
  silhouette and gains no thin outline.
- A layer that has other layers on top of it (the V shield under the yellow band and the green V) gets a solid
  colour, never the full logo image. If it got the image, the art would appear twice when the crest comes apart.
- The quality check is a pixel diff against the official PNG (section 5). It is a gate, not an opinion.

## 1. Route A: procedural vector → layered 3D (the studio signature)

This is the route for anything that has to be the brand: it is crisp and exact, and every layer can be animated.

1. Get the vector. The club's PDF (from its «Símbolo» page) is the source of truth. Render it with PyMuPDF at
   about 4000 px (`fitz`).
2. Separate the layers. Make one mask per visual layer from the colours and paths: plate, ring, field, leaves,
   bows, V shield, inner V, yellow band, year. Vectorise each mask into outer polygons plus holes, simplified to
   about 0.5 px at 1000 px. Store everything in one JSON in crest units (`emblem-shapes.json`: meta
   `{minX, minY, width, height}`, then `layers[id] = [{o: [x,y,…], h: [[…]]}]`).
3. Textures. `emblema-textura.webp` is the full logo framed exactly like the meta box. `-base` is the ring and
   field only. `-campo` is the field plus whatever art no layer covers (here, the olive stems, pulled out by their
   beige colour), so no art is lost and none is printed twice.
4. Geometry. Use `THREE.ExtrudeGeometry` for each layer with a bevel and `curveSegments: 1`. A custom
   `UVGenerator` maps both caps and side walls to the planar logo UV `((x − minX)/width, (y − minY)/height)`.
5. Materials. Follow section 0. Use a Standard metal (silver or gold) for the walls and the back plate, lit by a
   studio environment made in the scene: a few emissive light boxes rendered once through `PMREMGenerator`. No HDR
   file needed.
6. Motion. A mutable state object (`state.ts`) is driven by a GSAP ScrollTrigger timeline: the explode offsets
   per layer, coin spin, fit and position. Use `frameloop="demand"` and wake on scroll or pointer, run
   `compileAsync` before the first frame, use adaptive DPR, and load lazily after first paint with `next/dynamic`
   and `requestIdleCallback`.
7. Demo path for videos (house rule). `window.__grobEmblem` exposes the state, so a script can pose the emblem.
   For example `Object.assign(__grobEmblem, {rotY: 0, explode: 1}); __grobEmblem.wake()`.

## 2. Route B: AI image→3D (what the owner's `grob.glb` is)

### What the file tells us

- Writer: `pygltflib@1.16.5`, so a Python post-process step wrote it, not Blender or a DCC tool.
- Geometry: one mesh with 467,580 triangles and 253,876 vertices. After welding it is a single watertight body, so
  the parts cannot be separated and it cannot explode. The median edge is 0.0018 on a crest 1.9 units tall (very
  dense, from marching cubes). It faces +Z with Y up, the bounding box is 1.49 × 1.90 × 0.29, and it is centred.
  56 % of the faces point to the front and 9 % to the back.
- UVs: 773 small islands packed at about 66 % coverage. That is an automatic xatlas-style atlas, so you cannot
  edit the texture by hand.
- Material: baseColor 4096² JPEG (the lighting is partly painted in), metallicRoughness 2048² (metal = 0
  everywhere, roughness about 0.34 everywhere, so generic plastic), normal map 4096², double-sided.
- Most likely source: a current image→3D generator with a PBR texture stage, in the Hunyuan3D-2.x / Tripo / Meshy
  class (dense remeshed shell, xatlas atlas, baked base + MR + normal, re-exported by a Python script). The file
  cannot tell us which one.

### Verdict against the official logo

Measured with the fidelity script, front view, inner pixels:

| Render | Silhouette IoU | Median ΔE | p95 ΔE | Pixels with ΔE > 5 |
| --- | --- | --- | --- | --- |
| AI GLB | 0.991 | 10.4 | 21 | 96 % |
| Old procedural (lit enamel) | 0.997 | 14.7 | 59 | 98 % |
| Current procedural (brand rule) | 0.999 | 0.0 | 2.9 | 2.9 % (edges and relief only) |

- **Good in the GLB:** real sculpted volume. The bows are pillowy and their loops stand out at grazing angles. The
  branches and olives have relief, and the outer ring has a rounded profile.
- **Bad in the GLB:**
  - The drawing is reinterpreted: the V's proportions and inner black line differ, and the bow outlines are
    smeared.
  - The white field is lumpy, the rim wobbles, and the back carries a second copy of the logo.
  - The material is plastic and the colours are AI repaints.
  - It is 34 MB.
- **Rule:** never show an AI model's faces or colours for a brand mark. It can only donate relief.

### Generators and whether they run here

This machine has an Intel Iris Xe (no NVIDIA, no CUDA; `nvidia-smi` is absent), 32 GB RAM and about 13.6 GB free
on C:.

| Tool | Licence / cost | Runs locally here? | Notes |
| --- | --- | --- | --- |
| Hunyuan3D-2 / 2.1 (Tencent, open weights) | free, Tencent community licence (check the territory clause) | **No.** Needs CUDA: about 6 GB VRAM for shape (2mini) and 16 GB+ for textures | Best open-weights quality with PBR textures. Use the free HF Space (ZeroGPU quota) or rent a GPU |
| TRELLIS (Microsoft, MIT) | free | **No.** CUDA, 16 GB VRAM | Very good geometry. Free HF Space |
| TripoSR (Stability + Tripo, MIT) | free | **Yes, on CPU**, slowly (minutes per object, about 2 GB weights plus CPU torch) | Low detail with vertex colours. Fine for a relief proxy, not for a hero mesh |
| Stable Fast 3D / SPAR3D (Stability) | free under the community licence (≤ $1M revenue) | Officially CUDA or MPS; CPU is unofficial and slow | UV-unwrapped, fast on a GPU |
| Meshy, Tripo (cloud), Rodin/Hyper3D, the Higgsfield `generate_3d` connector | **paid credits** | cloud | **Never spend credits without the owner's approval** |

Nothing was installed for this job. If we want a local generator, the only realistic option on this laptop is
TripoSR on CPU. That is about 3–4 GB to download, so ask first. For quality, use a free Hugging Face Space (the
logo is public, but tell the owner it gets uploaded) or a rented CUDA GPU.

Prompting and input that work best: a clean, front-facing PNG of the logo on a transparent or white background,
square with padding, with no drop shadow or perspective. For badges, ask for a «thin relief plaque» or use a
low-thickness preset, otherwise the generators inflate everything into a pillow.

## 3. Post-processing an AI mesh

1. Inspect it. Dump the glTF JSON and extract the images (Node, about 20 lines). Check the generator, counts,
   bounding box and orientation, texture sizes, MR statistics (is it really metal?) and UV islands (trimesh plus
   scipy connected components).
2. Clean it in Blender 5.2, which is installed at `C:\Program Files\Blender Foundation\Blender 5.2`, run with
   `blender -b -P script.py`. Merge by distance, remove loose parts and the hallucinated back side, and fix normals.
3. Decimate and compress in one command. This took the GROB GLB from 34.35 MB to **1.56 MB** (468k → 103k
   triangles, visually the same):

   ```
   npx -y @gltf-transform/cli@4 optimize in.glb out.glb --compress meshopt --texture-compress webp \
     --texture-size 2048 --simplify true --simplify-ratio 0.22 --simplify-error 0.0008
   ```

   Use KTX2 (`--texture-compress ktx2`, which needs `toktx`) when GPU memory matters more than bytes. At runtime,
   `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)`.
4. Bake (section 4) instead of shipping the mesh whenever the brand route already exists.

## 4. Combining both routes (what GROB ships)

Keep the vector layers for shape, colour and the explode. Take only relief from the AI model, baked into the
logo's own UV frame.

1. Render the GLB orthographically from the front in headless Edge with three.js. Write three passes at
   2048 × 2609: an unlit albedo (`MeshBasicMaterial` with its map), object-space normals (`MeshNormalMaterial`
   with its normal map), and a 16-bit height (z packed into R and G).
2. Register it to the logo. Composite the albedo over white, then `cv2.findTransformECC` (affine) against
   `emblema-textura.webp`. Here that gave cc 0.974. Then refine with heavily smoothed DIS optical flow (median
   3 px). Warp the normal and height passes with the same mapping into the texture frame (1536 × 1961).
3. Mask by vector layer by rasterising `emblem-shapes.json`. Keep the AI normals on the elements, stems and ring
   (blur the ring's normals so its wobble disappears). Set the porcelain field to flat (0, 0, 1). The result is
   `emblema-relevo-normal.webp`, 139 KB.
4. Sculpted bows as real geometry. Resample the bow contours and fill them with a hex grid of points (spacing
   0.014). Run Delaunay and keep only the triangles inside the shape. Displace z by the registered AI height
   (Gaussian σ 3 px), measured above the ribbon level, × 0.75, with the boundary pinned to 0 and a falloff of
   2 × spacing. Quantise to uint16 and save as `emblema-relevo.bin` (8,183 vertices, 15,069 triangles, 139 KB,
   106 KB gzipped). At runtime it is a child mesh on the bows layer, sitting on its cap, so it explodes with it.
   From the front it is still exactly the logo (planar UVs). At an angle the loops have real volume.
5. Apply section 0 to all of it. No AO went into the faces in the end: contact shadows change colours, and they
   ghost when the crest is exploded.

Budget: the relief adds about 280 KB, loaded after first paint, where the AI GLB was 34 MB.
Measured on the dev server, headless Edge on Iris Xe, scrubbing the hero:

| Viewport | Frame rate | p99 frame | Long tasks |
| --- | --- | --- | --- |
| 1920 × 1080 | 57.5–59.9 fps over 4 runs | 17.2–33.5 ms | none during the scroll |
| 390 × 844 (mobile emulation) | 58.7–60.0 fps | 16.9–33.4 ms | none |

Mobile at 4× CPU throttle, with the dev server idle, alternating runs:

| Configuration | Frame rate |
| --- | --- |
| 3D hidden | 56–60 fps |
| Old setup (no antialiasing, DPR 1.25) | 59.9 fps |
| Antialiasing on (MSAA), DPR 1.25 | 53–60 fps |
| **Shipped: MSAA, DPR starting at 1.5 and adapting up to 2** | **57.9–58.8 fps** |

While the other agent's edits were recompiling, the same runs swung between 0.6 and 37 fps. Ignore runs that
have long tasks over 1 s.

Antialiasing is on for every device. On phone GPUs, MSAA resolves on the chip and costs almost nothing. FXAA or
SMAA would add a full-screen pass and blur the small «1937».

## 5. QA gate (run before showing a client)

- Render front, 3/4, edge, exploded and close-ups (V, year, letters, rim) side by side under the same light.
- Fidelity: capture the live front with a transparent background (via `window.__grobEmblem`), crop to the alpha
  bounding box, resize to the official PNG, and compare in Lab. Pass when the inner median ΔE is ≤ 1, the inner
  p95 ΔE is ≤ 3, and the IoU is ≥ 0.995. Check the ΔE heatmap: anything outside edges and the bows is a bug.
- Explode check: no element may appear twice, and nothing may be printed on a layer underneath.
- Performance check: the rAF frame log while scrolling stays at 60 fps on desktop, with no long tasks over 50 ms
  from the 3D.
- Regenerate the first-paint still (`emblema-3d.webp`) from the live canvas whenever the look changes, so the
  cross-fade does not jump.

The working scripts (inspect, harness, bake, register, field texture, relief, fidelity gate, live poses, hero
shots, still, share image, frame rate) are in [`scripts/3d-emblem/`](../scripts/3d-emblem/README.md).
