import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const demo = '/?demo=1';

const completeSample = async (page: import('@playwright/test').Page): Promise<void> => {
  await page.getByRole('button', { name: /Ask what “finished” means/ }).click();
  await page.getByRole('button', { name: 'Continue to next decision' }).click();
  await page.getByRole('button', { name: /Ask for the approved reference/ }).click();
  await page.getByRole('button', { name: 'Continue to next decision' }).click();
  await page.getByRole('button', { name: /Deliver it with a short change summary/ }).click();
  await page.getByRole('button', { name: 'Finish and debrief' }).click();
};

test('@claim:demo-isolated opens a sample drill in separate browser storage', async ({ page }) => {
  await page.goto(demo);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const names = await page.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  expect(names).toContain('demo:skill-decision-drills');
  expect(names).not.toContain('skill-decision-drills');
  expect(await page.evaluate(() => localStorage.getItem('demo:sdd_initialized'))).toBe('yes');
  expect(await page.evaluate(() => localStorage.getItem('sdd_initialized'))).toBeNull();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
});

test('@claim:offline-reload keeps the sample drill available offline after a first visit', async ({ page, context }) => {
  await page.goto(demo);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await expect(page.getByText('Offline mode')).toBeVisible();
});

test('@claim:local-only keeps the demo flow on the product origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4174') external.push(request.url());
  });
  await page.goto(demo);
  await completeSample(page);
  expect(external).toEqual([]);
});

test('@claim:csv-export exports an observable sample report', async ({ page }) => {
  await page.goto(demo);
  await completeSample(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sample CSV' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/results\.csv$/);
  expect(await file.createReadStream().then(async (stream) => {
    const pieces: Buffer[] = [];
    for await (const part of stream) pieces.push(Buffer.from(part));
    return Buffer.concat(pieces).toString('utf8');
  })).toContain('metric,label,value');
});

test('@claim:json-export exports browser data', async ({ page }) => {
  await page.goto('/data');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^decision-drills-backup-\d{4}-\d{2}-\d{2}\.json$/);
});

test('@claim:real-routes set concise titles and move focus after navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Skill Decision Drills — Rehearse real decisions');
  await page.getByRole('link', { name: 'Insights' }).click();
  await expect(page).toHaveURL(/\/insights$/);
  await expect(page).toHaveTitle('Skill Decision Drills — Replay insights');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#live-status')).toHaveText('Replay insights');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('landing, demo, 404, and legal pages have an accessible product skeleton', async ({ page }) => {
  for (const path of ['/', demo, '/not-a-route', '/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const scan = await new AxeBuilder({ page }).analyze();
    expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), path).toEqual([]);
  }
});

test('keyboard skip link preserves the active drill and has a designed focus state', async ({ page }) => {
  await page.goto('/drills/starter_studio_handoff/play');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
});
