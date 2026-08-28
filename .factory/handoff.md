# Review-1 handoff — Skill Decision Drills

## Outcome: FAIL

Completed the requested adversarial first-read review without modifying product code. The full report is in .factory/review-1.md.

## What was verified

- Fresh live Chromium visits at 390 px and desktop, including screenshot inspection and console/page-error monitoring.
- Cold first-screen clarity, visible-link crawl, route titles/metadata, header/footer consistency, navigation focus, and historic verification findings.
- ?demo=1 behavior, storage namespace, banner/reset/start controls, and an offline reload after service-worker readiness.
- Billing checkout response and response-cache/security headers.
- npm ci, npm test, npm run build, npm run test:e2e, and npm run check:live from this checkout.

## Results

npm test, the build, and all 18 local browser tests pass. npm run check:live fails because the live billing catalog has no skill-decision-drills product.

The release is not acceptable: it has no required demo sandbox or claims manifest/test inventory; the $29 purchase link is dead; the first screen is not clear enough for a cold visitor; app views use hash routes; metadata and route focus are incomplete; and two earlier P3 deployment concerns remain.

## How to reproduce

    npm ci
    npm test
    npm run build
    npm run test:e2e
    npm run check:live

For the core demo defect, open https://skill-decision-drills.sociobot.in/?demo=1 in a fresh browser profile: it opens normal storage, not a demo.

## Next steps

Address F-1-1 through F-1-10 in .factory/review-1.md, starting with the demo sandbox, claims manifest/tests, and factory billing registration. Then repeat the complete independent review from a fresh browser context.
