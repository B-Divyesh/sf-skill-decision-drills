# Adversarial first-read review 4 — FAIL

Reviewed 2026-08-28 UTC against
<https://skill-decision-drills.sociobot.in> in fresh Chromium contexts at
390 × 844 and 1440 × 900. Repository and clean-clone candidate:
`24e790503fe88b483cb029a38e7520c8612ef07a`. This was a full review, not a
diff-only check. No product code was changed.

## Cold first screen

Before scrolling, I could answer all three required questions at both sizes:

- **What does it do?** It lets someone rehearse decisions from real situations.
- **For whom?** Coaches and self-learners.
- **What should I click first?** **Try it with sample data.**

The exact text was “Rehearse real decisions before you act.”, “For coaches and
self-learners who need to practise choices from real situations.”, and “Try it
with sample data”. The adjacent result says “Open a three-choice practice
drill.”

At 390 × 844, the primary action ended at 625 px, its result at 619 px, and the
three facts at 653, 692, and 711 px. At 1440 × 900, those elements ended at
727, 730, 764, 788, and 813 px. All were visible before scrolling. Both cold
loads had one H1, one main landmark, and no console or page errors.

The paper board, route tape, block typography, warm stock palette, and hard
shadows are recognisably specific to this decision-rehearsal product. It does
not look like a generic SaaS template.

## Findings

### F-4-1 — BLOCKING — The primary demo route does not move focus or announce the new screen

**Exact location / evidence:** From `/`, activating “Try it with sample data”
loads `/demo` with `window.location.assign('/demo')`. After the demo H1 was
visible, `document.activeElement` was `BODY` and `#live-status` was empty.
Browser Back returned to `/` with the same result. “Start for real” uses the
same full-page pattern. Other in-app routes use `pushState`, focus the H1, and
announce it.

**Why this fails:** The most important first action is the exception to the
required route-focus behavior. Keyboard and screen-reader users are placed at
the document root instead of the newly opened drill. This reopens F-1-7 and
also shows that the `real-routes` claim is broader than its test.

**Concrete fix:** Preserve the storage-mode reload if needed, but mark the
pending transition and focus the rendered demo H1 after initialization. Put
“Demo drill” in the polite live region. Do the same for Start for real and
Back, then add those transitions to `@claim:real-routes`.

### F-4-2 — BLOCKING — The documented query demo identifies itself as the home page

**Exact location / evidence:** `/?demo=1` renders the demo, sets the title to
“Demo — Skill Decision Drills”, and shows the demo banner, but its canonical is
`https://skill-decision-drills.sociobot.in/`. `/demo` correctly uses `/demo`.
The README and `.factory/demo.md` explicitly publish `/?demo=1` as a demo entry
point.

**Why this fails:** One public URL presents demo content while declaring the
landing page as its canonical identity. Shared/indexed metadata does not match
the route the visitor is using. This reopens the incomplete-metadata finding
F-1-6.

**Concrete fix:** Normalize `/?demo=1` to `/demo` before rendering, or set its
canonical to `/demo`. Make `@claim:real-routes` assert the exact canonical for
both documented demo entry points, not only that it contains the origin.

### F-4-3 — BLOCKING — Five listed claim tests do not prove their full claim

All 17 listed commands pass, but these assertions remain narrower than their
manifest sentences. This reopens F-1-2, F-2-2, and F-2-15.

