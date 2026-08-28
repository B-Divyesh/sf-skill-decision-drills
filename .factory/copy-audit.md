# Copy audit — polish round 4

Word counts treat hyphenated terms, URLs, and code spans as one word. No
landing or README sentence exceeds 22 words or uses a banned marketing word.

## Landing sentences

| Sentence | Words | Claim evidence |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | Job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Audience statement. |
| Open a three-choice practice drill. | 5 | `sample-access`. |
| Your drills stay in this browser. | 6 | `normal-local-only`. |
| The sample works offline after your first visit. | 8 | `offline-reload`. |
| The sample opens without payment. | 6 | `sample-access`. |
| Read the situation. | 3 | Process instruction. |
| Choose an action. | 3 | Process instruction. |
| See what follows. | 3 | Process instruction. |
| Replay it. | 2 | Process instruction. |
| This sample starts with an unfinished creative project. | 9 | `sample-content`. |
| Practise asking what done means before you act. | 8 | Sample purpose. |
| Write the moment, not a trivia question. | 7 | Authoring instruction. |
| Show what happens after each choice. | 6 | `replay-feedback`. |
| Replay with choices in a new order. | 7 | `shuffle`. |
| Practice is not proof. | 4 | Safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Safety boundary. |
| Original artwork generated for this app. | 6 | `artwork-provenance`. |

The first screen has one job headline, one audience sentence, one primary
sample action with its outcome, and three short facts. The mobile and desktop
browser tests keep all five action/fact elements above the fold.

## Landing headings and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Rehearse real decisions before you act. | 6 | H1 states the job. |
| Your decision drills | 3 | H2 names the library. |
| Studio handoff: find the missing context | 6 | H2 names the sample. |
| Create a drill in three steps | 6 | H2 names the authoring path. |
| Try it with sample data | 5 | Prescribed primary action. |
| Create a drill | 3 | Consistent authoring action. |
| Create drill | 2 | Consistent compact authoring action. |
| Run drill | 2 | Result-naming action. |
| Edit drill | 2 | Result-naming action. |
| View results | 2 | Result-naming action. |
| Delete drill | 2 | Names the destructive target. |

The product uses **create** for starting a drill. “Build” is not used for this
action, and the heading no longer substitutes “make”.

## README sentences

| Sentence | Words | Claim evidence |
| --- | ---: | --- |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Product and audience summary. |
| Try the sample at https://skill-decision-drills.sociobot.in/?demo=1. | 5 | `sample-access`, `real-routes`. |
| Nothing you do there changes your drills. | 7 | `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | `sample-access`. |
| Create drills that save in this browser. | 7 | `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | `replay-feedback`. |
| Change choice order on replay. | 5 | `shuffle`. |
| See attempts, first-decision change by attempt three, and the choices learners missed. | 11 | `insights`. |
| Export a JSON backup or CSV report. | 7 | `json-export`, `csv-export`. |
| Restore a JSON backup after confirmation. | 6 | `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | `photo-local`. |
| Use the sample offline after the first visit. | 8 | `offline-reload`. |
| Use Node.js 20.19 or newer, or Node.js 22.12 or newer. | 10 | `build-output`. |
| The build writes the site to dist/index.html. | 7 | `build-output`. |
| The app has no account, advertising code, analytics, or third-party runtime requests. | 12 | `no-tracking`. |
| Your drills stay in browser storage unless you export them. | 10 | `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Safety instruction. |
| Deploy dist/ as an Azure Static Web App. | 8 | Deployment instruction. |
| The included configuration defines app routes, cache policy, security headers, and a real 404 override. | 14 | `deployment-config`. |

## Catalog sentence

“Rehearse real decisions with browser-saved drills for coaches and
self-learners.” has 10 words and 80 characters. It starts with a verb.

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
| starting authoring action | create a drill |
