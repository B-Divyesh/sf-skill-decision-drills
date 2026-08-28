# Polish 2 — cumulative finding closure

Candidate repaired: `52ace9c296858a3843e695ebaf13fe2036589fc9`  
Adversarial report: `016a535609b79d58e93b69c6efab95163b84f6a8`  
Deployed repair: `fba4e2d`  
Live URL: <https://skill-decision-drills.sociobot.in>

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added real SPA Privacy and Terms renderers, titles, focus, announcements, and Back handling. Cold loads retain static legal HTML. | `@claim:real-routes`; live 9/9 route sweep; [privacy screenshot](../evidence/live/privacy-desktop.png); live `/privacy` and `/terms`. |
| F-2-2 | Strengthened demo isolation, CSV parsing, JSON parsing, and all-route assertions to prove complete outcomes. | `@claim:demo-isolated`, `@claim:csv-export`, `@claim:json-export`, `@claim:real-routes`; all passed individually from the clean clone. |
| F-2-3 | Added a full normal-data lifecycle claim plus a separate all-route tracking test. | `@claim:normal-local-only` authors, uploads, completes, exports, reloads, deletes, imports, and inspects IndexedDB; `@claim:no-tracking` records requests. |
| F-2-4 | Added exact behavior claims for feedback/replay, changed order, report results, image resize/storage, and confirmed import. | `@claim:replay-feedback`, `@claim:shuffle`, `@claim:insights`, `@claim:photo-local`, `@claim:json-import`. |
| F-2-5 | Narrowed offline copy to the tested sample, removed sweeping “everything” and free-tier claims, and tested no-payment sample access. | `@claim:offline-reload`, `@claim:sample-access`; [mobile first screen](../evidence/live/landing-mobile.png). |
| F-2-6 | Replaced “safe sample” with factual creative-project copy and added repository provenance proof. | `@claim:sample-content`, `@claim:artwork-provenance`; [desktop landing](../evidence/live/landing-desktop.png). |
| F-2-7 | Added `twitter:image` to both static legal pages. | `@claim:real-routes` checks the complete metadata set on every route; live `/privacy` and `/terms`. |
| F-2-8 | Unified geometric wordmark, four-link nav, footer links, one-liner, factory credit, and `release 2` identity across SPA, legal, and 404 pages. | Shared-shell/axe browser test across 11 routes; [privacy screenshot](../evidence/live/privacy-desktop.png). |
| F-2-9 | Replaced “+ New drill” with “Create drill”. | `tests/mobile.spec.ts` and [mobile landing](../evidence/live/landing-mobile.png). |
| F-2-10 | Replaced “Edit” with “Edit drill”. | Shared-shell browser suite; [mobile landing](../evidence/live/landing-mobile.png). |
| F-2-11 | Replaced “Delete” with “Delete drill”; the confirmation still names the drill. | `@claim:normal-local-only` performs confirmed deletion; [mobile landing](../evidence/live/landing-mobile.png). |
| F-2-12 | Replaced “SAFE SAMPLE” and the vague safety sentence with “SAMPLE DRILL” and the prescribed British-English factual copy. | `@claim:sample-content`; `.factory/copy-audit.md`; [mobile landing](../evidence/live/landing-mobile.png). |
| F-2-13 | Rewrote the README demo instruction in visitor language and explained that demo actions do not change real drills. | `README.md`; `@claim:demo-isolated`. |
| F-2-14 | Replaced “missed ideas” with “the choices learners missed”. | `README.md`; `@claim:insights`. |
| F-2-15 | Declared Node `>=20` and added a build-output claim that verifies `dist/index.html`. | `@claim:build-output`; production build emits 47.57 kB JS and 24.43 kB CSS raw. |
| F-2-16 | Reduced hero scale/spacing, moved facts before the secondary action, and intentionally drops the illustration on phones. | Mobile and desktop first-screen bounding tests; live bottoms are 625, 619, 653, 692, and 711 px within 390 × 844; [desktop screenshot](../evidence/live/landing-desktop.png). |
| F-2-17 | Replaced unsupported `fetch(file://...)` with a `node:fs` command and added a docs smoke test. | `src/docs.test.ts`; `npm test` passes 6/6 and prints all 17 commands. |
| F-2-18 | Replaced fallback routing with explicit app rewrites and an Azure 404 response override backed by the designed static page. | `@claim:deployment-config`; live `/404` = 404 and `/no-such-route-polish-2` = 404; [404 screenshot](../evidence/live/404-desktop.png). |

