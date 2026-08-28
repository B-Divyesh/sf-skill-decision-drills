# Copy audit — polish round 5

This audit inventories the cold landing page and current README. Word counts
treat hyphenated terms, URLs, code spans, and command names as one word. No
sentence exceeds 22 words or uses a banned marketing word. The browser test
`copy audit covers every cold landing unit and current README unit` checks the
listed landing units against the rendered page and checks every listed README
unit against both this audit and `README.md`.

## Cold landing page

### Screen-reader labels and navigation

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Clear keyboard action. |
| Skill Decision Drills home | 4 | Clear wordmark label. |
| Decision drills | 2 | Clear wordmark. |
| Primary navigation | 2 | Clear navigation label. |
| Drills | 1 | Clear navigation link. |
| Demo | 1 | Clear navigation link. |
| Results | 1 | One name for the results area. |
| Privacy | 1 | Clear navigation link. |
| Legal and product information | 4 | Clear footer-navigation label. |

### First screen and artwork

| Copy unit | Words | Claim evidence or result |
| --- | ---: | --- |
| 01 Practice real decisions | 4 | Clear section label. |
| Rehearse real decisions before you act. | 6 | Job headline. |
| For coaches and self-learners who need to practise choices from real situations. | 12 | Audience and situation. |
| Try it with sample data | 5 | Primary action; `sample-access`. |
| Open a three-choice practice drill. | 5 | Immediate result; `sample-access`. |
| Your drills stay in this browser. | 6 | `normal-local-only`. |
| The sample works offline after your first visit. | 8 | `offline-reload`. |
| The sample opens without payment. | 5 | `sample-access`. |
| Create a drill | 3 | Secondary authoring action. |
| Blank scenario cards connected by orange, blue, and lime branching paths, including a replay loop | 15 | Meaningful hero-image alternative. |
| Read the situation | 3 | First practice step. |
| Choose an action | 3 | Second practice step. |
| See what follows | 3 | Third practice step. |
| Replay it | 2 | Fourth practice step. |

### Library, sample, and coaching path

| Copy unit | Words | Claim evidence or result |
| --- | ---: | --- |
| Your board | 2 | Clear section label beside its heading. |
| Your decision drills | 3 | Saved-drill heading. |
| Create drill | 2 | Compact authoring action. |
| SAMPLE DRILL | 2 | Factual sample label. |
| 0 attempts · Ready to play | 5 | Clear sample state. |
| Studio handoff: find the missing context | 6 | Specific sample title. |
| This sample starts with an unfinished creative project. Practise asking what done means before you act. | 16 | `sample-content`. |
| Run drill | 2 | Starts the sample. |
| Edit drill | 2 | Opens the authoring view. |
| View results | 2 | Opens the results view. |
| Delete drill | 2 | Names the destructive action. |
| Coach loop | 2 | Clear section label beside its heading. |
| Create a drill in three steps | 6 | Authoring-path heading. |
| Write | 1 | First authoring step. |
| Write the moment, not a trivia question. | 7 | Clear instruction. |
| Show | 1 | Second authoring step. |
| Show what happens after each choice. | 6 | `replay-feedback`. |
| Replay | 1 | Third authoring step. |
| Replay with choices in a new order. | 7 | `shuffle`. |

### Footer

| Copy unit | Words | Result |
| --- | ---: | --- |
| Practice is not proof. | 4 | Clear safety boundary. |
| Decision drills support rehearsal and do not replace qualified instruction or certify real-world competence. | 14 | Clear boundary. |
| Terms | 1 | Clear legal link. |
| Your data | 2 | Clear data link. |
| About | 1 | Clear product link. |
| Original artwork generated for this app. | 6 | `artwork-provenance`. |
| Built by Param Factory · release 5 | 6 | Build identity. |

The first screen has one job headline, an audience sentence, one primary sample
action with its result, and three short facts. The mobile and desktop browser
tests keep all of these items above the fold.

## README

### Product and feature copy

