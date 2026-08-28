# Polish 5 — cumulative finding closure

Candidate reviewed: `e77dd4105f7aa8e9f172b5a696ad466e450d7688`  
Repair: `6326f96ebb142570a7d041e00d7ea06b5e3ffd4c`  
Deployment: static work-order deploy on 2026-08-28  
Live URL: <https://skill-decision-drills.sociobot.in>

Every row was rechecked from a fresh clone and on the deployed site. The fresh
clone ran all 17 claim commands individually and then the aggregate suite;
both passed. The post-deployment Playwright/axe suite passed 27/27.

## Review 5

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Replaced “safe starter drill” with “bundled starter drill” and “The starter drill is ready.” Reset now rerenders and focuses the drill board when recovery begins on `/drills`. | `recovery uses factual starter-drill wording and resets malformed saved data`; live 27/27; live bundle grep; recovery path covered in production suite. |
| F-5-2 | README now states `20.19–20.x` or `22.12 and newer`, names excluded Node versions, and the `build-output` claim runs Vite under pinned Node 20.19.0 **and** 22.12.0. | `@claim:build-output`; fresh-clone individual claim pass; `dist/index.html` asserted after each build. |
| F-5-3 | Rebuilt the complete landing/README audit with corrected counts, meaningful alt and labels, a terminology table, plain Results wording, and a regression test that compares every audited unit with the rendered landing and README. | `copy audit covers every cold landing unit and current README unit`; [landing mobile](../evidence/live/polish-5-landing-mobile.png); [Results desktop](../evidence/live/polish-5-results-desktop.png); live 27/27. |

