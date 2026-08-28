# Polish 3 — cumulative finding closure

Candidate repaired: `3db077c997665eb745ec3ec0abfcb082eccddc81`  
Adversarial report: `ddbea57c48dfc215446115cf401b7926622697e1`  
Product repair: `e45f8f07b01521fee31f81e72fcb8675d6f6954a`  
Verification isolation: `e5f318502762f556ba479478c658fa376c70fb8d`
Live URL: <https://skill-decision-drills.sociobot.in>

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | The `sample-access` contract now names the three-choice outcome and its clean-context test asserts exactly three `.player-choice` controls while retaining the no-payment check. | `@claim:sample-access`; clean clone `/tmp/sdd-polish3-clean-goeVTq`; [live mobile demo](../evidence/live/polish-3-demo-mobile.png); live `/?demo=1`. |
| F-3-2 | The insights claim now follows a tagged incorrect route, then proves one attempt, 67% accuracy, “Acting before confirming the goal”, and count `1`. | `@claim:insights`; clean clone `/tmp/sdd-polish3-clean-goeVTq`; [live report](../evidence/live/polish-3-insights-desktop.png); live `/insights/starter_studio_handoff?demo=1`. |
| F-3-3 | Replaced “Need a hint?” with “Show hint” and “Continue to next decision” with “Show next decision”. The replay test now opens and checks the hint before using the result-naming route controls. | `@claim:replay-feedback`; [live demo](../evidence/live/polish-3-demo-mobile.png). |

## Review 2 findings

| Finding | Retained closure | Evidence |
| --- | --- | --- |
| F-2-1 | Privacy and Terms remain real SPA routes with working click, Back, title, focus, and announcement behavior. | `@claim:real-routes`; live `/privacy` and `/terms`. |
| F-2-2 | Demo isolation, CSV/JSON content, and all-route outcomes remain fully asserted; F-3-1 and F-3-2 close the last quantitative omissions. | `@claim:demo-isolated`, `@claim:sample-access`, `@claim:csv-export`, `@claim:json-export`, `@claim:real-routes`, `@claim:insights`. |
| F-2-3 | A complete normal-data lifecycle and all-route request interception prove browser-only storage and no tracking. | `@claim:normal-local-only`, `@claim:no-tracking`. |
| F-2-4 | Replay, feedback, shuffle, reports, image resize/storage, and confirmed import retain dedicated outcome tests. | `@claim:replay-feedback`, `@claim:shuffle`, `@claim:insights`, `@claim:photo-local`, `@claim:json-import`. |
| F-2-5 | Copy remains scoped to the tested offline sample and setup-free, no-payment access. | `@claim:offline-reload`, `@claim:sample-access`; [landing mobile](../evidence/live/polish-3-landing-mobile.png). |
| F-2-6 | Factual creative-project sample copy and repository-backed art provenance remain in place. | `@claim:sample-content`, `@claim:artwork-provenance`. |
| F-2-7 | Privacy and Terms retain complete OG/Twitter metadata, including `twitter:image`. | `@claim:real-routes`; live metadata sweep. |
| F-2-8 | SPA, legal, and 404 pages retain one geometric wordmark, four-link nav, shared footer, and now show `release 3`. | Shared-shell/axe browser test; live route sweep. |
| F-2-9 | The creation control remains “Create drill”. | Mobile browser test; live landing. |
| F-2-10 | The edit control remains “Edit drill”. | Shared-shell browser test; live landing. |
| F-2-11 | The destructive control remains “Delete drill” and its confirmation names the drill. | `@claim:normal-local-only`. |
| F-2-12 | The sample remains labelled “SAMPLE DRILL” with factual British-English copy. | `@claim:sample-content`; `.factory/copy-audit.md`. |
| F-2-13 | README keeps the visitor-language demo instruction and explains the isolation outcome. | `src/docs.test.ts`; `@claim:demo-isolated`. |
| F-2-14 | README keeps “the choices learners missed”; the report test now proves a non-zero miss. | `@claim:insights`. |
| F-2-15 | Node `>=20` and `dist/index.html` remain declared and tested. | `@claim:build-output`; clean-clone build. |
| F-2-16 | The first action, outcome, and three facts remain inside 390 × 844 and 1440 × 900 viewports. | Both first-screen bounding tests; [mobile](../evidence/live/polish-3-landing-mobile.png) and [desktop](../evidence/live/polish-3-landing-desktop.png). |
| F-2-17 | README's `node:fs` claim-list command remains executable and documented. | `src/docs.test.ts`; `npm test`. |
| F-2-18 | Explicit application rewrites and the designed response override retain real HTTP 404 behavior. | `@claim:deployment-config`; live `/404` and `/no-such-route-polish-3`. |

