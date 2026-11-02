import os
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))  # repo root
import json, sys
models = json.loads(sys.argv[1]); names = [m[0] for m in models]
views = {"1-front":{}, "2-34":{"rotY":-0.62,"rotX":0.16}, "5-close-V":{"zoom":2.6}, "7-close-GR":{"zoom":4.5,"tx":-0.38,"ty":0.5},
 "8-close-rim34":{"zoom":3,"rotY":-0.9,"rotX":0.1,"tx":-0.25,"ty":0.45}, "9-explode":{"rotY":0.95,"rotX":-0.14,"explode":1,"height":3.0}, "6-close-1937":{"zoom":6,"ty":-0.62}}
if len(sys.argv) > 2: views = {k: v for k, v in views.items() if k in sys.argv[2].split(',')}
shots = []
for k, v in views.items():
  for n in names:
    s = dict(v); s["model"] = n; s["file"] = f"{k}-{n}"; shots.append(s)
print(json.dumps({"w": 900, "h": 1100, "models": models, "shots": shots}))