| Claim | Gap | Concrete fix |
| --- | --- | --- |
| `real-routes` — “Every product screen has a real URL, concise title, complete metadata, working links, route focus, and Back behavior.” | It direct-loads ten routes but clicks only Privacy and Terms. Canonicals are checked only against an origin regex. It misses both F-4-1 and F-4-2. | Crawl every rendered link, assert exact per-route canonicals, and exercise landing → demo → Back and Start for real focus/announcements. |
| `deployment-config` — “explicit app routes, security headers, safe caching, and real 404 responses” | The tagged test checks only two rewrite entries, two headers, CSP text, and the JSON 404 override. It asserts no cache policy. The separate Vitest cache check is not run by the listed Playwright command. | Move the complete route/header/cache assertions into the one tagged test and exercise live response status/headers where the claim says the deployment “uses” them. |
| `csv-export` — “one result set per attempt” | It creates exactly one attempt. An exporter that silently drops every attempt after the first would still pass. | Complete two attempts, including one tagged miss, and assert two accuracy/first-decision result sets plus the aggregate misconception row. |
| `build-output` — “Node 20+ builds” | It runs only on Node 22.23.2 and asserts `major >= 20`. The declared `engines.node` is `>=20`, while Vite 7.3.6 declares `^20.19.0 || >=22.12.0`; the test never exercises the lower supported boundary. | Align `engines` and README with Vite, then run the build in a pinned Node 20.19 environment as part of this claim. |
| `no-tracking` — “The product uses no analytics or third-party runtime requests.” | Its route loop omits edit, player, drill-specific insights, and 404. The DOM scan runs only after the final `/terms` navigation. | Inspect every route before moving on, include dynamic and 404 routes, and retain request interception for the whole journey. |

### F-4-4 — BLOCKING — Live claim-like sentences remain outside the manifest

This reopens the claim inventory findings F-1-2, F-2-3, F-2-4, and F-2-5.

| Exact quote / location | Why it is unlisted or under-scoped | Concrete fix |
| --- | --- | --- |
| `/insights`: “Spot recurring misconceptions and whether the first decision improves by attempt three.” | `insights` claims attempts, accuracy, and missed-choice counts. Its test creates one attempt and cannot prove change by attempt three. | Add first-decision improvement to the claim and test three ordered attempts with an exact expected change, or rewrite to “Review first-decision accuracy and recurring misconceptions.” |
| Offline banner on every route: “Offline — browser-saved drills still work.” | `offline-reload` promises and tests only the bundled sample. The banner makes the broader normal-data promise. | Author and reload a normal drill offline in the tagged test, or scope the banner to the sample. |
| README: “The app has no account, advertising code, analytics, or third-party runtime requests.” Privacy/About: “No account or advertising code.” | `no-tracking` names only analytics and third-party requests. “No account” and “no advertising code” are separate promises, and its current DOM check does not cover every route. | Expand the manifest sentence and per-route assertions to the exact retained promise, or remove the extra terms. |

### F-4-5 — BLOCKING — The same creation action uses three different verbs

**Exact location:** The landing page uses “Build a drill”, “Create drill”, and
“Make a drill in three steps” for the same authoring start. The README uses
“Create drills”.

**Why this fails:** The plain-words rule requires one term for one concept.
Switching among build, create, and make adds avoidable interpretation to the
main action. This means the earlier copy finding F-1-9 is not fully closed and
is therefore blocking under the round rules.

**Concrete rewrite:** Use “Create a drill”, “Create drill”, and “Create a drill
in three steps”. Keep “Create drills that save in this browser” in the README.

## Complete copy audit

Counts treat hyphenated terms, URLs, and code spans as one word. No landing or
README sentence exceeds 22 words, and none contains a banned marketing word.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | Clear job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Clear audience and situation. |
| Open a three-choice practice drill. | 5 | Covered by `sample-access`. |
| Your drills stay in this browser. | 6 | Covered by `normal-local-only`. |
| The sample works offline after your first visit. | 8 | Covered by the scoped `offline-reload` claim. |
| The sample opens without payment. | 6 | Covered by `sample-access`. |
| Read the situation. | 3 | Clear process instruction. |
| Choose an action. | 3 | Clear process instruction. |
| See what follows. | 3 | Clear process instruction. |
| Replay it. | 2 | Clear process instruction. |
| This sample starts with an unfinished creative project. | 9 | Covered by `sample-content`. |
| Practise asking what done means before you act. | 8 | Clear sample purpose. |
| Write the moment, not a trivia question. | 7 | Clear instruction. |
| Show what happens after each choice. | 6 | Covered by `replay-feedback`. |
| Replay with choices in a new order. | 7 | Covered by `shuffle`. |
| Practice is not proof. | 4 | Clear safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear safety boundary. |
| Original artwork generated for this app. | 6 | Covered by `artwork-provenance`. |

