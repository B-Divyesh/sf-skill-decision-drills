# Handoff — perfection loop round 2

## Delivered

All findings in `.factory/review-1.md`, `.factory/review-2.md`, earlier
verification reports, and `.factory/polish-1.md` are closed. The product keeps
its neo-brutalist field-board design and remains a static offline PWA.

The release now has a compact first screen, isolated one-click demo, complete
claims contract, normal-data privacy proof, complete real routes and metadata,
working legal navigation, shared legal chrome, focus announcements, and true
HTTP 404 responses. Copy, README instructions, catalog text, and PWA status
messages now match the tested behavior.

Repair commits pushed to `main`:

- `f9ff8af` — cumulative product, claims, copy, routing, and layout repairs.
- `851b3e5` — valid Azure response-override configuration.
- `3d89252` — true `/404` and arbitrary-path HTTP 404 behavior.
- `fba4e2d` — clean fallback when service workers are blocked.

Production deployment ID: `24a418ed-0c37-4299-b9b3-b0f3d9ae1dbc`.

## Verification evidence

- `npm run check`: passed. Vitest 6/6, lint, typecheck/build, and Playwright
  25/25 all passed.
- Production build: `dist/index.html`; initial JS 47.57 kB raw / 15.50 kB
  gzip; CSS 24.43 kB raw / 5.84 kB gzip.
- Every one of 17 `.factory/claims.json` commands passed individually from
  clean clone `/tmp/sdd-polish2-clean-kG1AN9`. A final aggregate run against
  pushed commit `7e4d3ca` also passed 17/17 in clean clone
  `/tmp/sdd-polish2-final-wsRtMj`.
- Live Playwright at <https://skill-decision-drills.sociobot.in>: 9/9 selected
  route, demo, offline, first-screen, 200% reflow, reduced-motion, mobile, and
  axe checks passed. The blocked-service-worker console test also passed 1/1.
- Live 390 × 844 first-screen bottoms: primary action 625 px, outcome 619 px,
  facts 653/692/711 px. All are inside the 844 px viewport.
- Live cold demo: Reset restored the first decision; Start for real left zero
  demo drills, zero demo attempts, and no demo initialization key.
- Live legal click: `/privacy`, correct title/H1, and H1 focus. The complete
  route claim also covers Terms and browser Back announcement.
- Live response checks: `/` 200, `/privacy` 200, `/terms` 200, `/404` 404,
  arbitrary missing path 404. Security headers and hourly art revalidation are
  present.
- Live runtime: no external requests; no console or page errors on valid routes,
  including a context where service workers are blocked.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100, LCP 1.2 s, CLS 0, TBT 0 ms.
- Evidence: `evidence/live/landing-mobile.png`,
  `evidence/live/landing-desktop.png`, `evidence/live/demo-mobile.png`,
  `evidence/live/privacy-desktop.png`, `evidence/live/404-desktop.png`, and
  `evidence/live/lighthouse.json`.
- Finding-by-finding mapping: `.factory/polish-2.md`.

## Run and verify

```bash
npm ci
npm run check
npm run test:claims
npm run check:live
```

To run browser checks against production:

```bash
PLAYWRIGHT_BASE_URL=https://skill-decision-drills.sociobot.in npx playwright test
```

Deploy the built `dist/` directory with:

```bash
/opt/fleet/lib/deploy-static.sh skill-decision-drills dist
```

## Known gaps and next steps

None. No review finding or severity is deferred.
