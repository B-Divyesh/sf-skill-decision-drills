import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('loads a clear, accessible local drill library', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/library');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Practice the choice/i);
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('authors and persists a branching drill', async ({ page }) => {
  await page.goto('/#/library');
  await page.getByRole('button', { name: 'Build a drill' }).click();
  await expect(page).toHaveURL(/#\/edit\/drill_/);
  await page.getByLabel('Drill title').fill('Client review handoff');
  await page.getByLabel('Coach note').fill('Practice clarifying ownership before editing.');
  await page.getByRole('button', { name: '+ Add decision' }).click();
  await expect(page.getByText('2', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Drill title')).toHaveValue('Client review handoff');
  await expect(page.locator('.node-rail li')).toHaveCount(2);
});

test('plays a full branch and records replay insights', async ({ page }) => {
  await page.goto('/#/play/starter_studio_handoff');
  await page.getByRole('button', { name: /Ask what “finished” means/ }).click();
  await expect(page.getByText('That protects the outcome.')).toBeVisible();
  await page.getByRole('button', { name: 'Continue to next decision' }).click();
  await page.getByRole('button', { name: /Ask for the approved reference/ }).click();
  await page.getByRole('button', { name: 'Continue to next decision' }).click();
  await page.getByRole('button', { name: /Deliver it with a short change summary/ }).click();
  await page.getByRole('button', { name: 'Finish and debrief' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Route replayed.');
  await expect(page.getByText('100%')).toBeVisible();
  await page.getByRole('link', { name: 'See progress' }).click();
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('100%').first()).toBeVisible();
});

test('works after the network is disconnected', async ({ page, context }) => {
  await page.goto('/#/library');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Practice the choice/i);
  await expect(page.getByText(/Offline mode/)).toBeVisible();
  await page.getByRole('link', { name: 'Run drill' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
});

test('privacy and terms are real static routes', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your drills stay');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms in');
});
