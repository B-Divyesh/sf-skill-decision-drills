# Adversarial first-read review 5 — FAIL

Reviewed 2026-08-28 UTC against
<https://skill-decision-drills.sociobot.in> in fresh Chromium contexts at
390 × 844 and 1440 × 900. Repository and clean-clone candidate:
`e77dd4105f7aa8e9f172b5a696ad466e450d7688`. This was a full review, not a
diff-only check. No product code was changed.

## Cold first screen

Before scrolling, I could answer all three required questions at both sizes:

- **What does it do?** It lets someone rehearse decisions from real situations.
- **For whom?** Coaches and self-learners.
- **What should I click first?** **Try it with sample data.**

The exact text was “Rehearse real decisions before you act.”, “For coaches and
self-learners who need to practise choices from real situations.”, and “Try it
with sample data”. The adjacent result says “Open a three-choice practice
drill.” The action, result, and three privacy/offline/price facts were visible
without scrolling at both sizes. Both cold loads had one H1, one main landmark,
and no console or page errors.

The paper decision board, route tape, block type, warm stock palette, numbered
markers, and hard shadows form a distinct product-specific identity. It does
not look like a generic SaaS template.

## Findings

### F-5-1 — BLOCKING — An unlisted “safe” sample claim remains in the recovery path (reopens F-1-2 and F-2-6)

**Exact quote / location:** the reachable corrupt-storage recovery screen says
“Download the unreadable records for safekeeping, then reset this device to
reopen the app with the safe starter drill.” After Reset, the live-region
message is “Local data reset. The safe starter drill is ready.” The strings are
in `src/main.ts:377` and `src/main.ts:557`.

**Evidence:** I inserted a malformed record into a fresh live browser database
and reloaded. The designed recovery screen displayed the first sentence above.
Repository search confirms both “safe starter drill” strings remain.
`.factory/claims.json` has no claim that defines or tests sample safety;
`sample-content` proves only that the sample is a creative-project handoff.

**Why this fails:** “Safe” is a substantive, undefined promise in a training
product. A user cannot tell whether it means structurally valid data or safe
training content. Earlier F-2-6 required safety wording to become factual, so
this incomplete removal is blocking under the history rule.

**Concrete fix:** use “the bundled starter drill” in the recovery paragraph and
“The starter drill is ready.” in the status message. Add a browser test for the
corrupt-storage screen and Reset result so this state remains factual.

### F-5-2 — BLOCKING — The README Node range is ambiguous and exceeds its claim test (reopens F-1-2, F-2-2, F-2-15, and F-4-3)

**Exact quote / location:** `README.md:21`: “Use Node.js 20.19 or newer, or
Node.js 22.12 or newer.”

**Evidence:** `package.json` declares `^20.19.0 || >=22.12.0`, which excludes
Node 21 and Node 22.0–22.11. In plain language, “20.19 or newer” appears to
include those excluded versions, and makes the second clause redundant. The
listed `build-output` claim says only “A pinned Node 20.19 build writes the
static site to dist/index.html.” Its tagged test runs the pinned 20.19.0 build;
it does not test the documented 22.12 lower boundary.

**Why this fails:** a maintainer can reasonably choose Node 21 or early Node 22
from the README and receive an unsupported-engine result. The quantitative
22.12 compatibility promise is absent from the manifest and untested.

**Concrete fix:** write “Use Node.js 20.19–20.x or Node.js 22.12 and newer.”
Expand `build-output` to name both supported boundaries and run the production
build with pinned Node 20.19.0 and 22.12.0.

### F-5-3 — BLOCKING — The required copy audit is incomplete and misses jargon/term drift (reopens F-1-9)

**Exact location / evidence:** `.factory/copy-audit.md` calls itself the round-4
copy audit but omits six README sentences: “In a fresh copy of the repository,
list each claim command with:”, “Run them all with `npm run test:claims`.”,
“Read the privacy notice and terms.”, “See the design notes and original
artwork source.”, “MIT.”, and “See LICENSE.” It also omits visible landing
labels such as “Your board” and “Coach loop”, the navigation, state text, and
image alternative. It counts “See attempts, first-decision change by attempt
three, and the choices learners missed.” as 11 words; it has 12 under the
audit's stated rules.

