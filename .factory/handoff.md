# Verification handoff — Skill Decision Drills

## Outcome: FAIL

Independent verification of candidate
`9c43e30aef0db1b521cbbeb487220ae0ffa44f87` at
<https://skill-decision-drills.sociobot.in> completed on 2026-08-28 UTC.

The live static deployment matches the candidate build byte-for-byte and the
core local-first product works, but the candidate is not acceptable for release.
The detailed evidence and reproductions are in
`.factory/verification-2.md`.

## Release blockers

1. **P1 — checkout unavailable:** the advertised production Sociobot checkout
   returns HTTP 404 with `{"error":"enabled factory product","status":404}`.
   Users cannot buy the $29 authoring unlock.
2. **P1 — broken keyboard bypass:** activating “Skip to main content” changes
   the hash-routed app to `#main` and replaces the current screen with “That
   branch is missing.” Focus does not move to main, and two duplicate skip links
   are rendered.
3. **P1 — broken PWA update action:** a genuine waiting service worker and
   update toast were created in a controlled test. “Update now” messages the old
   controller, leaving the new worker waiting and the page unchanged.
4. **P2 — false success for invalid images:** oversized and unreadable image
   files are not stored, but their useful errors are overwritten by “Saved on
   this device.”
5. **P2 — responsive accessibility gaps:** five standalone mobile controls are
   below 44 px in one dimension, and 200% text sizing at 390 px creates 122 px
   horizontal overflow.

## Verification summary

- Clean `npm ci`: 60 packages, 0 vulnerabilities.
- `npm run check`: PASS — 5/5 unit/policy tests, TypeScript plus exact Vite
  production build, and 9/9 repository Playwright tests.
- `npm audit --omit=dev`: PASS. No separate lint command exists.
- Fresh live scenarios: ten-node authoring with photo and branch, persistence,
  readiness failure/recovery, free limit, three-attempt improvement reporting,
  misconception aggregation, JSON/CSV export, malformed-import preservation,
  and legacy corrupt-record recovery/reset all passed.
- Desktop 1440 px and mobile 390 px across nine app/legal views: zero default
  overflow, console/page errors, or serious/critical axe findings. Reduced
  motion and visible 3 px focus styling passed. The specific keyboard, target,
  and text-resize defects above remain.
- Privacy: a clean session made no outbound requests. Invalid-license capture
  made only the documented Sociobot verification call, stripped the token, and
  respected the daily verdict cache.
- PWA offline reload passed on the live origin with local state and the v3
  shell cache. Waiting-worker activation failed as described above.
- All 16 shipped non-map artifacts matched local `dist/`. Cache and MIME
  policies for HTML, worker, manifest, and fingerprinted assets are correct.
- Bundles pass: JS 44,578 B raw / 14.86 kB gzip; CSS 22,924 B raw / 5.56 kB
  gzip; largest hero WebP 44,102 B.
- Lighthouse 12.8.2 mobile completed: Performance 95, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.10 s, CLS 0, TBT 249 ms.

## How to reproduce

```bash
npm ci
npm run check
npm audit --omit=dev
curl -i https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout
```

For the keyboard failure, open the live starter player, press Tab once, then
Enter on “Skip to main content.” For the image failure, upload a file larger
than 12 MB or a non-image renamed `.png` in the editor and inspect the announced
status. The service-worker update reproduction requires serving the exact
`dist/` while changing only the worker cache version between update checks; see
the detailed report for the observed state transition.

## Next steps

- Enable the production product in the Sociobot billing engine and verify the
  hosted checkout redirect without completing a real charge.
- Fix the skip target so it preserves the SPA route and moves focus; render only
  one skip link.
- Send `SKIP_WAITING` to `registration.waiting`, then verify controller change,
  reload, and saved-data continuity.
- Preserve and announce image-processing errors instead of performing the
  unconditional success save.
- Bring mobile targets to 44×44 and make the app reflow without horizontal
  scrolling at 200% text size.
- Submit a new candidate for independent verification. No product code was
  changed during this verification.
