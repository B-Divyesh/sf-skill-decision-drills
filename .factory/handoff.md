# Handoff — polish round 5

## Outcome

Release repair commit `6326f96ebb142570a7d041e00d7ea06b5e3ffd4c` fixes every
finding recorded through adversarial review 5. It was pushed to `main` and
deployed with the work-order static deploy helper. Production is live at
<https://skill-decision-drills.sociobot.in>.

The repair removes the undefined recovery-path “safe starter drill” promise,
proves both documented Node build boundaries, fixes recovery reset when already
on `/drills`, and makes the copy audit complete and regression-tested. Outcome
language is now consistently **Results** in the navigation, page, links, and
CSV action. The neo-brutalist field-board visual system is unchanged.

## How to run and verify

```bash
npm ci
npm run check
npm run test:claims
npm run check:live
```

For the exact claim commands, run the documented command in `README.md`.
The demo entry point is <https://skill-decision-drills.sociobot.in/?demo=1>.

## Exact evidence

- Fresh clone: `/tmp/sdd-polish5-clean-tk85lc` at `6326f96`.
- Fresh-clone `npm ci` and `npm audit --omit=dev`: passed with 0
  vulnerabilities.
- Fresh-clone `npm run check`: passed — Vitest 6/6, lint, production build,
  and Playwright 27/27.
- Every one of the 17 commands in `.factory/claims.json` passed separately
  from that clean clone; aggregate `npm run test:claims` also passed 17/17.
- Production build: JavaScript 48.49 kB raw / 15.74 kB gzip; CSS 24.43 kB raw
  / 5.84 kB gzip. `dist/index.html` is present.
- Production cold suite:
  `PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run test:e2e`
  passed 27/27. It includes mobile 390 px, 200% reflow, reduced motion,
  keyboard/skip-link, route focus and Back, offline replay, privacy request
  interception, service-worker behavior, and axe serious/critical scans.
- `npm run check:live` passed after deployment. The live bundle is
  `assets/main-vedtO2gv.js`; it contains “Results saved in this browser” and
  “bundled starter drill”, not the removed recovery wording. Live headers
  include CSP, Permissions-Policy, COOP, nosniff, and the configured cache
  policy.
- Mobile Lighthouse report: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.15 s, CLS 0, TBT 0. Report:
  `evidence/live/polish-5-lighthouse.json`.
- Cold live screenshots:
  `evidence/live/polish-5-landing-mobile.png`,
  `evidence/live/polish-5-demo-mobile.png`,
  `evidence/live/polish-5-results-desktop.png`, and
  `evidence/live/polish-5-404-desktop.png`.

## Live recheck

The cold production recheck confirmed the job-first first screen, one-click
`?demo=1` normalization to `/demo`, persistent isolated-demo banner/reset,
real URLs and 404, metadata, shared legal shell, focused route transitions,
the Results terminology, recovery reset, and all historic claim behaviors.

## Known gaps

None. The standalone `@axe-core/cli` launcher could not find a Chrome binary
in this container; the required axe coverage was instead completed through the
installed Playwright Chromium integration in the full local and live 27-test
suites.
