# Pixel fidelity of a front render against the official logo (emblema.png, from the club's vector PDF).
import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import os, sys, numpy as np, cv2
from PIL import Image
ref = np.asarray(Image.open(SITE + '/public/media/clients/grob/emblema.png').convert('RGBA')).astype(np.float32)
RH, RW = ref.shape[:2]
out = sys.argv[1]
rows = []
for f in sys.argv[2:]:
  im = Image.open(f).convert('RGBA'); a = np.asarray(im)[..., 3]
  ys, xs = np.where(a > 128); bb = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
  r = np.asarray(im.crop(bb).resize((RW, RH), Image.LANCZOS)).astype(np.float32)
  ma, mr = ref[..., 3] > 128, r[..., 3] > 128
  iou = (ma & mr).sum() / (ma | mr).sum()
  both = ma & mr
  d = np.abs(r[..., :3] - ref[..., :3])
  dm = d.max(2)[both]
  lab = lambda x: cv2.cvtColor((x / 255).astype(np.float32), cv2.COLOR_RGB2Lab)
  de = np.linalg.norm(lab(r[..., :3]) - lab(ref[..., :3]), axis=2)[both]
  # same, ignoring a 2 px band around every edge in the logo (anti-aliasing / sub-pixel registration)
  g = cv2.Canny(ref[..., :3].astype(np.uint8), 40, 120); band = cv2.dilate(g, np.ones((5, 5), np.uint8)) > 0
  inner = both & ~band
  de_in = np.linalg.norm(lab(r[..., :3]) - lab(ref[..., :3]), axis=2)[inner]
  name = __import__('os').path.basename(f)
  rows.append((name, iou, d.mean(2)[both].mean(), (dm > 24).mean() * 100, np.median(de), np.percentile(de, 95), np.median(de_in), np.percentile(de_in, 95), (de_in > 5).mean() * 100))
  heat = np.zeros((RH, RW), np.float32); heat[both] = np.clip(np.linalg.norm(lab(r[..., :3]) - lab(ref[..., :3]), axis=2)[both] / 20, 0, 1)
  Image.fromarray((heat * 255).astype(np.uint8)).save(out + '/heat-' + name)
  Image.fromarray(r.astype(np.uint8)).save(out + '/aligned-' + name)
print('%-22s %6s %8s %8s %8s %8s %10s %10s %10s' % ('render', 'IoU', 'meanAbs', '%px>24', 'dE med', 'dE p95', 'dE med*', 'dE p95*', '%dE*>5'))
for r in rows: print('%-22s %6.3f %8.2f %8.2f %8.2f %8.2f %10.2f %10.2f %10.2f' % r)
print('* = excluding a 2px band around logo edges')
