import { expect, test } from '@playwright/test';

test('keeps the first screen clear and usable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Rehearse real decisions before you act.');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('Open a three-choice practice drill.')).toBeVisible();
  for (const item of [
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Open a three-choice practice drill.'),
    page.getByText('Your drills stay in this browser.').first(),
    page.getByText('The sample works offline after your first visit.'),
    page.getByText('The sample opens without payment.')
  ]) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('keeps the complete first-screen action and facts above the fold at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const item of [page.getByRole('link', { name: 'Try it with sample data' }), page.getByText('Open a three-choice practice drill.'), ...await page.locator('.local-note li').all()]) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  }
});

test('keeps the demo banner and touch targets usable at 390px', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  for (const target of [page.getByRole('button', { name: 'Reset demo' }), page.getByRole('link', { name: 'Start for real' }), page.getByRole('button', { name: /Ask what “finished” means/ })]) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44);
  }
});

test('reflows real routes and legal routes at 200% text size', async ({ page }) => {
  for (const route of ['/', '/demo', '/drills', '/drills/starter_studio_handoff/edit', '/drills/starter_studio_handoff/play', '/insights', '/data', '/about', '/privacy/', '/terms/']) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});

test('removes motion when requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  expect(Number.parseFloat(await page.locator('.hero-copy').evaluate((node) => getComputedStyle(node).transitionDuration))).toBeLessThanOrEqual(0.00001);
});
