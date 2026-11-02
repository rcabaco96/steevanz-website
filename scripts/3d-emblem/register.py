import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import os, sys, numpy as np, cv2
from PIL import Image
E = sys.argv[1]; B = E + '/out/bake'
tex = np.asarray(Image.open(SITE + '/public/media/clients/grob/emblema-textura.webp').convert('RGB')).astype(np.float32)/255
alb = np.asarray(Image.open(B + '/albedo-front.png').convert('RGBA')).astype(np.float32)/255
TH, TW = tex.shape[:2]
# start: GLB bbox frame -> texture frame (straight resize)
alb = np.dstack([alb[...,:3]*alb[...,3:]+(1-alb[...,3:]), alb[...,3]])
a0 = cv2.resize(alb, (TW, TH), interpolation=cv2.INTER_AREA)
g_t = cv2.GaussianBlur(cv2.cvtColor(tex, cv2.COLOR_RGB2GRAY), (0,0), 1.5)
g_a = cv2.GaussianBlur(cv2.cvtColor(a0[..., :3], cv2.COLOR_RGB2GRAY), (0,0), 1.5)
warp = np.eye(2, 3, dtype=np.float32)
cc, warp = cv2.findTransformECC(g_t, g_a, warp, cv2.MOTION_HOMOGRAPHY if False else cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 400, 1e-7), None, 5)
print('ECC cc', cc); print(warp)
# compose: texture pixel (x,y) -> a0 pixel via warp -> bake pixel (scale)
sx, sy = alb.shape[1]/TW, alb.shape[0]/TH
np.save(E + '/out/bake/warp.npy', warp)
reg = cv2.warpAffine(a0, warp, (TW, TH), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
before = np.abs(a0[..., :3] - tex).mean(); after = np.abs(reg[..., :3] - tex).mean()
print('mean abs diff before', before, 'after', after)
ov = (0.5*tex + 0.5*reg[..., :3]); Image.fromarray((ov*255).astype(np.uint8)).save(E + '/out/bake/overlay.png')
d = np.abs(reg[..., :3] - tex).mean(2); Image.fromarray((np.clip(d*3,0,1)*255).astype(np.uint8)).save(E + '/out/bake/diff.png')
