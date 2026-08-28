# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-28 UTC against
<https://skill-decision-drills.sociobot.in> in fresh Chromium contexts at
390 × 844 and 1440 × 900. Repository candidate:
`52ace9c296858a3843e695ebaf13fe2036589fc9`. This was a full review, not a
diff-only review.

## Cold first screen

Before scrolling, I could answer all three required questions at both sizes:

- **What does it do?** It lets someone rehearse decisions from real situations.
- **For whom?** Coaches and self-learners.
- **What should I click first?** **Try it with sample data.**

The exact text that supplied those answers was “Rehearse real decisions before
you act.”, “For coaches and self-learners who need to practise choices from
real situations.”, and “Try it with sample data”. The action and its adjacent
outcome, “Open a three-choice practice drill.”, were fully visible at 390 px.
At 1440 × 900 the action text was visible at the bottom of the viewport, though
the button's lower edge and part of the outcome text were clipped.

The live first screen had one H1 and one main landmark and produced no console
or page errors. Its paper decision-board artwork, hard rules, route tape, and
offset shadows are recognisably product-specific rather than a generic SaaS
template.

## Findings

### F-2-1 — BLOCKING — Privacy and Terms links become the 404 inside the app (repeat/partial regression of F-1-5)

**Exact location / evidence:** From the live landing page, clicking the footer
link “Privacy” changed the URL to `/privacy` but rendered H1 “That branch is
missing.” with title “Page not found — Skill Decision Drills”. “Terms” did the
same at `/terms`. Direct cold loads of both URLs returned their correct legal
pages, so the defect is specifically client-side navigation. In
`src/main.ts`, `route()` recognises `privacy` and `terms`, but `render()` has no
branch for either and falls through to `notFound()`.

**Why this fails:** Two required, visible links are dead in the normal visitor
journey. The real-route repair is only partial, and the supplied contract makes
broken routing blocking.

**Concrete fix:** Do not intercept links owned by the static legal pages, or
render those pages through the SPA. Add a browser test that clicks Privacy and
Terms from every SPA footer, asserts their legal H1/title, then uses Back and
checks focus and announcement.

### F-2-2 — BLOCKING — Four passing claim tests do not prove their listed claims (repeat/half-fix of F-1-2)

**Exact location / evidence:** All six commands in `.factory/claims.json`
passed from clean clone `/tmp/sdd-review2-H20DsV`, but four are incomplete:

| Claim | What its test actually asserts | Missing proof |
| --- | --- | --- |
| `demo-isolated` — “The sample demo is separate from real browser data.” | A fresh demo creates a `demo:` database/key and no normal database; Reset is pressed before any state changes. | Seed normal product data, change and reset the demo, then prove the normal database is unchanged. Also prove Reset clears a completed/changed demo. |
| `csv-export` — “The sample report exports as CSV.” | Filename and `metric,label,value` header only. | Parse the file and assert the completed sample's summary and one row per recorded attempt/result. |
| `json-export` — “Browser data exports as a JSON backup.” | Filename only. | Parse the download and assert the seeded drill and attempt fields are present and valid. |
| `real-routes` — “Each product screen has a real URL and concise title.” | Only Home → Insights → Back. | Cover every listed route and every nav/footer link. This would catch F-2-1. |

Independent manual testing confirmed demo isolation and Reset currently work,
but the claims contract requires repeatable tests that assert the full outcome.
The `real-routes` claim is currently false in the live click path.

**Concrete fix:** Extend the four exact tagged tests as described. Keep one
test per claim ID and make its assertions cover the whole sentence.

### F-2-3 — BLOCKING — Normal-data and privacy promises are unlisted claims (repeat/half-fix of F-1-2)

**Exact quotes / locations:**

- Landing and footer: “Your drills stay in this browser.” and “No tracking.”
- README: “Create drills that save in this browser.”, “Add a scenario photo
  that stays in this browser.”, “No account, ads, or tracking are used in the
  demo flow.”, and “Your drills stay in browser storage unless you export
  them.”
- `/data`: “Your drills, photos, and attempts stay in this browser.”
- `/privacy`: “No account, ads, or tracking.”; “The app stores drill text,
  uploaded scenario images, choice feedback, hints, notes, and completed
  attempt selections in browser storage.”; “The app sends no drill or attempt
  content to us.”; “The sample demo is also stored separately in your
  browser.”; “Scenario images are resized in your browser and stored locally.”;
  “JSON and CSV exports are created on your device.”; “Data remains until you
  delete drills, clear this site's browser storage, or import a replacement
  backup.”; “You can use the app without an account or personal information.”;
  and “Browser settings can remove all local data.”