The incomplete audit also marks no copy issues, despite these live terms:

- README: “first-decision change” is analytics jargon. Rewrite: “See whether
  learners improve their first choice by attempt three, and which choices they
  missed.”
- README: “third-party runtime requests” is developer jargon in the privacy
  summary. Rewrite: “The app has no accounts, ads, analytics, or network
  requests to other companies.”
- Landing/navigation/README: “Insights”, “View results”, and “CSV report” name
  the same result area three ways. Use “Results” for the nav, page heading, and
  button, and “Export CSV results” for the download.

**Why this fails:** the repository's claimed proof of plain wording is not a
complete inventory, and it allowed jargon and inconsistent names through.
Because F-1-9 and the polish reports explicitly claimed a complete audit and
consistent terminology, this is blocking under the cumulative-history rule.

**Concrete fix:** regenerate `.factory/copy-audit.md` from the rendered cold
landing and current README, include every sentence, heading, label, action, and
meaningful alt text, correct the counts, and apply the rewrites above. Add a
small source test that compares the audited copy units with the rendered
landing and README so omissions cannot silently recur.

## Complete copy audit

Counts treat hyphenated terms, URLs, and code spans as one word. No sentence
exceeds 22 words and no banned marketing adjective appears. The flags below
are still findings even though the length cap passes.

### Landing-page sentences and meaningful image text

| Sentence or image alternative | Words | Result |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | Clear job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Clear audience and situation. |
| Open a three-choice practice drill. | 5 | Covered by `sample-access`. |
| Your drills stay in this browser. | 6 | Covered by `normal-local-only`. |
| The sample works offline after your first visit. | 8 | Covered by `offline-reload`. |
| The sample opens without payment. | 6 | Covered by `sample-access`. |
| This sample starts with an unfinished creative project. | 9 | Covered by `sample-content`. |
| Practise asking what done means before you act. | 8 | Clear sample purpose. |
| Write the moment, not a trivia question. | 7 | Clear instruction. |
| Show what happens after each choice. | 6 | Covered by `replay-feedback`. |
| Replay with choices in a new order. | 7 | Covered by `shuffle`. |
| Practice is not proof. | 4 | Clear safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear boundary. |
| Original artwork generated for this app. | 6 | Repository provenance is covered by `artwork-provenance`. |
| Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop | 15 | Clear meaningful image alternative. |

