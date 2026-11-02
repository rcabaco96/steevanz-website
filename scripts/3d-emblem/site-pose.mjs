import { chromium } from './lib/pw.mjs';
// Drive the live /grob emblem via window.__grobEmblem and capture poses with a transparent background.
const [,, outDir, tag, vw = '1000', vh = '1200', dpr = '1'] = process.argv;
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +vw, height: +vh }, deviceScaleFactor: +dpr });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('[err]', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.text().slice(0, 300)); });
await page.goto('http://localhost:4380/grob', { waitUntil: 'load' });
await page.waitForFunction(() => window.__grobEmblem, null, { timeout: 90000 });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: 'html,body{background:transparent!important} body *{visibility:hidden!important} canvas{visibility:visible!important}' });
const poses = {
  front: { x: 0, y: 0, rotX: 0, rotY: 0, spin: 0, explode: 0, fit: 0.86, pointerX: 0, pointerY: 0 },
  q34: { x: 0, y: 0, rotX: 0.16, rotY: -0.62, spin: 0, explode: 0, fit: 0.8, pointerX: 0, pointerY: 0 },
  explode: { x: 0, y: 0, rotX: -0.14, rotY: 0.95, spin: 0, explode: 1, fit: 0.66, pointerX: 0, pointerY: 0 },
  spin: { x: 0, y: 0, rotX: 0.04, rotY: 0, spin: 2.4, explode: 0, fit: 0.8, pointerX: 0, pointerY: 0 },
};
for (const [name, pose] of Object.entries(poses)) {
  await page.evaluate((p) => { const s = window.__grobEmblem; Object.assign(s, p); s.wake?.(); }, pose);
  await page.waitForTimeout(3500);
  await page.evaluate(() => window.__grobEmblem.wake?.());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/${tag}-${name}.png`, omitBackground: true });
  console.log('shot', name);
}
await browser.close();
