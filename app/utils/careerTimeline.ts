import type { ExperienceRole } from '~/data/profile'

export type CareerStop = ExperienceRole & {
  durationLabel: string
  periodLabel: string
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function parseYearMonth(value: string): { year: number; month: number } {
  const [yearRaw, monthRaw] = value.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  if (!year || !month || month < 1 || month > 12) {
    throw new Error(`Invalid YYYY-MM value: ${value}`)
  }
  return { year, month }
}

function formatMonthYear(value: string, now = new Date()): string {
  if (value === 'present') {
    return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  }
  const { year, month } = parseYearMonth(value)
  return `${MONTHS[month - 1]} ${year}`
}

/** Inclusive month span → compact label like `3y 3m`, `10m`, `1y`. */
export function formatDurationLabel(start: string, end: string, now = new Date()): string {
  const from = parseYearMonth(start)
  const to =
    end === 'present'
      ? { year: now.getFullYear(), month: now.getMonth() + 1 }
      : parseYearMonth(end)

  let months = (to.year - from.year) * 12 + (to.month - from.month) + 1
  if (months < 1) months = 1

  const years = Math.floor(months / 12)
  const rest = months % 12

  if (years > 0 && rest > 0) return `${years}y ${rest}m`
  if (years > 0) return `${years}y`
  return `${rest}m`
}

export function formatPeriodLabel(start: string, end: string, now = new Date()): string {
  const from = formatMonthYear(start, now)
  const to = end === 'present' ? 'Present' : formatMonthYear(end, now)
  return `${from} - ${to}`
}

export function getCareerTimeline(
  experience: readonly ExperienceRole[],
  now = new Date(),
): CareerStop[] {
  return experience
    .filter((role) => role.timeline !== false)
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((role) => ({
      ...role,
      durationLabel: formatDurationLabel(role.start, role.end, now),
      periodLabel: formatPeriodLabel(role.start, role.end, now),
    }))
}

export type TotalExperience = {
  start: string
  end: string
  durationLabel: string
  /** Whole years (floor), for short copy like "5 years". */
  years: number
}

/**
 * Total commercial span on the timeline (earliest start → latest end).
 * Parallel / side roles with `timeline: false` are excluded so months are not double-counted.
 */
export function getTotalExperience(
  experience: readonly ExperienceRole[],
  now = new Date(),
): TotalExperience | null {
  const stops = experience.filter((role) => role.timeline !== false)
  if (!stops.length) return null

  const first = stops[0]
  if (!first) return null

  const start = stops.reduce(
    (min, role) => (role.start < min ? role.start : min),
    first.start,
  )

  const end = stops.reduce((max, role) => {
    if (role.end === 'present' || max === 'present') return 'present'
    return role.end > max ? role.end : max
  }, first.end)

  const durationLabel = formatDurationLabel(start, end, now)
  const from = parseYearMonth(start)
  const to =
    end === 'present'
      ? { year: now.getFullYear(), month: now.getMonth() + 1 }
      : parseYearMonth(end)
  let months = (to.year - from.year) * 12 + (to.month - from.month) + 1
  if (months < 1) months = 1

  return {
    start,
    end,
    durationLabel,
    years: Math.floor(months / 12),
  }
}