- `/terms`: “Content is stored locally.”
- `/about`: “No accounts, ads, or tracking.”

The only related manifest entry, `local-only`, is scoped to completing the
sample demo and recording requests. It does not exercise normal authoring,
photo handling, attempts, import, deletion, or all routes. The broader live
and README statements therefore have no matching claim entry.

**Why this fails:** A visitor is invited to trust the product with authored
training material and images, but the declared test proves only the demo flow.

**Concrete fix:** Add a `normal-local-only` claim and test that authors a drill,
adds a fixture image, completes it, exports it, reloads it, deletes it, and
asserts both IndexedDB contents and allowed network origins throughout. Add a
separate no-tracking test across all routes, or narrow every statement to the
tested demo scope.

### F-2-4 — BLOCKING — Core feature promises remain unlisted claims (repeat/half-fix of F-1-2)

**Exact quotes / locations:** The landing says “Replay with choices in a new
order.” The README says “Skill Decision Drills helps coaches and self-learners
practise choices from real situations.”, “It opens a three-choice practice
drill.”, “Let learners choose, see feedback, and replay.”, “Change choice order
on replay.”, “See attempts and missed ideas.”, and “Add a scenario photo that
stays in this browser.” `/data` says “Import replaces the current data on this
device after confirmation.” `/privacy` says scenario images are resized locally
and that JSON/CSV exports are created on-device.

**Why this fails:** These are observable product behaviours with no claim IDs.
The full browser suite touching some of them does not satisfy the one-claim,
one-tag contract, and current tests no longer cover import or photo handling.

**Concrete fix:** Add tagged claims for replay/feedback, shuffle, insights,
photo resize/storage, and confirmed JSON import. Each test must assert the
result, not only the presence of its control. Remove or narrow any promise not
retained.

### F-2-5 — BLOCKING — Availability, offline, and accessibility claims exceed their tests (repeat/half-fix of F-1-2)

**Exact quotes / locations:**

- Landing: “Works offline after your first visit.” and “Free to try with sample
  data.”
- README: “Install the app and use the sample offline after the first visit.”
- Live offline banner: “Offline mode — everything on this device still works.”
- `/upgrade`: “This release includes full authoring, replay, reports, and
  exports at no cost.”
- `/data`: “This is always available, including on the free tier.”
- `/terms`: “Accessibility, safety messaging, and data export are available to
  everyone.”

`offline-reload` proves only that the sample reloads and can be used offline;
it does not prove installability or “everything”. No manifest entry proves the
free/no-cost or universal-access statements.

**Why this fails:** Scope is broader in the copy than in the testable contract.

**Concrete fix:** Change the landing to the exact tested claim, “The sample
drill works offline after your first visit.” Remove “everything”, “free tier”,
and install/accessibility statements, or add sandbox tests for each retained
outcome (including manifest installability and all user-facing controls).

### F-2-6 — BLOCKING — Safety and provenance statements are unlisted claims (repeat/half-fix of F-1-2)

**Exact quotes / locations:** “SAFE SAMPLE”; “A safe sample about receiving an
unfinished creative project.”; “Artwork made for this app.”; `/about` says
“Sample content avoids hazardous procedure advice.” and identifies a specific
image model and generation date; README links to the artwork source.

**Why this fails:** “Safe” is a substantive promise in a product that discusses
skills and qualified instruction. Provenance is also a factual promise. Neither
has a claim entry or repeatable repository check.

**Concrete fix:** Prefer factual copy: “Sample drill” and “This sample starts
with an unfinished creative project.” Add a fixture/content test that rejects
hazardous procedure content if the safety statement remains. Add a provenance
file-presence/metadata test or remove model/date assertions from visitor copy.

### F-2-7 — BLOCKING — Legal metadata is still incomplete (repeat/half-fix of F-1-6)

**Exact location / evidence:** `/privacy/` and `/terms/` have title,
description, canonical, OG title/description/image, Twitter card/title/
description, favicon, and Apple icon, but both omit
`<meta name="twitter:image">`. Every SPA route includes it. The social image is
a valid 1200 × 630 WebP.

