import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

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

test('skip link preserves the current player route and focuses main', async ({ page }) => {
  await page.goto('/#/play/starter_studio_handoff');
  await expect(page.locator('.skip-link')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await expect(page.locator('.skip-link')).toHaveCSS('outline-width', '3px');
  await expect(page.locator('.skip-link')).toHaveCSS('outline-color', 'rgb(76, 114, 255)');
  const playerUrl = page.url();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(playerUrl);
  await expect(page.locator('main')).toBeFocused();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
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

test('keeps actionable errors for oversized and unreadable images', async ({ page }) => {
  await page.goto('/#/edit/starter_studio_handoff');
  const upload = page.locator('#node-image');
  const liveStatus = page.locator('#live-status');

  await upload.setInputFiles({
    name: 'too-large.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(12_000_001)
  });
  await expect(liveStatus).toHaveText('Choose an image smaller than 12 MB.');
  await expect(liveStatus).not.toContainText('Saved on this device');

  await upload.setInputFiles({
    name: 'not-an-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from('This is not PNG image data.')
  });
  await expect(liveStatus).toHaveText('That file is not a readable image.');
  await expect(liveStatus).not.toContainText('Saved on this device');
  await expect(page.locator('.node-sheet img')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.node-sheet img')).toHaveCount(0);

  await upload.setInputFiles(new URL('../public/icons/icon-192.png', import.meta.url).pathname);
  await expect(liveStatus).toHaveText('Saved on this device.');
  await expect(page.locator('.node-sheet img')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.node-sheet img')).toHaveCount(1);
});

test('keeps every primary screen semantically accessible without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
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
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('replaces motion with instant state changes when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/library');
  const motion = await page.locator('.hero-copy').evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  expect(Number.parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(motion.transitionDuration)).toBeLessThanOrEqual(0.00001);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
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

test('keeps normal use local-only', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.hostname !== '127.0.0.1') externalRequests.push(request.url());
  });
  await page.goto('/#/library');
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test('strips and verifies a captured license only once per day', async ({ page }) => {
  let verificationCount = 0;
  await page.route('https://api.sociobot.in/api/v1/products/skill-decision-drills/verify**', async (route) => {
    verificationCount += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto('/?license=qa-invalid-token#/library');
  await expect(page).not.toHaveURL(/license=/);
  await expect.poll(() => verificationCount).toBe(1);
  await page.reload();
  await expect.poll(() => verificationCount).toBe(1);

  await page.goto('/#/upgrade');
  await expect(page.getByRole('link', { name: 'Buy full authoring' })).toHaveAttribute(
    'href',
    'https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout'
  );
  await expect(page.getByText('$29')).toBeVisible();
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

test('applies a genuine waiting service worker and preserves local state', async ({ page }) => {
  const workerPath = new URL('../dist/sw.js', import.meta.url);
  const originalWorker = await readFile(workerPath, 'utf8');
  const updatedWorker = originalWorker.replace('sdd-shell-v4', `sdd-shell-test-${Date.now()}`);
  expect(updatedWorker).not.toBe(originalWorker);

  try {
    await page.goto('/#/edit/starter_studio_handoff');
    await page.getByLabel('Drill title').fill('Update state proof');
    await page.getByLabel('Drill title').blur();
    await expect(page.locator('#live-status')).toHaveText('Saved on this device.');
    await page.goto('/#/library');
    await expect(page.getByText('Update state proof')).toBeVisible();
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await page.evaluate(() => {
      sessionStorage.setItem('update-state-proof', 'before');
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        sessionStorage.setItem('update-state-proof', 'controller-changed');
      }, { once: true });
    });

    await writeFile(workerPath, updatedWorker);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
    });
    await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.waiting?.state ?? 'none')).toBe('installed');
    await expect(page.getByText('A fresh app version is ready.')).toBeVisible();

    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('button', { name: 'Update now' }).click()
    ]);
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('update-state-proof'))).toBe('controller-changed');
    await expect(page.getByText('Update state proof')).toBeVisible();
  } finally {
    await writeFile(workerPath, originalWorker);
  }
});
