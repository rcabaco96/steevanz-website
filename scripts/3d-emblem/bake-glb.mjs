import { chromium } from './lib/pw.mjs';
import fs from 'fs';
const out = process.argv[2]; const W = 2048, H = Math.round(2048 * 1.902069 / 1.493292);
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
page.on('pageerror', (e) => console.log('[err]', e.message));
await page.goto(`http://localhost:4391/bake.html?w=${W}&h=${H}`);
await page.waitForFunction(() => window.ready);
console.log(await page.evaluate(() => window.init('/glb/grob.glb')), W, H);
for (const [n, f] of [['albedo', true], ['normal', true], ['geonormal', true], ['height', true], ['albedo', false], ['height', false]]) {
  const url = await page.evaluate(([n, f]) => window.pass(n, f), [n, f]);
  fs.writeFileSync(`${out}/${n}-${f ? 'front' : 'back'}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', n, f);
}
await browser.close();