### Landing headings and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | H1 states the job. |
| Your decision drills | 3 | H2 makes sense out of context. |
| Studio handoff: find the missing context | 6 | H2 names the sample. |
| Make a drill in three steps | 6 | H2 is clear but uses the inconsistent verb in F-4-5. |
| Try it with sample data | 5 | Clear prescribed first action. |
| Build a drill | 3 | Result-naming, but inconsistent in F-4-5. |
| Create drill | 2 | Result-naming; use this verb consistently. |
| Run drill | 2 | Result-naming. |
| Edit drill | 2 | Result-naming. |
| View results | 2 | Result-naming. |
| Delete drill | 2 | Result-naming and names the destructive target. |

Navigation labels “Drills”, “Demo”, “Insights”, and “Privacy” are clear links.
Footer labels “Privacy”, “Terms”, “Your data”, and “About” are clear links.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Clear summary. |
| Try the sample at https://skill-decision-drills.sociobot.in/?demo=1. | 5 | Clear instruction; F-4-2 applies to its target. |
| Nothing you do there changes your drills. | 7 | Covered by `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | Covered by `sample-access`. |
| Create drills that save in this browser. | 7 | Covered by `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | Covered by `replay-feedback`. |
| Change choice order on replay. | 5 | Covered by `shuffle`. |
| See attempts and the choices learners missed. | 7 | Covered by `insights`. |
| Export a JSON backup or CSV report. | 7 | Covered by `json-export` and `csv-export`; F-4-3 records the CSV coverage gap. |
| Restore a JSON backup after confirmation. | 6 | Covered by `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | Covered by `photo-local`. |
| Use the sample offline after the first visit. | 8 | Covered by `offline-reload`. |
| Use Node.js 20 or newer. | 5 | F-4-3: declared/tested range is not aligned with Vite's supported range. |
| In a fresh copy of the repository, list each claim command with: | 12 | Clear developer instruction. |
| Run them all with `npm run test:claims`. | 5 | Clear developer instruction. |
| The build writes the site to `dist/index.html`. | 7 | Build output was observed; `build-output` has the runtime-range gap in F-4-3. |
| The app has no account, advertising code, analytics, or third-party runtime requests. | 12 | F-4-4: the manifest does not list the whole promise. |
| Your drills stay in browser storage unless you export them. | 10 | Covered by `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Clear safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Clear safety instruction. |
| Read the privacy notice and terms. | 6 | Both links resolve. |
| Deploy `dist/` as an Azure Static Web App. | 8 | Clear deployment instruction. |
| The included configuration handles app routes, cache policy, security headers, and real 404 responses. | 14 | F-4-3: the listed tagged test does not assert the full sentence. |
| See the design notes and original artwork source. | 8 | Links resolve. |
| MIT. | 1 | `LICENSE` exists. |
| See LICENSE. | 2 | Link resolves. |

README headings “What it does”, “Run locally”, “Test and build”, “Privacy and
safety”, “Deploy”, and “Design and license” make sense out of context.

## Demo, sandbox, offline, and privacy

- Landing → **Try it with sample data** opened `/demo` in one click and
  immediately showed a realistic creative-project handoff with exactly three
  choices.
- The persistent banner contained “Demo — sample data, nothing is saved”,
  **Reset demo**, and **Start for real**.
- A choice displayed its consequence. Reset restored the opening decision and
  removed the attempt. Start for real cleared the demo records and key.
- A normal drill was seeded first. After demo interaction, Reset, and Start for
  real, the normal `skill-decision-drills` IndexedDB content was byte-for-byte
  unchanged. Demo data used `demo:skill-decision-drills` and
  `demo:sdd_initialized`.
- A fresh live demo reloaded offline and still accepted a choice. The whole
  checked demo flow made no third-party request.
- The broader offline/account/advertising sentences still need the manifest
  repairs in F-4-4.

## Claims run from a clean clone

Clean clone: `/tmp/sdd-review4-clean-q9K4YU` at `24e7905`. `npm ci` completed
with zero reported vulnerabilities. Every exact command in
`.factory/claims.json` was run separately.

