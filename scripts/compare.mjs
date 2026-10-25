// Side-by-side check: original index (1).html vs the built site (served from out/).
//   npx serve out -l 4173   (in another terminal)
//   node scripts/compare.mjs [outputDir]
// Writes screenshots + pixel diffs and prints layout differences.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = process.argv[2] || join(root, 'test-results', 'compare');
mkdirSync(outDir, { recursive: true });

const ORIGINAL = pathToFileURL(join(root, 'index (1).html')).href;
const BUILT = process.env.BUILT_URL || 'http://localhost:4173/';
const SIZES = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];
// Elements whose position/size should match.
const PROBES = [
  '.side', '.topbar', '.ruler', 'h1', '.fig', '.strip', '#work .titleblock', '#work h2', '.proj',
  '#lab h2', '.filters', '.lab li', '#experience h2', '.log li', 'details.more', '.edu',
  '#offclock h2', '.offgrid > article', '#hoops', '#about h2', '#contact', 'main footer', 'section.sheet',
];

async function shoot(browser, url, size, reduce, tag) {
  const ctx = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    deviceScaleFactor: 1,
  });
  // Same starting state for both: hello pop-up already dismissed, fixed clock.
  await ctx.addInitScript(() => {
    try { localStorage.setItem('ajn-hello', 'done'); } catch {}
  });
  await ctx.clock?.setFixedTime?.(new Date('2026-10-26T15:00:00Z')); // 10:00 a.m. in Winnipeg
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(reduce ? 300 : 2600);
  const file = join(outDir, `${tag}-${size.name}${reduce ? '-full' : '-top'}.png`);
  await page.screenshot({ path: file, fullPage: reduce });
  const boxes = await page.evaluate((sels) => {
    const r = {};
    for (const s of sels) {
      r[s] = Array.from(document.querySelectorAll(s)).map((el) => {
        const b = el.getBoundingClientRect();
        return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)];
      });
    }
    return { boxes: r, h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth };
  }, PROBES);
  await ctx.close();
  return { file, ...boxes };
}

async function diff(browser, a, b, outFile) {
  const page = await browser.newPage();
  const res = await page.evaluate(
    async ([A, B]) => {
      const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
      const [ia, ib] = await Promise.all([load(A), load(B)]);
      const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
      const c = (img) => { const cv = new OffscreenCanvas(w, h); const x = cv.getContext('2d'); x.fillStyle = '#f0f'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
      const da = c(ia), db = c(ib);
      const out = new OffscreenCanvas(w, h), ox = out.getContext('2d'), od = ox.createImageData(w, h);
      let bad = 0;
      for (let p = 0; p < da.length; p += 4) {
        const d = Math.abs(da[p] - db[p]) + Math.abs(da[p + 1] - db[p + 1]) + Math.abs(da[p + 2] - db[p + 2]);
        const g = (da[p] + da[p + 1] + da[p + 2]) / 12;
        if (d > 48) { bad++; od.data[p] = 255; od.data[p + 1] = 40; od.data[p + 2] = 90; }
        else { od.data[p] = od.data[p + 1] = od.data[p + 2] = g; }
        od.data[p + 3] = 255;
      }
      ox.putImageData(od, 0, 0);
      const blob = await out.convertToBlob();
      const buf = new Uint8Array(await blob.arrayBuffer());
      let s = ''; for (const x of buf) s += String.fromCharCode(x);
      return { pct: (100 * bad) / (w * h), w, h, png: btoa(s) };
    },
    [a, b].map((f) => 'data:image/png;base64,' + readFileSync(f).toString('base64')),
  );
  await page.close();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(outFile, Buffer.from(res.png, 'base64'));
  return res;
}

const browser = await chromium.launch();
let worst = 0;
for (const size of SIZES) {
  for (const reduce of [true, false]) {
    const o = await shoot(browser, ORIGINAL, size, reduce, 'original');
    const n = await shoot(browser, BUILT, size, reduce, 'built');
    const d = await diff(browser, o.file, n.file, join(outDir, `diff-${size.name}${reduce ? '-full' : '-top'}.png`));
    worst = Math.max(worst, d.pct);
    console.log(`\n${size.name} ${size.width}px ${reduce ? 'full page (reduced motion)' : 'first screen (motion)'}`);
    console.log(`  page height: original ${o.h}px, built ${n.h}px · scrollWidth ${o.w}/${n.w}`);
    console.log(`  pixels differing: ${d.pct.toFixed(3)}%`);
    if (reduce) {
      for (const s of PROBES) {
        const A = JSON.stringify(o.boxes[s]), B = JSON.stringify(n.boxes[s]);
        if (A !== B) console.log(`  layout differs: ${s}\n    original ${A}\n    built    ${B}`);
      }
    }
  }
}
await browser.close();
console.log(`\nworst pixel difference: ${worst.toFixed(3)}%  ·  images in ${outDir}`);