### Landing headings, labels, navigation, and actions

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Clear keyboard action. |
| Decision drills | 2 | Clear wordmark. |
| Drills | 1 | Clear navigation label. |
| Demo | 1 | Clear navigation label. |
| Insights | 1 | F-5-3: inconsistent with “results” and “report”. |
| Privacy | 1 | Clear navigation label. |
| 01 Practice real decisions | 4 | Clear section label. |
| Rehearse real decisions before you act. | 6 | H1 states the job. |
| Try it with sample data | 5 | Clear primary action. |
| Create a drill | 3 | Clear secondary action. |
| Read the situation | 3 | Clear process label. |
| Choose an action | 3 | Clear process label. |
| See what follows | 3 | Clear process label. |
| Replay it | 2 | Clear process label. |
| Your board | 2 | Understandable beside the specific H2. |
| Your decision drills | 3 | H2 names the saved items. |
| Create drill | 2 | Result-naming action. |
| SAMPLE DRILL | 2 | Factual state label. |
| 0 ATTEMPTS · READY TO PLAY | 5 | Clear state text. |
| Studio handoff: find the missing context | 6 | H2 names the sample. |
| Run drill | 2 | Result-naming action. |
| Edit drill | 2 | Result-naming action. |
| View results | 2 | F-5-3: clear alone, but inconsistent with “Insights” and “report”. |
| Delete drill | 2 | Result-naming destructive action. |
| Coach loop | 2 | Understandable beside the specific H2. |
| Create a drill in three steps | 6 | H2 makes sense out of context. |
| Write | 1 | Clear inside its numbered step. |
| Show | 1 | Clear inside its numbered step. |
| Replay | 1 | Clear inside its numbered step. |
| Terms | 1 | Clear footer link. |
| Your data | 2 | Clear footer link. |
| About | 1 | Clear footer link. |
| Built by Param Factory · release 4 | 6 | Clear release identity. |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Clear summary. |
| Try the sample at https://skill-decision-drills.sociobot.in/?demo=1. | 5 | Clear demo instruction; `real-routes` normalizes it to `/demo`. |
| Nothing you do there changes your drills. | 7 | Covered by `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | Covered by `sample-access`. |
| Create drills that save in this browser. | 7 | Covered by `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | Covered by `replay-feedback`. |
| Change choice order on replay. | 5 | Covered by `shuffle`. |
| See attempts, first-decision change by attempt three, and the choices learners missed. | 12 | F-5-3: “first-decision change” is jargon. |
| Export a JSON backup or CSV report. | 7 | Covered by `json-export` and `csv-export`; F-5-3 term drift applies. |
| Restore a JSON backup after confirmation. | 6 | Covered by `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | Covered by `photo-local`. |
| Use the sample offline after the first visit. | 8 | Covered by `offline-reload`. |
| Use Node.js 20.19 or newer, or Node.js 22.12 or newer. | 10 | F-5-2: ambiguous and broader than its claim test. |
| In a fresh copy of the repository, list each claim command with: | 12 | Clear maintainer instruction. |
| Run them all with `npm run test:claims`. | 5 | Clear maintainer instruction. |
| The build writes the site to `dist/index.html`. | 7 | Covered by `build-output`. |
| The app has no account, advertising code, analytics, or third-party runtime requests. | 12 | F-5-3: “third-party runtime requests” is developer jargon. |
| Your drills stay in browser storage unless you export them. | 10 | Covered by `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Clear safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Clear safety instruction. |
| Read the privacy notice and terms. | 6 | Clear links. |
| Deploy `dist/` as an Azure Static Web App. | 8 | Clear deployment instruction. |
| The included configuration defines app routes, cache policy, security headers, and a real 404 override. | 14 | Technical but appropriate in the deployment section; covered by `deployment-config`. |
| See the design notes and original artwork source. | 8 | Clear repository links. |
| MIT. | 1 | Clear license statement. |
| See LICENSE. | 2 | Clear repository link. |

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| Skill Decision Drills | 3 | Product name. |
| What it does | 3 | Clear. |
| Run locally | 2 | Clear. |
| Test and build | 3 | Clear. |
| Privacy and safety | 3 | Clear. |
| Deploy | 1 | Clear. |
| Design and license | 3 | Clear. |

## Demo, sandbox, offline, and privacy

- The first landing action opened `/demo` in one click. Its first rendered
  screen already showed the Studio handoff decision and exactly three realistic
  choices.
- The persistent banner read “Demo — sample data, nothing is saved” and
  included working **Reset demo** and **Start for real** controls.
- Selecting the strong first choice displayed its consequence. Reset removed
  that consequence and restored the opening decision.
- A direct fresh `/demo` context created only
  `demo:skill-decision-drills` and `demo:sdd_initialized`; it did not create the
  normal database or key. The clean-clone isolation test separately seeded
  normal data, changed and reset the demo, and proved normal data stayed
  byte-for-byte unchanged. Start for real cleared the demo records and key.
- After service-worker readiness, the live demo reloaded offline and still
  accepted a choice. Request interception for the full checked flow recorded
  no third-party origin.

The demo requirement passes.

## Claims run from a clean clone

Fresh clone: `/tmp/sdd-review5-clean-5FZ8RK` at `e77dd410`. Every exact command
in `.factory/claims.json` was run separately.

| Claim ID | Exact command result |
| --- | --- |
| `demo-isolated` | PASS — 1 test |
| `sample-access` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `normal-local-only` | PASS — 1 test |
| `no-tracking` | PASS — 1 test |
| `replay-feedback` | PASS — 1 test |
| `shuffle` | PASS — 1 test |
| `insights` | PASS — 1 test |
| `photo-local` | PASS — 1 test |
| `csv-export` | PASS — 1 test |
| `json-export` | PASS — 1 test |
| `json-import` | PASS — 1 test |
| `real-routes` | PASS — 1 test |
| `sample-content` | PASS — 1 test |
| `artwork-provenance` | PASS — 1 test |
| `build-output` | PASS — 1 test; its manifest scope is incomplete in F-5-2. |
| `deployment-config` | PASS — 1 test |