| Claim ID | Exact command result |
| --- | --- |
| `demo-isolated` | PASS — 1 test |
| `sample-access` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `normal-local-only` | PASS — 1 test |
| `no-tracking` | PASS — 1 test; incomplete scope in F-4-3 |
| `replay-feedback` | PASS — 1 test |
| `shuffle` | PASS — 1 test |
| `insights` | PASS — 1 test; does not cover the separate improvement sentence in F-4-4 |
| `photo-local` | PASS — 1 test |
| `csv-export` | PASS — 1 test; incomplete cardinality in F-4-3 |
| `json-export` | PASS — 1 test |
| `json-import` | PASS — 1 test |
| `real-routes` | PASS — 1 test; misses F-4-1 and F-4-2 |
| `sample-content` | PASS — 1 test |
| `artwork-provenance` | PASS — 1 test |
| `build-output` | PASS — 1 test; runtime-range gap in F-4-3 |
| `deployment-config` | PASS — 1 test; incomplete assertions in F-4-3 |

No listed command returned a failing exit code. Passing incomplete tests do not
clear the claims contract.

## Structure, accessibility, and link checks

- Direct loads of `/`, `/demo`, `/drills`, the sample editor/player,
  `/insights`, `/data`, `/about`, `/privacy`, and `/terms` returned 200.
  `/404` and `/definitely-missing-review-4` returned real 404 responses with
  the designed field-board page and a route back.
- All checked routes had one H1, one main, `lang="en"`, a concise route title,
  description, canonical, OG/Twitter image metadata, SVG favicon, and Apple
  icon. The `/?demo=1` canonical exception is F-4-2.
- The social image is a real 1200 × 630 product-art crop. Initial JS is 47,558
  bytes raw / 15.49 kB gzip; CSS is 24,428 bytes raw / 5.84 kB gzip. No webfont
  or third-party script loaded.
- A crawl of every rendered same-origin link across the public routes found no
  dead target. Two `mailto:` links were treated as explicit external actions.
- Header and footer links, wordmark, product one-liner, factory credit, and
  `release 3` identity are consistent across SPA, legal, and 404 pages.
- The live 25-test Playwright suite passed, including the axe integration on
  every route, 390 px targets, 200% reflow, reduced motion, skip link, and
  blocked-service-worker console checks. The independent factory verifier also
  passed `/` and `/?demo=1` with no console errors, one H1/main, and no missing
  image alternatives or unnamed buttons.
- Live response headers include CSP, Permissions-Policy, COOP, referrer policy,
  and nosniff. Non-fingerprinted board art revalidates after one hour; the
  fingerprinted JS is immutable for one year.

## Earlier finding verification

Every earlier review, polish record, verification report, and the prior handoff
was read. “Fixed” below means reconfirmed in the live site and source, not
copied from a prior status.

