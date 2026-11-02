import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import os, sys, json, numpy as np, cv2
from PIL import Image
E = sys.argv[1]; B = E + '/out/bake'; O = E + '/out/maps'
import os; os.makedirs(O, exist_ok=True)
W_STEMS = O + '/stems.png'
tex = np.asarray(Image.open(SITE + '/public/media/clients/grob/emblema-textura.webp').convert('RGB')).astype(np.float32)/255
TH, TW = tex.shape[:2]
alb = np.asarray(Image.open(B + '/albedo-front.png').convert('RGBA')).astype(np.float32)/255
alb = alb[..., :3]*alb[..., 3:] + (1-alb[..., 3:])
BH, BW = alb.shape[:2]
nrm = np.asarray(Image.open(B + '/normal-front.png').convert('RGB')).astype(np.float32)/255*2-1
hraw = np.asarray(Image.open(B + '/height-front.png').convert('RGB')).astype(np.float32)
hgt = (hraw[..., 0]*256 + hraw[..., 1])/65535.0
cover = np.asarray(Image.open(B + '/albedo-front.png').convert('RGBA'))[..., 3] > 0
warp = np.load(B + '/warp.npy')  # texture px -> a0 px (a0 = bake resized to TW,TH)
# 1) affine-registered albedo at texture res, then dense flow refinement
a0 = cv2.resize(alb, (TW, TH), interpolation=cv2.INTER_AREA)
reg = cv2.warpAffine(a0, warp, (TW, TH), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
g1 = (cv2.cvtColor(tex, cv2.COLOR_RGB2GRAY)*255).astype(np.uint8)
g2 = (cv2.cvtColor(reg, cv2.COLOR_RGB2GRAY)*255).astype(np.uint8)
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
flow = dis.calc(g1, g2, None)  # for each tex px, where it is in reg
flow = cv2.GaussianBlur(flow, (0, 0), 6)  # keep it smooth: only correct drift, not invent detail
mag = np.linalg.norm(flow, axis=2); print('flow px median %.2f p95 %.2f max %.2f' % (np.median(mag), np.percentile(mag, 95), mag.max()))
gx, gy = np.meshgrid(np.arange(TW, dtype=np.float32), np.arange(TH, dtype=np.float32))
chk = cv2.remap(reg, gx + flow[..., 0], gy + flow[..., 1], cv2.INTER_LINEAR)
print('abs diff affine %.4f  +flow %.4f' % (np.abs(reg-tex).mean(), np.abs(chk-tex).mean()))
# 2) final map at output res: out px -> tex px -> +flow -> affine -> a0 px -> bake px
AO_STRENGTH = float(sys.argv[3]) if len(sys.argv) > 3 else 0.45
OW = int(sys.argv[2]) if len(sys.argv) > 2 else 1536
OH = round(OW * TH / TW)
ox, oy = np.meshgrid((np.arange(OW, dtype=np.float32)+0.5)*TW/OW-0.5, (np.arange(OH, dtype=np.float32)+0.5)*TH/OH-0.5)
fl = cv2.resize(flow, (OW, OH), interpolation=cv2.INTER_LINEAR)
tx, ty = ox + fl[..., 0], oy + fl[..., 1]
ax = warp[0, 0]*tx + warp[0, 1]*ty + warp[0, 2]
ay = warp[1, 0]*tx + warp[1, 1]*ty + warp[1, 2]
bx = ((ax+0.5)*BW/TW-0.5).astype(np.float32); by = ((ay+0.5)*BH/TH-0.5).astype(np.float32)
R = lambda img, interp=cv2.INTER_LINEAR: cv2.remap(img, bx, by, interp, borderMode=cv2.BORDER_REPLICATE)
N = R(nrm); H = R(hgt); A = R(alb); C = R(cover.astype(np.float32)) > 0.5
Image.fromarray((np.clip(A, 0, 1)*255).astype(np.uint8)).save(O + '/glb-albedo-registered.png')
# 3) masks from the vector layers
d = json.load(open(SITE + '/src/components/clients/grob/emblem/emblem-shapes.json')); m = d['meta']
def mask(ids):
  img = np.zeros((OH, OW), np.uint8)
  for lid in ids:
    for s in d['layers'][lid]:
      def pts(f): return np.array([[(f[i]-m['minX'])/m['width']*OW, (1-(f[i+1]-m['minY'])/m['height'])*OH] for i in range(0, len(f), 2)], np.float32)
      cv2.fillPoly(img, [np.round(pts(s['o'])*8).astype(np.int32)], 255, cv2.LINE_AA, 3)
      for h in s['h']: cv2.fillPoly(img, [np.round(pts(h)*8).astype(np.int32)], 0, cv2.LINE_AA, 3)
  return img.astype(np.float32)/255
M = {k: mask([k]) for k in d['layers']}
elems = np.clip(sum(M[k] for k in ['leaves', 'year', 'bows', 'vshield']), 0, 1)
ring = M['ring']; plate = M['plate']
fieldOnly = np.clip(M['field'] - elems, 0, 1)
for k, v in M.items(): Image.fromarray((v*255).astype(np.uint8)).save(O + f'/mask-{k}.png')
# 4) height: relative to the field level
field_level = np.median(H[(fieldOnly > 0.99) & C]); ring_level = np.median(H[(ring > 0.99) & C])
print('field level', field_level, 'ring level', ring_level, 'elem max', H[elems > 0.5].max(), 'field lump std', H[(fieldOnly > 0.99) & C].std())
rel = H - field_level
# field: flatten its AI lumps (keep only very low-frequency), elements keep their sculpt
stems = cv2.resize(cv2.imread(W_STEMS, cv2.IMREAD_GRAYSCALE), (OW, OH), interpolation=cv2.INTER_LINEAR).astype(np.float32)/255 if os.path.exists(W_STEMS) else 0
keep = cv2.GaussianBlur(np.clip(elems + ring + stems, 0, 1), (0, 0), 1.2)
Hc = keep*rel + (1-keep)*0.0
# 5) normals: GLB normals on the elements and the ring; dead flat on the porcelain field
Nf = N.copy(); Nf[..., 2] = np.maximum(Nf[..., 2], 0.05)
# the AI rim wobbles: keep only its broad rounded profile on the ring
ringOnly = cv2.GaussianBlur(np.clip(ring - elems, 0, 1), (0, 0), 2)[..., None]
Nf = ringOnly*cv2.GaussianBlur(Nf, (0, 0), 5) + (1-ringOnly)*Nf
flat = np.zeros_like(Nf); flat[..., 2] = 1
Nc = keep[..., None]*Nf + (1-keep[..., None])*flat
Nc /= np.linalg.norm(Nc, axis=2, keepdims=True)
Image.fromarray(((Nc*0.5+0.5)*255).round().astype(np.uint8)).save(O + '/normal.png')
# 6) AO from the height field (contact shadow around raised parts + crevices of the sculpt)
px = m['height']/OH  # procedural units per px
hz = Hc * (0.29196 * (4/1.902)) / px  # height in px units (GLB z range 0.292 scaled to the 4-unit crest)
occ = np.zeros_like(hz)
for s, w in [(2, 0.3), (6, 0.4), (16, 0.3)]:
  occ += w*np.clip(cv2.GaussianBlur(hz, (0, 0), s) - hz, 0, None)/s
inside = cv2.erode(plate, np.ones((5, 5), np.uint8)) > 0.5
ref = np.percentile(occ[inside & (occ > 0.01)], 90)
ao = 1 - AO_STRENGTH*np.tanh(occ/ref)
ao = np.where(inside, ao, 1.0)
ao = cv2.GaussianBlur(ao, (0, 0), 0.8)
hn = np.clip(Hc/max(Hc[elems > 0.5].max(), 1e-6), 0, 1)
print('ao min %.3f mean %.3f' % (ao.min(), ao.mean()))
Image.fromarray(np.dstack([(ao*255).astype(np.uint8), (hn*255).astype(np.uint8), np.zeros_like(ao, np.uint8)])).save(O + '/ao-height.png')
np.save(O + '/height-rel.npy', Hc.astype(np.float32))
json.dump({'OW': OW, 'OH': OH, 'field_level': float(field_level), 'hmax_rel': float(Hc[elems > 0.5].max()), 'glb_z_range': 0.29196}, open(O + '/meta.json', 'w'))

Image.open(O + '/normal.png').save(O + '/normal.webp', quality=92, method=6)
Image.open(O + '/ao-height.png').save(O + '/ao-height.webp', quality=90, method=6)
Image.fromarray((ao*255).round().astype(np.uint8)).convert('RGB').save(O + '/ao.webp', quality=88, method=6)
for f in ['normal.webp', 'ao-height.webp', 'ao.webp']: print(f, os.path.getsize(O + '/' + f))
