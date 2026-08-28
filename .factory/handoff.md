# Repair handoff — Skill Decision Drills

## Outcome

Work order `skill-decision-drills-repair-1` is complete. Both release blockers
reported for candidate `3b6ef9df774028cfca5f9d9f1623de4992f2b70c` in verifier
commit `b0d3edf6f8520144578465ac8e21e1deb47ffa2e` were reproduced, repaired,
covered by regression tests, and verified on the canonical production host.
The repair implementation is commit `ce5fd97` on `main`.

Production: <https://skill-decision-drills.sociobot.in>

## Repairs

### P1 — unsafe backup import and unrecoverable stored corruption

- Added recursive runtime validation for every required app-data field and
  type across drills, nodes, choices, attempts, and selections.
- Added identifier, duplicate-ID, start-node, branch-target, and attempt-owner
  integrity checks. Unsafe identifier characters are rejected before they can
  reach HTML attributes.
- Invalid JSON now gets a clear announced error. Structurally incomplete JSON
  is rejected before the replacement confirmation and before IndexedDB writes.
- The storage boundary validates again before its single read/write
  transaction clears and replaces either object store. A failed validation or
  transaction therefore leaves the previous database intact.
- Startup validates persisted records, including records written by the failed
  release. Corruption opens a dedicated recovery screen instead of crashing.
  Users can download the raw records, then explicitly confirm a reset that
  atomically restores the safe starter drill. Navigation cannot bypass this
  recovery state.

Exact regression coverage uses the verifier payload:

```json
{"drills":[{"id":"invalid","nodes":[]}],"attempts":[]}
```

The browser test proves that it produces no replacement confirmation, reports
the missing `title`, preserves the existing drill across reload, and leaves the
player usable. A second test writes that malformed record directly to
IndexedDB, then proves recovery-copy download, accessible recovery UI,
confirmed reset, and healthy persistence after another reload.

### P2 — 30-second caching on content-hashed assets

- Added the deployed Azure Static Web Apps policy in
  `public/staticwebapp.config.json`.
- `/assets/*` now receives `Cache-Control: public, max-age=31536000, immutable`.
- `/` remains fresh with `no-cache, must-revalidate`; `sw.js` uses `no-cache,
  no-store, must-revalidate`; the manifest has a one-hour revalidation policy.
- `.webmanifest` now serves as `application/manifest+json`.
- Added `X-Frame-Options: DENY` while preserving the existing nosniff and
  referrer policies.
- Advanced service-worker cache names from v2 to v3 so installed copies detect
  this release and use the existing in-app update path.
- Added an exact unit regression for the deployment response policy.

## Verification evidence — 2026-08-28 UTC

Run from `/work/repo`:

```bash
npm ci
npm run check
npm audit --omit=dev
```

- Clean install: 60 packages installed; audit found 0 vulnerabilities.
- Unit/policy tests: 5/5 passed in 2 files.
- Type check and production build: `tsc --noEmit && vite build` passed;
  `dist/index.html` is present. There is no separate lint script.
- Playwright 1.58.2: 9/9 Chromium tests passed across desktop and Pixel 5
  profiles, including authoring, persistence, full playback/reporting, legal
  pages, offline reload, malformed-import preservation, and legacy recovery.
- Package/consumer gate: not applicable to this static PWA; the deployable
  artifact itself was built and exercised through Vite preview and production.
- Desktop 1440px and mobile 390px: library, editor, player, insights, data,
  upgrade, about, privacy, and terms each had zero horizontal overflow, one
  `<h1>`, one `<main>`, correct language/title, no console/page errors, and no
  serious or critical axe violations.
- Keyboard: Tab reached a decision and Enter selected it. Computed focus was a
  3px `rgb(76, 114, 255)` outline with 3px offset.
- Reduced motion: transition/animation duration was 0.01ms and document scroll
  behavior was `auto`.
- Privacy: a clean normal flow made no request outside the product origin; no
  analytics, CDN scripts, or remote fonts are present. Product data remains in
  IndexedDB.
- Offline/update: a fresh production profile installed `/sw.js`, reloaded with
  Playwright offline mode enabled, showed the offline banner, and opened the
  starter player. The active cache version is v3; `skipWaiting`,
  `clients.claim`, and the waiting-worker update action remain wired.
- Bundle: initial JS 44,578 B raw / 14,790 B gzip; CSS 22,924 B raw / 5,566 B
  gzip; largest hero WebP 44,102 B.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.5 s, CLS 0, Total Blocking Time 0 ms.

## Production and identity evidence

Deployment used the work order's static command:

```bash
/opt/fleet/lib/deploy-static.sh skill-decision-drills /work/repo/dist
```

Azure deployment ID: `9c0714d8-26b1-429f-9d69-bd86eae7f1ff`.

- All 16 shipped non-source-map files (excluding the host-only config) matched
  local `dist/` byte-for-byte.
- Index SHA-256, local and live:
  `48474757c17c2134dee1e89f31296c5128a4961038e09c645aac3d5ed56e6bbd`.
- Service worker SHA-256, local and live:
  `26781b06b8d2602b5a58fbf4209286b7233e915eee8b42373fd455bc89b43b4a`.
- Live hashed JS `/assets/main-DVx0WJi9.js`: HTTP 200, 44,578 B,
  `Cache-Control: public, max-age=31536000, immutable`.
- Live `/`: `Cache-Control: no-cache, must-revalidate`.
- Live `/sw.js`: `Cache-Control: no-cache, no-store, must-revalidate`.
- Live manifest: `Content-Type: application/manifest+json`.
- Factory `verify-url.sh`: HTTP 200 in 565 ms, no errors, correct title/lang,
  one h1/main, zero missing alt text, and zero unlabeled buttons.
- The complete live malformed-import and legacy-recovery scenarios passed with
  no console/page errors; the live 390px recovery screen had no overflow and
  no serious/critical axe findings.

## Preserved scope and known gaps

The researched brief, original field-board visual system, generated asset and
provenance, local-first editor/player/reporting behavior, two-drill free tier,
Sociobot-only paid unlock, legal pages, privacy posture, PWA artifact class, and
static deployment class are unchanged.

No release-blocking gaps remain from the independent verification report. The
factory still needs to maintain the registered production paid product and
return URL outside this repository. V1 remains intentionally single-device,
aggregate-only, and non-certifying as documented in the README and product UI.
