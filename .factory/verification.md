# Independent verification — FAIL

**Candidate:** `3b6ef9df774028cfca5f9d9f1623de4992f2b70c` (`main`)

**Production URL:** <https://skill-decision-drills.sociobot.in>

**Verified:** 2026-08-28, from a clean checkout at the candidate commit. The
live deployment was compared after the local production build: all 16 shipped,
non-source-map artifacts were byte-for-byte identical to `dist/`.

## Verdict

**FAIL.** The normal offline author/player/reporting flow is strong, but an
invalid backup can overwrite the local database and make the app unable to
open. This fails the product contract's required invalid-input and recovery
behaviour, and is especially material for a local-first tool whose data is the
user's only copy.

## Required gates run

| Check | Result |
| --- | --- |
| Clean install | `npm ci` passed; 58 packages installed; audit reported 0 vulnerabilities |
| Unit tests | `npm test` passed: 4/4 Vitest tests |
| Type check and exact production build | `npm run build` passed (`tsc --noEmit && vite build`); `dist/` produced |
| Repository E2E suite | `npm run test:e2e` passed: 7/7 Playwright Chromium tests |
| Additional axe scans | 0 serious/critical violations on library, editor, player, insights, data, upgrade, about, privacy, and terms |
| Desktop and 390 px mobile | No horizontal overflow across those nine screens; normal desktop player flow completed |
| Keyboard and focus | Tab reached a player decision; Enter selected it; computed focus was a 3 px `#4C72FF` outline with 3 px offset |
| Reduced motion | Media emulation changed transition duration to `0.01ms` and document scroll behaviour to `auto` |
| Offline PWA | Local and live: waited for service worker, reloaded under offline emulation, and reopened the library/player successfully with the offline banner |
| Live normal flow | Completed the three-decision starter route and reached its report; no console/page errors; only `https://skill-decision-drills.sociobot.in` was requested |
| Privacy | No analytics/runtime CDN/font requests observed; normal data remains in IndexedDB, and normal initial load made no request outside the product origin |
| Bundle budget | Initial JS 40,251 B raw / 13,510 B gzip; CSS 22,924 B raw / 5,560 B gzip; largest hero WebP 44,102 B. All are within the stated static budgets. |
| Lighthouse | A fresh local mobile run emitted a report with Performance 90, Accessibility 100, Best Practices 100, SEO 100, LCP 1.4 s and CLS 0. Chromium then crashed during Lighthouse finalization, so this is diagnostic rather than a fully clean Lighthouse completion. |

`npm audit --omit=dev` also passed with 0 vulnerabilities. There is no separate
lint script; the repository's TypeScript check is part of `npm run build`.

## Representative workflow evidence

- Created a drill, made its title blank, verified preview was blocked by the
  readiness screen, restored the title, and verified preview recovered.
- Completed the supplied safe, non-hazardous three-decision scenario and saved
  its attempt/report.
- Exported JSON successfully.
- Submitted malformed JSON (`{not json}`): it was rejected with an announced
  parse error and the existing data remained usable.
- Checked the starter editor/player, insight/data/upgrade/about views and the
  two static legal pages at desktop and 390 px.

## Defects

### P1 — accepted malformed backup corrupts local-first data and bricks the app

**Reproduced locally and in production.** On `#/data`, choose a JSON file whose
contents are syntactically valid but structurally incomplete:

```json
{"drills":[{"id":"invalid","nodes":[]}],"attempts":[]}
```

Accept the replacement confirmation, then reload. The importer accepts this
object, calls `replaceAll`, and persists it. Rendering then throws
`Cannot read properties of undefined (reading 'trim')`; after reload the only
screen is “Your drill board could not open,” with Reload unable to repair the
data. The same two page errors were captured on the live host.

The importer validates only `id` and `nodes`, not the required drill/node/choice
fields or their types. The replace operation therefore occurs before the app
knows the backup is safe to render. Reject invalid schema before replacing any
stores; ideally validate in a transaction and retain the prior data until the
replacement is known-good. Provide a usable recovery/reset route if an old or
corrupt record is encountered.

### P2 — deployed hashed assets are not immutable or long-lived

The exact live candidate returns the same response policy for `/`, `sw.js`,
the manifest, hashed JS/CSS, WebP assets, legal pages, and offline page:

```text
Cache-Control: public, must-revalidate, max-age=30
```

For example, `/assets/main-DO-Q6dpH.js` and
`/assets/main-DOITGDCb.css` are content-hashed but receive only a 30-second
TTL. This does not meet the supplied PWA performance contract's long-lived,
immutable caching for hashed assets. The service worker provides an offline
fallback, but it is not a replacement for correct HTTP caching on normal
loads. Fix this in the deployment/static-host policy: retain short/no-cache
for HTML and `sw.js`, and use a long immutable TTL for fingerprinted assets.

## Live deployment and response evidence

- `GET /` was HTTP 200, 908 B, with correct title and `lang`; `sw.js`,
  manifest, hashed JS/CSS, icon and image bytes matched the candidate build.
- The live index, service worker, manifest, legal pages, images, icons, CSS and
  JS matched all 16 non-map build artifacts byte-for-byte.
- Present policies: HSTS (10886400 seconds with subdomains/preload),
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options:
  nosniff`, and HTTP/2. No CSP, frame-ancestors/X-Frame-Options, or COOP policy
  was returned; recorded as a hardening observation, not the release blocker.
- The manifest is served as `application/octet-stream`; Chromium loaded the
  manifest and the service worker/offline path worked, but
  `application/manifest+json` is preferable.

## PWA update check

The shipped service worker has versioned cache names, `skipWaiting`,
`clients.claim`, and an in-app update toast wired to post `SKIP_WAITING` to a
waiting worker. Offline reload was exercised end-to-end. A real production
service-worker replacement could not be triggered without changing the
deployed worker, so that update transition is source-reviewed rather than
end-to-end exercised in this verification. This is not the FAIL reason.

## Handoff recommendation

Do not release this candidate as accepted. Repair P1, rerun the import
corruption/recovery scenario on a fresh profile, and configure immutable
caching at deployment before a new verification candidate is submitted.
