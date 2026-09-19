# Case diagrams (NDA media)

Abstract block diagrams for **Under NDA** cases when sanitized screenshots are not published. Human canon; code lives in `app/data/caseDiagram.ts`, `app/utils/caseDiagram/`, and `CaseDiagramBoard.vue`.

## Goal

Show **product jobs and hard edges** (auth, pay, realtime, scoring) without client UI, brand, or invented infra. Hiring readers skim the map; authors write verbs, not role nouns alone.

## When to use

| Media | Use |
| --- | --- |
| Sanitized dual-res shots | Normal card + lightbox path (`work-images` pipeline) |
| No publishable shots | Validated `diagram` + pitch + facts (required for new NDA cases without images) |

Never treat a diagram like a lightbox photo. Never invent empty/error UI screenshots.

## Layout pick

| Layout | Shape | Use when |
| --- | --- | --- |
| `flow` | 2-4 nodes top to bottom | Pipeline (brief → editor → score) |
| `hub` | 1 hub + 2-3 spokes | One center task feeding tools |
| `triad` | north + center + SW + SE | Three clients (or surfaces) + shared core |

## Content rules

| Field | Rule | Soft max |
| --- | --- | --- |
| Node `label` | Job verb first (`Book, pay, chat`) | ~22 chars |
| Node `detail` | Role or stack hint (optional) | ~18 chars |
| Edge `label` | Hard part only; omit if empty | ~16 chars |
| Nodes | Max 4 per diagram | - |
| Copy | ASCII hygiene (`content.mdc`): hyphen `-`, no em dash, no decorative arrows | - |

### Forbidden

- Client brand, domains, niche-identifying product names
- Fake UI chrome, motion, pan/zoom
- Infra dump (every AWS box) - edges carry the hard integrations

## Data flow

```text
cases.ts (or caseDiagrams.ts)
  → assertCaseDiagram (ids, slots, soft length warn in dev)
  → layoutCaseDiagram (measure, route, viewBox)
  → CaseDiagramBoard (SVG paint + a11y caption)
```

## Surfaces

- Home NDA text card: dense diagram, then title / note / pitch (facts stay on the case page)
- Case page: full diagram (visible caption), then NDA note, facts

## Honesty

- Diagram must match the write-up (same apps and integrations the case claims)
- Prefer fewer honest boxes over a decorative org chart
