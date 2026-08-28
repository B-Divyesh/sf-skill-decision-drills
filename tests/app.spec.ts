import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const demo = '/demo';
const queryDemo = '/?demo=1';
const productOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4174').origin;
const canonicalOrigin = 'https://skill-decision-drills.sociobot.in';

const downloadText = async (download: Download): Promise<string> => {
  const stream = await download.createReadStream();
  const pieces: Buffer[] = [];
  for await (const part of stream) pieces.push(Buffer.from(part));
  return Buffer.concat(pieces).toString('utf8');
};

const database = async (page: Page, name: string): Promise<{ drills: Array<Record<string, unknown>>; attempts: Array<Record<string, unknown>> }> => page.evaluate(async (databaseName) => {
  const request = indexedDB.open(databaseName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const transaction = db.transaction(['drills', 'attempts'], 'readonly');
  const getAll = (store: string) => new Promise<Record<string, unknown>[]>((resolve, reject) => {
    const result = transaction.objectStore(store).getAll();
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error);
  });
  const result = { drills: await getAll('drills'), attempts: await getAll('attempts') };
  db.close();
  return result;
}, name);

const completeSample = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: /Ask what “finished” means/ }).click();
  await expect(page.getByRole('heading', { name: 'That protects the outcome.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show next decision' }).click();
  await page.getByRole('button', { name: /Ask for the approved reference/ }).click();
  await page.getByRole('button', { name: 'Show next decision' }).click();
  await page.getByRole('button', { name: /Deliver it with a short change summary/ }).click();
  await page.getByRole('button', { name: 'Finish and debrief' }).click();
  await expect(page.getByRole('heading', { name: 'Route replayed.' })).toBeVisible();
};

const completeSampleWithFirstMiss = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: /Open the newest-looking file/ }).click();
  await expect(page.getByRole('heading', { name: 'Pause and inspect the result.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show next decision' }).click();
  await page.getByRole('button', { name: /Compare them, note the differences/ }).click();
  await page.getByRole('button', { name: 'Show next decision' }).click();
  await page.getByRole('button', { name: /Deliver it with a short change summary/ }).click();
  await page.getByRole('button', { name: 'Finish and debrief' }).click();
  await expect(page.getByRole('heading', { name: 'Route replayed.' })).toBeVisible();
};

const createImage = async (page: Page): Promise<Buffer> => {
  const encoded = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 800;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ff5c35';
    context.fillRect(0, 0, 1600, 800);
    context.fillStyle = '#17211b';
    context.fillRect(200, 200, 1200, 400);
    return canvas.toDataURL('image/png').split(',')[1]!;
  });
  return Buffer.from(encoded, 'base64');
};

test('@claim:demo-isolated changes and resets demo data without touching normal data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Create drill' }).click();
  await page.getByLabel('Drill title').fill('Normal private drill');
  await page.getByLabel('Drill title').press('Tab');
  await expect(page.locator('#live-status')).toHaveText('Saved on this device.');
  const normalBefore = JSON.stringify(await database(page, 'skill-decision-drills'));
  await page.goto(queryDemo);
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: /Ask what “finished” means/ }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#live-status')).toHaveText('Demo reset. The sample drill is ready again.');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await expect(page.getByRole('heading', { name: 'That protects the outcome.' })).toHaveCount(0);
  const demoData = await database(page, 'demo:skill-decision-drills');
  expect(demoData.attempts).toEqual([]);
  expect(demoData.drills).toHaveLength(1);
  expect(JSON.stringify(await database(page, 'skill-decision-drills'))).toBe(normalBefore);
  expect(await page.evaluate(() => localStorage.getItem('demo:sdd_initialized'))).toBe('yes');
  expect(await page.evaluate(() => localStorage.getItem('sdd_initialized'))).toBe('yes');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toHaveCount(0);
  expect(await database(page, 'demo:skill-decision-drills')).toEqual({ drills: [], attempts: [] });
  expect(await page.evaluate(() => localStorage.getItem('demo:sdd_initialized'))).toBeNull();
  expect(JSON.stringify(await database(page, 'skill-decision-drills'))).toBe(normalBefore);
});

