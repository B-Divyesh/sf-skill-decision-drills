# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-28 UTC against https://skill-decision-drills.sociobot.in in fresh Chromium contexts at 390 × 844 and 1440 × 900. This is a full review, not a diff-only review.

## Cold first screen

Before scrolling, I understood this as a tool for making and replaying decision-based practice exercises. I could not state who it is for from the screen: visible text says “Learners” but never says coaches or self-learners. I also could not tell which of the two equal actions to choose: “Build a drill” and “Try one now.” The headline, “Practice the choice. Not the fact.” is a slogan, not the job, user, and first action.

The live mobile and desktop pages rendered without console errors. The illustration and field-board visual identity are distinct and match the design thesis; this is not a generic SaaS template.

## Findings

### F-1-1 — BLOCKING — No one-click demo sandbox exists

**Location / evidence:** the landing action is “Try one now,” not “Try it with sample data.” Opening the required verifier entry point https://skill-decision-drills.sociobot.in/?demo=1 in a fresh 390 px context showed the ordinary library. It had no “Demo — sample data, nothing is saved” banner, no “Reset demo,” and no “Start for real.” It created localStorage key “sdd_initialized” and IndexedDB database “skill-decision-drills,” the normal storage namespace. Source confirms src/storage.ts always uses DB_NAME = “skill-decision-drills”; it has no demo namespace or mode. .factory/demo.md is absent.

**Why this fails:** the first useful action is not isolated from a visitor's real local data. A reviewer cannot enter a documented demo, reset it, or prove that a rehearsal never writes real storage. The starter drill is realistic and the one-click player does show it being used, but that does not turn normal storage into a demo sandbox.

**Concrete fix:** implement /demo or ?demo=1 with demo:-prefixed storage, a persistent exact banner, working Reset demo and Start for real actions, and a realistic starter drill already open in the player. Add .factory/demo.md and Playwright coverage proving demo writes never reach the normal database.

### F-1-2 — BLOCKING — The required claims contract and all claim tests are absent

**Location / evidence:** .factory/claims.json does not exist; repository search found no @claim tags, claims manifest, or demo implementation. Therefore there are zero listed claim commands to run from a clean clone, rather than a complete, testable claims inventory. npm test passed 5 tests and the local browser suite passed 18 tests, but neither supplies the required tagged claim tests.

**Unlisted claim-like copy:** every item below has no manifest entry and no claim test: “Stored only on this device.”; “Works offline.”; “A safe sample about receiving an unfinished creative project.”; “Shuffle options and compare first decisions.”; “No tracking”; “Local-first”; the README's local-first/PWA, editor, replay, shuffling, reporting, backup/import, image, PWA/offline, sample, free-tier, $29 unlock, local-storage, no-account/no-analytics/no-CDN, daily-license-check, service-worker, safety, and generated-asset assertions; and the legal pages' local-storage, no-cloud-sync, no-content-upload, checkout, and license-verification assertions.

**Why this fails:** a visitor is asked to rely on privacy, offline, storage, pricing, and product-behaviour promises with no declared sandbox proof. The offline observation below is not a substitute for a claim test, especially because it is not performed in a demo.

**Concrete fix:** add .factory/claims.json with one clean-context test command per retained claim. Tag observable Playwright tests with the exact IDs. Cover offline reload, same-origin-only demo use, separate demo storage, persistence, CSV/JSON exports, pricing/checkout, and each numeric limit. Remove any sentence that cannot be tested.

### F-1-3 — BLOCKING — The advertised paid purchase path is dead (earlier P1, still unfixed)

**Location / exact quote:** /#/upgrade says “Lifetime authoring — $29 one-time purchase” and offers “Buy full authoring.” Its target, https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout, returned HTTP 404 on this review with {"error":"enabled factory product","status":404}. npm run check:live also failed with “Product catalog does not contain skill-decision-drills.”

**Why this fails:** a visitor can reach a price and purchase button but cannot buy the advertised unlock.

