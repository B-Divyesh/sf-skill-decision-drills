# Skill Decision Drills

Skill Decision Drills is a local-first PWA for coaches and self-learners who
need to rehearse choices inside realistic scenarios—not memorize isolated
facts. Authors build branching decision trees with prompts, optional photos,
consequences, hint paths, misconception tags, and debrief notes. Learners can
replay those routes with shuffled choices, while the coach sees first-decision
improvement and aggregate misconceptions.

Live product: <https://skill-decision-drills.sociobot.in>

## What v1 includes

- A complete visual drill editor with automatic IndexedDB persistence
- Branching learner mode with hints, consequences, debriefs, and replay
- Choice shuffling on every replay to reduce position memorization
- Local attempt history, first-decision lift, and misconception counts
- Schema-validated JSON backup/import, corrupt-data recovery, and aggregate CSV report export
- Optional local scenario photos, resized in the browser
- Installable PWA shell and explicit first-session offline coverage
- A safe, non-hazardous “Studio handoff” starter drill
- $29 one-time full-authoring unlock through the Sociobot billing API

The free kit is intentionally useful: it includes two full drills, unlimited
nodes, offline play, reporting, and all export/accessibility features. The paid
license only removes the drill-count limit.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL. Data is stored separately for each browser origin,
so development data is not shared with the deployed site.

## Test and build

```bash
npm test
npm run build
npm run test:e2e
```

`npm run build` is the exact production build command. It writes the static
site to `dist/`, with `dist/index.html` at the root. Playwright 1.58.2 is pinned
and its tests cover authoring persistence, complete drill playback, insights,
390 px layout, privacy/terms routes, accessibility, and a real offline reload.

For a local production preview:

```bash
npm run preview
```

## Architecture and privacy

The app uses Vite and framework-free TypeScript. IndexedDB stores drills and
attempts; localStorage stores only initialization state and an optional license
token/verdict. There is no account, analytics, ad code, third-party font, or
runtime CDN. The only external runtime request is a daily license check when a
license exists. See [`privacy/index.html`](privacy/index.html).

The service worker precaches the built shell (including Vite's hashed JS/CSS),
uses cache-first local assets, and treats the license API as network-first.

## Safety and product boundary

This is a rehearsal aid, not a certification or assessment of real-world
competence. Coaches remain responsible for their material and for qualified
instruction where mistakes could affect health, safety, property, or rights.
The bundled sample contains no hazardous procedural advice.

## Design and generated asset

The neo-brutalist field-board system and image provenance are documented in
[`design.md`](.factory/design.md). Source and prompt metadata for the original
hero illustration are retained in `assets/src/`.

## License

MIT. See [`LICENSE`](LICENSE).
