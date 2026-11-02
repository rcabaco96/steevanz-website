# Bows relief cap: a dense triangulation of the vector bows, displaced by the AI model's sculpt (height baked earlier).
import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import os, sys, json, struct, numpy as np, cv2
from scipy.spatial import Delaunay
W = sys.argv[1]; L = float(sys.argv[2]) if len(sys.argv) > 2 else 0.012
d = json.load(open(SITE + '/src/components/clients/grob/emblem/emblem-shapes.json')); m = d['meta']
H = np.load(W + '/out/maps/height-rel.npy') * 0.29196 * 4 / 1.902  # crest units above the field
OH, OW = H.shape
SIG = float(sys.argv[6]) if len(sys.argv) > 6 else 3.0
H = cv2.GaussianBlur(H.astype(np.float32), (0, 0), SIG)
def to_px(x, y): return (x - m['minX']) / m['width'] * OW - 0.5, (1 - (y - m['minY']) / m['height']) * OH - 0.5
def sample(img, x, y):
  px, py = to_px(x, y)
  return cv2.remap(img.astype(np.float32), px.astype(np.float32).reshape(-1, 1), py.astype(np.float32).reshape(-1, 1), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).ravel()
def ring_pts(f): return np.array(f, np.float64).reshape(-1, 2)
def resample(r, step):
  out = []
  for i in range(len(r)):
    a, b = r[i], r[(i + 1) % len(r)]
    n = max(1, int(np.ceil(np.linalg.norm(b - a) / step)))
    for k in range(n): out.append(a + (b - a) * k / n)
  return np.array(out)
def inside(pts, rings):
  res = np.zeros(len(pts), bool)
  x, y = pts[:, 0], pts[:, 1]
  for r in rings:
    xa, ya = r[:, 0], r[:, 1]; xb, yb = np.roll(xa, -1), np.roll(ya, -1)
    for i in range(len(r)):
      c = ((ya[i] > y) != (yb[i] > y)) & (x < (xb[i] - xa[i]) * (y - ya[i]) / (yb[i] - ya[i] + 1e-30) + xa[i])
      res ^= c
  return res
SS = 4  # supersampled mask for distance-to-edge
mask = np.zeros((OH * SS, OW * SS), np.uint8)
def fill(r, v):
  px, py = to_px(r[:, 0], r[:, 1]); cv2.fillPoly(mask, [np.round(np.stack([(px + 0.5) * SS, (py + 0.5) * SS], 1) * 16).astype(np.int32)], v, cv2.LINE_8, 4)
for s in d['layers']['bows']:
  fill(ring_pts(s['o']), 255)
  for h in s['h']: fill(ring_pts(h), 0)
dist = cv2.distanceTransform(mask, cv2.DIST_L2, 5) / SS * (m['height'] / OH)  # crest units
dist = cv2.resize(dist, (OW, OH), interpolation=cv2.INTER_AREA)
BASE, GAIN, FALL = float(sys.argv[3]) if len(sys.argv) > 3 else 0.03, float(sys.argv[4]) if len(sys.argv) > 4 else 0.85, 2.0 * L
verts, tris = [], []
for s in d['layers']['bows']:
  rings = [ring_pts(s['o'])] + [ring_pts(h) for h in s['h']]
  bnd = np.concatenate([resample(r, L * 0.7) for r in rings])
  lo, hi = bnd.min(0), bnd.max(0)
  gx, gy = np.meshgrid(np.arange(lo[0], hi[0], L), np.arange(lo[1], hi[1], L * 0.866))
  gx = gx + (np.arange(gx.shape[0])[:, None] % 2) * L * 0.5  # hex grid
  g = np.stack([gx.ravel(), gy.ravel()], 1)
  g = g[inside(g, rings)]
  g = g[sample(dist, g[:, 0], g[:, 1]) > 0.55 * L]
  P = np.concatenate([bnd, g]); nb = len(bnd)
  T = Delaunay(P).simplices
  c = P[T].mean(1)
  T = T[inside(c, rings)]
  h = sample(H, P[:, 0], P[:, 1])
  dd = sample(dist, P[:, 0], P[:, 1])
  z = np.clip(h - BASE, 0, None) * GAIN * np.clip(dd / FALL, 0, 1) ** 0.75
  z[:nb] = 0
  z = z + 0.0012  # sits a hair above the slab's cap
  off = sum(len(v) for v in verts)
  verts.append(np.column_stack([P, z])); tris.append(T + off)
V = np.concatenate(verts); T = np.concatenate(tris)
# orient CCW (+z facing)
a, b, c = V[T[:, 0], :2], V[T[:, 1], :2], V[T[:, 2], :2]
cr = (b[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0])
T[cr < 0] = T[cr < 0][:, [0, 2, 1]]
print('verts', len(V), 'tris', len(T), 'zmax %.3f' % V[:, 2].max())
# quantised binary: header (magic, nv, nt, zmax), xy uint16 over the crest frame, z uint16 over [0,zmax], indices uint16
zmax = float(V[:, 2].max())
qx = np.round((V[:, 0] - m['minX']) / m['width'] * 65535).astype('<u2')
qy = np.round((V[:, 1] - m['minY']) / m['height'] * 65535).astype('<u2')
qz = np.round(V[:, 2] / zmax * 65535).astype('<u2')
assert len(V) < 65536
with open(sys.argv[5] if len(sys.argv) > 5 else W + '/out/maps/emblema-relevo.bin', 'wb') as f:
  f.write(struct.pack('<4sIIf', b'GRB1', len(V), len(T), zmax))
  f.write(np.stack([qx, qy, qz], 1).tobytes()); f.write(T.astype('<u2').tobytes())
import os; print('bytes', os.path.getsize(sys.argv[5] if len(sys.argv) > 5 else W + '/out/maps/emblema-relevo.bin'))
