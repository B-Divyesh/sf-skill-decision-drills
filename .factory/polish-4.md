# Polish 4 — cumulative finding closure

Candidate reviewed: `24e790503fe88b483cb029a38e7520c8612ef07a`  
Repair: `af6620e714cab5152a1a2ef0aa262d211bc928fe`  
Deployment: `4866f49b-5397-4bb2-9de3-a52780329299`  
Live URL: <https://skill-decision-drills.sociobot.in>

Every row below was rechecked in a clean clone and against the deployed site.
The exact 17 claim commands passed individually in
`/tmp/sdd-polish4-clean-y8Pt5u`; clean-clone `npm run check` passed 6 unit and
25 browser tests, and the deployed browser suite passed 25/25.

## Review 4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Full-document demo transitions now set a pending focus marker. Demo initialization, Start for real, and Back focus the new H1 and announce the route. | `@claim:real-routes`; live 25/25; [demo mobile](../evidence/live/polish-4-demo/screenshot-mobile.png); live `/` → `/demo` → Back and Start for real. |
| F-4-2 | `/?demo=1` normalizes to canonical `/demo` before storage opens, so the URL, title, metadata, and isolated namespace agree. | `@claim:real-routes` asserts both demo entries and exact canonical; cold [demo verify](../evidence/live/polish-4-demo/verify.json); live `/?demo=1`. |
| F-4-3 — real routes | The route claim now direct-loads every screen, asserts each exact canonical/metadata set, crawls every rendered internal link, and exercises both mode transitions. | `@claim:real-routes`; live 25/25; live `/demo`, `/privacy`, `/terms`, and `/404`. |
| F-4-3 — deployment config | The tagged deployment test now asserts all app rewrites, every cache rule, all headers, MIME type, built config copy, and the 404 override. | `@claim:deployment-config`; live `npm run check:live`; live headers and `/round-four-missing` = 404. |
| F-4-3 — CSV | CSV coverage now completes a strong and a missed attempt, then checks two accuracy/first-decision sets and the quoted aggregate misconception row. | `@claim:csv-export`; live browser suite 25/25; live report screenshot. |
| F-4-3 — Node build | Engines and README now match Vite’s supported range; the claim invokes Vite using pinned `node@20.19.0`. | `@claim:build-output`; clean-clone individual command passed. |
| F-4-3 — tracking scope | The privacy claim now names account, advertising, analytics, and third-party runtime requests; it inspects every public, dynamic, and 404 screen before moving on. | `@claim:no-tracking`; live browser suite 25/25; live `/about`, `/privacy`, and `/round-four-missing`. |
| F-4-4 — insights | The claim and visible report now cover first-decision change from attempt one to three; its test proves 3 attempts, +100% lift, and count 1. | `@claim:insights`; [live insights](../evidence/live/polish-4-insights.png); live `/insights/starter_studio_handoff?demo=1`. |
| F-4-4 — offline | The offline claim now proves both the sample and an authored normal drill reload and accept a choice offline. | `@claim:offline-reload`; live browser suite 25/25; live `/demo`. |
| F-4-4 — account/advertising | The exact README, About, and Privacy promise is now listed in `no-tracking` and tested across all routes and runtime source entries. | `@claim:no-tracking`; live `/privacy` and `/about`; zero third-party requests in the live suite. |
| F-4-5 | Standardized drill creation on **Create**: “Create a drill”, “Create drill”, and “Create a drill in three steps.” Updated the copy audit and README terminology. | `.factory/copy-audit.md`; [live landing](../evidence/live/polish-4-landing/screenshot-mobile.png); live `/`. |

