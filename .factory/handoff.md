# Handoff — polish round 4

## Released repair

- Repair commit: `af6620e714cab5152a1a2ef0aa262d211bc928fe`
- Branch: `main`; pushed to `origin`.
- Static deployment: `4866f49b-5397-4bb2-9de3-a52780329299`
- Live product: <https://skill-decision-drills.sociobot.in>

The release closes every item in reviews 1–4 and the earlier verification
records. The direct `/?demo=1` entry now normalizes to `/demo`, keeps the
isolated `demo:` storage namespace, and gets the same focus and live-route
announcement behavior as the rest of the application.

## Verification evidence

- Clean clone: `/tmp/sdd-polish4-clean-y8Pt5u` at `af6620e`.
- `npm ci` passed; `npm audit --omit=dev` reported zero vulnerabilities.
- All 17 exact commands in `.factory/claims.json` passed individually.
- Clean-clone `npm run check`: 6 Vitest tests, lint, production build, and
  25 Playwright tests passed.
- Clean-clone `npm run test:claims`: 17/17 passed.
- The `build-output` claim runs Vite with pinned `node@20.19.0`; its output
  assertion passed in the clean clone.
- Live `PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npm run
  test:e2e`: 25/25 passed, including axe scans on every route, mobile targets,
  200% reflow, reduced motion, offline demo and normal-drill reloads, route
  focus/announcements, exact canonicals, link crawl, and 404 behavior.
- Live `npm run check:live`: passed. Cold verifier passed for `/` and
  `/?demo=1`, with no console errors, one H1/main, `lang="en"`, zero missing
  image alternatives, and zero unlabeled buttons.
- Live response checks: `/` and `/demo` returned 200; an arbitrary missing
  route returned 404. CSP, Permissions-Policy, COOP, referrer policy, nosniff,
  and cache policy were present.
- Lighthouse report:
  [polish-4-lighthouse-retry.json](../evidence/live/polish-4-lighthouse-retry.json)
  records Performance 100, Accessibility 100, Best Practices 100, SEO 100,
  LCP 1.10 s, CLS 0, and TBT 0 ms.

## Visual live checks

- [Landing, mobile](../evidence/live/polish-4-landing/screenshot-mobile.png)
  confirms the job headline, audience, single primary sample action, outcome,
  facts, and consistent **Create** language.
- [Demo, mobile](../evidence/live/polish-4-demo/screenshot-mobile.png)
  confirms the isolated banner, Reset demo, Start for real, and immediate
  three-choice player.
- [Insights](../evidence/live/polish-4-insights.png) confirms three attempts,
  100% latest accuracy, +100% first-decision lift, and the misconception count.
- [404](../evidence/live/polish-4-404.png) confirms the designed field-board
  not-found route and return link.

## Run and deploy

```bash
npm ci
npm run check
npm run test:claims
npm run build
/opt/fleet/lib/deploy-static.sh skill-decision-drills dist
```

## Known gaps

None. The product remains a static, offline-first PWA with browser-local
storage, self-hosted assets, no account, advertising code, analytics, or
third-party runtime requests.