No listed command failed. F-5-1 and F-5-2 remain because the claim inventory
does not cover those promises; a green listed suite cannot prove an omitted
claim.

## Structure, accessibility, and links

- Direct live loads of `/`, `/demo`, `/drills`, the sample editor/player,
  `/insights`, drill results, `/data`, `/about`, `/privacy`, and `/terms`
  returned 200. `/404` and `/review-5-missing` returned 404 with the designed
  field-board page and a route back.
- Every inspected route had `lang="en"`, one H1, one main, a concise route
  title, description, exact canonical, OG/Twitter image metadata, SVG favicon,
  Apple icon, and the common header/footer.
- The live rendered-link crawl found eleven same-origin targets and all
  returned 200. The two legal email links are explicit `mailto:` actions.
- Landing → Demo, Back, and Start for real moved focus to the new H1 and
  announced the route. `/?demo=1` normalized to `/demo` and its canonical.
- The full live Playwright suite passed 25/25, including axe checks on all
  screens, 390 px targets, 200% text reflow, reduced motion, keyboard skip
  navigation, and blocked-service-worker console handling.
- Live response headers include CSP, Permissions-Policy, COOP, referrer policy,
  nosniff, and safe cache rules. `robots.txt` names the sitemap, and the sitemap
  lists the public routes.
- The production build emits 48.31 kB JS raw / 15.73 kB gzip and 24.43 kB CSS
  raw / 5.84 kB gzip. No third-party font or runtime script loaded.

These structure and accessibility checks pass.

## Earlier finding verification

Every earlier review, polish report, and handoff was read. “Fixed” below means
reconfirmed against the live site and current source, not copied from the
polish status.

