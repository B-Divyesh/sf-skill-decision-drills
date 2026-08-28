# Independent verification 2 — FAIL

**Candidate:** `9c43e30aef0db1b521cbbeb487220ae0ffa44f87` (`main`)

**Production URL:** <https://skill-decision-drills.sociobot.in>

**Verified:** 2026-08-28 UTC from a clean checkout at the exact candidate.

## Verdict

**FAIL.** The core local-first authoring, playback, reporting, backup, corrupt-data
recovery, and offline flows work, and the live static artifacts match the
candidate build. The release still fails the acceptance contract because the
advertised purchase endpoint is unavailable, the keyboard skip link destroys
the current SPA route, and the in-app service-worker update action cannot
activate a waiting worker. Invalid image uploads also report false success, and
the mobile interface fails the supplied touch-target and 200% text-resize
requirements.

This result is based on fresh production evidence. It supersedes the PASS claim
in the prior repair handoff.

## Required gates

| Check | Fresh result |
| --- | --- |
| Clean checkout | Worktree was clean at `9c43e30aef0db1b521cbbeb487220ae0ffa44f87`; `origin/main` resolved to the same commit |
| Install | `npm ci` passed: 60 packages installed, 0 vulnerabilities |
| Repository aggregate gate | `npm run check` passed |
| Unit/policy tests | 5/5 Vitest tests passed in 2 files |
| Type check and exact build | `tsc --noEmit && vite build` passed; `dist/` produced |
| Repository browser suite | 9/9 Playwright 1.58.2 Chromium tests passed across desktop and Pixel 5 projects |
| Production dependency audit | `npm audit --omit=dev` passed with 0 vulnerabilities |
| Lint | No lint script or lint configuration exists; TypeScript checking is part of the production build |
| Package consumer test | Not applicable: this is a static PWA, not a public library or CLI |
| Backend checks | Not applicable: there is no application backend or server persistence layer |

## P1 defects — release blocking

### P1 — the advertised production checkout is unavailable

The live upgrade screen advertises a `$29` one-time purchase and links to the
required Sociobot endpoint:

```text
https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout
```

Fresh `HEAD` and `GET` requests both returned HTTP 404. The GET body was:

```json
{"error":"enabled factory product","status":404}
```

The invalid-license verify endpoint itself returned HTTP 200 with
`{"valid":false,"reason":"invalid","expires_at":null}`, so the API is
reachable and CORS is enabled for the product origin. The failure is specific
to acquiring the advertised product. A buyer therefore cannot purchase the
paid unlock. This remains a deployment/billing-registration blocker even
though it is outside the static bundle.

### P1 — “Skip to main content” replaces the current task with an error page

Reproduced on the live starter player with a clean profile and keyboard only:

1. Open `/#/play/starter_studio_handoff`.
2. Press Tab. The visible 3 px blue focus ring lands on “Skip to main content.”
3. Press Enter.

The URL changes to `#main`. The SPA router interprets `main` as an application
route and replaces the player with **“That branch is missing.”** Focus does not
move to `<main>`. The rendered page also contains two identical skip links: one
from `index.html` and another rendered inside `#app`.

Ordinary Tab navigation can reach and activate player choices, but the
prominent keyboard bypass mechanism actively removes the user from the task.
This fails the required keyboard-only and skip-link behavior.

### P1 — the update toast cannot activate its waiting service worker

Exercised end to end with the exact production build served locally. The test
first installed and controlled the page with the shipped v3 worker, then served
the same worker with only its cache version changed to create a genuine waiting
worker. Chromium showed the app's “A fresh app version is ready” toast.

After clicking **Update now**, the worker was still `waiting` in the
`installed` state 1.5 seconds later; no `controllerchange` or reload occurred.
The click handler sends `SKIP_WAITING` to
`navigator.serviceWorker.controller`, which is the old active worker, instead
of to `registration.waiting`. The advertised update path therefore cannot
apply an update while the installed app remains open.

## P2 defects

### P2 — invalid photo uploads announce false success

Reproduced on the live editor with both boundary and malformed inputs:

- a `12,000,001` byte PNG, exceeding the stated 12 MB limit;
- a small `.png` containing non-image text.

Neither file was stored or displayed, but both attempts ended with the live
status **“Saved on this device.”** The specific errors (“Choose an image smaller
than 12 MB” / “That file is not a readable image”) are immediately overwritten
by the unconditional save that follows the image-processing catch. Users get
no actionable recovery instruction and a misleading success announcement.
A valid PNG upload did resize, display, persist, and reload correctly.

### P2 — mobile touch targets and 200% text reflow miss the supplied baseline

At the required 390 px viewport, default-size layouts had no horizontal
overflow. A bounding-box audit found these standalone interactive targets below
44 px in one dimension:

| Control | Measured size |
| --- | --- |
| Mobile home/brand link | 33 × 44 px |
| “View results” | 116 × 25 px |
| Footer “Privacy” | 49 × 18 px |
| Footer “Terms” | 35 × 18 px |
| Footer “About” | 35 × 18 px |