test('recovery uses factual starter-drill wording and resets malformed saved data', async ({ page }) => {
  await page.goto('/drills');
  await page.evaluate(async () => {
    const request = indexedDB.open('skill-decision-drills');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = db.transaction('drills', 'readwrite');
    transaction.objectStore('drills').clear();
    transaction.objectStore('drills').put({ id: 'broken_record' });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    db.close();
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Saved data needs repair.' })).toBeVisible();
  await expect(page.getByText('Download the unreadable records for safekeeping, then reset this device to reopen the app with the bundled starter drill.')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset local drills' }).click();
  await expect(page).toHaveURL(/\/drills$/);
  await expect(page.getByText('Local data reset. The starter drill is ready.')).toBeVisible();
  await expect(page.getByText('Studio handoff: find the missing context')).toBeVisible();
});

test('@claim:sample-access opens a three-choice sample without payment or setup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await expect(page.locator('.player-choice')).toHaveCount(3);
  await expect(page.getByRole('button', { name: /Ask what “finished” means/ })).toBeEnabled();
  await expect(page.locator('form[action*="checkout"], [href*="checkout"], [name*="payment"]')).toHaveCount(0);
});

test('@claim:offline-reload keeps browser-saved drills usable offline after a first visit', async ({ page, context }) => {
  await page.goto(demo);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
  await page.getByRole('button', { name: /Ask what “finished” means/ }).click();
  await expect(page.getByRole('heading', { name: 'That protects the outcome.' })).toBeVisible();
  await expect(page.getByText('Offline — browser-saved drills work after the first visit.')).toBeVisible();
  await context.setOffline(false);
  await page.goto('/');
  await page.getByRole('button', { name: 'Create drill' }).click();
  await page.getByLabel('Drill title').fill('Offline camera check');
  await page.getByLabel('Drill title').press('Tab');
  await page.getByLabel('Consequence shown after choosing').first().fill('The camera owner confirms the approved frame.');
  await page.getByLabel('Consequence shown after choosing').first().press('Tab');
  await page.getByLabel('Mark as a strong decision').first().check();
  await page.getByRole('link', { name: 'Preview drill' }).click();
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Decision 1');
  await page.getByRole('button', { name: /Option A/ }).click();
  await expect(page.getByRole('heading', { name: 'That protects the outcome.' })).toBeVisible();
  await expect(page.getByText('Offline — browser-saved drills work after the first visit.')).toBeVisible();
});

test('@claim:normal-local-only keeps authored text, photos, attempts, imports, exports, and deletion in this browser', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== productOrigin) external.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Create drill' }).click();
  await page.getByLabel('Drill title').fill('Camera handoff drill');
  await page.getByLabel('Drill title').press('Tab');
  await page.getByLabel('Consequence shown after choosing').first().fill('The owner confirms the expected frame.');
  await page.getByLabel('Consequence shown after choosing').first().press('Tab');
  await page.getByLabel('Mark as a strong decision').first().check();
  await page.locator('#node-image').setInputFiles({ name: 'scene.png', mimeType: 'image/png', buffer: await createImage(page) });
  await expect(page.getByAltText('Scenario reference uploaded for this decision')).toBeVisible();
  await page.getByRole('link', { name: 'Preview drill' }).click();
  await page.getByRole('button', { name: /Option A/ }).click();
  await page.getByRole('button', { name: 'Finish and debrief' }).click();
  await expect(page.getByRole('heading', { name: 'Route replayed.' })).toBeVisible();
  const saved = await database(page, 'skill-decision-drills');
  const authored = saved.drills.find((drill) => drill.title === 'Camera handoff drill') as { id: string; nodes: Array<{ image?: string }> };
  expect(authored.nodes[0]?.image).toMatch(/^data:image\/jpeg;base64,/);
  expect(saved.attempts.some((attempt) => attempt.drillId === authored.id)).toBe(true);
  await page.goto('/data');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const backupText = await downloadText(await downloadPromise);
  await page.reload();
  await page.goto('/drills');
  const card = page.locator('.drill-card').filter({ hasText: 'Camera handoff drill' });
  await expect(card).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await card.getByRole('button', { name: 'Delete drill' }).click();
  await expect(card).toHaveCount(0);
  await page.goto('/data');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(backupText) });
  await expect(page).toHaveURL(/\/drills$/);
  await expect(page.getByText('Camera handoff drill')).toBeVisible();
  const restored = await database(page, 'skill-decision-drills');
  expect(restored.drills.some((drill) => drill.title === 'Camera handoff drill')).toBe(true);
  expect(restored.attempts.length).toBeGreaterThan(0);
  expect(external).toEqual([]);
});

