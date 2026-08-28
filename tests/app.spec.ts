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

test('deletion is confirmed and reveals the empty state', async ({ page }) => {
  await page.goto('/#/library');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No drills on this device' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create your first drill' })).toBeVisible();
});

test('rejects the verifier malformed backup without replacing existing data', async ({ page }) => {
  const errors: string[] = [];
  let replacementConfirmationSeen = false;
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('dialog', async (dialog) => {
    replacementConfirmationSeen = true;
    await dialog.dismiss();
  });

  await page.goto('/#/data');
  await page.locator('#import-file').setInputFiles({
    name: 'incomplete-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"drills":[{"id":"invalid","nodes":[]}],"attempts":[]}')
  });

  await expect(page.locator('#live-status')).toContainText('drills[0].title must be a string');
  expect(replacementConfirmationSeen).toBe(false);
  await page.reload();
  await page.getByRole('link', { name: 'Drills', exact: true }).click();
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
  await page.getByRole('link', { name: 'Run drill' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  expect(errors).toEqual([]);
});

test('recovers an existing malformed record from the failed release', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/library');
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('skill-decision-drills', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(['drills', 'attempts'], 'readwrite');
      transaction.objectStore('drills').clear();
      transaction.objectStore('attempts').clear();
      transaction.objectStore('drills').put({ id: 'invalid', nodes: [] });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Saved data needs repair.');
  await expect(page.getByText(/drills\[0\]\.title must be a string/)).toBeVisible();
  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('link', { name: 'Your data' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Saved data needs repair.');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download recovery copy' }).click();
  const recovery = await downloadPromise;
  expect(recovery.suggestedFilename()).toMatch(/^decision-drills-recovery-\d{4}-\d{2}-\d{2}\.json$/);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset local drills' }).click();
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
  expect(errors).toEqual([]);
});