| Earlier finding | Fresh status |
| --- | --- |
| F-1-1 demo sandbox absent | **Fixed.** One-click sample, banner, reset, separate namespaces, and untouched normal data were re-tested live. |
| F-1-2 claims absent | **Reopened / BLOCKING.** The manifest exists, but F-4-3 and F-4-4 show incomplete and unlisted claims. |
| F-1-3 dead paid purchase | **Fixed.** No purchase offer, checkout link, or payment control remains. |
| F-1-4 unclear first screen | **Fixed.** All three cold-read questions and three facts fit both target viewports. |
| F-1-5 hash routing | **Fixed.** Real URLs and direct loads work. |
| F-1-6 metadata incomplete | **Reopened / BLOCKING.** The documented `/?demo=1` canonical is wrong (F-4-2). |
| F-1-7 route focus/announcement absent | **Reopened / BLOCKING.** The primary demo transition and Back do not focus or announce (F-4-1). |
| F-1-8 inconsistent legal shell | **Fixed.** Live shell elements and release identity match. |
| F-1-9 unclear/inconsistent copy | **Reopened / BLOCKING.** Creation uses build/create/make (F-4-5). |
| F-1-10 cache/security hardening | **Fixed in behavior.** Live cache and security headers match the intended policy; F-4-3 separately records the tagged-test gap. |
| F-2-1 broken in-app legal links | **Fixed.** Click, title, H1 focus, announcement, and Back passed. |
| F-2-2 incomplete claim tests | **Reopened / BLOCKING.** Five listed tests remain narrower than their manifest claims (F-4-3). |
| F-2-3 unlisted privacy claims | **Reopened / BLOCKING.** Account/advertising promises are absent from the manifest wording (F-4-4). |
| F-2-4 unlisted core features | **Reopened / BLOCKING.** Improvement by attempt three is not listed or tested (F-4-4). |
| F-2-5 over-broad offline/availability claims | **Reopened / BLOCKING.** The global offline banner exceeds the sample-only claim (F-4-4). |
| F-2-6 safety/provenance claims | **Fixed.** Sample copy is factual and source/prompt files exist. |
| F-2-7 legal metadata | **Fixed.** Both legal routes include complete OG/Twitter metadata. |
| F-2-8 shared shell | **Fixed.** The SPA, legal, and 404 shells match. |
| F-2-9 “+ New drill” | **Fixed.** The control says “Create drill”. |
| F-2-10 “Edit” | **Fixed.** The control says “Edit drill”. |
| F-2-11 “Delete” | **Fixed.** The control says “Delete drill” and confirmation names it. |
| F-2-12 unsafe/inconsistent sample copy | **Fixed.** “SAMPLE DRILL” and British verb usage remain. |
| F-2-13 README “isolated” jargon | **Fixed.** The demo instruction uses visitor language. |
| F-2-14 “missed ideas” | **Fixed.** README says “the choices learners missed”. |
| F-2-15 unlisted environment/build promises | **Reopened / BLOCKING.** The tagged test does not exercise the claimed Node lower bound (F-4-3). |
| F-2-16 facts below the fold | **Fixed.** Fresh bounding measurements pass at both sizes. |
| F-2-17 broken README command | **Fixed.** The `node:fs` command runs and its docs test passes. |
| F-2-18 false 200 not-found responses | **Fixed.** Both tested missing paths returned 404. |
| F-3-1 three-choice count unproved | **Fixed.** `sample-access` asserts exactly three `.player-choice` controls. |
| F-3-2 missed-choice count unproved | **Fixed.** `insights` proves the exact label, 67% accuracy, and count 1. |
| F-3-3 generic player actions | **Fixed.** Live controls say “Show hint” and “Show next decision”. |

Earlier independent-verification defects are also fixed in behavior: malformed
imports are rejected before replacement; hashed assets cache immutably; the
dead checkout was removed; the skip link preserves the route; the update action
targets `registration.waiting`; invalid images retain their errors; mobile
targets/reflow pass; board art revalidates; and response hardening is live.

## Missed leverage

No additional feature finding. The brief's expected authoring, branching
replay, hints, consequences, debrief, local reports, misconception counts,
JSON import/export, CSV export, and offline sample are present. A live CSV from
an incorrect sample attempt included the aggregate misconception row. An AI
step is not implied by this local rehearsal job and would add key/privacy setup
without removing an obvious user step. No decorative AI or provider key was
found.

## Verification summary

- Fresh-clone claim commands: 17/17 exited successfully.
- `npm test`: 6/6 passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- Live Playwright suite: 25/25 passed.
- `npm run check:live`: passed.
- Factory URL verifier: passed for `/` and `/?demo=1`.

These green commands do not override the observable routing defect or the
claim-contract gaps above.

## What would make this perfect

Fix and test focus/announcement across the primary demo, Back, and Start for
real transitions; canonicalize the query demo to `/demo`; make each tagged
claim test prove its entire sentence; list or narrow the three extra live
promises; and use “create” consistently for drill creation. Then rerun every
claim command from a clean clone and repeat the full live route, demo, offline,
copy, metadata, link, and accessibility review.

## Verdict

**FAIL.** Five blocking findings remain. PASS requires zero findings and no
untested claim.