test('@claim:no-tracking has no accounts, ads, analytics, or network requests to other companies', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== productOrigin) external.push(request.url());
  });
  for (const path of ['/', '/demo', '/drills', '/drills/starter_studio_handoff/edit', '/drills/starter_studio_handoff/play', '/insights', '/insights/starter_studio_handoff', '/data', '/about', '/privacy', '/terms', '/not-a-route']) {
    await page.goto(path);
    const riskyControls = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('a[href], form[action], input, script[src], iframe')]
      .map((element) => `${element.tagName} ${(element.getAttribute('href') ?? element.getAttribute('action') ?? element.getAttribute('src') ?? element.getAttribute('type') ?? '')}`.toLowerCase())
      .filter((value) => /account|sign[ -]?(in|up)|log[ -]?in|password|checkout|payment|advertis|analytics|tracking|doubleclick|googleads|gtag|mixpanel|segment/.test(value)));
    expect(riskyControls, path).toEqual([]);
    const runtimeUrls = await page.locator('script[src], iframe[src]').evaluateAll((elements) => elements.map((element) => (element as HTMLScriptElement | HTMLIFrameElement).src));
    expect(runtimeUrls.every((url) => new URL(url).origin === productOrigin), path).toBe(true);
  }
  const runtimeSources = ['index.html', 'src/main.ts', 'public/sw.js', 'privacy/index.html', 'terms/index.html']
    .map((file) => readFileSync(file, 'utf8')).join('\n');
  expect(runtimeSources).not.toMatch(/doubleclick|googleads|gtag|mixpanel|segment|plausible|matomo/i);
  expect(external).toEqual([]);
});

test('@claim:replay-feedback shows consequences, debrief, and permits replay', async ({ page }) => {
  await page.goto(demo);
  await expect(page.getByRole('button', { name: 'Show hint' })).toBeVisible();
  await page.getByRole('button', { name: 'Show hint' }).click();
  await expect(page.getByRole('note')).toContainText('reduces ambiguity before work begins');
  await completeSample(page);
  await expect(page.getByText('100%')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Coach debrief' })).toBeVisible();
  await page.getByRole('button', { name: 'Replay with shuffled choices' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A teammate hands you');
});

test('@claim:shuffle changes the choice order on replay', async ({ page }) => {
  await page.goto(demo);
  const before = await page.locator('.player-choice strong').allTextContents();
  await completeSample(page);
  await page.getByRole('button', { name: 'Replay with shuffled choices' }).click();
  const after = await page.locator('.player-choice strong').allTextContents();
  expect(after).not.toEqual(before);
});

test('@claim:insights reports attempts, accuracy, missed choices, and first-choice improvement by attempt three', async ({ page }) => {
  await page.goto(demo);
  await completeSampleWithFirstMiss(page);
  await page.getByRole('button', { name: 'Replay with shuffled choices' }).click();
  await completeSample(page);
  await page.getByRole('button', { name: 'Replay with shuffled choices' }).click();
  await completeSample(page);
  await page.getByRole('link', { name: 'View results' }).click();
  await expect(page).toHaveURL(/\/insights\/starter_studio_handoff\?demo=1$/);
  await expect(page.getByText('See whether the first choice improves by attempt three, and which choices learners missed.')).toBeVisible();
  await expect(page.locator('.metric').nth(0).locator('strong')).toHaveText('3');
  await expect(page.locator('.metric').nth(1).locator('strong')).toHaveText('100%');
  await expect(page.locator('.metric').nth(2).locator('strong')).toHaveText('+100%');
  const missedChoice = page.locator('.misconceptions li').filter({ hasText: 'Acting before confirming the goal' });
  await expect(missedChoice).toBeVisible();
  await expect(missedChoice.locator('strong')).toHaveText('1');
});

test('@claim:photo-local resizes a scenario image and stores it only in IndexedDB', async ({ page }) => {
  await page.goto('/drills/starter_studio_handoff/edit');
  await page.locator('#node-image').setInputFiles({ name: 'wide.png', mimeType: 'image/png', buffer: await createImage(page) });
  await expect(page.getByAltText('Scenario reference uploaded for this decision')).toBeVisible();
  const image = await page.getByAltText('Scenario reference uploaded for this decision').evaluate((element: HTMLImageElement) => ({ src: element.src, width: element.naturalWidth, height: element.naturalHeight }));
  expect(image.src).toMatch(/^data:image\/jpeg;base64,/);
  expect(image.width).toBe(1200);
  expect(image.height).toBe(600);
  const stored = await database(page, 'skill-decision-drills');
  expect(JSON.stringify(stored)).toContain('data:image/jpeg;base64,');
  expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.includes('image')))).toBe(false);
});

