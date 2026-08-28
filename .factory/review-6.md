# Adversarial first-read review 6 — PASS

Reviewed 2026-08-28 UTC against
<https://skill-decision-drills.sociobot.in> from a fresh Chromium profile at
390 × 844 and 1440 × 900. Repository candidate: `9145e1d`. This is a full
review, not a diff-only check. No product source was changed.

## Verdict

**PASS.** No blocking, major, minor, unlisted-claim, or untested-claim finding
remains. The product is clear on first read, immediately tryable in an isolated
demo, and its visitor-facing assertions have executable evidence.

## Cold first screen

Before scrolling, at both target sizes, I understood the following.

| Question | First-read answer | Exact supporting text |
| --- | --- | --- |
| What does this do? | It helps people rehearse decisions from real situations before acting. | “Rehearse real decisions before you act.” |
| Who is it for? | Coaches and self-learners. | “For coaches and self-learners who need to practise choices from real situations.” |
| What should I click first? | Try the supplied example. | “Try it with sample data” → “Open a three-choice practice drill.” |

The primary action, its result, and all three short facts were visible without
scrolling at 390 px and desktop. Both cold loads had one H1, one main landmark,
and no console or page errors.

## Copy audit

Counts treat hyphenated words, URLs, and code commands as one word. The audit
includes visible labels, controls, headings, and the meaningful image
alternative because these are encountered independently by visitors and screen
reader users. No unit exceeds 22 words, uses a banned marketing adjective,
uses unexplained jargon, has inconsistent results terminology, or has a
non-result-naming action. Claim-like lines name their matching claim ID.

### Landing page

| Copy unit | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Clear action |
| Skill Decision Drills home | 4 | Clear label |
| Decision drills | 2 | Clear wordmark |
| Primary navigation | 2 | Clear label |
| Drills | 1 | Clear nav |
| Demo | 1 | Clear nav |
| Results | 1 | One visitor-facing name |
| Privacy | 1 | Clear nav |
| Legal and product information | 4 | Clear label |
| 01 Practice real decisions | 4 | Clear section label |
| Rehearse real decisions before you act. | 6 | Job headline |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Audience and situation |
| Try it with sample data | 5 | Primary action; `sample-access` |
| Open a three-choice practice drill. | 5 | `sample-access` |
| Your drills stay in this browser. | 6 | `normal-local-only` |
| The sample works offline after your first visit. | 8 | `offline-reload` |
| The sample opens without payment. | 5 | `sample-access` |
| Create a drill | 3 | Clear secondary action |
| Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop | 15 | Meaningful image alternative |
| Read the situation | 3 | Clear step |
| Choose an action | 3 | Clear step |
| See what follows | 3 | Clear step |
| Replay it | 2 | Clear step |
| Your board | 2 | Clear section label |
| Your decision drills | 3 | Clear heading |
| Create drill | 2 | Result-naming action |
| SAMPLE DRILL | 2 | Factual state label |
| 0 attempts · Ready to play | 5 | Clear state |
| Studio handoff: find the missing context | 6 | Specific sample heading |
| This sample starts with an unfinished creative project. Practise asking what done means before you act. | 16 | `sample-content` |
| Run drill | 2 | Result-naming action |
| Edit drill | 2 | Result-naming action |
| View results | 2 | Result-naming action |
| Delete drill | 2 | Result-naming action |
| Coach loop | 2 | Clear section label |
| Create a drill in three steps | 6 | Standalone heading |
| Write | 1 | Clear step |
| Write the moment, not a trivia question. | 7 | Clear instruction |
| Show | 1 | Clear step |
| Show what happens after each choice. | 6 | `replay-feedback` |
| Replay | 1 | Clear step |
| Replay with choices in a new order. | 7 | `shuffle` |
| Practice is not proof. | 4 | Clear safety boundary |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear safety boundary |
| Terms | 1 | Clear link |
| Your data | 2 | Clear link |
| About | 1 | Clear link |
| Original artwork generated for this app. | 6 | `artwork-provenance` |
| Built by Param Factory · release 5 | 6 | Clear build identity |

