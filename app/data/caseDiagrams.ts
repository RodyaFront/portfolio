/**
 * Validated NDA case diagrams. Authoring + assert live here;
 * `cases.ts` only references the exports.
 *
 * Contract: `docs/case-diagrams.md`
 */
import type { CaseDiagram } from '~/data/caseDiagram'
import { assertCaseDiagram } from '~/utils/caseDiagram'

export const roleBasedPlatformDiagram: CaseDiagram = assertCaseDiagram(
  {
    label:
      'Customer book-pay-chat, expert sessions, and admin ops share one API with Cognito, Stripe, and Socket.IO',
    layout: 'triad',
    nodes: [
      {
        id: 'customer',
        label: 'Book, pay, chat',
        detail: 'Customer app',
        slot: 'north',
      },
      {
        id: 'api',
        label: 'Shared API',
        detail: 'Backend',
        slot: 'center',
      },
      {
        id: 'expert',
        label: 'Sessions + chat',
        detail: 'Expert app',
        slot: 'southwest',
      },
      {
        id: 'admin',
        label: 'Ops + i18n',
        detail: 'Admin app',
        slot: 'southeast',
      },
    ],
    edges: [
      { from: 'customer', to: 'api', label: 'Cognito, Stripe' },
      { from: 'expert', to: 'api', label: 'Socket.IO' },
      { from: 'admin', to: 'api', label: 'Ops APIs' },
    ],
  },
  'role-based-platform',
)

export const linkAnalyticsPlatformDiagram: CaseDiagram = assertCaseDiagram(
  {
    label:
      'Task hub drives backlink import, link research, and analytics dashboards',
    layout: 'hub',
    nodes: [
      {
        id: 'task',
        label: 'Pick a task',
        detail: 'Hub',
        slot: 'hub',
      },
      {
        id: 'import',
        label: 'Import links',
        detail: 'Backlink data',
        slot: 'spoke',
      },
      {
        id: 'research',
        label: 'Research',
        detail: 'Stepped flow',
        slot: 'spoke',
      },
      {
        id: 'dashboards',
        label: 'Analyze',
        detail: '10+ views',
        slot: 'spoke',
      },
    ],
    edges: [
      { from: 'task', to: 'import', label: 'Uploads' },
      { from: 'task', to: 'research', label: 'Workflow' },
      { from: 'task', to: 'dashboards', label: 'Tables' },
    ],
  },
  'link-analytics-platform',
)

export const seoContentWorkspaceDiagram: CaseDiagram = assertCaseDiagram(
  {
    label:
      'Competitor brief into collaborative editor into SEO term and readability scoring',
    layout: 'flow',
    nodes: [
      {
        id: 'brief',
        label: 'Build brief',
        detail: 'Competitors',
      },
      {
        id: 'editor',
        label: 'Write draft',
        detail: 'TipTap + Yjs',
      },
      {
        id: 'score',
        label: 'Score text',
        detail: 'Terms + read',
      },
    ],
    edges: [
      { from: 'brief', to: 'editor', label: 'Targets' },
      { from: 'editor', to: 'score', label: 'Live score' },
    ],
  },
  'seo-content-workspace',
)