## Review 1 findings

| Finding | Final closure | Evidence |
| --- | --- | --- |
| F-1-1 | `/demo` and `?demo=1` open the seeded player in `demo:` storage. Reset clears changes; Start for real deletes demo records and leaves normal data unchanged. | `@claim:demo-isolated`; [demo screenshot](../evidence/live/demo-mobile.png). |
| F-1-2 | The claims manifest now lists 17 claims with exactly one tagged observable test each. | `.factory/claims.json`; one-by-one clean-clone run and `npm run test:claims`. |
| F-1-3 | Removed the unavailable paid offer and all dormant checkout/license code; no dead purchase link remains. | `@claim:sample-access`; repository search; live `/upgrade` is the designed 404. |
| F-1-4 | Retained the clear job headline, named audience, single primary sample action, adjacent outcome, and three facts above the fold. | Two viewport bounding tests; [mobile](../evidence/live/landing-mobile.png) and [desktop](../evidence/live/landing-desktop.png). |
| F-1-5 | Retained History API routes and completed legal/404 handling. | `@claim:real-routes`; live direct-load and Back checks. |
| F-1-6 | Every route has a concise title, description, canonical, OG/Twitter image set, favicon, and Apple icon. | `@claim:real-routes`; original 1200 × 630 preview asset. |
| F-1-7 | Navigation and Back focus the new H1 and announce the route. | `@claim:real-routes`. |
| F-1-8 | Legal pages now use the same product shell and release identity. | Shared-shell/axe route test; [privacy screenshot](../evidence/live/privacy-desktop.png). |
| F-1-9 | Completed all specified copy rewrites and audited landing sentences and terminology. | `.factory/copy-audit.md`; copy-specific claims. |
| F-1-10 | Retained one-hour revalidation for non-hashed art and CSP, Permissions-Policy, COOP, referrer, and nosniff headers. | `@claim:deployment-config`; live header check; `npm run check:live`. |

## Earlier verification findings

| Finding | Final closure | Evidence |
| --- | --- | --- |
| Verification P1 — malformed import could corrupt storage | Import is schema-validated before replacement and requires confirmation. | `src/model.test.ts` malformed cases; `@claim:json-import`; `@claim:normal-local-only`. |
| Verification P2 — hashed assets lacked immutable caching | Fingerprinted assets receive one-year immutable caching; board art revalidates hourly. | `src/deployment.test.ts`; live header check. |
| Verification-2/3 P1 — checkout unavailable | Removed the unavailable offer and unused license module. | `@claim:sample-access`; no checkout URL in product source. |
| Verification-2 P1 — skip link broke the route | Skip focuses `main` without URL mutation. | Keyboard skip-link browser test. |
| Verification-2 P1 — waiting worker could not update | The toast targets `registration.waiting`; worker handles `SKIP_WAITING`. | Full browser suite and retained service-worker implementation. |
| Verification-2 P2 — invalid image announced success | Decode and size errors return before saving; valid images are resized and stored. | `@claim:photo-local`; full browser suite. |
| Verification-2 P2 — mobile target/reflow defects | Controls meet 44 px target checks and all routes reflow at 200%. | Mobile browser suite; [demo screenshot](../evidence/live/demo-mobile.png). |
| Verification-3 P3 — non-hashed art cached immutably | Board artwork now uses one-hour revalidation. | Live `cache-control: public, max-age=3600, must-revalidate`. |
| Verification-3 P3 — response hardening absent | CSP, Permissions-Policy, COOP, referrer policy, and nosniff ship globally. | `@claim:deployment-config`; live header check. |

## Final live evidence

- Deployment ID: `24a418ed-0c37-4299-b9b3-b0f3d9ae1dbc`.
- Live selected browser suite: 9/9 passed; blocked-service-worker console test: 1/1 passed.
- Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 0 ms. Raw report: [lighthouse.json](../evidence/live/lighthouse.json).
- No unresolved finding remains.