**Concrete fix:** factory operations must enable/register the $29 USD product with return URL https://skill-decision-drills.sociobot.in/. Retain a live claim test that asserts the catalog record and a 303 hosted-checkout redirect.

### F-1-4 — BLOCKING — The first screen does not answer the cold-reader questions

**Location / exact quote:** the H1 is “Practice the choice. Not the fact.” The supporting copy is “Turn real moments into branching drills with consequences, hints, and debriefs. Learners replay the decisions; you see where judgment breaks down.” The two equal actions are “Build a drill” and “Try one now.”

**Why this fails:** this does not name the audience, uses unexplained terms (“branching drills,” “debriefs”), and offers two competing first actions. At 390 px the actions are below the initial visible headline/description area. The visitor cannot confidently answer what to click first.

**Concrete fix:** use one ≤9-word job headline, for example “Rehearse real decisions before you act.” Follow with “For coaches and self-learners who need to practise choices from real situations.” Make the single primary action “Try it with sample data,” with adjacent outcome text “Open a three-choice practice drill.” Keep “Build a drill” as the secondary action.

### F-1-5 — BLOCKING — Application navigation uses hash routes, not real URLs

**Location / evidence:** all product views use /#/library, /#/play/…, /#/insights, and so on. Source builds them with hash hrefs and parses window.location.hash. /demo is HTTP 200 but renders the regular library and has the landing title, not a Demo route. /not-a-route is HTTP 200 and becomes the generic SPA error only after JavaScript runs.

**Why this fails:** the supplied site-structure contract requires real URLs for real places and permits hash routing only for in-page anchors. These URLs are not independently describable, cannot have route-specific server metadata, and conflict with the skip-link anchor convention.

**Concrete fix:** use History API routes for /, /demo, /drills, /drills/:id/edit, /drills/:id/play, /insights, /data, /upgrade, and /about; preserve the navigation fallback; give /404 a designed response; and test direct load, reload, Back, title, announcement, and focus for each.

### F-1-6 — MAJOR — Metadata is incomplete and route titles are incorrect

**Location / evidence:** fresh route inspection found zero canonical links, zero Open Graph tags, and zero Twitter-card tags on /, /privacy/, /terms/, and every app view. There is no Apple touch icon declaration. The player title is 127 characters and reversed: “A teammate hands you a folder called FINAL-2 and says, ‘Can you finish this before lunch?’ What do you do first? — Skill Decision Drills.” Other app titles are similarly “what it does — Product,” instead of “Product — what it does”; /demo still has the landing title rather than “Demo — Skill Decision Drills.”

**Why this fails:** shared previews, bookmarking, and route context are incomplete or misleading. The dynamic player title is far beyond the ≤60 character requirement.

**Concrete fix:** add canonical, OG and Twitter title/description/image tags and an original 1200×630 image, plus an Apple touch icon. Set stable, concise route titles such as “Skill Decision Drills — Run a practice drill” and “Demo — Skill Decision Drills”; update them on every route transition.

### F-1-7 — MAJOR — Route changes do not move focus or announce the new page

**Location / evidence:** from /#/library, clicking “Insights” changed the URL and H1 to “Replay insights,” but document.activeElement was BODY and #live-status was empty. The hashchange handler calls render() but does not focus the new H1 or set a route announcement.

**Why this fails:** keyboard and screen-reader users lose their place after navigation. This is separate from the repaired skip link.

**Concrete fix:** after each user-initiated route transition, focus the new H1 (or main), put a concise route name in a polite live region, and test navigation and Back/Forward focus restoration.

### F-1-8 — MAJOR — Legal pages do not use the required common header/footer

**Location / evidence:** app routes have the Decision drills wordmark/nav and a footer with “Privacy Terms About.” /privacy/ and /terms/ instead have a different text-only header and footers “Terms About Open app” / “Privacy About Open app.” Neither footer contains the required product one-liner, “Built by Param Factory,” or version/build ID.

**Why this fails:** visitors lose orientation between product and legal pages; the required skeleton is not consistent.

