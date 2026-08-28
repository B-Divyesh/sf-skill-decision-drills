# Handoff — polish 1

## Delivered

Repair commit `ae623b2` replaces hash routes with real URLs, adds an isolated
sample demo, a testable claims contract, plain first-screen copy, route-aware
metadata/focus/404 behavior, matching legal-page chrome, hardened response
headers, and the 1200×630 social preview crop. The distinct neo-brutalist
field-board design and PWA/local-first deployment class remain intact.

The unregistered paid checkout was removed with its drill limit. This is the
honest available release: it does not advertise a purchase that cannot work.

## Verification

- Fresh clone: `/tmp/sdd-clean-NYr2N4`
  - `npm ci` passed (0 vulnerabilities)
  - `npm test` passed: 5 tests
  - `npm run build` passed; `dist/index.html` exists
  - `npm run test:e2e -- --grep '@claim:'` passed: 6 claims
- Repository gates: `npm test`, `npm run lint`, `npm run build`, and full
  `npm run test:e2e` passed (12 Playwright tests).
- Individual claim commands in `.factory/claims.json` were run. The first three
  passed independently; CSV, JSON, and real-route commands also passed after
  starting a local preview server.
- Local factory verification: [verify.json](evidence/local/verify.json) reports
  Demo title/lang, one H1/main, no missing alts or unlabeled buttons, and no
  console errors. Screenshots: [desktop](evidence/local/screenshot-desktop.png)
  and [mobile](evidence/local/screenshot-mobile.png).
- Lighthouse mobile demo: Performance 100, Accessibility 100, Best Practices
  96, SEO 100; LCP 1150 ms, CLS 0, TBT 0. Full JSON:
  [report.json](evidence/lighthouse/report.json).
- Live deploy: `https://skill-decision-drills.sociobot.in/?demo=1` was opened
  cold after deployment. Factory verify passed in 653 ms with no console errors.
  Live axe found zero serious/critical violations; [mobile screenshot](evidence/live/demo-mobile.png).
  `npm run check:live` passed route/title/header checks.

## How to run

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run test:e2e
```

Use `/?demo=1` for a clean isolated sample. See `.factory/demo.md` and
`.factory/claims.json` for the sandbox and claim commands.

## Known gaps

None in the repository-owned product. The former billing registration is not
used because the product no longer presents a paid purchase path.
