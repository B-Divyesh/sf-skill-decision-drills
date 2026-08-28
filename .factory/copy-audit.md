# Copy audit — polish round 3

Word counts treat hyphenated terms as one word. No sentence exceeds 22 words,
and none uses a banned marketing word.

## Landing sentences

| Sentence | Words | Claim evidence |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | Job headline; no external claim. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Audience statement. |
| Open a three-choice practice drill. | 5 | `sample-access` asserts exactly three visible choices. |
| Your drills stay in this browser. | 6 | `normal-local-only`. |
| The sample works offline after your first visit. | 8 | `offline-reload`. |
| The sample opens without payment. | 6 | `sample-access`. |
| This sample starts with an unfinished creative project. | 9 | `sample-content`. |
| Practise asking what done means before you act. | 9 | Sample description. |
| Write the moment, not a trivia question. | 8 | Authoring instruction. |
| Show what happens after each choice. | 6 | `replay-feedback`. |
| Replay with choices in a new order. | 7 | `shuffle`. |
| Practice is not proof. | 4 | Safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Safety boundary. |
| Original artwork generated for this app. | 6 | `artwork-provenance`. |

The first screen uses one job headline, one audience sentence, one primary
sample action with its outcome, and three short facts. All five action/fact
elements are browser-tested inside both 390 × 844 and 1440 × 900 viewports.

## Reviewed labels

| Earlier label | Final label | Reason |
| --- | --- | --- |
| + New drill | Create drill | Names the result. |
| Edit | Edit drill | Names the object. |
| Delete | Delete drill | Names the destructive target. |
| SAFE SAMPLE | SAMPLE DRILL | Removes an unproved safety promise. |
| Build a drill | Build a drill | Clear secondary action. |
| Try it with sample data | Try it with sample data | Prescribed primary action. |
| Need a hint? | Show hint | Names the revealed result. |
| Continue to next decision | Show next decision | Names the next screen. |

The player interaction test opens the hint, verifies its text, and uses **Show
next decision** twice to finish the three-decision strong route.

## README sentences

| Sentence | Words | Claim evidence |
| --- | ---: | --- |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Product and audience summary. |
| Try the sample at <https://skill-decision-drills.sociobot.in/?demo=1>. | 5 | `sample-access`. |
| Nothing you do there changes your drills. | 7 | `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | `sample-access` asserts exactly three visible choices. |
| Create drills that save in this browser. | 7 | `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | `replay-feedback`. |
| Change choice order on replay. | 5 | `shuffle`. |
| See attempts and the choices learners missed. | 7 | `insights` asserts a non-zero missed-choice count. |
| Export a JSON backup or CSV report. | 7 | `json-export` and `csv-export`. |
| Restore a JSON backup after confirmation. | 6 | `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | `photo-local`. |
| Use the sample offline after the first visit. | 8 | `offline-reload`. |
| Use Node.js 20 or newer. | 5 | `build-output`. |
| In a fresh copy of the repository, list each claim command with: | 12 | `src/docs.test.ts`. |
| Run them all with `npm run test:claims`. | 5 | `src/docs.test.ts`; clean-clone run passed. |
| The build writes the site to `dist/index.html`. | 7 | `build-output`. |
| The app has no account, advertising code, analytics, or third-party runtime requests. | 12 | `no-tracking`. |
| Your drills stay in browser storage unless you export them. | 10 | `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Safety instruction. |
| Read the privacy notice and terms. | 6 | `real-routes`. |
| Deploy `dist/` as an Azure Static Web App. | 8 | `deployment-config`. |
| The included configuration handles app routes, cache policy, security headers, and real 404 responses. | 14 | `deployment-config`; live response checks. |
| See the design notes and original artwork source. | 8 | Repository links. |
| MIT. | 1 | License statement. |
| See LICENSE. | 2 | Repository link. |

No sentence exceeds 22 words. No sentence uses a banned marketing word.

## Catalog sentence

“Rehearse real choices with browser-saved drills for coaches and
self-learners.” has 10 words and 78 characters. It starts with a verb.

## Terminology

| Concept | One term |
| --- | --- |
| authored practice item | drill |
| starting context | situation |
| learner response | choice |
| shipped example | sample |
| repeated run | replay |
| saved client data | browser storage |
| aggregate result screen | report |