**Why this fails:** The earlier all-routes metadata finding was only partly
fixed. The history rule makes a half-fixed earlier finding blocking again.

**Concrete fix:** Add the same product-specific Twitter image tag to both
static legal documents and test complete metadata on every route.

### F-2-8 — BLOCKING — Header/footer consistency is still partial (repeat/half-fix of F-1-8)

**Exact location / evidence:** SPA pages show the geometric brand mark and nav
order “Drills, Demo, Insights, Your data”; legal pages show “← Decision drills”
without the mark and order links “Demo, Drills, Insights, Your data”. The SPA
footer reports `build polish-1`; the legal footers report stale build
`3cb1107`. None of the headers includes the Privacy link required by the
site-structure contract.

**Why this fails:** The legal pages resemble the product, but the shared shell
is not actually consistent and exposes two build identities.

**Concrete fix:** Generate one shared header/footer for SPA and static pages,
with the same mark, order, Privacy link, product one-liner, and build ID. Add a
DOM snapshot assertion across all routes.

### F-2-9 — BLOCKING — “+ New drill” is not a result-naming verb (repeat/half-fix of F-1-9)

**Exact location:** Landing, beside “Your decision drills”.

**Why this fails:** “New” labels an object but does not say what the button
does.

**Concrete rewrite:** “Create drill”.

### F-2-10 — BLOCKING — “Edit” is not a result-naming action (repeat/half-fix of F-1-9)

**Exact location:** Landing sample-drill card.

**Why this fails:** The label omits what will be edited when heard out of
context.

**Concrete rewrite:** “Edit drill”.

### F-2-11 — BLOCKING — “Delete” is not a result-naming action (repeat/half-fix of F-1-9)

**Exact location:** Landing sample-drill card.

**Why this fails:** A destructive control must name its target.

**Concrete rewrite:** “Delete drill”.

### F-2-12 — BLOCKING — The sample copy makes an unproved safety claim and switches dialect (repeat/half-fix of F-1-9)

**Exact quote / location:** Landing card: “SAFE SAMPLE” and “A safe sample about
receiving an unfinished creative project. Practice clarifying before acting.”
The first screen and README otherwise use British “practise” as a verb.

**Why this fails:** “Safe” is vague and unproved, while “Practice” is an
inconsistent term/spelling in the same visitor journey.

**Concrete rewrite:** Label it “SAMPLE DRILL”. Use “This sample starts with an
unfinished creative project. Practise asking what done means before you act.”

### F-2-13 — BLOCKING — README uses verifier jargon in the visitor demo instruction (repeat/half-fix of F-1-9)

**Exact quote:** “Try the isolated sample at …”

**Why this fails:** “Isolated” describes implementation, not what a normal
visitor gets.

**Concrete rewrite:** “Try the sample at … Nothing you do there changes your
drills.”

### F-2-14 — BLOCKING — README uses the vague term “missed ideas” (repeat/half-fix of F-1-9)

**Exact quote:** “See attempts and missed ideas.”

**Why this fails:** A coach cannot tell whether an “idea” means a choice,
misconception tag, note, or decision.

**Concrete rewrite:** “See attempts and the choices learners missed.”

### F-2-15 — BLOCKING — README environment/build promises are absent from the claims manifest (repeat/half-fix of F-1-2)

**Exact quotes / locations:** “Use Node.js 20 or newer.” and “The build writes
the site to dist/.”

**Why this fails:** Both are observable compatibility/build promises. The build
statement passed in this review, but neither statement has a claims entry and
the Node version is not declared in `package.json` `engines`.

**Concrete fix:** Declare the supported Node range in `package.json`; add a
tagged clean-install/build claim that asserts the runtime version and
`dist/index.html`; or remove the unsupported version statement.

### F-2-16 — MAJOR — The required three first-screen facts sit below the viewport

**Exact location / evidence:** At 390 × 844, the viewport ended at the top of
“Build a drill”; none of “Your drills stay in this browser.”, “Works offline
after your first visit.”, or “Free to try with sample data.” was visible. At
1440 × 900, the primary button began at y=858 and extended below the viewport,
while the facts began below y=900.

**Why this fails:** The plain-words and site-structure contracts require the
three privacy/offline/price facts in the first screen. They currently require a
scroll at both target sizes.

