import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const errorsOf = (page: Page) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
};

test.beforeEach(async ({ context }) => {
  // Keep the voice pop-up out of the way unless a test wants it.
  await context.addInitScript(() => {
    try {
      if (!location.search.includes('hello')) localStorage.setItem('ajn-hello', 'done');
    } catch {
      /* about:blank */
    }
  });
});

test('home and case study load with no console errors', async ({ page }) => {
  const errors = errorsOf(page);
  await page.goto('/');
  await expect(page).toHaveTitle('Ather Johear Noor — Full-Stack & AI Engineer');
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(500);
  await page.goto('/work/lastclass/');
  await expect(page).toHaveTitle('LastClass.io — Case study · Ather Johear Noor');
  await expect(page.locator('h1#caseTitle')).toHaveText('LastClass.io');
  await expect(page.locator('#sheetName')).toHaveText('WORK / LASTCLASS');
  expect(errors).toEqual([]);
});

test('no horizontal scroll', async ({ page }) => {
  for (const url of ['/', '/work/lastclass/', '/nope/']) {
    await page.goto(url);
    const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sw, url).toBeLessThanOrEqual(cw);
  }
});

test('Ctrl+K palette filters, arrows and navigates', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dlg = page.locator('dialog#palette');
  await expect(dlg).toHaveJSProperty('open', true);
  await page.keyboard.type('case');
  await expect(page.locator('#kList [role=option]')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work\/lastclass\/$/);
  // "/" opens it too; arrows move the selection
  await page.keyboard.press('/');
  await expect(dlg).toHaveJSProperty('open', true);
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#k1')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(dlg).toHaveJSProperty('open', false);
});

test('B releases bats, L toggles lights, Esc exits', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('b');
  await expect(page.locator('.swarmbat').first()).toBeAttached();
  await page.keyboard.press('l');
  await expect(page.locator('body')).toHaveClass(/lights-out/);
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/lights-out/);
});

test('a basketball shot updates the score', async ({ page }) => {
  await page.goto('/#offclock');
  const score = page.locator('#hoopScore');
  await expect(score).toHaveText(/^0 \/ 0 · best streak \d+$/);
  const btn = page.locator('#shootBtn');
  await btn.scrollIntoViewIfNeeded();
  await btn.focus();
  await page.keyboard.down('Space');
  await page.waitForTimeout(600);
  await page.keyboard.up('Space');
  await expect(score).toHaveText(/^\d \/ 1 · best streak \d+$/, { timeout: 4000 });
});

test('reduced motion shows all content immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/');
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.rv, .stg > *, h1 .w, .seq, .sheet h2.h'))
      .filter((el) => getComputedStyle(el).opacity !== '1')
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(hidden).toEqual([]);
  await ctx.close();
});

test('voice hello pop-up appears after ~2 s and closes itself at 12 s', async ({ page }) => {
  test.setTimeout(30_000);
  await page.goto('/?hello');
  const hello = page.locator('#helloPrompt');
  await expect(hello).toBeHidden();
  await expect(hello).toBeVisible({ timeout: 4000 });
  await expect(hello).toBeHidden({ timeout: 14_000 });
});

test('copy email shows COPIED ✓ and a toast', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  await page.locator('#copyEmail').click();
  await expect(page.locator('#copyEmail')).toHaveText('COPIED ✓');
  await expect(page.locator('#toast')).toHaveText('Email copied');
});

test('mobile menu slides the sidebar in', async ({ page }, info) => {
  test.skip(info.project.name !== 'phone');
  await page.goto('/');
  await page.locator('#menuBtn').click();
  await expect(page.locator('body')).toHaveClass(/menu-open/);
  await page.locator('#nav a', { hasText: 'Lab' }).click();
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await expect(page).toHaveURL(/#lab$/);
});

test('404 page is served', async ({ page }) => {
  const res = await page.goto('/does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('This sheet isn’t');
});

for (const url of ['/', '/work/lastclass/']) {
  test(`axe: no serious/critical issues on ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.waitForTimeout(1500);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    console.log(
      `[axe ${url}]`,
      JSON.stringify(serious.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, nodes: v.nodes.slice(0, 6).map((n) => n.target.join(' ')) })), null, 1),
    );
    expect(serious).toEqual([]);
  });
}

test('case study links back to #work; old hash links redirect', async ({ page }) => {
  await page.goto('/work/lastclass/');
  await page.locator('.crumb a').click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator('#workTitle')).toBeInViewport();
  await page.goto('/#/work/lastclass');
  await expect(page).toHaveURL(/\/work\/lastclass\/$/);
});

test('pointer effects, ruler and active section (desktop)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/batcur/);
  await expect(page.locator('.proj').first()).toHaveClass(/spot/);
  await expect(page.locator('.proj').first()).toHaveClass(/tilt/);
  await page.mouse.move(700, 400);
  await page.mouse.move(720, 420);
  await expect(page.locator('.ruler')).toHaveClass(/hot/);
  await expect(page.locator('#xy')).toHaveText(/^X \d{4} · Y \d{4}$/);
  await expect(page.locator('#batpal')).toHaveClass(/on/);
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById('lab')!.scrollIntoView({ behavior: 'instant' }));
  await expect(page.locator('#sheetName')).toHaveText('LAB');
  await expect(page.locator('#nav a[href="#lab"]')).toHaveAttribute('aria-current', 'true');
  await page.locator('[data-f="idea"]').click();
  await expect(page.locator('#labList li:not([hidden])')).toHaveCount(2);
});
