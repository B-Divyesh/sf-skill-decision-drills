import './styles.css';
import { accuracy, AppDataValidationError, misconceptionCounts, newChoice, newDrill, newNode, parseImport, shuffle, uid, validateDrill } from './model';
import { captureLicenseFromUrl, checkoutUrl, getLicenseState, restoreLicense, verifyLicense } from './license';
import { LocalStore } from './storage';
import type { AppData, Attempt, Drill, DrillNode, LicenseState, Selection } from './types';

const store = new LocalStore();
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root is missing.');

let data: AppData = { drills: [], attempts: [] };
let license: LicenseState = getLicenseState();
let selectedNodeId = '';
let statusMessage = '';
let errorMessage = '';
let fatalStorageError: unknown = null;
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let updateReady = false;

type PlayerSession = {
  drillId: string;
  nodeId: string;
  startedAt: string;
  selections: Selection[];
  selectedChoiceId: string;
  hintVisible: boolean;
  completed: boolean;
  saved: boolean;
  choiceOrder: Record<string, string[]>;
};

let player: PlayerSession | null = null;

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const route = (): { page: string; id?: string } => {
  const [page = 'library', id] = window.location.hash.replace(/^#\/?/, '').split('/');
  return { page: page || 'library', id };
};

const href = (page: string, id?: string): string => `#/${page}${id ? `/${id}` : ''}`;

const safeImageSrc = (value?: string): string => value?.startsWith('data:image/') ? escapeHtml(value) : '';

const setStatus = (message: string, isError = false): void => {
  statusMessage = isError ? '' : message;
  errorMessage = isError ? message : '';
  const live = document.querySelector<HTMLElement>('#live-status');
  if (live) live.textContent = message;
};

const saveDrill = async (drill: Drill, message = 'Saved on this device.'): Promise<void> => {
  drill.updatedAt = new Date().toISOString();
  await store.putDrill(drill);
  setStatus(message);
};

const shell = (content: string): string => {
  const current = route().page;
  return `
    <a class="skip-link" href="#main" data-action="skip-main">Skip to main content</a>
    <header class="topbar">
      <a class="brand" href="#/library" aria-label="Skill Decision Drills home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Decision drills</span>
      </a>
      <nav aria-label="Primary navigation">
        <a ${current === 'library' ? 'aria-current="page"' : ''} href="#/library">Drills</a>
        <a ${current === 'insights' ? 'aria-current="page"' : ''} href="#/insights">Insights</a>
        <a ${current === 'data' ? 'aria-current="page"' : ''} href="#/data">Your data</a>
        <a class="license-chip" ${current === 'upgrade' ? 'aria-current="page"' : ''} href="#/upgrade">${license.unlocked ? 'Full access' : 'Unlock'}</a>
      </nav>
    </header>
    ${!navigator.onLine ? '<div class="offline-bar" role="status">Offline mode — everything on this device still works.</div>' : ''}
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <p><strong>Practice is not proof.</strong> Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence.</p>
      <nav aria-label="Legal and product information"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="#/about">About</a></nav>
      <p class="made-note">Original generated board artwork · No tracking · Local-first</p>
    </footer>
    <div id="live-status" class="sr-only" aria-live="polite">${escapeHtml(statusMessage || errorMessage)}</div>
    <div id="update-toast" class="toast" ${updateReady ? '' : 'hidden'}><span>A fresh app version is ready.</span><button type="button" data-action="apply-update">Update now</button></div>
  `;
};

const drillCard = (drill: Drill): string => {
  const attempts = data.attempts.filter((attempt) => attempt.drillId === drill.id);
  const readyErrors = validateDrill(drill);
  return `
    <article class="drill-card" data-drill-id="${drill.id}">
      <div class="card-tape" aria-hidden="true">${drill.id.startsWith('starter_') ? 'SAFE SAMPLE' : `${drill.nodes.length} NODES`}</div>
      <p class="eyebrow">${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'} · ${readyErrors.length ? `${readyErrors.length} setup note${readyErrors.length === 1 ? '' : 's'}` : 'Ready to play'}</p>
      <h2>${escapeHtml(drill.title)}</h2>
      <p>${escapeHtml(drill.description || 'No coach note yet.')}</p>
      <div class="card-actions">
        <a class="button primary" href="${href('play', drill.id)}">Run drill</a>
        <a class="button" href="${href('edit', drill.id)}">Edit</a>
        <a class="text-link" href="${href('insights', drill.id)}">View results</a>
        <button class="text-button danger-text" type="button" data-action="delete-drill">Delete</button>
      </div>
    </article>`;
};

const renderLibrary = (): string => `
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow"><span class="route-dot">01</span> Scenario rehearsal, built by you</p>
      <h1>Practice the choice.<br><span>Not the fact.</span></h1>
      <p class="lede">Turn real moments into branching drills with consequences, hints, and debriefs. Learners replay the decisions; you see where judgment breaks down.</p>
      <div class="hero-actions">
        <button class="button primary large" type="button" data-action="new-drill">Build a drill</button>
        ${data.drills[0] ? `<a class="button large" href="${href('play', data.drills[0].id)}">Try one now</a>` : ''}
      </div>
      <p class="local-note"><span aria-hidden="true">●</span> Stored only on this device. Works offline.</p>
    </div>
    <figure class="hero-figure">
      <picture>
        <source media="(max-width: 680px)" srcset="/assets/decision-board-640.webp" />
        <img src="/assets/decision-board-1200.webp" width="1200" height="800" alt="Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop" fetchpriority="high" decoding="async" />
      </picture>
      <figcaption><span>Prompt</span><span>Choose</span><span>See consequence</span><span>Replay</span></figcaption>
    </figure>
  </section>
  <section class="library-section" aria-labelledby="your-drills">
    <div class="section-heading">
      <div><p class="eyebrow">Your board</p><h2 id="your-drills">Your decision drills</h2></div>
      <button class="button" type="button" data-action="new-drill">+ New drill</button>
    </div>
    ${data.drills.length ? `<div class="drill-grid">${data.drills.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(drillCard).join('')}</div>` : `
      <div class="empty-state">
        <span class="empty-route" aria-hidden="true">?</span>
        <h2>No drills on this device</h2>
        <p>Start with one moment where a learner has to decide what to do next. You can build the branches as you go.</p>
        <button class="button primary" type="button" data-action="new-drill">Create your first drill</button>
      </div>`}
  </section>
  <section class="how-strip" aria-labelledby="how-it-works">
    <div><p class="eyebrow">Coach loop</p><h2 id="how-it-works">From messy moment to useful replay</h2></div>
    <ol><li><strong>Frame</strong><span>Write the moment, not a trivia question.</span></li><li><strong>Branch</strong><span>Connect choices to visible consequences.</span></li><li><strong>Replay</strong><span>Shuffle options and compare first decisions.</span></li></ol>
  </section>`;

const nodeName = (node: DrillNode, index: number): string => node.prompt.trim() || `Decision ${index + 1}`;

const choiceEditor = (drill: Drill, node: DrillNode): string => node.choices.map((choice, index) => `
  <fieldset class="choice-editor" data-choice-id="${choice.id}">
    <legend><span class="choice-index">${String.fromCharCode(65 + index)}</span> Choice ${index + 1}</legend>
    <div class="field full"><label for="choice-label-${choice.id}">What might the learner do?</label><textarea id="choice-label-${choice.id}" rows="2" data-field="choice-label">${escapeHtml(choice.label)}</textarea></div>
    <div class="field full"><label for="choice-consequence-${choice.id}">Consequence shown after choosing</label><textarea id="choice-consequence-${choice.id}" rows="2" data-field="choice-consequence">${escapeHtml(choice.consequence)}</textarea></div>
    <div class="choice-grid">
      <div class="field"><label for="choice-target-${choice.id}">Then go to</label><select id="choice-target-${choice.id}" data-field="choice-target"><option value="">Finish drill</option>${drill.nodes.filter((item) => item.id !== node.id).map((item, itemIndex) => `<option value="${item.id}" ${choice.nextNodeId === item.id ? 'selected' : ''}>${escapeHtml(nodeName(item, itemIndex))}</option>`).join('')}</select></div>
      <div class="field"><label for="choice-misconception-${choice.id}">Misconception tag <span>(if not best)</span></label><input id="choice-misconception-${choice.id}" data-field="choice-misconception" value="${escapeHtml(choice.misconception)}" /></div>
    </div>
    <div class="choice-footer"><label class="check"><input type="checkbox" data-field="choice-correct" ${choice.isCorrect ? 'checked' : ''} /> <span>Mark as a strong decision</span></label><button class="text-button danger-text" type="button" data-action="delete-choice">Remove choice</button></div>
  </fieldset>`).join('');

const renderEditor = (drill: Drill): string => {
  if (!selectedNodeId || !drill.nodes.some((node) => node.id === selectedNodeId)) selectedNodeId = drill.startNodeId || drill.nodes[0]?.id || '';
  const node = drill.nodes.find((item) => item.id === selectedNodeId);
  const errors = validateDrill(drill);
  return `
    <section class="editor-head">
      <div><p class="eyebrow">Author mode · Saves as you work</p><h1>Edit drill</h1></div>
      <div class="editor-actions"><a class="button" href="#/library">Done</a><a class="button primary" href="${href('play', drill.id)}">Preview drill</a></div>
    </section>
    <section class="drill-meta" data-drill-id="${drill.id}">
      <div class="field"><label for="drill-title">Drill title</label><input id="drill-title" data-field="drill-title" value="${escapeHtml(drill.title)}" /></div>
      <div class="field"><label for="drill-description">Coach note</label><textarea id="drill-description" rows="2" data-field="drill-description">${escapeHtml(drill.description)}</textarea></div>
      <label class="check"><input type="checkbox" data-field="shuffle" ${drill.shuffleChoices ? 'checked' : ''} /> <span>Shuffle choice order on each replay</span></label>
    </section>
    ${errors.length ? `<details class="readiness" open><summary>${errors.length} readiness ${errors.length === 1 ? 'note' : 'notes'}</summary><ul>${errors.map((message) => `<li>${escapeHtml(message)}</li>`).join('')}</ul></details>` : '<div class="ready-banner"><span aria-hidden="true">✓</span> Ready to rehearse</div>'}
    <div class="editor-layout" data-drill-id="${drill.id}">
      <aside class="node-rail" aria-label="Decision nodes">
        <div class="rail-title"><h2>Route map</h2><span>${drill.nodes.length}</span></div>
        <ol>${drill.nodes.map((item, index) => `<li><button type="button" data-action="select-node" data-node-id="${item.id}" ${item.id === selectedNodeId ? 'aria-current="step"' : ''}><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(nodeName(item, index))}</b>${item.id === drill.startNodeId ? '<em>Start</em>' : ''}</button></li>`).join('')}</ol>
        <button class="button full-width" type="button" data-action="add-node">+ Add decision</button>
      </aside>
      ${node ? `<section class="node-sheet" data-node-id="${node.id}" aria-labelledby="node-sheet-title">
        <div class="sheet-heading"><div><p class="eyebrow">Decision ${drill.nodes.findIndex((item) => item.id === node.id) + 1}</p><h2 id="node-sheet-title">Build this moment</h2></div><div class="sheet-tools">${node.id !== drill.startNodeId ? '<button class="text-button" type="button" data-action="set-start">Make start</button>' : '<span class="start-label">Start node</span>'}<button class="text-button danger-text" type="button" data-action="delete-node">Delete</button></div></div>
        <div class="field full"><label for="node-prompt">What is happening? <span>Ask for a decision, not a fact.</span></label><textarea id="node-prompt" data-field="node-prompt" rows="4">${escapeHtml(node.prompt)}</textarea></div>
        <div class="image-field">
          ${safeImageSrc(node.image) ? `<img src="${safeImageSrc(node.image)}" alt="Scenario reference uploaded for this decision" width="640" height="360" /><button type="button" class="text-button danger-text" data-action="remove-image">Remove image</button>` : '<div class="image-placeholder" aria-hidden="true"><span>＋</span> Optional scene photo</div>'}
          <div><label class="button small" for="node-image">${node.image ? 'Replace photo' : 'Add photo'}</label><input class="sr-only" id="node-image" type="file" accept="image/jpeg,image/png,image/webp" data-field="node-image" /><p>Saved on this device. Resized to reduce storage.</p></div>
        </div>
        <div class="field full"><label for="node-hint">Hint path <span>What should the learner notice?</span></label><textarea id="node-hint" data-field="node-hint" rows="2">${escapeHtml(node.hint)}</textarea></div>
        <div class="choices-heading"><div><p class="eyebrow">Branches</p><h3>Choices and consequences</h3></div><button class="button small" type="button" data-action="add-choice">+ Add choice</button></div>
        <div class="choice-list">${choiceEditor(drill, node)}</div>
        <div class="field full debrief-field"><label for="node-debrief">Debrief note <span>What should stick after this decision?</span></label><textarea id="node-debrief" data-field="node-debrief" rows="3">${escapeHtml(node.debrief)}</textarea></div>
      </section>` : '<section class="node-sheet empty-state"><h2>Add the first decision</h2><button type="button" class="button primary" data-action="add-node">Add decision</button></section>'}
    </div>`;
};

