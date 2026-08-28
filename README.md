# Skill Decision Drills

Skill Decision Drills helps coaches and self-learners practise choices from real situations.

Try the isolated sample at <https://skill-decision-drills.sociobot.in/?demo=1>.
It opens a three-choice practice drill.

## What it does

- Create drills that save in this browser.
- Let learners choose, see feedback, and replay.
- Change choice order on replay.
- See attempts and missed ideas.
- Export a JSON backup or CSV report.
- Add a scenario photo that stays in this browser.
- Install the app and use the sample offline after the first visit.

## Run locally

Use Node.js 20 or newer.

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

Run every listed claim test from a clean checkout:

```bash
node --input-type=module -e "for (const c of JSON.parse(await (await fetch('file://' + process.cwd() + '/.factory/claims.json')).text())) console.log(c.test)"
```

The build writes the site to `dist/`.

## Privacy and safety

No account, ads, or tracking are used in the demo flow.
Your drills stay in browser storage unless you export them.
Practice does not certify real-world competence.
Use qualified instruction where mistakes could affect people, property, or rights.

Read the [privacy notice](privacy/index.html) and [terms](terms/index.html).

## Design and license

See the [design notes](.factory/design.md) and [artwork source](assets/src/).
MIT. See [LICENSE](LICENSE).
