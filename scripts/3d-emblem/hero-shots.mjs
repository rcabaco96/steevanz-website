import { chromium } from './lib/pw.mjs';
const [,, outDir, tag] = process.argv;
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const [w, h, mobile] of [[1920, 1080, false], [390, 844, true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('[err]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text()); });
  await page.goto('http://localhost:4380/grob', { waitUntil: 'load', timeout: 120000 });
  await page.waitForSelector('#emblema canvas, section canvas', { timeout: 60000 }).catch(() => console.log('no canvas'));
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${outDir}/${tag}-hero-${w}.png` });
  const H = await page.evaluate(() => window.innerHeight);
  for (const [name, f] of [['front', 1.0], ['explode', 1.25], ['explode2', 1.7]]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * f));
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${outDir}/${tag}-${name}-${w}.png` });
  }
  await ctx.close();
  console.log('done', w);
}
await browser.close();