const beginPlayer = (drill: Drill): void => {
  player = {
    drillId: drill.id,
    nodeId: drill.startNodeId,
    startedAt: new Date().toISOString(),
    selections: [],
    selectedChoiceId: '',
    hintVisible: false,
    completed: false,
    saved: false,
    choiceOrder: {}
  };
};

const orderedChoices = (drill: Drill, node: DrillNode): typeof node.choices => {
  if (!player) return node.choices;
  if (!player.choiceOrder[node.id]) {
    player.choiceOrder[node.id] = (drill.shuffleChoices ? shuffle(node.choices) : node.choices).map((choice) => choice.id);
  }
  return player.choiceOrder[node.id]!.map((id) => node.choices.find((choice) => choice.id === id)).filter(Boolean) as typeof node.choices;
};

const completePlayer = async (drill: Drill): Promise<void> => {
  if (!player || player.saved) return;
  player.completed = true;
  player.saved = true;
  const attempt: Attempt = {
    id: uid('attempt'), drillId: drill.id, startedAt: player.startedAt,
    completedAt: new Date().toISOString(), selections: player.selections
  };
  data.attempts.push(attempt);
  await store.putAttempt(attempt);
  setStatus('Attempt saved.');
};

const renderPlayer = (drill: Drill): string => {
  const errors = validateDrill(drill);
  if (errors.length) return `
    <section class="narrow error-panel"><p class="eyebrow">Setup needed</p><h1>This drill is not ready yet</h1><p>Fix these notes before asking someone to play:</p><ul>${errors.map((message) => `<li>${escapeHtml(message)}</li>`).join('')}</ul><a class="button primary" href="${href('edit', drill.id)}">Return to editor</a></section>`;
  if (!player || player.drillId !== drill.id) beginPlayer(drill);
  if (player!.completed) {
    const currentAttempts = data.attempts.filter((attempt) => attempt.drillId === drill.id);
    const latest: Attempt = { id: 'current', drillId: drill.id, startedAt: player!.startedAt, completedAt: new Date().toISOString(), selections: player!.selections };
    const score = accuracy(latest);
    const first = player!.selections[0]?.correct;
    return `
      <section class="completion narrow">
        <p class="eyebrow">Attempt ${currentAttempts.length} complete</p><h1>Route replayed.</h1>
        <div class="score-stamp"><strong>${score}%</strong><span>strong decisions</span></div>
        <p class="first-choice ${first ? 'good' : 'needs-work'}"><span>${first ? '✓' : '↺'}</span> First decision: ${first ? 'strong' : 'worth another replay'}</p>
        <div class="debrief-card"><h2>Coach debrief</h2><p>${escapeHtml(drill.description || 'Review the consequences, then replay with a different route.')}</p></div>
        <div class="completion-actions"><button class="button primary large" type="button" data-action="replay">Replay with shuffled choices</button><a class="button large" href="${href('insights', drill.id)}">See progress</a><a class="text-link" href="#/library">Back to drills</a></div>
      </section>`;
  }
  const node = drill.nodes.find((item) => item.id === player!.nodeId) ?? drill.nodes[0]!;
  const selected = node.choices.find((choice) => choice.id === player!.selectedChoiceId);
  const choices = orderedChoices(drill, node);
  const step = player!.selections.length + (selected ? 0 : 1);
  return `
    <section class="player-shell narrow" data-drill-id="${drill.id}" data-node-id="${node.id}">
      <div class="player-top"><a class="text-link" href="#/library">← Leave drill</a><span>Decision ${step}</span></div>
      <div class="progress-track" role="img" aria-label="${player!.selections.length} decisions completed"><i style="width:${Math.min(100, player!.selections.length * 18 + 12)}%"></i></div>
      <p class="eyebrow">${escapeHtml(drill.title)}</p>
      <h1>${escapeHtml(node.prompt)}</h1>
      ${safeImageSrc(node.image) ? `<img class="scenario-image" src="${safeImageSrc(node.image)}" alt="Scenario reference for this decision" width="640" height="360" />` : ''}
      ${node.hint ? `<div class="hint-wrap">${player!.hintVisible ? `<div class="hint" role="note"><strong>Notice this</strong><p>${escapeHtml(node.hint)}</p></div>` : '<button class="hint-button" type="button" data-action="show-hint">Need a hint?</button>'}</div>` : ''}
      ${choices.length ? `<div class="player-choices" aria-label="Choose your response">${choices.map((choice, index) => `
        <button type="button" class="player-choice ${selected?.id === choice.id ? (choice.isCorrect ? 'selected correct' : 'selected incorrect') : ''}" data-action="choose" data-choice-id="${choice.id}" ${selected ? 'disabled' : ''}>
          <span>${String.fromCharCode(65 + index)}</span><strong>${escapeHtml(choice.label)}</strong>${selected?.id === choice.id ? `<em>${choice.isCorrect ? 'Strong decision' : 'See what follows'}</em>` : ''}
        </button>`).join('')}</div>` : '<div class="empty-state compact"><h2>This route ends here</h2><button class="button primary" type="button" data-action="finish-drill">Finish and debrief</button></div>'}
      ${selected ? `<section class="consequence ${selected.isCorrect ? 'positive' : 'caution'}" aria-live="polite"><p class="eyebrow">Consequence</p><h2>${selected.isCorrect ? 'That protects the outcome.' : 'Pause and inspect the result.'}</h2><p>${escapeHtml(selected.consequence || 'No consequence note was added for this choice.')}</p>${node.debrief ? `<div class="micro-debrief"><strong>Coach note</strong><p>${escapeHtml(node.debrief)}</p></div>` : ''}<button class="button primary large" type="button" data-action="continue">${selected.nextNodeId ? 'Continue to next decision' : 'Finish and debrief'}</button></section>` : ''}
      <p class="safety-note">This rehearsal does not replace qualified instruction or assess real-world competence.</p>
    </section>`;
};

