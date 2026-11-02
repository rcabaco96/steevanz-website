// Playwright for these scripts: the repo's own playwright-core if installed, else the global @playwright/cli copy.
import { createRequire } from 'module';
const candidates = [import.meta.url, 'file:///C:/Users/RogerioDanielRamalho/AppData/Roaming/npm/node_modules/@playwright/cli/'];
let pw;
for (const base of candidates) {
  try {
    pw = createRequire(base)('playwright-core');
    break;
  } catch {}
}
if (!pw) throw new Error('playwright-core not found: npm i -g @playwright/cli (or add playwright-core as a dev dependency)');
export const chromium = pw.chromium;
