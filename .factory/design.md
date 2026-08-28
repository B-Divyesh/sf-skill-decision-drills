# Visual thesis — Skill Decision Drills

## Direction: neo-brutalist field decision board

The product should feel like a coach's working board: direct, writable, a little
physical, and unmistakably about making choices under pressure. Hard rules,
offset shadows, numbered route markers, and high-contrast status tape make the
decision structure legible without turning it into a generic flow-chart app.
The interface is intentionally single-mode light: the warm paper field is part
of the workshop-board metaphor, is explicitly painted on every surface, and
keeps authoring diagrams and learner prompts visually consistent.

Clarity comes before decoration. The current node, consequence, and next action
always dominate. Chrome recedes into a compact top rail; thick borders appear
only around distinct working objects or important actions. Depth survives
without motion through 4 px ink shadows and overlapping route labels.

## Palette

All pairings below meet WCAG AA for normal text; color is always paired with a
label, icon, or shape.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F3EEDC` | page and canvas; warm training-card stock |
| `--surface` | `#FFFDF5` | editable sheets and prompt panels |
| `--ink` | `#17211B` | primary text, borders, shadows |
| `--muted` | `#4F5B52` | supporting copy |
| `--signal` | `#FF5C35` | primary action and decision markers |
| `--signal-ink` | `#17120F` | text on signal orange |
| `--electric` | `#B9E633` | selected route and positive emphasis |
| `--blue` | `#4C72FF` | hints, information, learner mode |
| `--success` | `#176B3A` | correct consequence |
| `--warning` | `#8A4B00` | coaching caution |
| `--danger` | `#A52A2A` | destructive/error state |

## Typography

- Display and labels: `Arial Black`, `Arial`, sans-serif. Its compressed visual
  weight resembles equipment labels and makes the product title distinct.
- Body and forms: `ui-monospace`, `SFMono-Regular`, `Cascadia Code`, `Roboto
  Mono`, monospace. The technical rhythm suits procedural notes and numbered
  branches while remaining system-hosted and zero-byte.
- Scale: 14 px meta, 16 px body, 20 px section title, fluid 32–48 px page title,
  fluid 44–72 px landing display. Body line-height is 1.55 and readable lines
  cap at 68 characters.

## Spacing and layout

An 8 px base rhythm uses `4, 8, 12, 16, 24, 32, 48, 64`. Touch targets are at
least 44 px and separated by at least 8 px. Desktop authoring uses a 280 px node
rail plus a flexible work sheet; the phone view drops the persistent rail and
turns it into a compact node selector above the sheet. Learner mode is always a
single focused column, because the choice—not the tree—is the task.

Borders are 2 px ink, important containers use a 4 px bottom/right shadow, and
corners stay between 0 and 6 px. Cards are reserved for independent drills,
decision choices, and report summaries. Dashed rules mean “editable”; solid
rules mean “ready/current.”

## Interaction grammar

- Orange filled controls advance or create. Ink controls are structural. Blue
  controls reveal coaching help. Lime tape marks the active/correct route.
- Decisions press down by translating into their shadow. New panels enter from
  the originating control by 8 px over 180 ms; report bars grow over 240 ms.
- Every save is immediate to IndexedDB and acknowledged in a polite live region.
- Deletion names the node/drill and requires confirmation. Data export is never
  paywalled.
- Keyboard paths: tab/shift-tab across actions, Enter/Space activates, and
  Escape closes dialogs. Visible 3 px blue focus rings are offset by 3 px.

## Motion policy

Motion only explains continuity or input feedback. UI transitions last
150–240 ms and animate opacity/transform only. Nothing loops or flashes. Under
`prefers-reduced-motion: reduce`, all transitions and scroll behavior become
instant; hierarchy remains through borders, tape, and scale.

## Asset plan and provenance

One generated hero illustration explains the product: a tactile overhead
decision-board made of blank prompt cards, branching colored route tape, and
choice markers. It contains no procedural or hazardous advice and does not
promise automation. Hand-authored SVG icons and PWA icons use the same card and
route-marker geometry.

### Image prompt sheet

- Subject: overhead tabletop decision rehearsal board, blank cream index cards
  connected by branching orange, blue, and lime paper tape, chunky numbered
  wooden choice tokens without readable characters, one route folding back to
  show replay.
- World/materials: coach's workshop table, recycled paper, screen-printed ink,
  cut paper edges, tactile but orderly.
- Light/lens: soft daylight, straight overhead 50 mm editorial still life,
  crisp shadows, generous negative space.
- Palette words: warm cream, carbon ink, safety orange, electric lime, cobalt.
- Negative list: people, hands, text, letters, logos, watermarks, brands,
  screens, gradients, photorealistic hazardous equipment, clutter.

Generated with the factory image deployment (`factory-image`) on 2026-08-28.
The source PNG and prompt sidecar are retained in `assets/src/`; optimized WebP
is shipped in `public/assets/`. The generated image is original to this product.
`decision-board-social.webp` is a hand-reviewed 1200×630 crop of that same
original board artwork for Open Graph and Twitter previews.