| Copy unit | Words | Claim evidence or result |
| --- | ---: | --- |
| Skill Decision Drills | 3 | Product name. |
| Skill Decision Drills helps coaches and self-learners practise choices from real situations. | 12 | Product and audience summary. |
| Try the sample at https://skill-decision-drills.sociobot.in/?demo=1. | 5 | `sample-access`, `real-routes`. |
| Nothing you do there changes your drills. | 7 | `demo-isolated`. |
| It opens a three-choice practice drill. | 6 | `sample-access`. |
| What it does | 3 | Clear heading. |
| Create drills that save in this browser. | 7 | `normal-local-only`. |
| Let learners choose, see feedback, and replay. | 7 | `replay-feedback`. |
| Change choice order on replay. | 5 | `shuffle`. |
| See whether learners improve their first choice by attempt three, and which choices they missed. | 15 | `insights`; plain description of the measurement. |
| Export a JSON backup or CSV results. | 7 | `json-export`, `csv-export`. |
| Restore a JSON backup after confirmation. | 6 | `json-import`. |
| Add a scenario photo that is resized and stored in this browser. | 12 | `photo-local`. |
| Use the sample offline after the first visit. | 8 | `offline-reload`. |

### Run, test, and claim commands

| Copy unit | Words | Result |
| --- | ---: | --- |
| Run locally | 2 | Clear heading. |
| Use Node.js 20.19–20.x or Node.js 22.12 and newer. | 8 | Supported build range; `build-output`. |
| Node 21 and Node 22.0–22.11 are unsupported. | 7 | Names excluded versions. |
| npm ci | 2 | Install command. |
| npm run dev | 3 | Local-server command. |
| Test and build | 3 | Clear heading. |
| npm test | 2 | Unit-test command. |
| npm run lint | 3 | Lint command. |
| npm run build | 3 | Production-build command. |
| npm run test:e2e | 3 | Browser-test command. |
| In a fresh copy of the repository, list each claim command with: | 12 | Clear maintainer instruction. |
| node --input-type=module -e "import {readFileSync} from 'node:fs'; for (const claim of JSON.parse(readFileSync('.factory/claims.json', 'utf8'))) console.log(claim.test)" | 1 | Claim-list command. |
| Run them all with `npm run test:claims`. | 5 | Clear claim-suite instruction. |
| The build writes the site to `dist/index.html`. | 7 | `build-output`. |

### Privacy, safety, deployment, and links

| Copy unit | Words | Claim evidence or result |
| --- | ---: | --- |
| Privacy and safety | 3 | Clear heading. |
| The app has no accounts, ads, analytics, or network requests to other companies. | 13 | `no-tracking`. |
| Your drills stay in browser storage unless you export them. | 10 | `normal-local-only`. |
| Practice does not certify real-world competence. | 6 | Safety boundary. |
| Use qualified instruction where mistakes could affect people, property, or rights. | 11 | Safety instruction. |
| Read the privacy notice and terms. | 6 | Clear legal-link action. |
| privacy notice | 2 | Link label. |
| terms | 1 | Link label. |
| Deploy | 1 | Clear heading. |
| Deploy `dist/` as an Azure Static Web App. | 8 | Clear deployment instruction. |
| The included configuration defines app routes, cache policy, security headers, and a real 404 override. | 15 | `deployment-config`. |
| Design and license | 3 | Clear heading. |
| See the design notes and original artwork source. | 8 | Clear repository-link action. |
| design notes | 2 | Link label. |
| original artwork source | 3 | Link label. |
| MIT. | 1 | License statement. |
| See LICENSE. | 2 | Clear license-link action. |
| LICENSE | 1 | Link label. |

## Terminology table

| Concept | One term used |
| --- | --- |
| Saved practice outcome area | Results |
| Download of attempt outcomes | Export CSV results |
| Authoring action | Create a drill / Create drill |
| Shipped example | Sample drill |
| User’s saved content | Drills |

`Results` is used in the navigation, page heading, result links, and CSV
action. The technical route remains `/insights` so existing real URLs continue
to work, but it is not presented as a second name to visitors.
