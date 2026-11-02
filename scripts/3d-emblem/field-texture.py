# Field texture = the plain base + whatever art the vector layers do not cover (the olive stems), so nothing is lost
# and nothing is printed twice under the floating layers when the crest comes apart.
import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import os, sys, json, numpy as np, cv2
from PIL import Image
W = sys.argv[1]; SITE = SITE + ''; G = SITE + '/public/media/clients/grob/'
full = np.asarray(Image.open(G + 'emblema-textura.webp').convert('RGB')).astype(np.float32)
base = np.asarray(Image.open(G + 'emblema-textura-base.webp').convert('RGB')).astype(np.float32)
TH, TW = full.shape[:2]
d = json.load(open(SITE + '/src/components/clients/grob/emblem/emblem-shapes.json')); m = d['meta']
def mask(ids, w, h):
  img = np.zeros((h, w), np.uint8)
  for lid in ids:
    for s in d['layers'][lid]:
      def pts(f): return np.array([[(f[i]-m['minX'])/m['width']*w, (1-(f[i+1]-m['minY'])/m['height'])*h] for i in range(0, len(f), 2)])
      cv2.fillPoly(img, [np.round(pts(s['o'])*16).astype(np.int32)], 255, cv2.LINE_AA, 4)
      for hh in s['h']: cv2.fillPoly(img, [np.round(pts(hh)*16).astype(np.int32)], 0, cv2.LINE_AA, 4)
  return img
elems = mask(['leaves', 'year', 'bows', 'vshield'], TW, TH)
elemsD = cv2.dilate(elems, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
field = mask(['field'], TW, TH) > 127
hsv = cv2.cvtColor(full.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
beige = (hsv[..., 0] >= 10) & (hsv[..., 0] <= 30) & (hsv[..., 1] > 40) & (hsv[..., 1] < 170) & (hsv[..., 2] > 120)
diff = (np.abs(full - base).max(2) > 18) & cv2.dilate(beige.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
stems = diff & field & (elemsD < 128)
stems = cv2.morphologyEx(stems.astype(np.uint8)*255, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
stems = cv2.dilate(stems, np.ones((3, 3), np.uint8))
a = cv2.GaussianBlur(stems.astype(np.float32)/255, (0, 0), 0.7)[..., None]
out = base*(1-a) + full*a
Image.fromarray(out.round().clip(0, 255).astype(np.uint8)).save(G + 'emblema-textura-campo.webp', quality=92, method=6)
cv2.imwrite(W + '/out/maps/stems.png', stems)
print('stem px', int((stems > 0).sum()))
