# Handoff — adversarial review 4

## Delivered

- Added `.factory/review-4.md` with a full cold-read, copy, demo, claims,
  offline/privacy, history, structure, accessibility, and missed-leverage
  review.
- Verdict: **FAIL** with five blocking findings.
- No product code was changed.

## Main findings

1. The landing → demo, Back, and Start for real transitions do not focus or
   announce the new H1.
2. The documented `/?demo=1` page renders demo metadata but canonicals to `/`.
3. Five tagged claim tests are narrower than their manifest claims.
4. The insights-improvement, broad offline, and account/advertising promises
   are absent from or broader than the manifest.
5. Drill creation is called build, create, and make on the same page.

## Verification performed

- Fresh clone `/tmp/sdd-review4-clean-q9K4YU` at `24e7905`.
- `npm ci`: passed; zero reported vulnerabilities.
- Every one of the 17 exact `.factory/claims.json` commands: passed separately.
- `npm test`: 6/6 passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` produced.
- `PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run test:e2e`:
  25/25 passed.
- `npm run check:live`: passed.
- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/?demo=1`.
- Fresh mobile/desktop first-screen inspection, link crawl, true-404 checks,
  demo storage isolation/reset, offline reload, same-origin interception, and
  CSV content inspection were completed.

## Known gaps / next steps

The five findings in `.factory/review-4.md` remain. Repair them without
weakening the copy, then rerun the exact verification above from another clean
clone. Do not treat the green current tests as closure until their assertions
cover the full manifest sentences.