**Concrete fix:** render one shared header/footer on every route, retaining a home wordmark, skip link, Privacy and Terms, the product one-liner, Built by Param Factory, and a build identifier.

### F-1-9 — MAJOR — Copy audit finds unclear terms, vague headings, and unlisted claims

The following is the complete visible landing-copy audit. Word counts treat hyphenated compounds as one word. “F-1-2” means the claim must be listed/tested; “F-1-4” means the first-read repair above applies.

| Copy unit | Words | Flag and concrete rewrite |
| --- | ---: | --- |
| Scenario rehearsal, built by you | 5 | Vague heading. Use “Practice real decisions.” |
| Practice the choice. | 3 | F-1-4: slogan, not job. Use the proposed job headline. |
| Not the fact. | 3 | Fragment without context. Remove; the job headline carries the contrast. |
| Turn real moments into branching drills with consequences, hints, and debriefs. | 11 | Jargon. Use “Turn a real situation into choices, feedback, and a short review.” |
| Learners replay the decisions; you see where judgment breaks down. | 10 | Audience is implicit; phrase is vague. Use “Learners practise each choice. Coaches see the choices they miss.” |
| Stored only on this device. | 5 | F-1-2 privacy claim. Retain only with a storage claim test. |
| Works offline. | 2 | F-1-2 offline claim. Retain only with a demo offline test. |
| Prompt / Choose / See consequence / Replay | 1 / 1 / 2 / 1 | Fragments. Use “Read the situation / Choose an action / See what follows / Replay it.” |
| Your decision drills | 3 | Clear; no rewrite. |
| SAFE SAMPLE | 2 | Misleading as a demo label. Use “Sample drill” only inside the actual Demo sandbox. |
| Studio handoff: find the missing context | 6 | Specific enough as a sample title; no rewrite. |
| A safe sample about receiving an unfinished creative project. | 9 | F-1-2 safety/content claim. Test it or use “Sample: an unfinished creative project.” |
| Practice clarifying before acting. | 4 | Clear; no rewrite. |
| From messy moment to useful replay | 6 | Abstract heading. Use “Make a drill in three steps.” |
| Write the moment, not a trivia question. | 8 | Clear; no rewrite. |
| Connect choices to visible consequences. | 5 | Use “Show what happens after each choice.” |
| Shuffle options and compare first decisions. | 7 | F-1-2 behavioural claim. Use “Replay with choices in a new order” once tested. |
| Practice is not proof. | 4 | Clear safety boundary; no rewrite. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear safety boundary; no rewrite. |
| Original generated board artwork · No tracking · Local-first | 7 | F-1-2 provenance/privacy claims; jargon. Use “Artwork made for this app. No tracking. Your drills stay in this browser.” after tests. |

The complete README copy audit follows. Bullets and headings are included as copy units because a reader encounters them as sentences/labels.