## Reviews 1–3, retained and reverified

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo remains a one-click, seeded, separate `demo:` IndexedDB/localStorage workspace with Reset and Start for real. | `@claim:demo-isolated`; [live demo](../evidence/live/polish-4-demo/screenshot-mobile.png); live `/?demo=1`. |
| F-1-2 | Claims manifest contains 17 observable, one-to-one tagged tests; each command passed separately from the clean clone. | `.factory/claims.json`; clean-clone 17/17 individual commands and aggregate 17/17. |
| F-1-3 | The unavailable checkout and all payment controls remain absent; the complete sample requires no payment. | `@claim:sample-access`; live `/demo`; all-link crawl. |
| F-1-4 | The first screen retains the job-first H1, named audience, single primary demo action, result note, and three facts above the fold. | Mobile/desktop browser checks; [live landing](../evidence/live/polish-4-landing/screenshot-mobile.png); live `/`. |
| F-1-5 | Product screens use History API URLs with direct loads, deep links, and a real host-level 404. | `@claim:real-routes`; live `/drills`, `/insights`, `/data`, and `/round-four-missing` = 404. |
| F-1-6 | Every route has a concise title, description, exact canonical, OG/Twitter image, favicon, and Apple icon; the query demo now canonicalizes correctly. | `@claim:real-routes`; cold [demo verify](../evidence/live/polish-4-demo/verify.json); live `/?demo=1`. |
| F-1-7 | In-app navigation plus full-document demo mode changes and Back focus the H1 and update the polite route announcement. | `@claim:real-routes`; live 25/25; live landing-to-demo transition. |
| F-1-8 | App, legal, and 404 routes retain the common wordmark, nav, safety footer, legal links, factory credit, and release 4 label. | Axe/shared-shell route test; [live 404](../evidence/live/polish-4-404.png); live `/privacy` and `/terms`. |
| F-1-9 | Plain-language copy, result-naming controls, consistent terminology, and a complete copy audit are retained; creation is now consistently **Create**. | `.factory/copy-audit.md`; mobile browser suite; live landing screenshot. |
| F-1-10 | Static configuration retains one-hour revalidation for board art, immutable hashed assets, CSP, Permissions-Policy, COOP, referrer, and nosniff. | `@claim:deployment-config`; `npm run check:live`; live response headers. |
| F-2-1 | Privacy and Terms remain real SPA routes with click, Back, title, focus, announcement, and static cold-load support. | `@claim:real-routes`; live `/privacy` and `/terms`. |
| F-2-2 | Claim tests now prove their full outcomes, including two CSV attempts, first-decision lift, full metadata/link checks, and complete deployment configuration. | All 17 individual claim commands; live browser suite 25/25. |
| F-2-3 | Browser-only normal-data lifecycle and exact no-account/no-advertising/no-analytics/no-third-party assertion cover the retained privacy wording. | `@claim:normal-local-only`, `@claim:no-tracking`; live `/privacy`. |
| F-2-4 | Replay feedback, shuffle, local report, photo resize, CSV/JSON export, and confirmed import retain dedicated observed-outcome tests. | Corresponding 8 `@claim:` tests; [live insights](../evidence/live/polish-4-insights.png). |
| F-2-5 | Offline behavior is now proven for both the sample and authored browser-saved drills; the sample remains payment-free. | `@claim:offline-reload`, `@claim:sample-access`; live `/demo`. |
| F-2-6 | Sample content remains factual creative-project material; art source and prompt remain included and named. | `@claim:sample-content`, `@claim:artwork-provenance`; live `/about`. |
| F-2-7 | Static Privacy and Terms retain full social metadata, including Twitter image. | `@claim:real-routes`; live `/privacy`, `/terms`. |
| F-2-8 | The common shell is present on SPA, legal, and designed 404 pages with release 4 identity. | Axe/shared-shell test; [live 404](../evidence/live/polish-4-404.png). |
| F-2-9 | Creation toolbar uses “Create drill.” | Mobile test; live landing. |
| F-2-10 | Editor control uses “Edit drill.” | Shared-shell test; live landing. |
| F-2-11 | Destructive control uses “Delete drill” and its confirmation identifies the target. | `@claim:normal-local-only`; live browser suite. |
| F-2-12 | The sample is labelled “SAMPLE DRILL” and retains factual British-English copy. | `@claim:sample-content`; live demo. |
| F-2-13 | README demo guidance says what visitors can do and that their drills do not change. | `src/docs.test.ts`; `@claim:demo-isolated`; live `/?demo=1`. |
| F-2-14 | README says “the choices learners missed”; the improved report claim proves a non-zero count. | `@claim:insights`; live insights screenshot. |
| F-2-15 | README/engines align with Vite and a Node 20.19 build is executed in the claim. | `@claim:build-output`; clean-clone individual command. |
| F-2-16 | Primary action, outcome, and three facts remain in both required initial viewports. | `tests/mobile.spec.ts`; live landing screenshot. |
| F-2-17 | The README command that enumerates claim commands remains executable. | `src/docs.test.ts`; clean-clone command output listed all 17. |
| F-2-18 | Explicit rewrites plus response override preserve true unknown-route 404s. | `@claim:deployment-config`; live `/round-four-missing` = 404; [live 404](../evidence/live/polish-4-404.png). |
| F-3-1 | The sample-access test still asserts exactly three playable choices after one click. | `@claim:sample-access`; [live demo](../evidence/live/polish-4-demo/screenshot-mobile.png). |
| F-3-2 | Insights now exceeds the earlier requirement by proving a missed count and a three-attempt first-decision lift. | `@claim:insights`; live insights screenshot. |
| F-3-3 | Player controls remain “Show hint” and “Show next decision.” | `@claim:replay-feedback`; live demo. |

## Earlier independent-verification findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| Malformed import/storage corruption | Schema validation occurs before replacement and exposes a recovery path for corrupt saved records. | `src/model.test.ts`; `@claim:json-import`; clean-clone `npm run check`. |
| Asset caching | Hashed assets use immutable caching and board art revalidates hourly. | `@claim:deployment-config`; live header check. |
| Broken checkout | No checkout, license, or payment control is shipped. | `@claim:sample-access`; live link crawl. |
| Skip link route mutation | Skip moves focus to main without changing the active route. | Keyboard skip-link browser test; live suite 25/25. |
| Waiting worker update | The update control still posts `SKIP_WAITING` to the waiting registration; release 4 uses cache `v8`. | Service-worker browser test; `public/sw.js`. |
| Invalid-image false success | Image decode/size errors return before persistence; accepted images are resized locally. | `@claim:photo-local`; full browser suite. |
| Mobile targets/reflow | Touch targets, 390 px layout, 200% text reflow, and reduced motion remain checked. | `tests/mobile.spec.ts`; live browser suite 25/25. |
| Missing response hardening | CSP, Permissions-Policy, COOP, referrer, and nosniff are shipped and live. | `npm run check:live`; live HEAD response. |

## Final live evidence

- Cold landing and `/?demo=1` loads: no console errors, correct title/lang,
  one H1/main, no missing image alternatives, and no unnamed buttons.
- Full live browser/axe suite: 25/25 passed.
- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100;
  LCP 1.10 s, CLS 0, TBT 0. Report:
  [polish-4-lighthouse-retry.json](../evidence/live/polish-4-lighthouse-retry.json).
- No findings remain open.