With root text resized to 200% at 390 px, the library developed 122 px of
horizontal overflow. This fails the attached accessibility requirement for
44×44 targets and 200% text resizing without loss/reflow failure.

## End-to-end product evidence

- Authored a ten-node drill through the live UI with a title, coach note, text
  prompt, hint, consequence, misconception, debrief, correct-choice flag, local
  image, and branch target. It persisted across reload and remained ready to
  rehearse.
- Blank-title preview was blocked by a clear readiness screen; restoring the
  title recovered the player. The free two-drill limit redirected to the clear
  one-time-upgrade screen.
- Revealed a hint, followed an incorrect branch, saw its consequence and coach
  note, completed three attempts with stronger first decisions, and observed
  `+100%` first-decision lift plus the expected misconception aggregate.
- JSON backup and report CSV downloads worked. Malformed JSON and the former
  structurally incomplete verifier payload were rejected without confirmation
  or replacement; the saved drill remained usable.
- Fresh live persisted-corruption testing wrote the former malformed record
  directly to IndexedDB. The recovery screen opened without console/page
  errors, its JSON recovery copy downloaded, confirmed reset restored the safe
  starter, and the starter survived another reload. Axe found no
  serious/critical issue on that recovery screen.
- Deletion confirmation and the empty state passed in the repository suite.
- The bundled scenario is non-hazardous, and the safety/non-certification
  disclaimer is prominent in the app, player, terms, and README.

## Accessibility, viewport, privacy, and browser evidence

- Independently scanned library, editor, player, insights, data, upgrade,
  about, privacy, and terms at 1440 px and 390 px: zero serious or critical axe
  violations, one `<h1>`, one `<main>`, no missing image alt text, no default
  horizontal overflow, and no console/page errors.
- After bypassing the broken skip action, keyboard Tab reached a player choice
  and Enter selected it. Computed focus styling was a 3 px
  `rgb(76, 114, 255)` outline with 3 px offset.
- Under `prefers-reduced-motion: reduce`, document scrolling was `auto` and UI
  animation/transition durations computed to `0.00001s`.
- A clean normal session made no request outside
  `https://skill-decision-drills.sociobot.in`. There are no analytics, remote
  scripts, CDN fonts, accounts, or content uploads. Drills and attempts were in
  IndexedDB.
- Capturing `?license=qa-invalid-token` stripped the token from the URL and made
  exactly one deliberate request to the Sociobot verify endpoint. The invalid
  verdict was cached; reload made no second API request. No real token or
  purchase was used.
- Browser zoom is not disabled. The visual system is product-specific,
  single-mode light by documented design, uses system fonts, and records the
  generated illustration's provenance.

## PWA, deployment identity, response policy, and performance

- A fresh live profile installed `/sw.js`, became controlled, reloaded while
  Playwright network emulation was offline, displayed the offline banner, and
  opened the starter player. Cache `sdd-shell-v3` was present. The broken
  waiting-worker update action is documented separately above.
- All 16 shipped non-source-map artifacts, excluding the host-only static
  configuration, matched the fresh local `dist/` byte-for-byte. Key hashes:
  - `index.html`: `48474757c17c2134dee1e89f31296c5128a4961038e09c645aac3d5ed56e6bbd`
  - `sw.js`: `26781b06b8d2602b5a58fbf4209286b7233e915eee8b42373fd455bc89b43b4a`
  - JS: `beb6b87ed05b1184fe56eeccba83345467d77bfd76aa3516107f58da05ae5659`
- Factory `verify-url.sh` returned HTTP 200 in 777 ms with correct title/lang,
  one h1/main, zero missing alt text/unlabelled buttons, and zero console/page
  errors.
- Initial JS is 44,578 B raw / 14.86 kB gzip; CSS is 22,924 B raw / 5.56 kB
  gzip; largest hero WebP is 44,102 B. All static budgets pass. There are no
  downloaded webfonts.
- A clean Lighthouse 12.8.2 mobile run completed with Performance 95,
  Accessibility 100, Best Practices 100, SEO 100, LCP 1.10 s, CLS 0, and TBT
  249 ms. Lab Lighthouse did not report INP because no interaction sample was
  available.
- `/` returns `Cache-Control: no-cache, must-revalidate`; `/sw.js` returns
  `no-cache, no-store, must-revalidate`; the manifest returns
  `application/manifest+json` and one-hour revalidation; hashed JS, CSS, and
  images return `public, max-age=31536000, immutable`.
- HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` are present.
  No CSP, Permissions-Policy, or COOP header is present; this is recorded as a
  defense-in-depth observation, not an additional release blocker.

## Release recommendation

Do not accept or release this candidate as complete. Enable/register the
production checkout, repair the hash-router-safe skip behavior, target the
waiting service worker from the update action, preserve image validation errors,
and correct mobile target/reflow failures. Re-run these exact scenarios against
a new candidate and the canonical production URL.