test('@claim:csv-export exports one result set per completed attempt', async ({ page }) => {
  await page.goto(demo);
  await completeSample(page);
  await page.getByRole('button', { name: 'Replay with shuffled choices' }).click();
  await completeSampleWithFirstMiss(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV results' }).click();
  const file = await downloadPromise;
  expect(file.suggestedFilename()).toMatch(/results\.csv$/);
  const rows = (await downloadText(file)).trim().split('\n');
  expect(rows).toEqual([
    'metric,label,value',
    'summary,attempts,2',
    'attempt_accuracy,attempt_1,100',
    'first_decision,attempt_1,100',
    'attempt_accuracy,attempt_2,67',
    'first_decision,attempt_2,0',
    'misconception_count,"Acting before confirming the goal",1'
  ]);
});

test('@claim:json-export exports valid demo drills and completed attempt fields', async ({ page }) => {
  await page.goto(demo);
  await completeSample(page);
  await page.goto('/data?demo=1');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON backup' }).click();
  const file = await downloadPromise;
  expect(file.suggestedFilename()).toMatch(/^decision-drills-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const backup = JSON.parse(await downloadText(file));
  expect(backup.version).toBe(1);
  expect(backup.drills[0]).toMatchObject({ id: 'starter_studio_handoff', title: 'Studio handoff: find the missing context' });
  expect(backup.attempts[0].selections).toHaveLength(3);
  expect(backup.attempts[0]).toEqual(expect.objectContaining({ drillId: 'starter_studio_handoff', startedAt: expect.any(String), completedAt: expect.any(String) }));
});

test('@claim:json-import replaces demo data only after confirmation', async ({ page }) => {
  await page.goto('/data?demo=1');
  const replacement = {
    drills: [{ id: 'imported_drill', title: 'Imported camera check', description: 'Imported fixture', createdAt: '2026-08-28T00:00:00.000Z', updatedAt: '2026-08-28T00:00:00.000Z', startNodeId: 'imported_node', shuffleChoices: false, nodes: [{ id: 'imported_node', prompt: 'Which frame is approved?', hint: '', debrief: '', choices: [{ id: 'imported_choice', label: 'Ask the owner', consequence: 'The frame is confirmed.', nextNodeId: null, isCorrect: true, misconception: '' }] }] }],
    attempts: []
  };
  let confirmation = '';
  page.once('dialog', async (dialog) => { confirmation = dialog.message(); await dialog.accept(); });
  await page.locator('#import-file').setInputFiles({ name: 'replacement.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement)) });
  await expect(page).toHaveURL(/\/drills\?demo=1$/);
  expect(confirmation).toContain('Replace');
  const stored = await database(page, 'demo:skill-decision-drills');
  expect(stored.drills).toHaveLength(1);
  expect(stored.drills[0]?.title).toBe('Imported camera check');
});

test('@claim:real-routes gives every screen exact metadata, working links, focus, and Back behavior', async ({ page }) => {
  const routes: Array<[string, string, string]> = [
    ['/', 'Skill Decision Drills — Rehearse real decisions', '/'],
    ['/demo', 'Demo — Skill Decision Drills', '/demo'],
    ['/drills', 'Skill Decision Drills — Rehearse real decisions', '/drills'],
    ['/drills/starter_studio_handoff/edit', 'Skill Decision Drills — Edit a drill', '/drills/starter_studio_handoff/edit'],
    ['/drills/starter_studio_handoff/play', 'Skill Decision Drills — Run a practice drill', '/drills/starter_studio_handoff/play'],
    ['/insights', 'Skill Decision Drills — Results', '/insights'],
    ['/insights/starter_studio_handoff', 'Skill Decision Drills — Results', '/insights/starter_studio_handoff'],
    ['/data', 'Skill Decision Drills — Your data', '/data'],
    ['/about', 'About — Skill Decision Drills', '/about'],
    ['/privacy', 'Privacy — Skill Decision Drills', '/privacy'],
    ['/terms', 'Terms — Skill Decision Drills', '/terms'],
    ['/404', 'Page not found — Skill Decision Drills', '/404']
  ];
  const linkedPaths = new Set<string>();
  for (const [path, title, canonicalPath] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    expect(title.length).toBeLessThanOrEqual(60);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${canonicalOrigin}${canonicalPath}`);
    for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:card"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]', 'link[rel="apple-touch-icon"]']) await expect(page.locator(selector), `${path} ${selector}`).toHaveCount(1);
    for (const href of await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''))) {
      if (href.startsWith('/') && !href.startsWith('//')) linkedPaths.add(href);
    }
  }
  await page.goto(queryDemo);
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${canonicalOrigin}/demo`);
  for (const path of linkedPaths) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('That branch is missing.');
  }

  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#live-status')).toHaveText('Demo drill');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#live-status')).toHaveText('Drill board');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#live-status')).toHaveText('Drill board');
});

test('@claim:sample-content ships the factual creative-project sample', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('This sample starts with an unfinished creative project. Practise asking what done means before you act.')).toBeVisible();
  await page.goto(demo);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('folder called FINAL-2');
});

test('@claim:artwork-provenance keeps the original art and prompt metadata in the repository', async ({ page }) => {
  expect(existsSync('assets/src/decision-board.png')).toBe(true);
  expect(existsSync('assets/src/decision-board.prompt.json')).toBe(true);
  const metadata = JSON.parse(readFileSync('assets/src/decision-board.prompt.json', 'utf8'));
  expect(JSON.stringify(metadata)).toMatch(/decision|board|prompt/i);
  await page.goto('/about');
  await expect(page.getByText('The original paper-board illustration was generated for this product.')).toBeVisible();
});

test('@claim:build-output runs pinned Node 20.19.0 and 22.12.0 builds and emits dist/index.html', async () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(pkg.engines.node).toBe('^20.19.0 || >=22.12.0');
  for (const version of ['20.19.0', '22.12.0']) {
    const nodeVersion = execFileSync('npx', ['--yes', `node@${version}`, '--version'], { encoding: 'utf8', timeout: 120_000 }).trim();
    expect(nodeVersion).toBe(`v${version}`);
    execFileSync('npx', ['--yes', `node@${version}`, './node_modules/vite/bin/vite.js', 'build'], { encoding: 'utf8', timeout: 120_000 });
    expect(existsSync('dist/index.html')).toBe(true);
    expect(readFileSync('dist/index.html', 'utf8')).toContain('<title>Skill Decision Drills — Rehearse real decisions</title>');
  }
});

