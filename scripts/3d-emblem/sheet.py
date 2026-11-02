import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]; cols = int(sys.argv[2]); files = sys.argv[3:]
ims = [Image.open(f).convert('RGB') for f in files]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (h + 28)), (20, 20, 20))
d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype('arial.ttf', 20)
except Exception: font = None
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 28)
    sheet.paste(im, (x, y + 28)); d.text((x + 8, y + 3), __import__('os').path.basename(f), fill=(255, 255, 255), font=font)
sheet.save(out, quality=90)