const attemptsFor = (id?: string): Attempt[] => id ? data.attempts.filter((attempt) => attempt.drillId === id).sort((a, b) => a.completedAt.localeCompare(b.completedAt)) : data.attempts;

const insightPanel = (drill: Drill): string => {
  const attempts = attemptsFor(drill.id);
  if (!attempts.length) return `<div class="empty-state compact"><span class="empty-route" aria-hidden="true">0</span><h2>No replays yet</h2><p>Run this drill once to start seeing first-decision accuracy and misconception counts.</p><a class="button primary" href="${href('play', drill.id)}">Run drill</a></div>`;
  const misconceptions = misconceptionCounts(attempts);
  const firstAccuracy = attempts[0]?.selections[0]?.correct ? 100 : 0;
  const third = attempts[2];
  const thirdAccuracy = third ? (third.selections[0]?.correct ? 100 : 0) : null;
  const lift = thirdAccuracy === null ? null : thirdAccuracy - firstAccuracy;
  return `
    <div class="metric-grid">
      <div class="metric"><span>Attempts</span><strong>${attempts.length}</strong><small>saved on this device</small></div>
      <div class="metric"><span>Latest accuracy</span><strong>${accuracy(attempts.at(-1)!)}%</strong><small>across decisions</small></div>
      <div class="metric accent"><span>First-decision lift</span><strong>${lift === null ? '—' : `${lift > 0 ? '+' : ''}${lift}%`}</strong><small>${lift === null ? 'complete 3 attempts' : 'attempt 1 → 3'}</small></div>
    </div>
    <section class="chart-section" aria-labelledby="attempt-history"><div class="chart-head"><h2 id="attempt-history">Decision accuracy by replay</h2><button class="text-button" type="button" data-action="export-csv" data-drill-id="${drill.id}">Export CSV</button></div>
      <div class="bar-chart" role="img" aria-label="Accuracy: ${attempts.map((attempt, index) => `attempt ${index + 1}, ${accuracy(attempt)} percent`).join('; ')}">${attempts.map((attempt, index) => `<div class="bar-column"><span>${accuracy(attempt)}%</span><i style="height:${Math.max(4, accuracy(attempt))}%"></i><small>#${index + 1}</small></div>`).join('')}</div>
    </section>
    <section class="misconceptions" aria-labelledby="misconceptions"><h2 id="misconceptions">Misconceptions to coach next</h2>${misconceptions.length ? `<ol>${misconceptions.map(([label, count]) => `<li><span>${escapeHtml(label)}</span><strong>${count}</strong></li>`).join('')}</ol>` : '<p class="success-note">No tagged misconceptions recorded. The authored strong decisions were selected.</p>'}</section>`;
};

const renderInsights = (id?: string): string => {
  const drill = (id && data.drills.find((item) => item.id === id)) || data.drills[0];
  return `
    <section class="insights-head"><div><p class="eyebrow">Local aggregate report</p><h1>Replay insights</h1><p>Spot recurring misconceptions and whether the first decision improves by attempt three.</p></div>${drill ? `<label for="insight-drill">Drill<select id="insight-drill" data-action="select-insight-drill">${data.drills.map((item) => `<option value="${item.id}" ${item.id === drill.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}</select></label>` : ''}</section>
    ${drill ? `<section class="insight-board"><div class="report-title"><p class="eyebrow">Report for</p><h2>${escapeHtml(drill.title)}</h2></div>${insightPanel(drill)}</section>` : '<div class="empty-state"><h2>No drill data yet</h2><p>Create a drill, then replay it to collect local results.</p><a class="button primary" href="#/library">Create a drill</a></div>'}`;
};

const renderData = (): string => `
  <section class="narrow data-page">
    <p class="eyebrow">Ownership, not lock-in</p><h1>Your data stays yours.</h1>
    <p class="lede">Drills, photos, and attempts live in this browser's IndexedDB. Nothing is uploaded to us. Back up before clearing browser data or moving devices.</p>
    <div class="data-actions">
      <section><span class="route-dot">↓</span><div><h2>Export everything</h2><p>Download drills and attempt history as one JSON backup. This is always available, including on the free tier.</p><button class="button primary" type="button" data-action="export-json">Export JSON backup</button></div></section>
      <section><span class="route-dot blue">↑</span><div><h2>Import a backup</h2><p>Import replaces the current data on this device after confirmation.</p><label class="button" for="import-file">Choose JSON backup</label><input class="sr-only" type="file" id="import-file" accept="application/json,.json" data-action="import-json" /></div></section>
    </div>
    <div class="storage-facts"><h2>What is stored</h2><ul><li>Drill text and uploaded scenario images</li><li>Each completed attempt and selected misconception tags</li><li>A license token and daily verification timestamp, if you unlock</li></ul><p><a href="/privacy/">Read the full privacy notice</a></p></div>
  </section>`;

const renderStorageError = (error: unknown): string => {
  if (error instanceof AppDataValidationError) {
    return `<section class="narrow error-panel"><p class="eyebrow">Recovery needed</p><h1>Saved data needs repair.</h1><p>${escapeHtml(error.message)}</p><p>Download the unreadable records for safekeeping, then reset this device to reopen the app with the safe starter drill.</p><div class="hero-actions"><button class="button" type="button" data-action="export-recovery">Download recovery copy</button><button class="button primary" type="button" data-action="reset-local-data">Reset local drills</button></div><p><small>Reset deletes all drills and attempt history on this device. A confirmation appears first.</small></p></section>`;
  }
  return `<section class="narrow error-panel"><p class="eyebrow">Storage error</p><h1>Your drill board could not open.</h1><p>${escapeHtml(error instanceof Error ? error.message : 'Local storage is unavailable.')}</p><p>Check that private browsing or browser storage restrictions are not blocking IndexedDB, then reload.</p><button class="button primary" type="button" data-action="reload">Reload app</button></section>`;
};

const renderUpgrade = (): string => `
  <section class="upgrade-page narrow">
    <p class="eyebrow">One-time license · No learner seats</p><h1>${license.unlocked ? 'Full authoring is unlocked.' : 'Keep every scenario in one kit.'}</h1>
    <p class="lede">The free kit includes two complete drills, unlimited nodes, offline play, insights, and export. Full authoring removes the drill limit for one private coach toolkit.</p>
    <div class="price-board">
      <div><span>Lifetime authoring</span><strong><sup>$</sup>29</strong><small>one-time purchase</small></div>
      <ul><li>Unlimited private drills</li><li>Unlimited decision nodes and photos</li><li>All current replay insights</li><li>No per-learner fee</li></ul>
      ${license.unlocked ? '<div class="unlocked-stamp">✓ Active on this device</div>' : `<a class="button primary large" href="${checkoutUrl}">Buy full authoring</a>`}
    </div>
    ${license.notice ? `<p class="license-notice" role="status">${escapeHtml(license.notice)} ${!license.unlocked ? `<a href="${checkoutUrl}">Buy a new license</a>` : ''}</p>` : ''}
    <form class="restore-form" data-action="restore-license"><h2>Restore a purchase</h2><p>Paste the license token from your receipt to use it on this device.</p><label for="license-token">License token</label><div><input id="license-token" name="license" required autocomplete="off" /><button class="button" type="submit">Verify license</button></div></form>
    <p class="merchant-note">Checkout and refunds are handled by Sociobot / Dodo, the merchant of record. A refunded purchase revokes the license. By buying, you agree to the <a href="/terms/">terms</a> and <a href="/privacy/">privacy notice</a>.</p>
  </section>`;

const renderAbout = (): string => `
  <section class="narrow about-page"><p class="eyebrow">Why this exists</p><h1>Decisions transfer. Trivia rarely does.</h1><p class="lede">Skill Decision Drills gives coaches and self-learners a small, private format for rehearsing judgment from realistic moments. It is for practice and discussion—not certification.</p><h2>Built for honest rehearsal</h2><ul><li>No content marketplace or bundled hazardous advice.</li><li>No claim that a score proves real-world competence.</li><li>No accounts, analytics, advertising, or remote learner tracking.</li></ul><h2>Artwork provenance</h2><p>The branching paper-board illustration was generated specifically for this product with the Param Factory image model on August 28, 2026, then reviewed for text artifacts, brands, and misleading content.</p><a class="button primary" href="#/library">Open your drill board</a></section>`;

const notFound = (): string => '<section class="narrow error-panel"><p class="eyebrow">Route not found</p><h1>That branch is missing.</h1><p>The drill may have been deleted on this device.</p><a class="button primary" href="#/library">Return to drills</a></section>';

const render = (): void => {
  if (fatalStorageError) {
    app.innerHTML = shell(renderStorageError(fatalStorageError));
    document.title = `${fatalStorageError instanceof AppDataValidationError ? 'Saved data needs repair' : 'Storage error'} — Skill Decision Drills`;
    return;
  }
  const current = route();
  let content = '';
  if (current.page === 'library') content = renderLibrary();
  else if (current.page === 'edit') {
    const drill = data.drills.find((item) => item.id === current.id);
    content = drill ? renderEditor(drill) : notFound();
  } else if (current.page === 'play') {
    const drill = data.drills.find((item) => item.id === current.id);
    content = drill ? renderPlayer(drill) : notFound();
  } else if (current.page === 'insights') content = renderInsights(current.id);
  else if (current.page === 'data') content = renderData();
  else if (current.page === 'upgrade') content = renderUpgrade();
  else if (current.page === 'about') content = renderAbout();
  else content = notFound();
  app.innerHTML = shell(content);
  document.title = current.page === 'library'
    ? 'Skill Decision Drills — Practice the choice, not the fact'
    : `${document.querySelector('h1')?.textContent ?? 'Skill Decision Drills'} — Skill Decision Drills`;
};

const currentDrillAndNode = (target: Element): { drill: Drill; node?: DrillNode } | null => {
  const container = target.closest<HTMLElement>('[data-drill-id]');
  if (!container) return null;
  const drill = data.drills.find((item) => item.id === container.dataset.drillId);
  if (!drill) return null;
  const nodeContainer = target.closest<HTMLElement>('[data-node-id]');
  return { drill, node: drill.nodes.find((item) => item.id === nodeContainer?.dataset.nodeId) };
};

const download = (name: string, contents: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const imageData = async (file: File): Promise<string> => new Promise((resolve, reject) => {
  if (file.size > 12_000_000) return reject(new Error('Choose an image smaller than 12 MB.'));
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('The image could not be read.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('That file is not a readable image.'));
    image.onload = () => {
      const scale = Math.min(1, 1200 / image.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

document.addEventListener('click', async (event) => {
  const target = (event.target as Element).closest<HTMLElement>('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'skip-main') {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('#main');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return;
  }
  if (action === 'export-recovery') {
    try {
      download(`decision-drills-recovery-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(await store.getRawAll(), null, 2), 'application/json');
      setStatus('Recovery copy downloaded.');
    } catch {
      setStatus('The recovery copy could not be downloaded. Try again before resetting.', true);
    }
    return;
  }
  if (action === 'reset-local-data') {
    if (!confirm('Reset every local drill and attempt on this device? This cannot be undone unless you downloaded a recovery copy.')) return;
    try {
      data = await store.reset();
      fatalStorageError = null;
      player = null;
      selectedNodeId = '';
      setStatus('Local data reset. The safe starter drill is ready.');
      window.location.hash = '#/library';
      render();
    } catch {
      setStatus('Local data could not be reset. Check browser storage permissions and try again.', true);
    }
    return;
  }
  if (action === 'new-drill') {
    if (!license.unlocked && data.drills.length >= 2) {
      window.location.hash = '#/upgrade';
      setStatus('The free kit holds two drills. Full authoring removes that limit.', true);
      return;
    }
    const drill = newDrill();
    data.drills.push(drill);
    await store.putDrill(drill);
    selectedNodeId = drill.startNodeId;
    window.location.hash = href('edit', drill.id);
  }
  if (action === 'delete-drill') {
    const drill = data.drills.find((item) => item.id === target.closest<HTMLElement>('[data-drill-id]')?.dataset.drillId);
    if (!drill || !confirm(`Delete “${drill.title}” and all of its attempt history from this device?`)) return;
    await store.deleteDrill(drill.id);
    data.drills = data.drills.filter((item) => item.id !== drill.id);
    data.attempts = data.attempts.filter((attempt) => attempt.drillId !== drill.id);
    setStatus('Drill and its attempt history deleted.');
    render();
  }
  if (action === 'select-node') {
    selectedNodeId = target.dataset.nodeId ?? '';
    render();
  }
  const context = currentDrillAndNode(target);
  if (action === 'add-node' && context) {
    const node = newNode(context.drill.nodes.length + 1);
    context.drill.nodes.push(node);
    if (!context.drill.startNodeId) context.drill.startNodeId = node.id;
    selectedNodeId = node.id;
    await saveDrill(context.drill, 'Decision added and saved.');
    render();
  }
  if (action === 'delete-node' && context?.node) {
    if (!confirm(`Delete “${nodeName(context.node, context.drill.nodes.indexOf(context.node))}”? Choices that lead here will become finish points.`)) return;
    context.drill.nodes = context.drill.nodes.filter((node) => node.id !== context.node!.id);
    context.drill.nodes.forEach((node) => node.choices.forEach((choice) => { if (choice.nextNodeId === context.node!.id) choice.nextNodeId = null; }));
    if (context.drill.startNodeId === context.node.id) context.drill.startNodeId = context.drill.nodes[0]?.id ?? '';
    selectedNodeId = context.drill.startNodeId;
    await saveDrill(context.drill, 'Decision deleted.');
    render();
  }
  if (action === 'set-start' && context?.node) {
    context.drill.startNodeId = context.node.id;
    await saveDrill(context.drill, 'Start decision updated.');
    render();
  }
  if (action === 'add-choice' && context?.node) {
    context.node.choices.push(newChoice(`Option ${String.fromCharCode(65 + context.node.choices.length)}`));
    await saveDrill(context.drill, 'Choice added.');
    render();
  }
  if (action === 'delete-choice' && context?.node) {
    const choiceBox = target.closest<HTMLElement>('[data-choice-id]');
    context.node.choices = context.node.choices.filter((choice) => choice.id !== choiceBox?.dataset.choiceId);
    await saveDrill(context.drill, 'Choice removed.');
    render();
  }
  if (action === 'remove-image' && context?.node) {
    delete context.node.image;
    await saveDrill(context.drill, 'Scenario image removed.');
    render();
  }
  if (action === 'show-hint' && player) { player.hintVisible = true; render(); }
  if (action === 'choose' && context?.node && player && !player.selectedChoiceId) {
    const choice = context.node.choices.find((item) => item.id === target.dataset.choiceId);
    if (choice) {
      player.selectedChoiceId = choice.id;
      player.selections.push({ nodeId: context.node.id, choiceId: choice.id, correct: choice.isCorrect, misconception: choice.misconception });
      render();
      document.querySelector('.consequence')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  }
  if (action === 'continue' && context?.node && player) {
    const choice = context.node.choices.find((item) => item.id === player!.selectedChoiceId);
    if (choice?.nextNodeId && player.selections.length < 50) {
      player.nodeId = choice.nextNodeId;
      player.selectedChoiceId = '';
      player.hintVisible = false;
      render();
      document.querySelector('#main')?.scrollIntoView();
    } else {
      await completePlayer(context.drill);
      render();
    }
  }
  if (action === 'finish-drill' && context) { await completePlayer(context.drill); render(); }
  if (action === 'replay') {
    const drill = data.drills.find((item) => item.id === player?.drillId);
    if (drill) { beginPlayer(drill); render(); }
  }
  if (action === 'export-json') {
    download(`decision-drills-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ ...data, exportedAt: new Date().toISOString(), version: 1 }, null, 2), 'application/json');
    setStatus('JSON backup downloaded.');
  }
  if (action === 'export-csv') {
    const drill = data.drills.find((item) => item.id === target.dataset.drillId);
    if (drill) {
      const drillAttempts = attemptsFor(drill.id);
      const rows = ['metric,label,value'];
      rows.push(`summary,attempts,${drillAttempts.length}`);
      drillAttempts.forEach((attempt, attemptIndex) => {
        rows.push(`attempt_accuracy,attempt_${attemptIndex + 1},${accuracy(attempt)}`);
        rows.push(`first_decision,attempt_${attemptIndex + 1},${attempt.selections[0]?.correct ? 100 : 0}`);
      });
      misconceptionCounts(drillAttempts).forEach(([label, count]) => {
        rows.push(`misconception_count,"${label.replaceAll('"', '""')}",${count}`);
      });
      download(`${drill.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-results.csv`, rows.join('\n'), 'text/csv');
      setStatus('Results CSV downloaded.');
    }
  }
  if (action === 'apply-update') {
    const registration = serviceWorkerRegistration ?? await navigator.serviceWorker.getRegistration();
    const waitingWorker = registration?.waiting;
    if (!waitingWorker) {
      updateReady = false;
      setStatus('The update is no longer waiting. The app is already current.');
      document.querySelector<HTMLElement>('#update-toast')?.setAttribute('hidden', '');
      return;
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }
  if (action === 'reload') window.location.reload();
});

document.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const field = input.dataset.field;
  if (input.dataset.action === 'select-insight-drill') { window.location.hash = href('insights', input.value); return; }
  if (input.dataset.action === 'import-json' && input instanceof HTMLInputElement && input.files?.[0]) {
    try {
      const imported = parseImport(await input.files[0].text());
      if (!confirm(`Replace this device's ${data.drills.length} drills and ${data.attempts.length} attempts with ${imported.drills.length} drills and ${imported.attempts.length} attempts?`)) return;
      await store.replaceAll(imported);
      data = imported;
      setStatus('Backup imported.');
      window.location.hash = '#/library';
      render();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not import that file.', true);
      render();
    }
    return;
  }
  if (!field) return;
  const context = currentDrillAndNode(input);
  if (!context) return;
  const { drill, node } = context;
  if (field === 'drill-title') drill.title = input.value;
  if (field === 'drill-description') drill.description = input.value;
  if (field === 'shuffle' && input instanceof HTMLInputElement) drill.shuffleChoices = input.checked;
  if (node) {
    if (field === 'node-prompt') node.prompt = input.value;
    if (field === 'node-hint') node.hint = input.value;
    if (field === 'node-debrief') node.debrief = input.value;
    if (field === 'node-image' && input instanceof HTMLInputElement && input.files?.[0]) {
      try {
        node.image = await imageData(input.files[0]);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Could not add image.', true);
        input.value = '';
        return;
      }
    }
    const choiceId = input.closest<HTMLElement>('[data-choice-id]')?.dataset.choiceId;
    const choice = node.choices.find((item) => item.id === choiceId);
    if (choice) {
      if (field === 'choice-label') choice.label = input.value;
      if (field === 'choice-consequence') choice.consequence = input.value;
      if (field === 'choice-target') choice.nextNodeId = input.value || null;
      if (field === 'choice-misconception') choice.misconception = input.value;
      if (field === 'choice-correct' && input instanceof HTMLInputElement) choice.isCorrect = input.checked;
    }
  }
  await saveDrill(drill);
  render();
});

document.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== 'restore-license') return;
  event.preventDefault();
  const token = new FormData(form).get('license');
  if (typeof token !== 'string' || !token.trim()) return;
  license = { ...license, checking: true };
  render();
  license = await restoreLicense(token);
  setStatus(license.unlocked ? 'License verified. Full authoring is active.' : license.notice || 'That license could not be verified.', !license.unlocked);
  render();
});

window.addEventListener('hashchange', () => {
  if (route().page !== 'play') player = null;
  render();
  window.scrollTo(0, 0);
});
window.addEventListener('online', render);
window.addEventListener('offline', render);

const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  serviceWorkerRegistration = registration;
  if (registration.waiting) {
    updateReady = true;
    document.querySelector<HTMLElement>('#update-toast')?.removeAttribute('hidden');
  }
  registration.addEventListener('updatefound', () => {
    registration.installing?.addEventListener('statechange', () => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        updateReady = true;
        document.querySelector<HTMLElement>('#update-toast')?.removeAttribute('hidden');
      }
    });
  });
};

const initialize = async (): Promise<void> => {
  try {
    captureLicenseFromUrl();
    license = getLicenseState();
    await store.initialize();
    data = await store.getAll();
    render();
    void registerServiceWorker();
    void verifyLicense().then((state) => { license = state; render(); });
  } catch (error) {
    fatalStorageError = error;
    app.innerHTML = shell(renderStorageError(error));
    void registerServiceWorker();
  }
};

void initialize();
