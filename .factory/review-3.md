# Adversarial first-read review 3 — FAIL

Reviewed 2026-08-28 UTC against <https://skill-decision-drills.sociobot.in>, deployment matching repository commit `3db077c997665eb745ec3ec0abfcb082eccddc81`. This is a full first-read review, not a diff-only check. No product code was changed.

## Cold first screen

Fresh Chromium contexts at 390 × 844 and 1440 × 900 answered the three required questions before scrolling:

- **What does it do?** It lets people rehearse decisions from real situations.
- **For whom?** Coaches and self-learners.
- **What should I click first?** **Try it with sample data.**

The exact first-screen text was “Rehearse real decisions before you act.”, “For coaches and self-learners who need to practise choices from real situations.”, and “Try it with sample data”. Its adjacent outcome reads “Open a three-choice practice drill.” All three facts were visible at 390 px (their bottom edges were 653, 692, and 711 px in an 844 px viewport). There were no console or page errors.

The field-board artwork, block typography, paper palette, route tape, and hard offset shadows are distinct and fit the documented neo-brutalist decision-board direction. This is not a generic SaaS template.

## Findings

### F-3-1 — BLOCKING — The claimed three-choice demo outcome has no quantitative proof (reopens F-2-2 / F-2-4)

**Exact quote / location:** landing primary-action outcome and README: “Open a three-choice practice drill.” / “It opens a three-choice practice drill.”

**Evidence:** `.factory/claims.json` maps the demo path to `sample-access`. Its `@claim:sample-access` test opens the sample and asserts one named choice button exists, but never asserts that exactly three choices are visible. The sample currently has three choices on the live site, but the required claim test does not prove the number.

**Why this fails:** “three-choice” is a quantitative visitor promise. A future sample with one or two options would still pass the listed test while making the landing and README inaccurate.

**Concrete fix:** change the `sample-access` manifest claim to explicitly say that the sample opens a three-choice practice drill, list both copy locations, and add `expect(page.locator('.player-choice')).toHaveCount(3)` to its tagged clean-context test. Retain the current no-payment assertion.

### F-3-2 — BLOCKING — The insights claim never proves a missed-choice count (reopens F-2-2 / F-2-4)

**Exact quote / location:** `.factory/claims.json`: “Reports show attempts, accuracy, and missed-choice counts.” README: “See attempts and the choices learners missed.”

**Evidence:** `@claim:insights` completes the sample entirely with strong choices. It asserts one attempt, 100% accuracy, and the zero-state “No tagged misconceptions recorded.” It never selects an incorrect tagged choice and never asserts a non-zero missed-choice label/count. The live report can show one, but the claim test does not exercise or prove it.

**Why this fails:** a zero-state is not proof that the promised count appears when a learner misses a choice. The claims contract requires the observable outcome, including the claimed number, not merely that the report route opens.

**Concrete fix:** extend the single `@claim:insights` test with a fresh sample attempt that selects a known incorrect, tagged choice. Assert the exact misconception label and its count (for example, `1`), alongside attempts and accuracy. Keep the current correct-path test only if it is needed within that same tagged test.

### F-3-3 — MINOR — Two player controls are not result-naming actions

**Exact quote / location:** `/demo` player: “Need a hint?” and “Continue to next decision”.

**Why this fails:** the supplied plain-words rule requires buttons to name the result and explicitly rejects generic “Continue”. A question does not name the action either. These labels make the next UI result less scannable for a first-time learner.

**Concrete fix:** use “Show hint” and “Show next decision”. Add an interaction test that locates these result-naming labels while preserving the existing hint and route-advance assertions.

## Complete copy audit

Counts treat hyphenated terms and a URL as one word. All landing and README sentences are listed below. No sentence exceeds 22 words and no banned marketing adjective appears. The two quantitative gaps above are the only sentence-level claim flags; standalone player-button labels are F-3-3.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | Clear job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Clear audience and situation. |
| Open a three-choice practice drill. | 5 | F-3-1: number lacks test proof. |
| Your drills stay in this browser. | 6 | `normal-local-only`. |
| The sample works offline after your first visit. | 8 | `offline-reload`. |
| The sample opens without payment. | 6 | `sample-access`. |
| Read the situation. | 3 | Clear process label. |
| Choose an action. | 3 | Clear process label. |
| See what follows. | 3 | Clear process label. |
| Replay it. | 2 | Clear process label. |
| This sample starts with an unfinished creative project. | 9 | `sample-content`. |
| Practise asking what done means before you act. | 9 | Clear sample purpose. |
| Write the moment, not a trivia question. | 8 | Clear instruction. |
| Show what happens after each choice. | 6 | `replay-feedback`. |
| Replay with choices in a new order. | 7 | `shuffle`. |
| Practice is not proof. | 4 | Clear safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear safety boundary. |
| Original artwork generated for this app. | 6 | `artwork-provenance`. |

