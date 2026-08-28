# Independent verification 3 — FAIL

**Candidate:** `71847ee2ac8bd4e58690b66f35d385a434ed3847` (`main`)

**Production URL:** <https://skill-decision-drills.sociobot.in>

**Verified:** 2026-08-28 UTC from a clean checkout at the exact candidate.

## Verdict

**FAIL.** The candidate's repository-owned product, accessibility repairs,
offline/update behavior, privacy model, production build, and live deployment
all pass fresh verification. Acceptance remains blocked because the app sells a
$29 one-time unlock through a production checkout that does not exist in the
Sociobot billing catalog. The live checkout returns HTTP 404, so a user cannot
buy the advertised paid feature.

This is fresh evidence, not a carry-forward of the builder's deployment report.
It confirms the earlier deployment-only failure is still present.

## Release-blocking defect

### P1 — advertised production purchase is unavailable

The live upgrade view advertises **Lifetime authoring — $29 one-time purchase**
and links to:

```text
https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout
```

Fresh production checks found:

- `GET /api/v1/products` returned HTTP 200 in live mode, but its 34 product
  records did not contain `skill-decision-drills`.
- `GET /api/v1/products/skill-decision-drills/checkout` returned HTTP 404 with
  `{"error":"enabled factory product","status":404}`.
- `npm run check:live` failed at `Product catalog does not contain
  skill-decision-drills.`
- The adjacent invalid-license endpoint is healthy: HTTP 200,
  `{"valid":false,"reason":"invalid","expires_at":null}`, `Cache-Control:
  no-store`, and `Access-Control-Allow-Origin:
  https://skill-decision-drills.sociobot.in`. The failure is specific to
  product registration/checkout, not general API reachability.

This blocks the documented monetization path. Repository policy reserves
billing registration to the factory, so no billing state was changed during
verification.

## Clean checkout and repository gates

| Check | Fresh result |
| --- | --- |
| Checkout identity | Worktree clean; `HEAD`, `origin/main`, and remote `refs/heads/main` all resolved to `71847ee2ac8bd4e58690b66f35d385a434ed3847` |
| Install | `npm ci` passed: 140 packages installed, 0 vulnerabilities |
| Aggregate gate | `npm run check` passed |
| Unit/policy tests | 5/5 Vitest tests passed in 2 files |
| Lint | ESLint passed |
| Type check | `tsc --noEmit` passed, both directly and through the build |
| Exact production build | `npm run build` passed and produced `dist/` |
| Repository browser suite | 18/18 Playwright 1.58.2 Chromium tests passed across desktop and Pixel 5 projects |
| Dependency audit | Both `npm audit` and `npm audit --omit=dev` passed with 0 vulnerabilities |
| Live release gate | `npm run check:live` failed only at the missing billing catalog record |
| Library/CLI consumer check | Not applicable: this is a static PWA, not a package or CLI |
| Backend concurrency/persistence | Not applicable: there is no application backend; persistence is browser-local IndexedDB |

The browser suite includes a real waiting-service-worker replacement, local
state preservation, offline reload, corrupt-record recovery, malformed backup
rejection, image validation, cross-view axe scans, 200% text reflow, and the
repaired hash-router-safe skip link.

## Independent end-to-end product evidence

In addition to the repository tests, a separate production-browser journey
exercised the product without importing test helpers:

- Authored a named 10-node drill with coach note, text prompt, hint, debrief,
  two consequences, a misconception tag, strong-choice marker, and a branch to
  the next node. All ten nodes and fields survived reload in IndexedDB.
- Cleared the title and confirmed preview was blocked by **This drill is not
  ready yet** / **Add a drill title**; restoring the title recovered playback.
- Revealed a hint, selected a branch, saw its consequence and coach note,
  continued to the next decision, completed the route, and saw the saved local
  aggregate.
- Exported report CSV and confirmed the attempt summary/accuracy rows. Exported
  JSON and confirmed the ten-node drill and its attempt were present. A
  malformed JSON backup produced an actionable error without a replacement
  confirmation; importing the valid backup restored the library.
- Verified the free boundary: the starter plus one authored drill is useful;
  trying to create a third local record redirects to the clear one-time unlock
  screen and explains the two-drill limit.
- Uploaded a valid PNG padded to exactly `12,000,000` bytes; it resized,
  displayed, persisted, and survived reload. A `12,000,001` byte image was
  rejected with **Choose an image smaller than 12 MB**. A fake PNG was rejected
  with **That file is not a readable image**. Neither error was overwritten by
  false success.
- Replayed the live starter three times: attempt one used an incorrect first
  decision, attempts two and three used the strong first decision. Insights
  reported 3 attempts, latest accuracy 100%, first-decision lift `+100%`, and
  one **Acting before confirming the goal** misconception.
- The bundled scenario contains no hazardous procedural advice. The
  non-certification disclaimer is prominent in the app, player, README, terms,
  and footer.

