# Polish 1 — review finding closure

Candidate repaired: `3cb110732315d4444964d0696a7cb7b869010132`  
Repair commit: `ae623b2`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `/demo` and `?demo=1`, a direct sample player, persistent exact demo banner, Reset demo, Start for real, and `demo:` IndexedDB/localStorage namespaces. | `@claim:demo-isolated`; fresh live `?demo=1` browser check records only `demo:sdd_initialized` and `demo:skill-decision-drills`; [live verify](evidence/live/verify.json). |
| F-1-2 | Added `claims.json`, six exact tagged Playwright claims, demo documentation, and reduced copy to testable promises. | Clean clone `/tmp/sdd-clean-NYr2N4`: 6/6 `@claim:` tests passed; each manifest command was run. |
| F-1-3 | Removed the unavailable $29 checkout, license gate, and purchase copy. Full authoring is available in this release, so no visitor is offered a broken transaction. | `rg` finds no checkout URL or `$29` offer; live `/upgrade` contains no purchase action. |
| F-1-4 | Rewrote the first screen with a six-word job heading, coach/self-learner audience sentence, one primary sample action, immediate outcome, and three short facts. | `tests/mobile.spec.ts` first-screen test; live cold check reports the new H1 and action. |
| F-1-5 | Replaced hash routing with History API routes for drills, editing, play, insights, data, about, demo, and a designed 404 state. Updated manifest and offline link. | `@claim:real-routes`; live `/insights` and `/not-a-route` checks. |
| F-1-6 | Added concise dynamic route titles, descriptions, canonical, OG/Twitter metadata, Apple icon, and original 1200×630 social crop. | `@claim:real-routes`; `npm run check:live`; live demo title in [verify.json](evidence/live/verify.json). |
| F-1-7 | History navigation now focuses the new H1 and announces the route in a polite live region; Back does the same. | `@claim:real-routes` asserts URL, title, focused H1, live announcement, and Back. |
| F-1-8 | Legal pages now use the product wordmark/nav, common safety footer, Privacy/Terms/About links, Param Factory credit, and build label. | Browser accessibility route scan covers `/privacy/` and `/terms/`; live check follows both URLs. |
| F-1-9 | Rewrote landing and README copy in plain language; recorded sentence counts and terminology in `copy-audit.md`. | `copy-audit.md`; mobile first-screen assertion. |
| F-1-10 | Revalidation caching now applies to non-fingerprinted board artwork. Added CSP, Permissions-Policy, and COOP. | `deployment.test.ts`; live header capture in `npm run check:live` and command output. |

Earlier verification items for skip links, image errors, corrupt import recovery,
offline behavior, mobile targets, and service-worker activation remain covered by
the product code and the current full browser suite. The former checkout blocker
is resolved honestly by removing the unregistered offer rather than pretending a
payment path exists.

## Live re-check

- URL: <https://skill-decision-drills.sociobot.in/?demo=1>
- Cold verification: title `Demo — Skill Decision Drills`, one H1/main, no
  console errors, no missing alt text, no unnamed buttons.
- Live axe: zero serious or critical violations; screenshot:
  [demo-mobile.png](evidence/live/demo-mobile.png).