**Concrete fix:** Reduce hero/header height and heading scale enough to show the
complete primary action, outcome, and three short facts within 390 × 844 and
1440 × 900. Add bounding-box assertions for all five elements.

### F-2-17 — MAJOR — The README's claim-list command fails as written

**Exact location / evidence:** Under “Run every listed claim test from a clean
checkout”, the documented Node command calls `fetch('file://' + ...)`. Running
it exactly with the documented Node 20+ environment failed on Node 22.23.2 with
`TypeError: fetch failed` and cause `not implemented... yet...`.

**Why this fails:** A maintainer following the verification instructions cannot
even list the required commands.

**Concrete fix:** Read the local file with `node:fs`, for example
`JSON.parse(readFileSync('.factory/claims.json', 'utf8'))`, and add a docs smoke
test that executes the README command.

### F-2-18 — MAJOR — Unknown routes return HTTP 200

**Exact location / evidence:** Fresh `HEAD` and browser navigation to
`/no-such-route` returned HTTP 200 while rendering “That branch is missing.”
`/404` also returns 200.

**Why this fails:** The design is useful, but the server does not expose a real
not-found response. Crawlers and link checkers cannot distinguish missing
paths from valid screens.

**Concrete fix:** Add a static designed 404 document and host response override
that returns it with status 404 for unmatched routes, while retaining explicit
SPA route rewrites for every real application URL. Test both status and design.

## Complete copy audit

Counts treat hyphenated compounds and URLs as one word. Navigation, headings,
labels, and buttons are included because visitors and screen-reader users
encounter them as standalone copy. No unit exceeds 22 words, and no banned
marketing word appears.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Decision drills | 2 | Clear wordmark. |
| Drills | 1 | Clear nav label. |
| Demo | 1 | Clear nav label. |
| Insights | 1 | Clear nav label. |
| Your data | 2 | Clear nav label. |
| Practice real decisions | 3 | Clear section label. |
| Rehearse real decisions before you act. | 6 | Clear job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Clear audience and situation. |
| Try it with sample data | 5 | Clear prescribed primary action. |
| Open a three-choice practice drill. | 5 | Clear immediate outcome. |
| Build a drill | 3 | Clear result-naming action. |
| Your drills stay in this browser. | 6 | Claim gap: F-2-3. |
| Works offline after your first visit. | 6 | Over-broad claim: F-2-5. |
| Free to try with sample data. | 6 | Unlisted claim: F-2-5. |
| Read the situation | 3 | Clear instruction. |
| Choose an action | 3 | Clear instruction. |
| See what follows | 3 | Clear instruction. |
| Replay it | 2 | Clear instruction. |
| Your board | 2 | Clear section label. |
| Your decision drills | 3 | Clear heading. |
| + New drill | 2 | Non-result action: F-2-9. |
| SAFE SAMPLE | 2 | Vague/unproved claim: F-2-6 and F-2-12. |
| 0 attempts · Ready to play | 5 | Clear state. |
| Studio handoff: find the missing context | 6 | Specific sample title. |
| A safe sample about receiving an unfinished creative project. | 9 | Vague/unproved claim: F-2-6 and F-2-12. |
| Practice clarifying before acting. | 4 | Inconsistent verb spelling: F-2-12. |
| Run drill | 2 | Clear result-naming action. |
| Edit | 1 | Missing object: F-2-10. |
| View results | 2 | Clear result-naming action. |
| Delete | 1 | Missing destructive target: F-2-11. |
| Coach loop | 2 | Understandable section label. |
| Make a drill in three steps | 6 | Clear heading. |
| Write | 1 | Clear in its numbered step. |
| Write the moment, not a trivia question. | 7 | Clear. |
| Show | 1 | Clear in its numbered step. |
| Show what happens after each choice. | 6 | Clear. |
| Replay | 1 | Clear in its numbered step. |
| Replay with choices in a new order. | 7 | Unlisted feature claim: F-2-4. |
| Practice is not proof. | 4 | Clear safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear safety boundary. |
| Privacy | 1 | Clear link, but broken in-app: F-2-1. |
| Terms | 1 | Clear link, but broken in-app: F-2-1. |
| About | 1 | Clear link. |
| Artwork made for this app. | 5 | Unlisted provenance claim: F-2-6. |
| No tracking. | 2 | Unlisted broad privacy claim: F-2-3. |
| Your drills stay in this browser. | 6 | Repeated claim gap: F-2-3. |
| Built by Param Factory · build polish-1 | 6 | Clear, but inconsistent with legal build ID: F-2-8. |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skill Decision Drills | 3 | Clear product name. |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Clear. |
| Try the isolated sample at https://skill-decision-drills.sociobot.in/?demo=1. | 6 | Jargon: F-2-13. |
| It opens a three-choice practice drill. | 6 | Clear. |
| What it does | 3 | Clear heading. |
| Create drills that save in this browser. | 7 | Unlisted feature/privacy claim: F-2-3/F-2-4. |
| Let learners choose, see feedback, and replay. | 7 | Unlisted feature claim: F-2-4. |
| Change choice order on replay. | 5 | Unlisted feature claim: F-2-4. |
| See attempts and missed ideas. | 5 | Vague and unlisted: F-2-4/F-2-14. |
| Export a JSON backup or CSV report. | 7 | Listed, but weakly tested: F-2-2. |
| Add a scenario photo that stays in this browser. | 9 | Unlisted feature/privacy claim: F-2-3/F-2-4. |
| Install the app and use the sample offline after the first visit. | 12 | Exceeds tested offline scope: F-2-5. |
| Run locally | 2 | Clear heading. |
| Use Node.js 20 or newer. | 5 | Unlisted compatibility claim: F-2-15. |
| Test and build | 3 | Clear heading. |
| Run every listed claim test from a clean checkout: | 9 | “Clean checkout” is developer terminology; command is broken: F-2-17. Rewrite “In a fresh copy of the repository, run each claim command.” |
| The build writes the site to dist/. | 7 | Verified but unlisted operational claim: F-2-15. |
| Privacy and safety | 3 | Clear heading. |
| No account, ads, or tracking are used in the demo flow. | 11 | Claim scope mismatch: F-2-3. |
| Your drills stay in browser storage unless you export them. | 10 | Unlisted normal-data claim: F-2-3. |
| Practice does not certify real-world competence. | 6 | Clear safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Clear safety instruction. |
| Read the privacy notice and terms. | 6 | Clear, but the app's equivalent links fail: F-2-1. |
| Design and license | 3 | Clear heading. |
| See the design notes and artwork source. | 7 | Clear repository instruction. |
| MIT. | 1 | Clear license statement. |
| See LICENSE. | 2 | Clear repository instruction. |

