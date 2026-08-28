# Skill Decision Drills

Skill Decision Drills helps coaches and self-learners practise choices from real situations.

Try the sample at <https://skill-decision-drills.sociobot.in/?demo=1>.
Nothing you do there changes your drills. It opens a three-choice practice drill.

## What it does

- Create drills that save in this browser.
- Let learners choose, see feedback, and replay.
- Change choice order on replay.
- See whether learners improve their first choice by attempt three, and which choices they missed.
- Export a JSON backup or CSV results.
- Restore a JSON backup after confirmation.
- Add a scenario photo that is resized and stored in this browser.
- Use the sample offline after the first visit.

## Run locally

Use Node.js 20.19–20.x or Node.js 22.12 and newer. Node 21 and Node 22.0–22.11 are unsupported.

```bash
npm ci
npm run dev
```

## Test and build

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```

In a fresh copy of the repository, list each claim command with:

```bash
node --input-type=module -e "import {readFileSync} from 'node:fs'; for (const claim of JSON.parse(readFileSync('.factory/claims.json', 'utf8'))) console.log(claim.test)"
```

Run them all with `npm run test:claims`. The build writes the site to `dist/index.html`.

## Privacy and safety

The app has no accounts, ads, analytics, or network requests to other companies.
Your drills stay in browser storage unless you export them.
Practice does not certify real-world competence.
Use qualified instruction where mistakes could affect people, property, or rights.

Read the [privacy notice](privacy/index.html) and [terms](terms/index.html).

## Deploy

Deploy `dist/` as an Azure Static Web App. The included configuration defines app routes, cache policy, security headers, and a real 404 override.

## Design and license

See the [design notes](.factory/design.md) and [original artwork source](assets/src/).
MIT. See [LICENSE](LICENSE).
