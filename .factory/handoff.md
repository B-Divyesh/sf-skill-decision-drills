# Handoff — adversarial review 2

## Delivered

Completed a fresh adversarial review of candidate
`52ace9c296858a3843e695ebaf13fe2036589fc9` and wrote
`.factory/review-2.md`. No product code was modified.

Verdict: **FAIL** with 18 findings. The live first screen and isolated demo now
work, but in-app Privacy/Terms navigation is broken, the claims contract is
incomplete, earlier metadata/chrome/copy findings are only partly fixed, the
three required facts sit below the first viewport, the README claim-list command
fails, and unknown routes return HTTP 200.

## Verification performed

- Cold live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click live demo, changed-state Reset, Start for real, separate storage,
  byte-for-byte normal-database preservation, same-origin request interception,
  and offline reload/interaction.
- Every `.factory/claims.json` command from clean clone
  `/tmp/sdd-review2-H20DsV`; all six commands passed, with assertion gaps
  documented in the review.
- `npm test` passed 5/5; `npm run lint` passed; `npm run build` produced `dist/`;
  `npm run test:e2e` passed 12/12.
- `npm run check:live` passed; its direct-route scope misses the in-app
  legal-link defect recorded in the review.
- Live route/title/metadata inspection, same-origin href crawl, HTTP header and
  missing-route checks, and axe scans of 11 routes at mobile and desktop sizes.
  Axe found zero violations.
- Every earlier review, polish, verification, and handoff document was read and
  rechecked against live behavior and source.

## How to verify

```bash
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```

Open `/`, click **Try it with sample data**, then click the footer Privacy and
Terms links to reproduce the blocking route defect. See
`.factory/review-2.md` for exact claim commands, evidence, copy counts, and
concrete repairs.

## Product changes left

All 18 findings in `.factory/review-2.md` remain. This review work order did not
authorize product-code changes.