## Demo, sandbox, offline, and privacy evidence

- Landing → **Try it with sample data** opened `/demo` in one click and
  immediately showed a realistic three-choice studio handoff decision.
- The persistent banner contained the exact text “Demo — sample data, nothing
  is saved”, plus working **Reset demo** and **Start for real** controls.
- After making a choice, waiting for Reset to complete returned the first
  decision with no selected consequence and announced “Demo reset. The sample
  drill is ready again.”
- A normal `skill-decision-drills` database was initialized first. After demo
  interaction and Reset, its serialized 3,695 bytes were byte-for-byte
  unchanged. The demo used `demo:skill-decision-drills` and
  `demo:sdd_initialized`.
- The whole live demo interaction requested only
  `https://skill-decision-drills.sociobot.in`.
- After service-worker readiness, a live `/demo` reload worked with network
  disabled; the offline banner appeared and selecting the strong first choice
  displayed its consequence without errors.

The demo implementation therefore works in this manual run. F-2-2 concerns
the permanent automated proof required by the claims contract.

## Listed claim results from a clean clone

| ID | Exact command | Result |
| --- | --- | --- |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | PASS, 1 test; incomplete coverage in F-2-2. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 1 test. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS, 1 test. |
| `csv-export` | `npm run test:e2e -- --grep @claim:csv-export` | PASS, 1 test; incomplete coverage in F-2-2. |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS, 1 test; incomplete coverage in F-2-2. |
| `real-routes` | `npm run test:e2e -- --grep @claim:real-routes` | PASS, 1 test; listed claim falsified by F-2-1 and incomplete coverage in F-2-2. |

## Structure, accessibility, and links

- Route titles are concise and follow the required product/task pattern. Every
  inspected route has exactly one H1, one main, a description, canonical, OG
  image, favicon, and Apple icon. F-2-7 records the legal Twitter-image gap.
- `/404` and arbitrary missing paths render a designed field-board error with
  a route back. F-2-18 records the incorrect HTTP status.
