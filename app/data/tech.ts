/**
 * Tech registry for scannable marks (icon + label).
 * Logos: public/tech/{id}/{32,64,128}.webp and source.svg (see scripts/optimize-tech-logos.mjs).
 */

export type TechId =
  | 'vue'
  | 'nuxt'
  | 'typescript'
  | 'javascript'
  | 'react'
  | 'nextjs'
  | 'pinia'
  | 'tailwind'
  | 'vitest'
  | 'stripe'
  | 'socketio'
  | 'nodejs'
  | 'git'
  | 'figma'

export type TechDefinition = {
  id: TechId
  label: string
  /** Brand accent (icons / future use); label text stays ink */
  color: string
  /** 32px asset (inline text) */
  icon32: string
  /** 64px asset (chip / retina inline) */
  icon64: string
  /** Original artwork for tooltips (no baked background) */
  source: string
}

function icons(id: TechId) {
  return {
    icon32: `/tech/${id}/32.webp`,
    icon64: `/tech/${id}/64.webp`,
    source: `/tech/${id}/source.svg`,
  }
}

const definitions: Record<TechId, TechDefinition> = {
  vue: { id: 'vue', label: 'Vue', color: '#42b883', ...icons('vue') },
  nuxt: { id: 'nuxt', label: 'Nuxt', color: '#00a86a', ...icons('nuxt') },
  typescript: { id: 'typescript', label: 'TypeScript', color: '#3178c6', ...icons('typescript') },
  javascript: { id: 'javascript', label: 'JavaScript', color: '#b8860b', ...icons('javascript') },
  react: { id: 'react', label: 'React', color: '#087ea4', ...icons('react') },
  nextjs: { id: 'nextjs', label: 'Next.js', color: '#1a1a1a', ...icons('nextjs') },
  pinia: { id: 'pinia', label: 'Pinia', color: '#b45309', ...icons('pinia') },
  tailwind: { id: 'tailwind', label: 'Tailwind CSS', color: '#0ea5e9', ...icons('tailwind') },
  vitest: { id: 'vitest', label: 'Vitest', color: '#729b1b', ...icons('vitest') },
  stripe: { id: 'stripe', label: 'Stripe', color: '#635bff', ...icons('stripe') },
  socketio: { id: 'socketio', label: 'Socket.IO', color: '#1a1a1a', ...icons('socketio') },
  nodejs: { id: 'nodejs', label: 'Node.js', color: '#3c873a', ...icons('nodejs') },
  git: { id: 'git', label: 'Git', color: '#f05032', ...icons('git') },
  figma: { id: 'figma', label: 'Figma', color: '#a259ff', ...icons('figma') },
}

/** Aliases to TechId for flexible string inputs ("Vue 3", "Nuxt 4", "TS", ...) */
const aliases: Record<string, TechId> = {
  vue: 'vue',
  vue2: 'vue',
  vue3: 'vue',
  vuejs: 'vue',
  nuxt: 'nuxt',
  nuxt2: 'nuxt',
  nuxt3: 'nuxt',
  nuxt4: 'nuxt',
  nuxtjs: 'nuxt',
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  react: 'react',
  reactjs: 'react',
  next: 'nextjs',
  nextjs: 'nextjs',
  pinia: 'pinia',
  tailwind: 'tailwind',
  tailwindcss: 'tailwind',
  vitest: 'vitest',
  stripe: 'stripe',
  socketio: 'socketio',
  socket: 'socketio',
  websockets: 'socketio',
  node: 'nodejs',
  nodejs: 'nodejs',
  git: 'git',
  github: 'git',
  figma: 'figma',
}

export type TechInput = TechId | string

function normalizeKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.js\b/g, 'js')
    .replace(/[^a-z0-9]+/g, '')
}

export function resolveTech(input: TechInput): TechDefinition | null {
  const key = normalizeKey(String(input))
  const candidates = [key, key.replace(/\d+$/g, '')]

  for (const candidate of candidates) {
    if (!candidate) continue
    const id = aliases[candidate]
    if (id) return definitions[id]
  }

  return null
}

export function resolveTechs(inputs: readonly TechInput[]): TechDefinition[] {
  const seen = new Set<TechId>()
  const result: TechDefinition[] = []

  for (const input of inputs) {
    const tech = resolveTech(input)
    if (!tech || seen.has(tech.id)) continue
    seen.add(tech.id)
    result.push(tech)
  }

  return result
}

/**
 * Phrases to detect inside prose (longest first).
 * Matched text is kept as-is; icon comes from TechId.
 */
const prosePhraseSeed: { phrase: string; id: TechId }[] = [
  { phrase: 'Tailwind CSS', id: 'tailwind' },
  { phrase: 'Socket.IO', id: 'socketio' },
  { phrase: 'TypeScript', id: 'typescript' },
  { phrase: 'JavaScript', id: 'javascript' },
  { phrase: 'Nuxt 3-4', id: 'nuxt' },
  { phrase: 'Node.js', id: 'nodejs' },
  { phrase: 'Next.js', id: 'nextjs' },
  { phrase: 'Vue.js', id: 'vue' },
  { phrase: 'Vue 3', id: 'vue' },
  { phrase: 'Vue 2', id: 'vue' },
  { phrase: 'Nuxt 4', id: 'nuxt' },
  { phrase: 'Nuxt 3', id: 'nuxt' },
  { phrase: 'Nuxt 2', id: 'nuxt' },
  { phrase: 'Vitest', id: 'vitest' },
  { phrase: 'Stripe', id: 'stripe' },
  { phrase: 'Tailwind', id: 'tailwind' },
  { phrase: 'Pinia', id: 'pinia' },
  { phrase: 'Figma', id: 'figma' },
  { phrase: 'React', id: 'react' },
  { phrase: 'Nuxt', id: 'nuxt' },
  { phrase: 'Vue', id: 'vue' },
  { phrase: 'Git', id: 'git' },
]

const prosePhrases = prosePhraseSeed
  .slice()
  .sort((a, b) => b.phrase.length - a.phrase.length)

export type TechTextPart =
  | { type: 'text'; value: string }
  | { type: 'tech'; id: TechId; value: string }

function isWordChar(char: string | undefined): boolean {
  return !!char && /[A-Za-z0-9]/.test(char)
}

function hasWordBoundary(text: string, start: number, end: number): boolean {
  const before = start === 0 ? undefined : text[start - 1]
  const after = end >= text.length ? undefined : text[end]
  return !isWordChar(before) && !isWordChar(after)
}

/** Split prose into plain text and inline tech marks. */
export function parseTechText(text: string): TechTextPart[] {
  const parts: TechTextPart[] = []
  let cursor = 0

  while (cursor < text.length) {
    let match: { start: number; end: number; id: TechId; value: string } | null = null

    for (let i = cursor; i < text.length; i++) {
      for (const { phrase, id } of prosePhrases) {
        const end = i + phrase.length
        if (end > text.length) continue
        const slice = text.slice(i, end)
        if (slice.toLowerCase() !== phrase.toLowerCase()) continue
        if (!hasWordBoundary(text, i, end)) continue

        if (!match || i < match.start || (i === match.start && slice.length > match.value.length)) {
          match = { start: i, end, id, value: slice }
        }
      }

      if (match && match.start === i) break
    }

    if (!match) {
      parts.push({ type: 'text', value: text.slice(cursor) })
      break
    }

    if (match.start > cursor) {
      parts.push({ type: 'text', value: text.slice(cursor, match.start) })
    }

    parts.push({ type: 'tech', id: match.id, value: match.value })
    cursor = match.end
  }

  return parts
}

export const techIds = Object.keys(definitions) as TechId[]
