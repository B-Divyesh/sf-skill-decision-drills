# Handoff — polish round 3

## Delivered

All findings in `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, the earlier verification reports, and the prior polish
records are closed. The static, offline PWA keeps its neo-brutalist field-board
identity.

Round 3 closes the final three review findings:

- `sample-access` now proves the exact three-choice sample outcome.
- `insights` now creates one tagged miss and proves the 67% report and count.
- Player actions now say **Show hint** and **Show next decision**.

The release includes the isolated `?demo=1`/`/demo` player, separate `demo:`
IndexedDB and localStorage namespaces, reset/start-real controls, full claim
manifest, real History API routes, titles and metadata, focused/announced route
changes, legal pages, mobile reflow, response hardening, offline use, and a
real 404 response. The detailed finding map is `.factory/polish-3.md`.

## Release

- Repair commit: `e45f8f07b01521fee31f81e72fcb8675d6f6954a`.
- Verification isolation commit: `e5f318502762f556ba479478c658fa376c70fb8d`.
- Production deployment: `a668bde5-5c96-4127-a1f6-e3a2bb0a572f`.
- Live URL: <https://skill-decision-drills.sociobot.in>.

## Verification

- `npm run check`: passed — Vitest 6/6, lint, typecheck/build, and Playwright
  25/25, including axe serious/critical scans, keyboard skip, 390 px layout,
  200% text reflow, reduced motion, privacy, and offline tests.
- Fresh remote clone `/tmp/sdd-polish3-clean-4mB5B7`: `npm ci` passed with
  zero audit vulnerabilities; every one of the 17 commands in
  `.factory/claims.json` passed individually.
- Production build: `dist/index.html`; JS 47.56 kB raw / 15.49 kB gzip; CSS
  24.43 kB raw / 5.84 kB gzip.
- Cold live smoke: `/opt/fleet/lib/verify-url.sh` passed for `/` and
  `/?demo=1`; both have a title, `lang`, one H1, one main landmark, image alt
  text, no unlabeled buttons, and no console/page errors.
- Live browser suite: `PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run test:e2e` passed 25/25.
- Live routing: `/`, `/privacy`, `/terms`, and `/demo` return 200; `/404` and
  `/no-such-route-polish-3` return 404. CSP, Permissions-Policy, COOP,
  Referrer-Policy, nosniff, and the one-hour board-art cache policy are live.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms.
- Evidence: `evidence/live/polish-3-landing/verify.json`,
  `evidence/live/polish-3-demo/verify.json`,
  `evidence/live/polish-3-landing-mobile.png`,
  `evidence/live/polish-3-demo-mobile.png`,
  `evidence/live/polish-3-insights-desktop.png`, and
  `evidence/live/lighthouse.json`.

## Run and deploy

```bash
npm ci
npm run check
npm run test:claims
npm run check:live
PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run test:e2e
npm run build
/opt/fleet/lib/deploy-static.sh skill-decision-drills dist
```

## Known gaps

None. No finding is deferred.