| Earlier finding | Fresh status |
| --- | --- |
| F-1-1 demo sandbox absent | **Fixed.** One-click seeded demo, banner, Reset, Start for real, separate namespace, and untouched normal data passed. |
| F-1-2 claims contract absent | **Reopened / BLOCKING.** The manifest exists and all entries pass, but F-5-1 and F-5-2 are unlisted/under-listed claims. |
| F-1-3 dead paid purchase | **Fixed.** No payment offer, checkout link, or payment control remains. |
| F-1-4 unclear first screen | **Fixed.** The job, audience, first action, result, and three facts fit both target viewports. |
| F-1-5 hash routing | **Fixed.** Real URLs, direct loads, Back, and a real 404 work. |
| F-1-6 incomplete metadata | **Fixed.** The complete metadata set and exact canonicals are present per route. |
| F-1-7 route focus/announcement | **Fixed.** Demo, Back, Start for real, and in-app routes focus and announce their H1. |
| F-1-8 inconsistent legal shell | **Fixed.** App, legal, and 404 routes share the wordmark, nav, footer, and release ID. |
| F-1-9 copy and terminology | **Reopened / BLOCKING.** F-5-3 shows an incomplete audit plus jargon and result-term drift. |
| F-1-10 cache/security hardening | **Fixed.** Live headers and cache controls match the configured policy. |
| F-2-1 broken in-app legal links | **Fixed.** Privacy and Terms work by click, direct load, and Back. |
| F-2-2 incomplete claim tests | **Reopened / BLOCKING.** The Node 22.12 boundary in F-5-2 remains outside the tagged claim. |
| F-2-3 unlisted privacy claims | **Fixed.** Normal data and no-tracking claims cover the current standard routes and lifecycle. |
| F-2-4 unlisted core features | **Fixed.** Replay, shuffle, insights, photos, import, and exports have outcome tests. |
| F-2-5 broad offline/availability claims | **Fixed.** The offline test covers the sample and an authored normal drill; payment controls are absent. |
| F-2-6 unlisted safety/provenance claims | **Reopened / BLOCKING.** “Safe starter drill” remains as F-5-1. Provenance files remain present. |
| F-2-7 incomplete legal metadata | **Fixed.** Privacy and Terms include complete OG/Twitter metadata. |
| F-2-8 inconsistent shell | **Fixed.** Shell and release identity match across route classes. |
| F-2-9 “+ New drill” | **Fixed.** The action says “Create drill”. |
| F-2-10 “Edit” | **Fixed.** The action says “Edit drill”. |
| F-2-11 “Delete” | **Fixed.** The action says “Delete drill” and confirmation names the drill. |
| F-2-12 unsafe/inconsistent landing sample copy | **Fixed on the landing page.** It says “SAMPLE DRILL” with factual British-English copy; the separate recovery regression is F-5-1. |
| F-2-13 README “isolated” jargon | **Fixed.** The demo instruction describes the user-visible outcome. |
| F-2-14 vague “missed ideas” | **Fixed.** README names the choices learners missed; F-5-3 separately flags the adjacent metric jargon. |
| F-2-15 environment/build promise | **Reopened / BLOCKING.** F-5-2 shows the untested 22.12 boundary and ambiguous range. |
| F-2-16 first-screen facts below fold | **Fixed.** All required items fit 390 × 844 and 1440 × 900. |
| F-2-17 broken README command | **Fixed.** The `node:fs` command runs and its docs test passes. |
| F-2-18 unknown routes return 200 | **Fixed.** Both designed and arbitrary missing paths returned 404. |
| F-3-1 three-choice count unproved | **Fixed.** `sample-access` asserts exactly three playable choices. |
| F-3-2 missed-choice count unproved | **Fixed.** `insights` proves three attempts, +100% change, and exact missed count 1. |
| F-3-3 generic player actions | **Fixed.** Controls say “Show hint” and “Show next decision”. |
| F-4-1 demo route focus/announcement | **Fixed.** Demo, Back, and Start for real focus and announce correctly. |
| F-4-2 query-demo canonical | **Fixed.** `/?demo=1` normalizes to canonical `/demo`. |
| F-4-3 five incomplete claim tests | **Reopened in part / BLOCKING.** Routes, deployment, CSV, and tracking now have complete checks; the build-range gap remains as F-5-2. |
| F-4-4 unlisted insights/offline/account claims | **Fixed.** The expanded claims and live tests cover those exact outcomes. |
| F-4-5 create/build/make term drift | **Fixed at the cited landing/README locations.** The creation action consistently uses “create”. |

The earlier independent verification defects also remain fixed: malformed
imports are rejected before replacement; hashed assets cache immutably;
non-fingerprinted art revalidates; the dead checkout is absent; the skip link
preserves the route; the update action targets the waiting worker; invalid
images retain errors; mobile targets/reflow pass; and response hardening is
live.

## Missed leverage

No additional feature finding. The brief's authoring, branching replay, hints,
consequences, debrief, local reports, misconception counts, JSON import/export,
CSV export, and offline use are present. A model-assisted step is not implied
by this local rehearsal job and would add key/privacy setup without removing an
obvious user task. No decorative AI or provider key was found.

## Verification summary

- Fresh clone `e77dd410`: `npm ci` passed with zero reported vulnerabilities.
- All 17 manifest commands passed individually.
- `npm test`: 6/6 passed; lint passed; production build passed and produced
  `dist/`.
- Full live Playwright/axe suite: 25/25 passed.
- Live route/metadata/header checker: passed.
- Independent live demo, offline, storage-namespace, request-interception,
  route, metadata, focus, link, robots, sitemap, and 404 checks completed.

## What would make this perfect

1. Remove the two “safe starter drill” promises and cover the recovery/reset
   wording with a browser test.
2. State the Node ranges unambiguously, list both boundaries in
   `build-output`, and test builds on pinned 20.19.0 and 22.12.0.
3. Regenerate the complete copy audit, replace the two jargon phrases, and use
   one term for the results screen and export.
4. Re-run all 17 claim commands and the full live review. PASS then requires
   zero remaining findings and no omitted claim.

## Verdict

**FAIL.** Three blocking findings remain. The core product and demo work, but
PASS is impossible while two promises are outside the tested claims contract
and the required copy audit remains incomplete.