### README

| Copy unit | Words | Check |
| --- | ---: | --- |
| Skill Decision Drills | 3 | Product name |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Clear summary |
| Try the sample at https://skill-decision-drills.sociobot.in/?demo=1. | 5 | `sample-access`, `real-routes` |
| Nothing you do there changes your drills. | 7 | `demo-isolated` |
| It opens a three-choice practice drill. | 6 | `sample-access` |
| What it does | 3 | Clear heading |
| Create drills that save in this browser. | 7 | `normal-local-only` |
| Let learners choose, see feedback, and replay. | 7 | `replay-feedback` |
| Change choice order on replay. | 5 | `shuffle` |
| See whether learners improve their first choice by attempt three, and which choices they missed. | 15 | `insights` |
| Export a JSON backup or CSV results. | 7 | `json-export`, `csv-export` |
| Restore a JSON backup after confirmation. | 6 | `json-import` |
| Add a scenario photo that is resized and stored in this browser. | 12 | `photo-local` |
| Use the sample offline after the first visit. | 8 | `offline-reload` |
| Run locally | 2 | Clear heading |
| Use Node.js 20.19–20.x or Node.js 22.12 and newer. | 8 | `build-output` |
| Node 21 and Node 22.0–22.11 are unsupported. | 7 | Clear boundary |
| npm ci | 2 | Install command |
| npm run dev | 3 | Local-server command |
| Test and build | 3 | Clear heading |
| npm test | 2 | Test command |
| npm run lint | 3 | Lint command |
| npm run build | 3 | Build command |
| npm run test:e2e | 3 | Browser-test command |
| In a fresh copy of the repository, list each claim command with: | 12 | Clear maintainer instruction |
| node --input-type=module -e "import {readFileSync} from 'node:fs'; for (const claim of JSON.parse(readFileSync('.factory/claims.json', 'utf8'))) console.log(claim.test)" | 1 | Claim-list command |
| Run them all with `npm run test:claims`. | 5 | Clear instruction |
| The build writes the site to `dist/index.html`. | 7 | `build-output` |
| Privacy and safety | 3 | Clear heading |
| The app has no accounts, ads, analytics, or network requests to other companies. | 13 | `no-tracking` |
| Your drills stay in browser storage unless you export them. | 10 | `normal-local-only` |
| Practice does not certify real-world competence. | 6 | Clear safety boundary |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Clear safety instruction |
| Read the privacy notice and terms. | 6 | Clear link action |
| privacy notice | 2 | Clear link label |
| terms | 1 | Clear link label |
| Deploy | 1 | Clear heading |
| Deploy `dist/` as an Azure Static Web App. | 8 | Deployment instruction |
| The included configuration defines app routes, cache policy, security headers, and a real 404 override. | 15 | `deployment-config` |
| Design and license | 3 | Clear heading |
| See the design notes and original artwork source. | 8 | Clear link action |
| design notes | 2 | Clear link label |
| original artwork source | 3 | Clear link label |
| MIT. | 1 | License statement |
| See LICENSE. | 2 | Clear link action |
| LICENSE | 1 | Clear link label |

Terminology remains consistent: **Results** is the saved-outcome area,
**Export CSV results** is its download, **Create** names authoring, **sample
drill** names the bundled example, and **drills** names saved content.

## Demo and sandbox

The first landing action opened `/demo` in one click. Its first rendered screen
already showed the supplied Studio handoff decision, with three concrete
choices; it did not show a setup form or empty state. The persistent banner
said “Demo — sample data, nothing is saved” and supplied working **Reset demo**
and **Start for real** controls.

The clean-context isolation test seeded normal IndexedDB data, changed and
reset demo data, and verified byte-for-byte unchanged normal data. Demo uses
`demo:skill-decision-drills` and `demo:sdd_initialized`; normal use uses the
unprefixed names. Start for real clears the demo namespace. The offline claim
was exercised after service-worker readiness with network disabled; the demo
reloaded and accepted a choice. The privacy tests intercepted requests through
the exercised flows and found only the product origin.

## Claims and clean-clone evidence