test('@claim:deployment-config defines every app route, security header, cache rule, and 404 override', async () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
  const builtConfig = JSON.parse(readFileSync('dist/staticwebapp.config.json', 'utf8'));
  expect(builtConfig).toEqual(config);
  expect(config.navigationFallback).toBeUndefined();
  const route = (path: string) => config.routes.find((item: { route: string }) => item.route === path);
  for (const path of ['/demo', '/drills', '/drills/*', '/insights', '/insights/*', '/data', '/about']) {
    expect(route(path), path).toEqual({ route: path, rewrite: '/index.html' });
  }
  expect(route('/assets/decision-board-*.webp')?.headers?.['cache-control']).toBe('public, max-age=3600, must-revalidate');
  expect(route('/assets/*')?.headers?.['cache-control']).toBe('public, max-age=31536000, immutable');
  expect(route('/sw.js')?.headers?.['cache-control']).toBe('no-cache, no-store, must-revalidate');
  expect(route('/manifest.webmanifest')?.headers?.['cache-control']).toBe('public, max-age=3600, must-revalidate');
  expect(route('/')?.headers?.['cache-control']).toBe('no-cache, must-revalidate');
  expect(route('/privacy/*')?.headers?.['cache-control']).toBe('no-cache, must-revalidate');
  expect(route('/terms/*')?.headers?.['cache-control']).toBe('no-cache, must-revalidate');
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/not-found.html', statusCode: 404 });
  expect(config.globalHeaders).toEqual({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; manifest-src 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; worker-src 'self'"
  });
  expect(config.mimeTypes).toEqual({ '.webmanifest': 'application/manifest+json' });
  expect(existsSync('dist/not-found.html')).toBe(true);
});

test('every route has the shared shell and no serious accessibility violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/', '/demo', '/drills', '/drills/starter_studio_handoff/edit', '/drills/starter_studio_handoff/play', '/insights', '/data', '/about', '/privacy', '/terms', '/not-a-route']) {
    const errorsBefore = errors.length;
    await page.goto(path);
    await expect(page.locator('.brand-mark')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link')).toHaveText(['Drills', 'Demo', 'Results', 'Privacy']);
    await expect(page.locator('footer')).toContainText('Built by Param Factory · release 5');
    const scan = await new AxeBuilder({ page }).analyze();
    expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), path).toEqual([]);
    if (path !== '/not-a-route') expect(errors.slice(errorsBefore), path).toEqual([]);
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

