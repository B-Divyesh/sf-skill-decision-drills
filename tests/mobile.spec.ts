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
