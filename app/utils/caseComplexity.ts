/**
 * Case complexity index (1-10) for Portfolio cards.
 *
 * Goal: compare engineering (and delivery) weight across cases - not "how cool"
 * the brand feels. Hiring readers skim a number; authors score from case facts.
 *
 * ## Formula
 *
 *   score = clamp(1..10, round(A + B + C + D))
 *
 * | Axis | Range | Meaning |
 * | --- | --- | --- |
 * | A Surface | 0-3 | How many distinct apps / product surfaces |
 * | B Domain depth | 0-3 | Domain and data difficulty |
 * | C Platform risk | 0-2 | Hard integrations (auth, pay, realtime, SSR/SEO, …) |
 * | D Ownership span | 0-2 | How much of the frontend you owned end to end |
 *
 * Optional later (not in v1 sum): Design ownership +0..1 for `code-and-design`
 * only - keep out of the engineering total so Code vs Code-and-design stay comparable.
 *
 * ## Honesty rules
 *
 * - Score from what the case write-up claims, not brand prestige.
 * - NDA does not raise or lower the score by itself.
 * - A strong single product can outrank a thin commercial CRUD.
 * - Prefer a stored `complexity` on the case (author judgment) validated against
 *   this breakdown; do not auto-derive from the `stack` array alone.
 *
 * Human doc: `docs/case-complexity.md`
 */

export const CASE_COMPLEXITY_MIN = 1
export const CASE_COMPLEXITY_MAX = 10

export type ComplexityAxisId = 'surface' | 'domain' | 'platform' | 'ownership'

export type ComplexityAxisDef = {
  id: ComplexityAxisId
  /** Short label for tooltips / docs. */
  label: string
  min: number
  max: number
  /** One-line guide for scoring. */
  guide: string
}

/** Axis catalog (order = formula order A→D). */
export const complexityAxes: readonly ComplexityAxisDef[] = [
  {
    id: 'surface',
    label: 'Surface',
    min: 0,
    max: 3,
    guide:
      '0-1: one app or thin surface. 2: multi-module single app. 3: several apps or domains.',
  },
  {
    id: 'domain',
    label: 'Domain depth',
    min: 0,
    max: 3,
    guide:
      '0-1: landing / simple CRUD. 2: data-heavy, scoring, or dense ops. 3: realtime + payments + auth + multi-role (or equivalent depth).',
  },
  {
    id: 'platform',
    label: 'Platform risk',
    min: 0,
    max: 2,
    guide:
      '0: few hard integrations. 1: two or three serious ones (e.g. auth, SSR/SEO, payments). 2: several combined (auth + pay + realtime + i18n publish, etc.).',
  },
  {
    id: 'ownership',
    label: 'Ownership span',
    min: 0,
    max: 2,
    guide:
      '0: narrow UI slice. 1: full FE of one product. 2: sole FE across several apps or full delivery ownership.',
  },
] as const

export type ComplexityBreakdown = {
  /** A - Surface (0-3) */
  surface: number
  /** B - Domain depth (0-3) */
  domain: number
  /** C - Platform risk (0-2) */
  platform: number
  /** D - Ownership span (0-2) */
  ownership: number
}

export type ComplexityScore = {
  /** Final card value, 1-10. */
  value: number
  /** Raw axis sum before clamp (0-10). */
  raw: number
  breakdown: ComplexityBreakdown
}

function clampAxis(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

/**
 * Sum axes and clamp to the public 1-10 scale.
 * Axis values outside their ranges are clamped per axis first.
 */
export function scoreCaseComplexity(
  breakdown: ComplexityBreakdown,
): ComplexityScore {
  const surface = clampAxis(breakdown.surface, 0, 3)
  const domain = clampAxis(breakdown.domain, 0, 3)
  const platform = clampAxis(breakdown.platform, 0, 2)
  const ownership = clampAxis(breakdown.ownership, 0, 2)

  const raw = surface + domain + platform + ownership
  const value = Math.min(
    CASE_COMPLEXITY_MAX,
    Math.max(CASE_COMPLEXITY_MIN, Math.round(raw)),
  )

  return {
    value,
    raw,
    breakdown: { surface, domain, platform, ownership },
  }
}

/** True if a stored card index matches a breakdown under the formula. */
export function complexityMatchesBreakdown(
  stored: number,
  breakdown: ComplexityBreakdown,
): boolean {
  return scoreCaseComplexity(breakdown).value === stored
}

/**
 * Calibration snapshot from the formula discussion (author judgment).
 * Re-score when case facts change; do not treat as auto-truth.
 */
export const complexityCalibration: Record<
  string,
  ComplexityBreakdown & { value: number }
> = {
  'ancient-lens': {
    surface: 1,
    domain: 2,
    platform: 0,
    ownership: 1,
    value: 4,
  },
  teotale: {
    surface: 1,
    domain: 2,
    platform: 1,
    ownership: 1,
    value: 5,
  },
  'creative-service-marketplace': {
    surface: 1,
    domain: 2,
    platform: 2,
    ownership: 1,
    value: 6,
  },
  'seo-content-workspace': {
    surface: 1,
    domain: 3,
    platform: 1,
    ownership: 1,
    value: 6,
  },
  'link-analytics-platform': {
    surface: 2,
    domain: 3,
    platform: 1,
    ownership: 1,
    value: 7,
  },
  'role-based-platform': {
    surface: 3,
    domain: 3,
    platform: 2,
    ownership: 2,
    value: 10,
  },
}

export function getCaseComplexity(slug: string) {
  return complexityCalibration[slug] ?? null
}