## Review 1 findings

| Finding | Retained closure | Evidence |
| --- | --- | --- |
| F-1-1 | `/?demo=1` and `/demo` open the seeded player in `demo:` storage with the persistent banner, Reset demo, and Start for real. | `@claim:demo-isolated`; `.factory/demo.md`; live cold demo. |
| F-1-2 | All retained visitor claims remain in the 17-entry manifest with exactly one matching tagged test each. | `.factory/claims.json`; 17/17 individual commands and aggregate `npm run test:claims` from the clean clone. |
| F-1-3 | The unavailable paid offer and checkout remain absent; the complete sample requires no payment. | `@claim:sample-access`; repository and live link crawl. |
| F-1-4 | The first screen keeps the six-word job headline, named audience, single primary sample action, adjacent outcome, and three facts. | Mobile/desktop first-screen browser tests; live screenshots. |
| F-1-5 | History API URLs remain in place for every application, demo, report, data, about, and legal screen. | `@claim:real-routes`; live direct-load and Back checks. |
| F-1-6 | Every route retains a concise title, description, canonical, OG/Twitter metadata, social image, favicon, and Apple icon. | `@claim:real-routes`; live metadata sweep. |
| F-1-7 | User navigation and Back continue to focus and announce the route H1. | `@claim:real-routes`. |
| F-1-8 | Legal pages retain the same product header/footer, legal links, factory credit, and release identity. | Shared-shell/axe browser test; live `/privacy` and `/terms`. |
| F-1-9 | Landing and README sentences remain within 22 words, avoid banned marketing language, and use consistent terms; player labels are now result-naming too. | `.factory/copy-audit.md`; `@claim:replay-feedback`. |
| F-1-10 | Non-fingerprinted art retains one-hour revalidation and the host config retains CSP, Permissions-Policy, COOP, referrer, and nosniff headers. | `@claim:deployment-config`; `npm run check:live`; live response headers. |

## Earlier independent-verification findings

| Finding | Retained closure | Evidence |
| --- | --- | --- |
| Malformed import could corrupt storage | Full schema validation happens before transactional replacement; corrupt stored data has a recovery screen. | `src/model.test.ts`; `@claim:json-import`; `@claim:normal-local-only`. |
| Hashed assets lacked immutable caching | Fingerprinted build assets use immutable caching; non-fingerprinted board art revalidates hourly. | `src/deployment.test.ts`; live header checks. |
| Checkout was unavailable | No paid offer, license code, checkout link, or payment control ships. | `@claim:sample-access`; live link crawl. |
| Skip link broke routing | The keyboard skip action focuses `main` without changing the URL. | Keyboard skip-link browser test. |
| Waiting worker could not update | The update control posts `SKIP_WAITING` to `registration.waiting`; release 3 uses cache version `v7`. | Full browser suite; `public/sw.js`. |
| Invalid image announced success | Decode/size errors return before persistence; valid images are resized and stored. | `@claim:photo-local`; unit/browser suite. |
| Mobile targets and reflow failed | Demo controls meet the 44 px check and every route has no horizontal overflow at 200% text. | Mobile browser suite. |
| Response hardening was absent | Security headers and safe cache policy remain in the deployment configuration. | `@claim:deployment-config`; live headers. |

## Verification summary

- Fresh remote clone: `/tmp/sdd-polish3-clean-4mB5B7` at `e5f3185`.
- `npm ci` and `npm audit --omit=dev`: passed with 0 vulnerabilities.
- `npm run check`: passed; Vitest 6/6 and Playwright 25/25.
- All 17 manifest commands passed individually; aggregate `npm run test:claims` passed 17/17.
- Production build: 47.56 kB JS raw / 15.49 kB gzip and 24.43 kB CSS raw / 5.84 kB gzip.
- Live deployment `a668bde5-5c96-4127-a1f6-e3a2bb0a572f` passed the cold
  browser, header, 404, and full 25-test recheck; exact evidence is in
  `.factory/handoff.md`.

No finding is deferred.
