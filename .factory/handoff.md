# Repair handoff — Skill Decision Drills

## Outcome

The four repository-owned QA findings from verifier commit
`7107ce12cccdfedd2f4d7149c0c447e7136c8007` are repaired and covered by exact
regressions. The static PWA remains buildable and the researched brief,
field-board visual system, local-first behavior, free tier, and deployment
class are unchanged. Repair implementation commit: `bc25dca2be2205c2e843e11bbda3026ed00032d4`.

One release blocker is external and remains open: the public Sociobot billing
catalog does not contain `skill-decision-drills`, so the required production
checkout still returns HTTP 404. Repository instructions reserve billing
registration to the factory; no billing or payment-provider state was changed
from this repository. `npm run check:live` now makes this release dependency an
explicit, repeatable gate.

## Repairs

### Keyboard skip link

- Removed the duplicate pre-app skip link from `index.html`.
- Kept one app-owned skip link and intercept its activation without changing
  the hash-router route.
- Made `<main>` programmatically focusable; activation focuses and scrolls it
  while respecting reduced motion.
- Regression starts on the starter player, confirms one skip link, activates
  it with Tab and Enter, confirms the URL and player are unchanged, and checks
  main focus plus the 3 px cobalt focus ring.

### Waiting service-worker update

- Retain the service-worker registration and message `registration.waiting`,
  not the old active controller.
- Persist update-ready state across app rerenders and handle a no-longer-waiting
  worker with a clear status.
- Advanced both cache names from v3 to v4.
- Regression installs and controls the production build, writes a versioned
  worker to create a genuine `installed`/waiting worker, edits a saved drill,
  activates **Update now**, observes `controllerchange` and reload, and confirms
  the edited IndexedDB state survives.

### Image validation feedback

- Return immediately after image processing fails, clear the file input, and
  avoid the unconditional drill save that previously replaced the error with
  false success.
- Regression covers the exact 12,000,001-byte boundary and malformed `.png`,
  confirms the actionable live errors and absence after reload, then uploads a
  valid PNG and confirms successful persistence after reload.

### Mobile targets and 200% text reflow

- Raised the named home, results, and footer link targets to at least 44 px.
- Made mobile navigation an intentional two-column layout, constrained and
  wrapped display text, stacked the editor choice heading, and allowed long
  legal-page addresses to wrap.
- Exact 390 px regression measures all five verifier-named targets at or above
  44×44 CSS px.
- A second regression applies 200% root text sizing to library, editor, player,
  insights, data, upgrade, about, privacy, and terms and confirms no horizontal
  document overflow on any view.

### Release gates

- Added current ESLint 10 + typescript-eslint and first-class `lint` and
  `typecheck` scripts. `npm run check` now runs unit/policy tests, lint, type
  checking, production build, and browser tests.
- Added `npm run check:live` to verify canonical identity, the $29 USD catalog
  record and return URL, a 303 hosted-checkout redirect, verification CORS, and
  the invalid-token response policy.
- Added cross-view axe/semantic/console coverage, normal-session network
  privacy coverage, daily license-verification caching, and reduced-motion
  coverage.

## Verification evidence — 2026-08-28 UTC

Run from `/work/repo`:

```bash
npm ci
npm run check
npm audit --omit=dev
npm run check:live
```

- Clean install: 140 packages installed; npm reported 0 vulnerabilities.
- Unit/policy: 5/5 Vitest tests passed in 2 files.
- Lint/type/build: ESLint passed; `tsc --noEmit` passed; Vite produced
  `dist/index.html`.
- Browser: 18 Playwright 1.58.2 Chromium tests pass across desktop and Pixel 5
  projects. They cover authoring/persistence, player/reporting, backup and
  corrupt-record recovery, the exact verifier repairs, offline reload,
  service-worker replacement, privacy/license behavior, reduced motion, and
  every primary/legal screen.
- Accessibility: axe reports zero serious/critical violations across all nine
  primary/legal views; every view has one h1 and one main; no console/page
  errors; the factory URL verifier reports correct title/lang, 0 missing image
  alternatives, and 0 unnamed buttons.
- Keyboard: skip-link Tab/Enter preserves the active player route and focuses
  main with a 3 px `rgb(76, 114, 255)` outline.
- Mobile: the five reported targets are at least 44×44; all nine views have
  no horizontal document overflow at 390 px under 200% text sizing.
- Privacy: a normal session makes no request outside the app origin. License
  capture strips the query token and makes one verification request; reload
  reuses the daily verdict.
- Offline/update: offline reload keeps the starter player usable; a real
  waiting-worker transition reaches `controllerchange`, reloads, and preserves
  edited local data.
- Local factory URL verifier: HTTP 200 in 593 ms, no console/page errors,
  correct title/lang, one h1/main, 0 missing image alternatives, and 0 unnamed
  buttons.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.4 s, CLS 0, TBT 0 ms.
- Bundles: initial JS 45,086 B raw / 14,929 B gzip; CSS 23,444 B raw /
  5,641 B gzip; mobile hero WebP 11,276 B; no webfonts.
- Package/consumer check: not applicable; this artifact is a static PWA, not a
  published package or CLI.
- Production dependency audit: 0 vulnerabilities.

## Live identity and remaining release blocker

`npm run check:live` currently fails at its first billing assertion:

```text
Error: Product catalog does not contain skill-decision-drills.
```

Direct production evidence is unchanged from the verifier:

```text
GET https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The invalid-license endpoint remains healthy (HTTP 200, `valid:false`,
`reason:"invalid"`) and allows the canonical product origin. To clear the last
release blocker, the factory must enable/register the existing $29 USD product
with return URL `https://skill-decision-drills.sociobot.in/`, then rerun
`npm run check:live`. No real payment is required by that check.

## Deployment

The work order's static deployment published `dist/` to
<https://skill-decision-drills.sociobot.in> on 2026-08-28 UTC. Azure deployment
ID: `7ab2b323-f2c3-4b6b-b7d6-44d07e1b246a`.

- Live factory URL verifier: HTTP 200 in 821 ms, no console/page errors,
  correct title/lang, one h1/main, 0 missing image alternatives, and 0 unnamed
  buttons.
- Fresh live Chromium at 390 px confirmed one skip link, Tab/Enter route and
  focus preservation, no 200%-text horizontal overflow, and no console/page
  errors.
- Live and local `index.html` SHA-256:
  `b245223779e87fe72ef8f8b5d37940be2369e98225ae5799ea872795398c885f`.
- Live and local `sw.js` SHA-256:
  `800282948b5483c455a8e7f4e39629c0c35c103a1ac2f3a9826e571e93300292`.
- The deployed worker advertises the v4 caches and the live HTML references
  the repaired hashed bundles.
- Post-deployment `npm run check:live` still fails only because the factory
  billing catalog record is absent. Acceptance must remain blocked until that
  external gate passes.