Landing headings “Your decision drills” and “Make a drill in three steps” make sense out of context. Landing actions “Try it with sample data”, “Build a drill”, “Create drill”, “Run drill”, “Edit drill”, “View results”, and “Delete drill” are result-naming verbs.

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Clear product summary. |
| Try the sample at <https://skill-decision-drills.sociobot.in/?demo=1>. | 5 | Clear demo instruction. |
| Nothing you do there changes your drills. | 7 | `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | F-3-1: number lacks test proof. |
| Create drills that save in this browser. | 7 | `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | `replay-feedback`. |
| Change choice order on replay. | 5 | `shuffle`. |
| See attempts and the choices learners missed. | 7 | F-3-2: missed count lacks test proof. |
| Export a JSON backup or CSV report. | 7 | `json-export`, `csv-export`. |
| Restore a JSON backup after confirmation. | 6 | `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | `photo-local`. |
| Use the sample offline after the first visit. | 8 | `offline-reload`. |
| Use Node.js 20 or newer. | 5 | `build-output`. |
| In a fresh copy of the repository, list each claim command with: | 12 | Clear developer instruction. |
| Run them all with `npm run test:claims`. | 5 | Clear developer instruction. |
| The build writes the site to `dist/index.html`. | 7 | `build-output`. |
| The app has no account, advertising code, analytics, or third-party runtime requests. | 12 | `no-tracking`. |
| Your drills stay in browser storage unless you export them. | 10 | `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Clear safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Clear safety boundary. |
| Read the privacy notice and terms. | 6 | Clear links. |
| Deploy `dist/` as an Azure Static Web App. | 8 | `deployment-config`. |
| The included configuration handles app routes, cache policy, security headers, and real 404 responses. | 14 | `deployment-config`. |
| See the design notes and original artwork source. | 8 | Clear repository links. |
| MIT. | 1 | License label. |
| See LICENSE. | 2 | Clear repository link. |

## Demo, sandbox, claims, and privacy checks

- The first-screen demo action reached `/demo` in one click. It immediately showed the realistic Studio handoff prompt with three choices, the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real.
- On the live site, selecting a choice showed the consequence; Reset restored the opening decision and announced “Demo reset. The sample drill is ready again.” The clean-clone isolation test additionally seeded normal data, changed/reset demo data, and verified normal IndexedDB bytes stayed unchanged.
- After service-worker readiness, a fresh live demo context reloaded with network offline, showed “Offline — browser-saved drills still work.”, and still accepted a sample choice. No external runtime requests or console/page errors occurred during the live demo flow.
- Clean clone used: `/tmp/sdd-review3-clean-S4sE22`, at the same commit as this worktree. `npm ci`, `npm test` (6/6), `npm run lint`, and `npm run build` passed. The production build emitted `dist/`.
- All 17 listed tagged claim tests passed against the clean production build: `demo-isolated`, `sample-access`, `offline-reload`, `normal-local-only`, `no-tracking`, `replay-feedback`, `shuffle`, `insights`, `photo-local`, `csv-export`, `json-export`, `json-import`, `real-routes`, `sample-content`, `artwork-provenance`, `build-output`, and `deployment-config`.
- Passing commands do not clear F-3-1 or F-3-2: those are test-completeness defects, not observed runtime failures.

## Structure, accessibility, and links

- Fresh live route sweep confirmed HTTP 200 for `/`, `/demo`, `/drills`, `/insights`, `/data`, `/about`, `/privacy`, and `/terms`; designed `/404` and an arbitrary missing route returned HTTP 404.
- Every checked application/legal route had one `<h1>`, one `<main>`, concise route title, description, canonical URL, OG/Twitter image metadata, favicon, and Apple touch icon. Privacy navigation and browser Back moved focus to the new H1 and updated the polite route announcement.
- Crawling all rendered internal links across public routes found working 200 targets (the `/404#main` skip link correctly retains its page's 404 status) and two explicit `mailto:` targets; no dead visitor link was found.
- Live mobile axe scans of landing, demo, editor, insights, data, about, Privacy, Terms, and 404 found zero violations, including zero serious or critical violations.
- Live headers include CSP, Permissions-Policy, COOP, nosniff, and referrer policy. The original non-fingerprinted artwork uses one-hour revalidation.

## Earlier findings and handoff verification

Every earlier report, polish report, and handoff was read. The live and source checks confirm F-1-1, F-1-3 through F-1-10, F-2-1, F-2-3, F-2-5 through F-2-18, and the prior verification defects are fixed: isolated demo storage, real URLs, full metadata, legal navigation/shared chrome, no checkout offer, first-screen facts, true 404 responses, headers, cache policy, skip link, service-worker update path, image errors, targets/reflow, and README command all behave as documented.

F-2-2 and F-2-4 are only partly closed. Their claim-test coverage is reopened by F-3-1 and F-3-2 above; the existing tests pass but omit the specified quantitative outcomes.

## Missed leverage

No additional feature finding. The brief's obvious useful actions are present: authoring, realistic replay, reporting, JSON backup/import, CSV export, and an offline demo. The brief does not imply an AI step, and adding one would not improve this local-first decision-rehearsal workflow. No runtime AI provider key or decorative AI feature was found.

## What would make this perfect

1. Add exact quantitative assertions for the three demo choices and a non-zero missed-choice count, then keep the copy and claims manifest aligned.
2. Replace the two generic player controls with “Show hint” and “Show next decision”.
3. Re-run the clean-clone claim suite and this whole first-read review. Only then can the verdict become PASS.

## Verdict

**FAIL.** There are two blocking claim-proof gaps and one minor plain-words issue. A PASS requires zero findings and no untested claim.
