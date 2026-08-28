# Handoff — Skill Decision Drills v1

## What shipped

- End-to-end local-first workflow: create/edit/delete branching drills, attach
  locally resized scenario images, connect consequences to later decisions,
  add hints/debriefs, set a start node, and check authoring readiness.
- Focused learner player with shuffled choices, immediate consequence feedback,
  hints, bounded traversal, attempt persistence, replay, and safety disclaimer.
- Local insight report with per-attempt accuracy, first-decision change from
  attempt one to three, aggregate misconception counts, and CSV export.
- IndexedDB persistence plus user-owned JSON backup/import. An empty state,
  malformed-import error, missing-drill error, and IndexedDB failure screen are
  included.
- Installable PWA manifest, 192/512/maskable icon, versioned service-worker
  caches, first-install hashed-asset precaching, offline fallback, and an
  in-app update prompt.
- $29 one-time unlock contract: hosted Sociobot checkout, URL token capture,
  local token storage, daily background verification, optimistic offline use,
  invalid-license notice, and paste-to-restore. Free use remains meaningful at
  two complete drills; exports, accessibility, and safety are never gated.
- Static `/privacy/` and `/terms/` pages, MIT license, complete README, and a
  safe non-hazardous starter drill.
- Product-specific neo-brutalist field-board system and an original generated
  branching-board illustration. Prompt, review, and provenance are recorded in
  `.factory/design.md` and `assets/src/`.

## Verification performed

Run from `/work/repo`:

```bash
npm install
npm test
npm run build
npm run test:e2e
```

Results on 2026-08-28:

- `npm test`: 4/4 Vitest unit tests passed.
- `npm run build`: passed; `dist/index.html` present. Initial app JS is 40.25 KB
  raw / 13.51 KB gzip; CSS is 22.92 KB raw / 5.56 KB gzip. Hero WebP variants
  are 12 KB and 44 KB, all within the supplied budgets.
- `npm run test:e2e`: 7/7 Playwright tests passed using pinned Chromium 1.58.2.
  Covered authoring persistence, a complete 3-decision route, saved insights,
  confirmed deletion/empty state, 390 px usability, legal routes, and reload +
  continued play with the browser explicitly offline.
- Axe Playwright scan: no serious or critical violations on library, editor,
  player, insights, data, upgrade, privacy, or terms screens.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.5 s, CLS 0, Total Blocking Time 0 ms.
- Manual visual review: desktop 1440 px and mobile 390 px; no horizontal mobile
  overflow and no console/page errors on load.
- `npm audit --omit=dev`: 0 vulnerabilities (the full dependency audit was also
  clean after updating Vite/Vitest patch releases).

## Build and deploy

The exact build command is `npm run build`. Deploy the generated `dist/`
directory as a static site; `index.html` is at its root. The canonical host is
`https://skill-decision-drills.sociobot.in`.

## Known gaps / next steps

- The factory still needs to register/confirm the production paid product and
  its return URL. The client intentionally uses the slug-based production API
  and contains no provider or product ID.
- v1 is deliberately single-device and aggregate-only: there are no learner
  accounts, named participants, cloud sync, multi-coach collaboration, or
  content marketplace.
- Measurement is descriptive rather than certifying. Coaches must validate
  their own scenarios and use qualified instruction for consequential skills.
