import { expect, test } from '@playwright/test';

test('keeps library and editor usable at 390px', async ({ page }) => {
  await page.goto('/#/library');
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  await page.getByRole('link', { name: 'Edit' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Edit drill');
  await expect(page.getByRole('button', { name: '+ Add decision' })).toBeVisible();
  await expect(page.getByLabel('What is happening? Ask for a decision, not a fact.')).toBeVisible();
});

test('keeps standalone targets at least 44px and reflows at 200% text size', async ({ page }) => {
  await page.goto('/#/library');
  const targets = [
    page.getByRole('link', { name: 'Skill Decision Drills home' }),
    page.getByRole('link', { name: 'View results' }),
    page.getByRole('link', { name: 'Privacy' }),
    page.getByRole('link', { name: 'Terms' }),
    page.getByRole('link', { name: 'About' })
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box, `missing target: ${await target.getAttribute('aria-label') ?? await target.textContent()}`).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test('reflows every primary app view at 390px with 200% text', async ({ page }) => {
  const routes = [
    '/#/library',
    '/#/edit/starter_studio_handoff',
    '/#/play/starter_studio_handoff',
    '/#/insights',
    '/#/data',
    '/#/upgrade',
    '/#/about',
    '/privacy/',
    '/terms/'
  ];

  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(horizontalOverflow, route).toBeLessThanOrEqual(1);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});
