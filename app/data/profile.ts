/**
 * Canonical profile for the site.
 * Source: d:\ПоискРаботы\CV\v16\HordiienkoRodionCV.md
 * Raw copy: content/cv/HordiienkoRodionCV.md
 */

export type ProfileLink = {
  label: string
  href: string
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type ExperienceRole = {
  company: string
  title: string
  employment?: string
  /** Inclusive month start, YYYY-MM */
  start: string
  /** Inclusive month end, YYYY-MM, or `present` */
  end: string
  period: string
  location?: string
  highlights: string[]
  projects?: string[]
  /** Latest commercial role; shown with a flag on the career timeline */
  current?: boolean
  /** When false, omitted from the homepage career timeline */
  timeline?: boolean
}

export type NavItem = {
  label: string
  href: string
}

export const profile = {
  name: 'Rodion Hordiienko',
  headline: 'Frontend Engineer · Technical Ownership',
  location: 'Odesa, Ukraine',
  /** Prefer `getTotalExperience(profile.experience)` in UI; keep roughly in sync for meta. */
  yearsOfExperience: 5,
  nav: [
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Design', href: '#design' },
  ] satisfies NavItem[],
  hero: {
    thesis:
      'Primary frontend owner for SaaS and product platforms: architecture, delivery, and production. Vue 3 / Nuxt / TypeScript; also designs product UI.',
    availability: 'Open to remote or hybrid roles, timezone EET',
    timeZone: 'Europe/Kyiv',
    actions: [
      {
        id: 'telegram',
        label: 'Message on Telegram',
        href: 'https://t.me/RodyaYa',
        external: true,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/rodion-hordiienko-8a3090232/',
        external: true,
      },
      {
        id: 'dribbble',
        label: 'Dribbble',
        href: 'https://dribbble.com/Rodyaya',
        external: true,
      },
      {
        id: 'built',
        label: 'View projects',
        href: '#portfolio',
      },
      {
        id: 'designed',
        label: 'View designs',
        href: '#design',
      },
      {
        id: 'email',
        label: 'Email',
        href: 'mailto:rodyaforbusines@gmail.com',
      },
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/RodyaFront',
        external: true,
      },
    ],
  },
  contacts: {
    email: 'rodyaforbusines@gmail.com',
    phone: '+380681060965',
    telegram: {
      handle: '@RodyaYa',
      href: 'https://t.me/RodyaYa',
    },
    dribbble: 'https://dribbble.com/Rodyaya',
    linkedin: 'https://www.linkedin.com/in/rodion-hordiienko-8a3090232/',
    github: 'https://github.com/RodyaFront',
  },
  links: [
    { label: 'Email', href: 'mailto:rodyaforbusines@gmail.com' },
    { label: 'Telegram', href: 'https://t.me/RodyaYa' },
    { label: 'GitHub', href: 'https://github.com/RodyaFront' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rodion-hordiienko-8a3090232/' },
    { label: 'Dribbble', href: 'https://dribbble.com/Rodyaya' },
  ] satisfies ProfileLink[],
  summary: [
    'Frontend Engineer with 4+ years building SaaS and product platforms on Vue 3, Nuxt, and TypeScript.',
    'Usually the primary frontend owner: architecture, delivery scope, standards, and end-to-end delivery from scratch to production. Strong in role-based apps, realtime features, auth, and payment flows.',
    'Core stack: Vue 3 / Nuxt 3-4 / TypeScript. Secondary: React / Next.js.',
  ],
  coreStack: ['Vue 3', 'Nuxt 3-4', 'TypeScript'],
  secondaryStack: ['React', 'Next.js'],
  skills: [
    {
      title: 'Languages & Frameworks',
      items: [
        'JavaScript (ES6+)',
        'TypeScript',
        'Vue.js (2, 3)',
        'Composition API',
        'Nuxt.js (2, 3, 4)',
        'React.js',
        'Next.js',
        'Pinia',
        'Vuex',
        'Redux Toolkit',
        'Zustand',
        'Tailwind CSS',
        'Vuetify',
        'Material UI',
        'Nuxt UI',
      ],
    },
    {
      title: 'Architecture & Product Frontend',
      items: [
        'SPA / SSR architecture',
        'Role-based apps, admin tools, data-heavy dashboards',
        'Auth/authorization flows, Stripe payments/checkout',
        'Real-time features (WebSockets / Socket.IO)',
        'Design systems, Figma handoff, performance optimization',
        'SOLID, DRY, KISS, clean/modular architecture, feature-slice / domain separation',
      ],
    },
    {
      title: 'Tools & Quality',
      items: [
        'Git',
        'GitHub',
        'Bitbucket',
        'pnpm',
        'Vite',
        'Webpack',
        'Docker',
        'GitHub Actions',
        'CI/CD (lint, typecheck, test, build)',
        'AWS Cognito',
        'AWS S3',
        'Stripe',
        'Sentry',
        'Vitest',
        'Cypress',
        'Jest',
        'ESLint',
        'Prettier',
        'Husky',
      ],
    },
  ] satisfies SkillGroup[],
  experience: [
    {
      company: 'Yaradin',
      title: 'Frontend Engineer',
      employment: 'Technical ownership',
      start: '2025-08',
      end: '2026-07',
      period: 'Aug 2025 - Jul 15, 2026',
      location: 'Odesa, Ukraine',
      current: true,
      highlights: [
        'Sole Frontend Engineer on a product team (5 engineers + QA + PM), owning frontend across three role-based applications (client, manager, admin).',
        'Delivered a multi-domain frontend platform from scratch to production in 9 months with full feature scope (not MVP-only) using Nuxt 4, Vue 3, TypeScript, Pinia, and Nuxt UI.',
        'Owned per-app frontend architecture (domain separation / feature-slice), focused on extensibility, testability, and shared logic without duplication.',
        'Built a contract-based fake/http data layer with one-click switch to real APIs so QA could test critical flows without pausing when backend endpoints were briefly unavailable.',
        'Challenged weak design proposals and pushed UI decisions that better fit business needs in discussions with designers and stakeholders.',
        'Established frontend standards: code style rules, Git workflow, and CI quality gates (lint, typecheck, tests, build).',
        'Implemented real-time communication with Socket.IO, including chat sync, session state, unread indicators, and reconnection recovery.',
        'Built authentication flows with AWS Cognito (sign-up, login, email/SMS confirmation codes, password reset/recovery, OAuth, route middleware, cross-tab session sync).',
        'Developed payment and booking flows with Stripe and backend APIs, from onboarding to transaction history.',
        'Delivered admin tools for moderation, manager accounts, refunds, and localization, including a custom i18n editor with publish workflow.',
        'Maintained code quality with TypeScript, ESLint, Prettier, Husky; supported CI/CD via GitHub Actions, Docker, AWS S3, and Ansible.',
      ],
      projects: [
        'Role-based product platform (customer, expert, and admin Nuxt apps; Cognito, Stripe, Socket.IO)',
      ],
    },
    {
      company: 'Boosta',
      title: 'Frontend Developer',
      start: '2022-04',
      end: '2025-07',
      period: 'Apr 2022 - Jul 2025',
      location: 'Odesa, Ukraine',
      highlights: [
        'Sole Frontend Developer on multiple SaaS products using Vue 2/3, Nuxt 2/3, TypeScript, Composition API, Vuetify, Pinia, and Tailwind CSS.',
        'Owned frontend architecture and internal design systems used across product modules.',
        'Built 150+ dashboards and related UI for analytics platforms and business tools.',
        'Developed data-heavy dashboards with large datasets and realtime updates.',
        'Implemented token-based billing and subscription management UI.',
        'Migrated legacy Vue/Nuxt JavaScript codebases to Vue 3 + TypeScript (Composition API).',
        'Full frontend ownership in collaboration with backend teams.',
      ],
      projects: [
        'SEO Analytics Platform (150+ dashboards, multilingual UI)',
        'SEO Competitor Tool (migration + AI text analysis)',
        'SaaS subscription platform (token-based billing)',
        'Team Performance Tool (analytics dashboards)',
      ],
    },
    {
      company: 'Cynebo',
      title: 'Frontend Developer',
      start: '2021-07',
      end: '2022-05',
      period: 'Jul 2021 - May 2022',
      highlights: [
        'Developed web applications using Vue.js 2, Nuxt.js 2, JavaScript.',
        'Delivered landing pages, marketplaces, and B2B/B2C platforms.',
        'Implemented dynamic forms, layouts, and backend integrations.',
        'Ensured cross-browser compatibility and responsive design.',
      ],
    },
    {
      company: 'Contract Projects',
      title: 'Frontend Developer',
      employment: 'React / Next.js · Contract (part-time, evenings/weekends)',
      start: '2021-01',
      end: '2025-12',
      period: '2021 - 2025',
      location: 'Remote',
      timeline: false,
      highlights: [
        'Parallel side contracts in free time outside full-time roles: React, Next.js, TypeScript, SSR apps.',
        'LinkVault: drag-and-drop builder platform with SSR and Redux Toolkit.',
        'FitTrack: dashboard UI with virtualized tables and Zustand state management.',
        'Integrated third-party APIs and applied performance-oriented UI patterns on data-heavy screens.',
      ],
      projects: ['LinkVault', 'FitTrack'],
    },
  ] satisfies ExperienceRole[],
  achievements: [
    'Built a multi-application frontend platform (client, manager, admin) from scratch.',
    'Delivered real-time communication systems with robust state synchronization.',
    'Implemented production-ready authentication and payment systems (AWS Cognito, Stripe).',
    'Developed internal admin tools for moderation, localization, and financial operations.',
    'Led frontend development as the primary engineer in product teams.',
    'Built 150+ dashboards across SaaS, analytics, and business platforms.',
    'Migrated legacy applications to modern Vue 3 + TypeScript architecture.',
    'Improved performance and maintainability of large-scale frontend systems.',
  ],
  languages: [
    { name: 'Ukrainian', level: 'Native' },
    { name: 'English', level: 'B2 (CEFR) Upper-Intermediate' },
  ],
  preferences: {
    workFormat: ['remote', 'hybrid'],
  },
} as const