## Accessibility, responsive behavior, and browser quality

- Independently scanned library, editor, player, insights, data, upgrade,
  about, privacy, and terms on both local production and the live site: zero
  serious/critical axe findings, one `<h1>`, one `<main>`, and no console or
  page errors.
- Desktop keyboard-only entry starts at the single skip link. Enter preserves
  the active player route and moves focus to main. The visible focus treatment
  computes to a 3 px cobalt outline with 3 px offset.
- At 390×844, all nine primary/legal routes had no horizontal overflow, both at
  default sizing and after 200% root text resizing. The home, results, privacy,
  terms, and about targets measured at least 44×44 CSS px.
- `prefers-reduced-motion: reduce` changes animation and transition durations
  to `0.00001s` and document scrolling to `auto`.
- The factory `verify-url.sh` passed live: HTTP 200 in 753 ms, correct title and
  `lang`, one h1/main, zero missing image alternatives, zero unnamed buttons,
  and zero browser errors.
- Visual inspection at 1440 px and 390 px confirmed the documented field-board
  identity, clear primary action, intentional mobile stacking, legible content,
  and no clipping.

## Privacy, outbound traffic, and license behavior

- Normal authoring, playback, reporting, navigation, and offline use made no
  request outside the app origin. There are no analytics, ads, remote scripts,
  CDN fonts, accounts, content uploads, WebSockets, or beacons.
- Drills, photos, and attempts are stored in IndexedDB. LocalStorage contains
  only initialization state and an optional license token/daily verdict.
- A fresh live `?license=qa-invalid-fresh-71847ee` test stored the token,
  removed it from the URL before display, made exactly one verify request,
  showed **License no longer active**, and made no second request after reload
  because the daily verdict was cached.
- `/privacy/` and `/terms/` are real static routes and accurately disclose
  local storage, export, licensing, merchant-of-record, refund, and safety
  boundaries.

## PWA, offline, update, and deployment identity

- Live registration controlled the page at scope `/`, with cache
  `sdd-shell-v4`. A fresh controlled profile reloaded offline, displayed the
  offline state, retained the starter library, and opened/used the player.
- Manifest validation passed: standalone display, versioned start URL, matching
  theme/background colors, actual 192×192 and 512×512 PNGs, and a maskable 512
  icon.
- The repository's real update regression installed the current worker, served
  a changed worker/cache version to create a genuine waiting worker, selected
  **Update now**, observed `controllerchange` and reload, and confirmed edited
  IndexedDB state survived.
- All 16 deployed non-source-map artifacts (excluding the host-only static
  configuration) matched the fresh `dist/` byte-for-byte. Representative
  SHA-256 values:
  - `index.html`: `b245223779e87fe72ef8f8b5d37940be2369e98225ae5799ea872795398c885f`
  - `sw.js`: `800282948b5483c455a8e7f4e39629c0c35c103a1ac2f3a9826e571e93300292`
  - `assets/main-BlxWV8GJ.js`: `dc5f24396ca25c1582020f668ad92798b125bcc0fca16d7c28c6f6014da9ce00`
  - `assets/main-BQivJHif.css`: `135ebb6486e0d66c0ccc2c7e039ad229f643dac4c440c2f7520f8e353f5c4ba2`

## Performance, caching, and response policy

- Initial JS: 45,086 B raw / 15.00 kB gzip (budget ≤200 KB).
- CSS: 23,444 B raw / 5.63 kB gzip (budget ≤50 KB).
- Mobile hero: 11,276 B; desktop hero: 44,102 B (budget ≤300 KB).
- Webfonts: 0 B.
- Lighthouse 12.8.2 mobile: Performance 95, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.91 s, LCP 1.09 s, CLS 0, TBT 264.5 ms. Lab Lighthouse
  had no INP sample; Chromium Event Timing observed a 56 ms player interaction.
- `/` and legal HTML use `no-cache, must-revalidate`; `/sw.js` uses `no-cache,
  no-store, must-revalidate`; the manifest uses one-hour revalidation; `/assets`
  uses one-year immutable caching.
- HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` are present.

## Non-blocking hardening observations

- **P3:** The host applies one-year immutable caching to the two generated hero
  files even though their filenames are not content-hashed. A future image
  replacement at the same URL can remain stale in browser HTTP cache despite a
  service-worker cache-version change. Content-hash those files or revalidate
  non-hashed assets in a future release.
- **P3:** No Content-Security-Policy, Permissions-Policy, or
  Cross-Origin-Opener-Policy header is present. Current runtime privacy and
  same-origin behavior passed, so this is defense-in-depth rather than a
  release blocker.

## Release recommendation

Do not accept this candidate as complete. Enable/register the production
`skill-decision-drills` $29 USD product with return URL
`https://skill-decision-drills.sociobot.in/`, then rerun `npm run check:live`
and confirm the checkout returns the expected hosted redirect. No repository
code repair is required for the current blocker.
