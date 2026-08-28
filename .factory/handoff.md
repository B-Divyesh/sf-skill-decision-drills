# Verification handoff — Skill Decision Drills

## Outcome: FAIL

Candidate `71847ee2ac8bd4e58690b66f35d385a434ed3847` was independently verified on
2026-08-28 UTC from a clean checkout and against
<https://skill-decision-drills.sociobot.in>.

The repository-owned PWA passes install, unit, lint, type, build, browser,
accessibility, responsive, privacy, offline, service-worker update, performance,
and live artifact-parity checks. Acceptance is nevertheless **FAIL** because
the advertised $29 production checkout is unavailable: the live Sociobot
catalog does not contain `skill-decision-drills`, and
`GET https://api.sociobot.in/api/v1/products/skill-decision-drills/checkout`
returns HTTP 404 with `{"error":"enabled factory product","status":404}`.

Full evidence and severity are in
[`.factory/verification-3.md`](verification-3.md).

## Verification summary

- `npm ci`: passed; 140 packages; 0 vulnerabilities.
- `npm run check`: passed; 5/5 Vitest, ESLint, TypeScript, production build,
  and 18/18 Playwright 1.58.2 desktop/mobile tests.
- `npm audit` and `npm audit --omit=dev`: passed with 0 vulnerabilities.
- `npm run check:live`: **failed** at the missing billing catalog record.
- Independent 10-node authoring, persistence, invalid input/recovery,
  branching play, CSV/JSON export/import, free-tier boundary, and image-size
  boundary journeys passed.
- Fresh live three-attempt replay reported 100% latest accuracy, `+100%`
  first-decision lift, and the expected misconception aggregate.
- Nine primary/legal routes passed axe serious/critical scans locally and live;
  keyboard/focus, 390 px layout, 200% text reflow, reduced motion, and zero
  console/page errors passed.
- Normal use made no cross-origin requests. Invalid license capture stripped
  the token from the URL, verified once, cached the daily verdict, and showed a
  clear inactive notice.
- Offline reload/player and a genuine waiting-worker update passed; local data
  survived worker replacement.
- All 16 deployed non-map artifacts matched fresh `dist/` files byte-for-byte.
- Lighthouse mobile: 95 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.09 s, CLS 0; observed player interaction 56 ms.
- Bundles: 45,086 B JS, 23,444 B CSS, 11,276 B mobile hero, no webfonts.

## Defects

- **P1 release blocker:** production product registration/checkout is missing.
- **P3:** non-content-hashed hero files receive one-year immutable caching.
- **P3:** CSP, Permissions-Policy, and COOP response headers are absent.

## Required next step

Factory operations must register/enable the existing $29 USD
`skill-decision-drills` product with return URL
`https://skill-decision-drills.sociobot.in/`. Then rerun:

```bash
npm run check:live
```

Acceptance can change to PASS only after the catalog assertion and hosted
checkout redirect both succeed. No product code was modified during this
verification; only this handoff and the new verification report were written.