## Reviews 1–4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first action opens the seeded `/demo` sandbox; `?demo=1` normalizes there before storage opens. Demo uses `demo:` IndexedDB/localStorage, shows the persistent banner, Reset demo, and Start for real. | `@claim:demo-isolated`, `@claim:sample-access`, `@claim:real-routes`; [live demo](../evidence/live/polish-5-demo-mobile.png); live `/?demo=1`. |
| F-1-2 | Kept a 17-entry claims contract with exactly one tagged observable test per retained claim; added the missing dual-Node build proof. | `.factory/claims.json`; fresh-clone 17 individual passes and aggregate 17/17. |
| F-1-3 | No checkout, price, license, or payment control is shipped; the complete sample remains available without payment. | `@claim:sample-access`; live link crawl in `@claim:real-routes`; live 27/27. |
| F-1-4 | Retained the job-first H1, named audience, one primary sample action, adjacent outcome, and three facts above the fold. | `tests/mobile.spec.ts`; [live landing](../evidence/live/polish-5-landing-mobile.png); live 390 px suite. |
| F-1-5 | Retained History API routes, direct loads, deep links, Back behavior, and a host-level designed 404. | `@claim:real-routes`, `@claim:deployment-config`; [live 404](../evidence/live/polish-5-404-desktop.png); live 27/27. |
| F-1-6 | Retained concise route titles, descriptions, canonical, OG/Twitter metadata, favicon, Apple icon, and social artwork. | `@claim:real-routes`; `npm run check:live`; live 27/27. |
| F-1-7 | Retained focus-to-H1 and polite route announcements for internal navigation, Back, demo entry, and Start for real. | `@claim:real-routes`; live 27/27. |
| F-1-8 | Retained the shared field-board wordmark, four-link nav, safety footer, legal links, factory credit, and release-5 identity on app, legal, and 404 pages. | Shared-shell/axe test; [live 404](../evidence/live/polish-5-404-desktop.png); live 27/27. |
| F-1-9 | Replaced incomplete audit coverage with a full tested audit; uses Create consistently and Results as the sole visitor-facing outcome term. | Copy-audit regression test; [landing](../evidence/live/polish-5-landing-mobile.png); [Results](../evidence/live/polish-5-results-desktop.png). |
| F-1-10 | Retained safe cache policy and CSP, Permissions-Policy, COOP, referrer, and nosniff response hardening. | `@claim:deployment-config`; `npm run check:live`; live header capture. |
| F-2-1 | Privacy and Terms remain real static and SPA routes with click, title, focus, announcement, and Back behavior. | `@claim:real-routes`; live `/privacy`, `/terms`; live 27/27. |
| F-2-2 | Retained complete observable outcomes for every listed claim; dual Node boundary is now included. | 17 individual claim commands from fresh clone; aggregate 17/17. |
| F-2-3 | Retained browser-only normal-data lifecycle and no-account/no-ads/no-analytics/no-other-company-request coverage. | `@claim:normal-local-only`, `@claim:no-tracking`; live 27/27. |
| F-2-4 | Retained dedicated outcome tests for feedback, replay, shuffled choices, Results, photo resize/storage, CSV/JSON export, and confirmed import. | `@claim:replay-feedback`, `shuffle`, `insights`, `photo-local`, `csv-export`, `json-export`, `json-import`. |
| F-2-5 | Retained tested sample and authored-drill offline reload and choice completion, plus setup-free no-payment sample access. | `@claim:offline-reload`, `@claim:sample-access`; live 27/27. |
| F-2-6 | The sample and recovery text are factual: creative-project sample, bundled starter drill, and repository-backed original art provenance. | `@claim:sample-content`, `@claim:artwork-provenance`; recovery regression test; live bundle check. |
| F-2-7 | Privacy and Terms retain exact canonical, OG, Twitter, favicon, and Apple touch metadata. | `@claim:real-routes`; live 27/27. |
| F-2-8 | Common header/footer and release identity are present on SPA, legal, and designed 404 screens. | Shared-shell/axe test; live `/privacy`, `/terms`, `/round-five-missing`. |
| F-2-9 | The compact authoring control remains “Create drill.” | Landing copy-audit test; [live landing](../evidence/live/polish-5-landing-mobile.png). |
| F-2-10 | The editor action remains “Edit drill.” | Shared-shell browser test; live 27/27. |
| F-2-11 | The destructive action remains “Delete drill” and confirmation names the affected drill. | `@claim:normal-local-only`; live 27/27. |
| F-2-12 | The landing sample remains `SAMPLE DRILL` with factual British-English creative-project copy. | `@claim:sample-content`; [live landing](../evidence/live/polish-5-landing-mobile.png). |
| F-2-13 | README demo copy stays visitor-focused and describes the outcome without sandbox jargon. | `.factory/copy-audit.md`; `@claim:demo-isolated`; fresh-clone docs test. |
| F-2-14 | README and Results now say which choices learners missed, without metric jargon. | Copy-audit regression test; [Results](../evidence/live/polish-5-results-desktop.png). |
| F-2-15 | README and engines agree on the supported Node ranges; both lower bounds are built in the claim test. | `@claim:build-output`; fresh-clone individual command. |
| F-2-16 | Primary action, outcome, and three facts remain inside 390 × 844 and 1440 × 900 first screens. | `tests/mobile.spec.ts`; [live landing](../evidence/live/polish-5-landing-mobile.png). |
| F-2-17 | The README claim-list command remains executable and now appears in the complete audit. | `src/docs.test.ts`; copy-audit regression test; fresh clone `npm test`. |
| F-2-18 | Explicit route rewrites and response override retain real HTTP 404 behavior. | `@claim:deployment-config`; [live 404](../evidence/live/polish-5-404-desktop.png). |
| F-3-1 | The sample-access claim continues to assert exactly three playable choices after one click. | `@claim:sample-access`; [live demo](../evidence/live/polish-5-demo-mobile.png). |
| F-3-2 | Results claim proves three attempts, 100% latest accuracy, +100% first-choice improvement, and a missed-choice count of 1. | `@claim:insights`; live 27/27. |
| F-3-3 | Player controls remain “Show hint” and “Show next decision.” | `@claim:replay-feedback`; [live demo](../evidence/live/polish-5-demo-mobile.png). |
| F-4-1 | Full-document demo transitions and Back retain focused H1s and route announcements. | `@claim:real-routes`; live 27/27. |
| F-4-2 | `?demo=1` remains canonicalized to `/demo` before any storage action. | `@claim:real-routes`; live `/?demo=1`; [live demo](../evidence/live/polish-5-demo-mobile.png). |
| F-4-3 | Route, deployment, CSV, tracking, and now both Node build boundaries have complete tagged outcome assertions. | `@claim:real-routes`, `deployment-config`, `csv-export`, `no-tracking`, `build-output`; fresh-clone 17/17. |
| F-4-4 | Results, offline, account/ads/analytics, and third-party-request claims remain exact, listed, and tested. | `@claim:insights`, `offline-reload`, `no-tracking`; live 27/27. |
| F-4-5 | Creation copy remains consistently Create; the audit now protects that terminology and all current landing labels. | Copy-audit regression test; [live landing](../evidence/live/polish-5-landing-mobile.png). |

## Earlier independent-verification findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| Malformed import/storage corruption | Import validates before replacement; corrupt saved records have a factual recovery screen, recovery download, confirmation, reset, focus, and status. | `src/model.test.ts`, `@claim:json-import`, recovery regression test; live 27/27. |
| Asset caching | Hashed assets are immutable and the non-hashed board art revalidates hourly. | `@claim:deployment-config`; live headers. |
| Broken checkout | No broken payment path remains. | `@claim:sample-access`; rendered-link crawl. |
| Skip link route mutation | Skip focuses `main` without changing the active route. | Keyboard skip-link test; live 27/27. |
| Waiting worker update | Update control sends `SKIP_WAITING` to the waiting worker. | Service-worker browser coverage; `public/sw.js`. |
| Invalid-image false success | Decode and size errors return before persistence; accepted images are browser-resized. | `@claim:photo-local`; full browser suite. |
| Mobile target/reflow defects | 44 px demo controls, 390 px layout, 200% reflow, and reduced motion remain tested. | `tests/mobile.spec.ts`; live 27/27. |
| Missing response hardening | CSP, Permissions-Policy, COOP, referrer, nosniff, and cache policy are deployed. | `npm run check:live`; live header capture. |

## Final live evidence

- Cold production browser/axe suite: 27/27 passed.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.15 s, CLS 0, TBT 0. See
  `evidence/live/polish-5-lighthouse.json`.
- Deployment is serving `assets/main-vedtO2gv.js`, which contains the repaired
  Results and recovery strings. No finding remains open.
