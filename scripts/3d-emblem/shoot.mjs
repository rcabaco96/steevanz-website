import { chromium } from './lib/pw.mjs';
const [,, outDir, jobFile] = process.argv;
const job = JSON.parse((await import('fs')).readFileSync(jobFile, 'utf8'));
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: job.w || 900, height: job.h || 1100 } });
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[err]', e.message));
await page.goto(`http://localhost:4391/${job.page || 'compare.html'}?w=${job.w || 900}&h=${job.h || 1100}&alpha=${job.alpha ? 1 : 0}`);
await page.waitForFunction(() => window.ready, null, { timeout: 60000 });
console.log('GL:', await page.evaluate(() => window.glInfo()));
for (const [name, kind, arg] of job.models) {
  const t = Date.now();
  const info = await page.evaluate(([n, k, a]) => window.load(n, k, a), [name, kind, arg]);
  console.log('loaded', name, Date.now() - t, 'ms', JSON.stringify(info));
}
for (const shot of job.shots) {
  await page.evaluate((v) => window.show(v), shot);
  await page.screenshot({ path: `${outDir}/${shot.file}.png`, omitBackground: !!job.alpha });
  console.log('shot', shot.file);
}
await browser.close();
