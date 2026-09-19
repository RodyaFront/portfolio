# Case complexity index

Portfolio cases can show a **1-10 complexity** number (card corner, later). This doc is the human canon; code lives in `app/utils/caseComplexity.ts`.

## Goal

Compare **engineering and delivery weight**, not brand prestige. A hiring reader skims the number; authors score from case facts.

## Formula

```text
score = clamp(1..10, round(A + B + C + D))
```

| Axis | Id | Range | Guide |
| --- | --- | --- | --- |
| A Surface | `surface` | 0-3 | 0-1 one app / thin surface; 2 multi-module single app; 3 several apps or domains |
| B Domain depth | `domain` | 0-3 | 0-1 landing / simple CRUD; 2 data-heavy, scoring, dense ops; 3 realtime + payments + auth + multi-role (or equivalent) |
| C Platform risk | `platform` | 0-2 | 0 few hard integrations; 1 two or three serious ones; 2 several combined |
| D Ownership span | `ownership` | 0-2 | 0 narrow UI slice; 1 full FE of one product; 2 sole FE across several apps / full delivery |

Max raw sum = 10. Use `scoreCaseComplexity(breakdown)` in code.

### Not in v1 total

Optional later: **Design ownership** +0..1 only for `code-and-design`. Keep it out of the engineering sum so Code and Code-and-design stay comparable on the same axes.

## Honesty rules

- Score from the case write-up, not the logo.
- NDA alone does not change the score.
- A strong single product can beat thin commercial CRUD.
- Store an integer on the case when wiring UI; keep a `ComplexityBreakdown` (or calibration entry) so the number stays explainable.
- Do **not** auto-derive from the `stack` string list alone.

## Calibration (initial)

| Case slug | A | B | C | D | Score |
| --- | --- | --- | --- | --- | --- |
| `ancient-lens` | 1 | 2 | 0 | 1 | 4 |
| `teotale` | 1 | 2 | 1 | 1 | 5 |
| `creative-service-marketplace` | 1 | 2 | 2 | 1 | 6 |
| `seo-content-workspace` | 1 | 3 | 1 | 1 | 6 |
| `link-analytics-platform` | 2 | 3 | 1 | 1 | 7 |
| `role-based-platform` | 3 | 3 | 2 | 2 | 10 |

Same data: `complexityCalibration` in `app/utils/caseComplexity.ts`. Revisit when case facts change.

## UI

- Card: no `CaseFactsStrip` (facts live on Details only - avoids comparative noise)
- Details: facts under role; complexity beside title
- Components: `CaseFactsStrip.vue`, `CaseComplexityBadge.vue`
- Case fields: `facts`, `complexity` on `CaseStudy`

## Reuse

```ts
import {
  scoreCaseComplexity,
  complexityCalibration,
  complexityAxes,
} from '~/utils/caseComplexity'

const scored = scoreCaseComplexity({
  surface: 3,
  domain: 3,
  platform: 2,
  ownership: 2,
})
// scored.value === 10
```