| README copy unit | Words | Flag and concrete rewrite |
| --- | ---: | --- |
| Skill Decision Drills is a local-first PWA for coaches and self-learners who need to rehearse choices inside realistic scenarios—not memorize isolated facts. | 23 | **>22**, jargon, F-1-2. Use “Skill Decision Drills helps coaches and self-learners practise choices from real situations.” |
| Authors build branching decision trees with prompts, optional photos, consequences, hint paths, misconception tags, and debrief notes. | 17 | Jargon/F-1-2. Use “Coaches add a situation, choices, feedback, hints, and notes.” |
| Learners can replay those routes with shuffled choices, while the coach sees first-decision improvement and aggregate misconceptions. | 17 | Jargon/F-1-2. Use “Learners replay a situation. Coaches see which first choices were missed.” |
| A complete visual drill editor with automatic IndexedDB persistence | 9 | Jargon/F-1-2. Use “Create drills that save in this browser.” |
| Branching learner mode with hints, consequences, debriefs, and replay | 8 | Jargon/F-1-2. Use “Let learners choose, see feedback, and replay.” |
| Choice shuffling on every replay to reduce position memorization | 9 | F-1-2. Use “Change choice order on replay.” |
| Local attempt history, first-decision lift, and misconception counts | 8 | Jargon/F-1-2. Use “See attempts, first-choice improvement, and missed ideas.” |
| Schema-validated JSON backup/import, corrupt-data recovery, and aggregate CSV report export | 10 | Jargon/F-1-2. Use “Export a backup or CSV report. Restore a valid backup.” |
| Optional local scenario photos, resized in the browser | 8 | F-1-2. Use “Add a scenario photo; it stays in this browser.” |
| Installable PWA shell and explicit first-session offline coverage | 8 | Jargon/F-1-2. Use “Install the app and use it offline after the first visit.” |
| A safe, non-hazardous “Studio handoff” starter drill | 8 | F-1-2. Use “A sample drill about an unfinished creative project.” |
| $29 one-time full-authoring unlock through the Sociobot billing API | 9 | F-1-2 and F-1-3. Use “$29 one-time authoring unlock” only after checkout works. |
| The free kit is intentionally useful: it includes two full drills, unlimited nodes, offline play, reporting, and all export/accessibility features. | 20 | Marketing adjective, jargon, F-1-2. Use “Free: two drills, unlimited choices, reports, exports, and accessibility tools.” |
| The paid license only removes the drill-count limit. | 8 | F-1-2. Use “Paid authoring removes the two-drill limit.” |
| Data is stored separately for each browser origin, so development data is not shared with the deployed site. | 18 | Jargon/F-1-2. Use “Your local test data does not appear on the live site.” |
| npm run build is the exact production build command. | 8 | F-1-2 operational claim. Use “Build the production files with npm run build.” |
| It writes the static site to dist/, with dist/index.html at the root. | 10 | F-1-2 operational claim. Use “The build writes the site to dist/.” |
| Playwright 1.58.2 is pinned and its tests cover authoring persistence, complete drill playback, insights, 390 px layout and text reflow, privacy/terms routes, accessibility, a real offline reload, and service-worker update activation. | 31 | **>22**, jargon, F-1-2. Split into short tested bullets. |
| npm run check:live confirms the canonical product identity, billing catalog record, hosted checkout redirect, CORS, and invalid-license response policy. | 19 | Jargon/F-1-2. Use “npm run check:live checks the product record and checkout link.” |
| The app uses Vite and framework-free TypeScript. | 7 | Developer detail; remove from product description. |
| IndexedDB stores drills and attempts; localStorage stores only initialization state and an optional license token/verdict. | 16 | Jargon/F-1-2. Use “Your drills and attempts stay in browser storage.” |
| There is no account, analytics, ad code, third-party font, or runtime CDN. | 12 | F-1-2 privacy claim. Use “No account, ads, or tracking.” after network tests. |
| The only external runtime request is a daily license check when a license exists. | 14 | F-1-2. Use “A paid license is checked once a day.” after interception test. |
| The service worker precaches the built shell (including Vite's hashed JS/CSS), uses cache-first local assets, and treats the license API as network-first. | 21 | Jargon/F-1-2. Move to developer docs or use a tested plain-language offline statement. |
| This is a rehearsal aid, not a certification or assessment of real-world competence. | 14 | Clear safety boundary; no rewrite. |
| Coaches remain responsible for their material and for qualified instruction where mistakes could affect health, safety, property, or rights. | 19 | Clear safety boundary; no rewrite. |
| The bundled sample contains no hazardous procedural advice. | 8 | F-1-2 safety-content claim. Test the sample fixture or use a factual content description. |
| The neo-brutalist field-board system and image provenance are documented in design.md. | 12 | Jargon/developer detail. Use “See the design notes and artwork source.” |
| Source and prompt metadata for the original hero illustration are retained in assets/src/. | 11 | F-1-2 provenance claim. Use “Artwork source files are in assets/src/.” after a file-presence test. |

Unflagged README labels are: “Skill Decision Drills” (3), “Live product” (2), “What v1 includes” (3), “Run locally” (2), “Requirements: Node.js 20 or newer and npm.” (8), “Vite prints the local URL.” (5), “Test and build” (3), “For a local production preview” (5), “Architecture and privacy” (3), “See privacy/index.html.” (3), “Safety and product boundary” (4), “Design and generated asset” (4), “License” (1), “MIT.” (1), and “See LICENSE.” (2).

### F-1-10 — MINOR — Earlier cache and response-hardening findings remain

**Location / evidence:** prior verification-3 recorded a P3 for generated hero files receiving immutable caching without content hashes. Fresh HEAD /assets/decision-board-1200.webp still returns cache-control: public, max-age=31536000, immutable; the filename is unchanged/non-hashed. The same earlier report recorded absent CSP, Permissions-Policy, and COOP. Fresh live headers still contain none of those three headers.

**Why this matters:** a replaced hero can remain stale for a year, and basic browser containment policy is absent.

**Concrete fix:** content-hash generated assets or revalidate non-hashed files; add a CSP compatible with the self-hosted PWA, a restrictive Permissions-Policy, and an appropriate COOP header.

## Demo, privacy, offline, and link checks

- Fresh ?demo=1 testing is documented in F-1-1. It fails storage isolation.
- After the first normal visit and service-worker readiness, network interception (context.setOffline(true)) allowed a reload and showed the starter library. This is useful evidence for the offline claim, but it is not a demo test and cannot clear F-1-1/F-1-2.
- Normal fresh loading requested only the product origin (HTML, JS, CSS, and hero image). This observation does not replace the missing privacy claim test.
- Crawled visible landing links. Internal legal and app links opened; the external Buy full authoring link is dead as recorded in F-1-3. /favicon.svg at the site root is 404, although the declared /icons/icon.svg favicon is available.

## Earlier-review/history verification

No earlier .factory/review-*.md or .factory/polish-*.md files exist. I read every available verification*.md and the prior handoff.

| Earlier finding | Fresh status |
| --- | --- |
| Verification P1: structurally invalid backup can brick the app | **Fixed.** Current replaceAll validates before replacing stores; malformed-backup and corrupt-record recovery browser tests pass. |
| Verification P2: hashed assets have short cache TTL | **Fixed.** Current hashed JS is one-year immutable. The non-hashed hero P3 remains as F-1-10. |
| Verification-2 P1: production checkout unavailable | **Unfixed.** Reproduced as F-1-3. |
| Verification-2 P1: skip link changes hash route | **Fixed.** Current 18-test suite's skip-link test passes. |
| Verification-2 P1: waiting worker cannot update | **Fixed.** Current genuine waiting-worker E2E test passes. |
| Verification-2 P2: image errors overwritten by success | **Fixed.** Current image-error E2E test passes. |
| Verification-2 P2: 390 px target/reflow failures | **Fixed.** Current mobile target/reflow E2E tests pass. |
| Verification-3 P3: non-hashed hero cache and absent CSP/Permissions-Policy/COOP | **Unfixed.** Reproduced as F-1-10. |

## Quality-gate evidence

- npm ci: passed; 140 packages, 0 vulnerabilities.
- npm test: passed; 5/5 tests.
- npm run build: passed; dist/ produced; initial JS is 45.09 kB raw.
- npm run test:e2e: passed; 18/18 Chromium desktop/mobile tests.
- npm run check:live: **failed** at the missing catalog record described in F-1-3.
- Fresh live 390 px and desktop sessions: no page or console errors. Existing local E2E tests cover axe serious/critical scans, target size, reflow, and reduced motion. The separate metadata/focus/demo defects above still fail the stated review contract.

## What would make this perfect

Provide a genuine, isolated sample drill at /demo; replace slogan/jargon with a single clear coach/self-learner first screen; make every retained promise a clean-context claim test; enable the advertised checkout; move app views to real routes with concise metadata and route focus; and finish the shared legal-site skeleton and response hardening.

## Verdict

**FAIL.** There are ten findings, including five blocking failures. No PASS is possible while the demo, claims contract, checkout, first-read clarity, and real-route requirements remain unmet.

