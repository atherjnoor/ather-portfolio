// Renders public/og.png (1200×630) in the site's drafting-sheet style.
// Run with: npm run og   (needs Playwright's Chromium: npx playwright install chromium)
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=block" rel="stylesheet">
<style>
:root{--ink:#131412;--side:#161715;--panel:#1A1C19;--line:#2E312C;--line2:#3A3D37;--grid:#1B1C1A;--paper:#ECE8DF;--muted:#A3A399;--dim:#8E8E85;--mint:#7DDCB0}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1200px;height:630px;overflow:hidden;background:var(--ink);color:var(--paper);font-family:'IBM Plex Sans',sans-serif;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:48px 48px;background-position:-1px -1px;position:relative}
.ruler{position:absolute;left:0;right:0;top:0;height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;border-bottom:1px solid var(--line);
  background:repeating-linear-gradient(90deg,var(--line2) 0 1px,transparent 1px 48px) bottom/100% 12px no-repeat,repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 12px) bottom/100% 6px no-repeat,rgba(19,20,18,.92);
  font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--dim);letter-spacing:.5px}
.ruler b{color:var(--paper);font-weight:500}.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--mint);margin-right:10px;vertical-align:middle}
.prog{position:absolute;left:0;bottom:-1px;height:2px;width:38%;background:var(--mint)}
.wrap{position:absolute;left:96px;right:96px;top:112px}
.titleblock{display:inline-grid;grid-template-columns:auto auto auto;border:1px solid var(--line);font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:1.2px;text-transform:uppercase;background:var(--ink)}
.titleblock span{padding:9px 16px;color:var(--dim)}.titleblock span+span{border-left:1px solid var(--line)}
.titleblock span:first-child{color:var(--mint)}.titleblock span:nth-child(2){color:var(--paper)}
h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:92px;line-height:1.0;letter-spacing:-1px;margin:34px 0 0;max-width:15ch}
h1 i{color:var(--mint)}
.foot{position:absolute;left:96px;right:96px;bottom:64px;display:flex;align-items:center;gap:22px;border-top:1px solid var(--line);padding-top:26px}
.mark{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:22px;color:var(--ink);background:var(--mint);padding:7px 14px;border-radius:7px;letter-spacing:.5px}
.who b{display:block;font-size:24px;font-weight:600}.who span{color:var(--muted);font-size:19px}
.stack{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--dim);letter-spacing:1px;text-transform:uppercase}
.crop{position:absolute;width:22px;height:22px;border-color:var(--mint);opacity:.6}
</style></head><body>
<div class="ruler"><span><span class="dot"></span>SHEET <b>01</b> / 07 — <b>OVERVIEW</b></span><span>AJN · PORTFOLIO · REV A · 2026</span><span class="prog"></span></div>
<span class="crop" style="left:72px;top:88px;border-top:1px solid;border-left:1px solid"></span>
<span class="crop" style="right:72px;bottom:40px;border-bottom:1px solid;border-right:1px solid"></span>
<div class="wrap">
  <div class="titleblock"><span>Full-stack &amp; AI engineer</span><span>Winnipeg</span><span>Technical co-founder · LastClass.io</span></div>
  <h1>I turn product requirements into <i>working software.</i></h1>
</div>
<div class="foot"><span class="mark">AJN</span><div class="who"><b>Ather Johear Noor</b><span>Full-Stack &amp; AI Engineer</span></div><span class="stack">Next.js · TypeScript · LLM APIs</span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