Fresh clone: `/tmp/tmp.MYqVF1VboQ/repo` at `9145e1d`. `npm ci` succeeded.
Each exact listed command was run separately; all passed. The clone then passed
`npm test` (6 tests), `npm run lint`, and `npm run build`, which wrote `dist/`.

| Claim IDs with passing exact command | Result |
| --- | --- |
| `demo-isolated`, `sample-access`, `offline-reload`, `normal-local-only`, `no-tracking` | PASS |
| `replay-feedback`, `shuffle`, `insights`, `photo-local`, `csv-export`, `json-export`, `json-import` | PASS |
| `real-routes`, `sample-content`, `artwork-provenance`, `build-output`, `deployment-config` | PASS |

The live landing and README were cross-checked against the manifest. Every
visitor-reliant product assertion above has a corresponding claim. Safety
boundaries are warnings rather than unverifiable capability promises. No
unlisted claim remains.

## Structure, accessibility, and visual identity

- `PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run test:e2e`
  passed 27/27, including live axe serious/critical scans, 390 px targets,
  200% reflow, reduced motion, keyboard skip navigation, demo isolation,
  offline replay, route focus, and Back behavior.
- `npm run check:live` passed. Live routes have concise route-specific titles,
  descriptions, canonical URLs, OG/Twitter metadata, favicon, Apple touch icon,
  `lang=en`, one H1, and one main. `/?demo=1` normalizes to `/demo`.
- Direct deep links to product and legal routes worked. Rendered internal links
  were crawled by `real-routes`; no dead link was found. `/review-6-missing`
  returned HTTP 404 and the designed field-board 404 with a route back.
- Header, footer, skip link, Privacy/Terms links, safety one-liner, factory
  credit, and release identity are consistent on app, legal, and 404 pages.
- The warm-paper board, hard ink shadows, route tape, numbered markers,
  compressed display type, and original overhead board art match the recorded
  neo-brutalist field-decision-board direction. This is distinct from a generic
  SaaS template.

## Earlier-finding verification

Every prior review, polish record, verification report, and the previous
handoff was read. The following identifiers were reconfirmed against live
behavior and current code, not accepted from their prior “fixed” labels.

| Earlier finding | Fresh confirmation |
| --- | --- |
| F-1-1, F-1-2 | Isolated one-click demo and all 17 tagged claim outcomes pass. |
| F-1-3, F-1-4 | No payment path remains; cold first screen is clear at both sizes. |
| F-1-5, F-1-6, F-1-7 | History routes, metadata, 404, focus, announcements, and Back pass. |
| F-1-8, F-1-9, F-1-10 | Shared shell, complete plain-language audit, caching, and response hardening pass. |
| F-2-1 through F-2-8 | Legal routing, full claim scopes, privacy/core/offline/provenance coverage, metadata, and shell pass. |
| F-2-9 through F-2-18 | Result-naming controls, factual sample wording, README language/commands, first-screen fit, Node boundaries, and real 404 pass. |
| F-3-1 through F-3-3 | Exactly three sample choices, missed-choice reporting, and specific player actions pass. |
| F-4-1 through F-4-5 | Demo focus/canonical behavior, complete tagged test scopes, listed claims, and Create terminology pass. |
| F-5-1 through F-5-3 | Recovery uses factual “bundled starter drill” wording, both Node lower bounds build, and the complete audited copy is regression-tested. |
| Earlier verification defects | Invalid imports recover safely; caching, response hardening, skip behavior, waiting-worker handling, image validation, and mobile/reflow checks pass. |

## Missed leverage and AI check

The brief implies a local scenario editor/player with branching replay,
feedback, debrief, reporting, JSON backup/import, CSV export, and offline use.
All are present and exercised. An AI authoring step would require a key and
network use without removing an obvious required step, so it is not missing
leverage for this local-first tool. No decorative AI feature, provider key,
Azure endpoint, or runtime AI request is present.

## What would make this perfect

No additional product change is indicated by this round. Keep the existing
claim, copy-audit, and live browser checks in release verification so future
copy or route changes retain this standard.
