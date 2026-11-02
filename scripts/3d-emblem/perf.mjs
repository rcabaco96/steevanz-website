import { chromium } from './lib/pw.mjs';
const browser = await chromium.launch({ channel: 'msedge', headless: false, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0'] });
for (const [w, h, mobile, throttle] of JSON.parse(process.argv[2])) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }); }).observe({ type: 'longtask', buffered: true });
  });
  const cdp = await ctx.newCDPSession(page);
  if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  const t0 = Date.now();
  await page.goto('http://localhost:4380/grob', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__grobEmblem, null, { timeout: 120000 });
  const readyAt = Date.now() - t0;
  await page.waitForTimeout(3000);
  const loadLong = await page.evaluate(() => window.__long.slice());
  if (process.argv[3] === 'no3d') await page.evaluate(() => { document.querySelector('section canvas').parentElement.parentElement.style.display = 'none'; });
  await page.evaluate(() => { window.__long = []; window.__frames = []; let last = performance.now(); const tick = (t) => { window.__frames.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const H = h;
  for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, Math.round(H * 2.4 / 90)); await page.waitForTimeout(50); }
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => { window.__stop = true; const f = window.__frames.slice(2).sort((a, b) => a - b); const avg = f.reduce((a, b) => a + b, 0) / f.length; return { frames: f.length, avgMs: avg.toFixed(2), fps: (1000 / avg).toFixed(1), p95: f[Math.floor(f.length * 0.95)].toFixed(1), p99: f[Math.floor(f.length * 0.99)].toFixed(1), over33: f.filter((x) => x > 33.4).length, long: window.__long }; });
  r.longCount = r.long.length; r.longMax = Math.max(0, ...r.long.map((x) => x.d)); delete r.long; console.log(JSON.stringify({ viewport: `${w}x${h}`, cpuThrottle: throttle, emblemReadyMs: readyAt, loadLongMax: Math.max(0, ...loadLong.map((x) => x.d)), scroll: r }));
  await ctx.close();
}
await browser.close();
