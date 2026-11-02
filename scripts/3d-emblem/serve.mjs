import http from 'http'; import fs from 'fs'; import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..', '..');
const E = process.argv[2]; const port = +process.argv[3] || 4391;
const routes = [
  ['/three/', SITE + '/node_modules/three/'],
  ['/media/', SITE + '/public/media/'],
  ['/emblem/', SITE + '/src/components/clients/grob/emblem/'],
  ['/glb/', E + '/glb-in/'],
  ['/out/', E + '/out/'],
  ['/', HERE + '/www/'],
];
const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.ktx2': 'image/ktx2' };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const r = routes.find(([p]) => url.startsWith(p));
  const file = path.join(r[1], url.slice(r[0].length) || 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404 ' + file); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
}).listen(port, () => console.log('serving', port));