- Direct deep links load. Home → Insights and browser Back update URL/title,
  focus the H1, and announce the route. F-2-1 records legal click failure.
- Every discovered same-origin `href` returned HTTP 200. This does not clear
  the client-side dead links in F-2-1.
- Live axe scans on 11 routes at 390 × 844 and 1440 × 900 found zero violations,
  zero horizontal overflow, one H1, and one main on every page.
- Reduced-motion and 200% reflow checks pass in the repository browser suite.
- Initial production JS is 45.33 kB raw / 14.82 kB gzip, below the stated
  budget. No third-party font or runtime script was observed.
- AI is not implied by the brief's author/replay job. Import and export already
  exist. Adding a model call or sync would add privacy and setup cost without
  filling an obvious missing step, so no missed-leverage finding is raised.

## Earlier finding verification

| Earlier finding | Fresh status |
| --- | --- |
| Verification P1: malformed backup corrupts storage | **Fixed in code.** `parseImport` performs full schema validation before `replaceAll`; malformed data cannot reach the replacement transaction. |
| Verification P2: hashed assets lack long-lived caching | **Fixed live and in code.** Hashed assets use one-year immutable caching. |
| Verification-2/3 checkout unavailable | **Fixed honestly.** Paid copy, gate, and checkout link were removed; `/upgrade` states that the current release costs nothing. |
| Verification-2 skip link breaks route | **Fixed live and in code.** It focuses `#main` without changing the active route. |
| Verification-2 update action targets the wrong worker | **Fixed in code.** The action reads `registration.waiting` and posts `SKIP_WAITING`; the service worker handles that message. No waiting production worker existed to trigger safely during this review. |
| Verification-2 image errors announce false success | **Fixed in code.** Image validation returns on error before `saveDrill`; size and decode checks remain. |
| Verification-2 mobile targets/reflow | **Fixed live.** Both viewport axe/overflow passes and the full mobile suite passed. |
| Verification-3 non-hashed artwork cache | **Fixed live.** Board art now revalidates after one hour. |
| Verification-3 CSP/Permissions-Policy/COOP absent | **Fixed live.** All three headers are present. |
| F-1-1 demo absent | **Fixed live and in code.** One-click, isolated, resettable demo verified. |
| F-1-2 claims absent | **Half-fixed; BLOCKING again.** Manifest/tests exist, but F-2-2 through F-2-6 remain. |
| F-1-3 dead purchase | **Fixed.** The unavailable offer was removed. |
| F-1-4 unclear first screen | **Fixed.** All three cold-read questions are answered above the fold. |
| F-1-5 hash routing | **Half-fixed; BLOCKING again.** Real URLs exist, but legal links break through the SPA (F-2-1). |
| F-1-6 metadata/titles | **Half-fixed; BLOCKING again.** Legal Twitter images remain absent (F-2-7). |
| F-1-7 route focus/announcement | **Fixed for tested SPA routes.** Live Insights navigation and Back focused/announced correctly. |
| F-1-8 common legal chrome | **Half-fixed; BLOCKING again.** Brand/nav/build differences remain (F-2-8). |
| F-1-9 copy | **Half-fixed; BLOCKING again.** First-screen copy is strong, but F-2-9 through F-2-14 remain. |
| F-1-10 caching/security headers | **Fixed live and in code.** |

## Quality-gate evidence

- Clean clone install: passed, 140 packages, 0 vulnerabilities.
- `npm test`: passed, 5/5.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: passed, 12/12 Chromium desktop/mobile tests.
- `npm run check:live`: passed; its direct-load checks do not exercise the
  in-app legal-link failure in F-2-1.
- Every exact claim command: passed individually, with coverage defects noted
  in F-2-2.
- The README's documented claim-list command: failed as recorded in F-2-17.

## What would make this perfect

Make Privacy and Terms work when clicked inside the SPA; make the claims suite
prove the full text of every retained promise; either list/test or remove every
remaining privacy, feature, cost, safety, and provenance claim; finish legal
metadata and truly shared chrome; replace the six flagged copy units; repair
the README command; fit the three facts above the fold; and return an actual
404 status for unknown paths. Then
repeat the cold, demo, claim, route, metadata, link, offline, and accessibility
checks from a clean context.

## Verdict

**FAIL.** Eighteen findings remain, including fifteen blocking findings. The
core demo is clear and works, but PASS requires zero findings and no untested
claim.