test('copy audit covers every cold landing unit and current README unit', async ({ page }) => {
  const audit = readFileSync('.factory/copy-audit.md', 'utf8');
  const readme = readFileSync('README.md', 'utf8');
  const plainCopy = (value: string): string => value
    .replace(/<([^>]+)>/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replaceAll('`', '');
  const auditedText = plainCopy(audit);
  const landingUnits = [
    'Skip to main content', 'Decision drills', 'Drills', 'Demo', 'Results', 'Privacy',
    '01 Practice real decisions', 'Rehearse real decisions before you act.',
    'For coaches and self-learners who need to practise choices from real situations.',
    'Try it with sample data', 'Open a three-choice practice drill.',
    'Your drills stay in this browser.', 'The sample works offline after your first visit.',
    'The sample opens without payment.', 'Create a drill', 'Read the situation', 'Choose an action',
    'See what follows', 'Replay it', 'Your board', 'Your decision drills', 'Create drill',
    'SAMPLE DRILL', '0 attempts · Ready to play', 'Studio handoff: find the missing context',
    'This sample starts with an unfinished creative project. Practise asking what done means before you act.',
    'Run drill', 'Edit drill', 'View results', 'Delete drill', 'Coach loop',
    'Create a drill in three steps', 'Write', 'Write the moment, not a trivia question.', 'Show',
    'Show what happens after each choice.', 'Replay', 'Replay with choices in a new order.',
    'Practice is not proof.',
    'Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence.',
    'Terms', 'Your data', 'About', 'Original artwork generated for this app.',
    'Built by Param Factory · release 5'
  ];
  const readmeUnits = [
    'Skill Decision Drills',
    'Skill Decision Drills helps coaches and self-learners practise choices from real situations.',
    'Try the sample at <https://skill-decision-drills.sociobot.in/?demo=1>.',
    'Nothing you do there changes your drills.', 'It opens a three-choice practice drill.', 'What it does',
    'Create drills that save in this browser.', 'Let learners choose, see feedback, and replay.',
    'Change choice order on replay.',
    'See whether learners improve their first choice by attempt three, and which choices they missed.',
    'Export a JSON backup or CSV results.', 'Restore a JSON backup after confirmation.',
    'Add a scenario photo that is resized and stored in this browser.', 'Use the sample offline after the first visit.',
    'Run locally', 'Use Node.js 20.19–20.x or Node.js 22.12 and newer.',
    'Node 21 and Node 22.0–22.11 are unsupported.', 'Test and build',
    'In a fresh copy of the repository, list each claim command with:',
    'Run them all with `npm run test:claims`.', 'The build writes the site to `dist/index.html`.',
    'Privacy and safety', 'The app has no accounts, ads, analytics, or network requests to other companies.',
    'Your drills stay in browser storage unless you export them.', 'Practice does not certify real-world competence.',
    'Use qualified instruction where mistakes could affect people, property, or rights.',
    'Read the [privacy notice](privacy/index.html) and [terms](terms/index.html).', 'Deploy',
    'Deploy `dist/` as an Azure Static Web App.',
    'The included configuration defines app routes, cache policy, security headers, and a real 404 override.',
    'Design and license', 'See the [design notes](.factory/design.md) and [original artwork source](assets/src/).',
    'MIT.', 'See [LICENSE](LICENSE).'
  ];
  await page.goto('/');
  for (const unit of landingUnits) {
    expect(audit, `audit omits landing unit: ${unit}`).toContain(unit);
    if ([
      'Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence.',
      'Original artwork generated for this app.',
      'Built by Param Factory · release 5'
    ].includes(unit)) {
      await expect(unit.startsWith('Decision drills') ? page.locator('footer > p').first() : page.locator('footer > p').last(), unit).toContainText(unit);
    } else {
      await expect(page.getByText(unit, { exact: true }).first(), unit).toBeVisible();
    }
  }
  await expect(page.getByAltText('Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop')).toBeVisible();
  expect(audit).toContain('Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop');
  expect(audit).toContain('Skill Decision Drills home');
  expect(audit).toContain('Primary navigation');
  expect(audit).toContain('Legal and product information');
  for (const unit of readmeUnits) {
    expect(readme, `README omits unit: ${unit}`).toContain(unit);
    expect(auditedText, `audit omits README unit: ${unit}`).toContain(plainCopy(unit));
  }
});

test('loads without console errors when browser policy blocks service workers', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Rehearse real decisions before you act.');
  await page.waitForTimeout(250);
  expect(errors).toEqual([]);
  await context.close();
});
