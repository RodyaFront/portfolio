import type { ActionIconName } from '~/data/actions'
import type { CaseDiagram } from '~/data/caseDiagram'
import type { TechInput } from '~/data/tech'
import {
  linkAnalyticsPlatformDiagram,
  roleBasedPlatformDiagram,
  seoContentWorkspaceDiagram,
} from '~/data/caseDiagrams'

export type CaseImage = {
  /** Compressed preview for page / card layout. */
  src: string
  /** Native-resolution asset for lightbox; falls back to src. */
  srcFull?: string
  alt: string
  width: number
  height: number
  fullWidth?: number
  fullHeight?: number
  objectPosition?: string
}

export type CasePreview = {
  squares: readonly [CaseImage, CaseImage]
  tall: CaseImage
}

export type CaseKind = 'code-and-design' | 'code' | 'design'

/** Home Portfolio tab: open / personal work vs NDA client work. */
export type CaseShelf = 'non-commercial' | 'nda'

export const caseShelfLabel: Record<CaseShelf, string> = {
  'non-commercial': 'Non-commercial',
  nda: 'Under NDA',
}

export const caseShelves: readonly CaseShelf[] = ['nda', 'non-commercial']

export const caseKindLabel: Record<CaseKind, string> = {
  'code-and-design': 'Code and design',
  code: 'Code',
  design: 'Design',
}

export const caseKindHint: Record<CaseKind, string> = {
  'code-and-design':
    'I did everything on this project: code, design, delivery, and every decision.',
  code: 'I owned the engineering: architecture, implementation, and delivery. Visual design was not mine.',
  design: 'I owned the visual design and product UI. Engineering was not mine.',
}

/** Blue = engineering, pink = visual, violet = both (blue + pink). */
export const caseKindColor: Record<CaseKind, string> = {
  code: '#1a56db',
  design: '#EA4C89',
  'code-and-design': '#6b3fa0',
}

export type CaseLink = {
  id: ActionIconName
  label: string
  href: string
  external?: boolean
}

export type CaseSection = {
  heading: string
  body: string
}

/** Scannable label/value pairs for cards and case Details. */
export type CaseFact = {
  label: string
  value: string
}

/** GitHub-style language share for the case detail page (bytes snapshot). */
export type CaseLanguage = {
  name: string
  /** Share of repository, 0-100. */
  percent: number
  /** Linguist / GitHub language color. */
  color: string
}

export type CaseStudy = {
  slug: string
  title: string
  kind: CaseKind
  /** Portfolio tab on the home page. */
  shelf: CaseShelf
  summary: string
  /** Product keywords for cards / recruiter skim. */
  stack: readonly TechInput[]
  /** Repo language breakdown for the detail page. */
  languages?: readonly CaseLanguage[]
  /** Detail carousel. Omit or leave empty until dual-res shots are ready. */
  images?: CaseImage[]
  /** Home card bento. Omit until card shots are ready. */
  preview?: CasePreview
  /**
   * Short scannable facts for NDA cards (no screenshots).
   * Shown on the home card and under the NDA media block on the case page.
   */
  signals?: readonly string[]
  /**
   * One plain-English line for NDA media: what the product does (no internal step names).
   */
  pitch?: string
  /**
   * Structural facts for skim (apps, ownership, auth, …).
   * Card + Details; keep 3-5 items.
   */
  facts: readonly CaseFact[]
  /**
   * Engineering complexity 1-10. Formula: `docs/case-complexity.md`
   * and `app/utils/caseComplexity.ts`.
   */
  complexity: number
  /**
   * Abstract block diagram for NDA cases (replaces screenshots in the media slot).
   */
  diagram?: CaseDiagram
  role: string
  sections: CaseSection[]
  links: CaseLink[]
}

export const cases: CaseStudy[] = [
  {
    slug: 'ancient-lens',
    title: 'Ancient Lens',
    kind: 'code-and-design',
    shelf: 'non-commercial',
    summary:
      'Public Dota 2 match scorebook: live OpenDota data, tournament-style review, and a visual system built for post-game reading.',
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Pinia', 'Tailwind CSS'],
    languages: [
      { name: 'TypeScript', percent: 41.2, color: '#3178c6' },
      { name: 'Vue', percent: 28.1, color: '#41b883' },
      { name: 'CSS', percent: 18.3, color: '#563d7c' },
      { name: 'JavaScript', percent: 7.2, color: '#f1e05a' },
      { name: 'Python', percent: 5.2, color: '#3572A5' },
    ],
    preview: {
      squares: [
        {
          src: '/work/ancient-lens/card-score-preview.webp',
          srcFull: '/work/ancient-lens/card-score-full.webp',
          alt: 'Ancient Lens match score 12:12, Radiant victory banner, and skills table',
          width: 720,
          height: 660,
          fullWidth: 1024,
          fullHeight: 938,
          objectPosition: 'top center',
        },
        {
          src: '/work/ancient-lens/card-table-preview.webp',
          srcFull: '/work/ancient-lens/card-table-full.webp',
          alt: 'Ancient Lens match overview: Radiant and Dire player table with net worth and damage',
          width: 676,
          height: 720,
          fullWidth: 962,
          fullHeight: 1024,
          objectPosition: 'top left',
        },
      ],
      tall: {
        src: '/work/ancient-lens/card-mvp-preview.webp',
        srcFull: '/work/ancient-lens/card-mvp-full.webp',
        alt: 'Ancient Lens MVP card and Radiant victory summary for match 9005829256',
        width: 398,
        height: 720,
        fullWidth: 566,
        fullHeight: 1024,
        objectPosition: 'top center',
      },
    },
    images: [
      {
        src: '/work/ancient-lens/detail-match-preview.webp',
        srcFull: '/work/ancient-lens/detail-match-full.webp',
        alt: 'Ancient Lens match review: Radiant 12:12 Dire, MVP Alchemist, and skills table',
        width: 720,
        height: 442,
        fullWidth: 1024,
        fullHeight: 629,
        objectPosition: 'top center',
      },
      {
        src: '/work/ancient-lens/detail-combat-preview.webp',
        srcFull: '/work/ancient-lens/detail-combat-full.webp',
        alt: 'Ancient Lens combat tab: worth, GPM, damage, healing, and items for both teams',
        width: 720,
        height: 455,
        fullWidth: 1024,
        fullHeight: 647,
        objectPosition: 'top center',
      },
      {
        src: '/work/ancient-lens/detail-tips-preview.webp',
        srcFull: '/work/ancient-lens/detail-tips-full.webp',
        alt: 'Ancient Lens skills table with item and ability encyclopedia tips open',
        width: 720,
        height: 468,
        fullWidth: 1024,
        fullHeight: 665,
        objectPosition: 'top center',
      },
      {
        src: '/work/ancient-lens/detail-home-preview.webp',
        srcFull: '/work/ancient-lens/detail-home-full.webp',
        alt: 'Ancient Lens match review entry: ID search, local recent list, and bookmarks',
        width: 720,
        height: 404,
        fullWidth: 1024,
        fullHeight: 575,
        objectPosition: 'top center',
      },
      {
        src: '/work/ancient-lens/detail-recent-preview.webp',
        srcFull: '/work/ancient-lens/detail-recent-full.webp',
        alt: 'Ancient Lens recent matches list with live public games, ranks, drafts, and filters',
        width: 720,
        height: 444,
        fullWidth: 1024,
        fullHeight: 631,
        objectPosition: 'top center',
      },
    ],
    role: 'Sole owner: product, visual system, frontend architecture, and production delivery.',
    facts: [
      { label: 'Apps', value: '1' },
      { label: 'Ownership', value: 'Sole (code and design)' },
      { label: 'Data', value: 'Live OpenDota' },
      { label: 'Delivery', value: 'Static generate' },
    ],
    complexity: 4,
    sections: [
      {
        heading: 'What it is',
        body: 'A tournament-style scorebook for a public Dota 2 match. Paste a match ID or an OpenDota / Dotabuff link and get result, draft, party, contribution, economy, and items. It is a working surface for players, not an analytics dashboard and not a Dotabuff clone. Missing numbers stay empty; a real zero stays zero. Stats are not invented.',
      },
      {
        heading: 'What I owned',
        body: 'Everything from the visual system to production: product decisions, compact masthead, match review (score, MVP from real fields, economy / combat / skills tables), recent matches with filters, local bookmarks, JSON export, EN / UK interface, and the deploy path. I did not invent ratings or private insights beyond fields in the match payload.',
      },
      {
        heading: 'How it is built',
        body: 'Nuxt 4, Vue 3, TypeScript, Pinia, and Tailwind CSS. The browser talks to OpenDota with live GETs only: no credentials, no backend proxy. Match payload is shaped in the app; Pinia holds the active match and local bookmarks. Hero and item dictionaries ship with the build; icons load from Valve CDN with text fallbacks. JSON export records provider, time, and live or snapshot mode. Delivery is static (nuxt generate) on Cloudflare Pages. Gate before ship: ESLint, typecheck, Vitest, then generate.',
      },
      {
        heading: 'Who it is for',
        body: 'Post-game readers and stacks: finish a ranked game and understand it in a few minutes, or show a stack game in chat on a phone. Draft identifies the match; both sides stay equally readable; party grouping is obvious without opaque ratings.',
      },
      {
        heading: 'Visual system',
        body: 'Competitive scorebook look: compact masthead, flat dark surfaces, condensed score type, equal-weight Radiant / Dire. Hero portraits are the draft. Color is factual (sides, net worth, party strips). Rules written and implemented in the UI, including item tips and an MVP panel from real match fields.',
      },
    ],
    links: [
      {
        id: 'visit',
        label: 'Visit',
        href: 'https://ancientlens.info',
        external: true,
      },
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/RodyaFront/ancient-lens',
        external: true,
      },
    ],
  },
  {
    slug: 'teotale',
    title: 'Teotale',
    kind: 'code-and-design',
    shelf: 'non-commercial',
    summary:
      'Live Vintage Story multiplayer hub: player accounts, whitelist applications, settlements, and server-facing ops under one brand.',
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vitest'],
    languages: [
      { name: 'Vue', percent: 47, color: '#41b883' },
      { name: 'TypeScript', percent: 36.8, color: '#3178c6' },
      { name: 'C#', percent: 6.4, color: '#178600' },
      { name: 'PowerShell', percent: 4.8, color: '#012456' },
      { name: 'JavaScript', percent: 2.9, color: '#f1e05a' },
      { name: 'CSS', percent: 1.7, color: '#563d7c' },
      { name: 'Other', percent: 0.4, color: '#b0aba3' },
    ],
    preview: {
      squares: [
        {
          src: '/work/teotale/detail-home-preview.webp',
          srcFull: '/work/teotale/detail-home-full.webp',
          alt: 'Teotale landing: hero, Start playing, and server details grid',
          width: 720,
          height: 444,
          fullWidth: 1024,
          fullHeight: 632,
          objectPosition: 'top center',
        },
        {
          src: '/work/teotale/detail-admin-preview.webp',
          srcFull: '/work/teotale/detail-admin-full.webp',
          alt: 'Teotale ops: player management table with whitelist actions open',
          width: 720,
          height: 437,
          fullWidth: 1024,
          fullHeight: 622,
          objectPosition: 'top left',
        },
      ],
      tall: {
        src: '/work/teotale/detail-profile-approved-preview.webp',
        srcFull: '/work/teotale/detail-profile-approved-full.webp',
        alt: 'Teotale profile after approval: whitelist badge, world map, and settlements',
        width: 718,
        height: 720,
        fullWidth: 1021,
        fullHeight: 1024,
        objectPosition: 'top center',
      },
    },
    images: [
      {
        src: '/work/teotale/detail-home-preview.webp',
        srcFull: '/work/teotale/detail-home-full.webp',
        alt: 'Teotale landing: hero, Start playing, and server details grid',
        width: 720,
        height: 444,
        fullWidth: 1024,
        fullHeight: 632,
        objectPosition: 'top center',
      },
      {
        src: '/work/teotale/detail-profile-apply-preview.webp',
        srcFull: '/work/teotale/detail-profile-apply-full.webp',
        alt: 'Teotale profile before whitelist: Fill application and not whitelisted status',
        width: 720,
        height: 705,
        fullWidth: 1024,
        fullHeight: 1003,
        objectPosition: 'top center',
      },
      {
        src: '/work/teotale/detail-admin-preview.webp',
        srcFull: '/work/teotale/detail-admin-full.webp',
        alt: 'Teotale ops: player management table with whitelist actions open',
        width: 720,
        height: 437,
        fullWidth: 1024,
        fullHeight: 622,
        objectPosition: 'top left',
      },
      {
        src: '/work/teotale/detail-profile-approved-preview.webp',
        srcFull: '/work/teotale/detail-profile-approved-full.webp',
        alt: 'Teotale profile after approval: whitelist badge, world map, and settlements',
        width: 718,
        height: 720,
        fullWidth: 1021,
        fullHeight: 1024,
        objectPosition: 'top center',
      },
      {
        src: '/work/teotale/detail-about-preview.webp',
        srcFull: '/work/teotale/detail-about-full.webp',
        alt: 'Teotale About server: world map, server facts, IP copy, and Discord link',
        width: 709,
        height: 720,
        fullWidth: 1008,
        fullHeight: 1024,
        objectPosition: 'top center',
      },
    ],
    role: 'Sole owner: product, site UI, accounts and whitelist, server tooling, and production delivery.',
    facts: [
      { label: 'Apps', value: '1 site + server tooling' },
      { label: 'Ownership', value: 'Sole (code and design)' },
      { label: 'Auth', value: 'JWT sessions' },
      { label: 'Live', value: 'Public hub' },
    ],
    complexity: 5,
    sections: [
      {
        heading: 'What it is',
        body: 'Teotale is a branded hub for a Vintage Story survival server: no scheduled wipes, curated vanilla+ mods, player-driven economy, and settlements. The site is the join path - register, apply for whitelist, then get connection details and the mod pack after approval. It is a working community product, not a landing that points at Discord.',
      },
      {
        heading: 'What I owned',
        body: 'Product decisions and delivery end to end: public site (server info, mods, FAQ, builds gallery), player accounts, whitelist applications, post-approval access to address and packs, i18n, and the ops surface around the live server. Companion game-side auth ties site accounts to Vintage Story. I shipped the brand as Teotale; the private GitHub slug is legacy and not the product name.',
      },
      {
        heading: 'How it is built',
        body: 'Nuxt 4, Vue 3, TypeScript, and Tailwind CSS with a Node server (not a static brochure). Site auth uses JWT sessions; account and whitelist flows sit behind Nuxt server routes. i18n for the player UI. Vitest covers web account paths. A C# AuthMod on the game server links whitelist to real joins. Quality gate includes Vitest on the web side before ship.',
      },
      {
        heading: 'Who it is for',
        body: 'Players who want a lasting vanilla+ Vintage Story world with a clear apply-and-join path, and anyone evaluating whether the server is real before installing mods. Staff use the same product surface instead of a pastebin IP.',
      },
      {
        heading: 'Visual system',
        body: 'Dark game-community chrome tuned for long reading: server facts, mod list, FAQ, and account flows without fake dashboard polish. Hierarchy stays typographic; accent marks primary actions (register, apply, join). Branding stays Teotale everywhere the player looks.',
      },
    ],
    links: [
      {
        id: 'visit',
        label: 'Visit',
        href: 'https://teotale.com',
        external: true,
      },
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/RodyaFront/VintageStoryServer',
        external: true,
      },
    ],
  },
  {
    slug: 'creative-service-marketplace',
    title: 'Creative Service Marketplace',
    kind: 'code-and-design',
    shelf: 'non-commercial',
    summary:
      'Commission storefront for traditional watercolor pet portraits: catalog, order flow, artist and admin tools, Stripe, and i18n.',
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Pinia', 'Tailwind CSS', 'Stripe'],
    languages: [
      { name: 'Vue', percent: 54.4, color: '#41b883' },
      { name: 'TypeScript', percent: 34.3, color: '#3178c6' },
      { name: 'Python', percent: 7.9, color: '#3572A5' },
      { name: 'Shell', percent: 2.5, color: '#89e051' },
      { name: 'CSS', percent: 0.8, color: '#563d7c' },
      { name: 'Other', percent: 0.1, color: '#b0aba3' },
    ],
    preview: {
      squares: [
        {
          src: '/work/creative-service-marketplace/detail-home-preview.webp',
          srcFull: '/work/creative-service-marketplace/detail-home-full.webp',
          alt: 'Creative Service Marketplace home: portrait masonry hero and Order a Portrait',
          width: 720,
          height: 527,
          fullWidth: 1024,
          fullHeight: 749,
          objectPosition: 'center center',
        },
        {
          src: '/work/creative-service-marketplace/detail-gallery-cms-preview.webp',
          srcFull: '/work/creative-service-marketplace/detail-gallery-cms-full.webp',
          alt: 'Studio Admin Gallery CMS: published watercolor works in a five-across grid',
          width: 720,
          height: 443,
          fullWidth: 1024,
          fullHeight: 630,
          objectPosition: 'top left',
        },
      ],
      tall: {
        src: '/work/creative-service-marketplace/detail-about-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-about-full.webp',
        alt: 'Not AI section with artist profile and framed hand-painting process photo',
        width: 720,
        height: 534,
        fullWidth: 1024,
        fullHeight: 759,
        objectPosition: 'top right',
      },
    },
    images: [
      {
        src: '/work/creative-service-marketplace/detail-home-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-home-full.webp',
        alt: 'Creative Service Marketplace home: portrait masonry hero and Order a Portrait',
        width: 720,
        height: 527,
        fullWidth: 1024,
        fullHeight: 749,
        objectPosition: 'top center',
      },
      {
        src: '/work/creative-service-marketplace/detail-about-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-about-full.webp',
        alt: 'Not AI section with artist profile and framed hand-painting process photo',
        width: 720,
        height: 534,
        fullWidth: 1024,
        fullHeight: 759,
        objectPosition: 'top center',
      },
      {
        src: '/work/creative-service-marketplace/detail-estimate-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-estimate-full.webp',
        alt: 'Estimate your portrait: size, background, pets, timing, and continue to order',
        width: 720,
        height: 450,
        fullWidth: 1024,
        fullHeight: 640,
        objectPosition: 'top center',
      },
      {
        src: '/work/creative-service-marketplace/detail-order-review-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-order-review-full.webp',
        alt: 'Order review step: check portrait, photos, contact, and submit order',
        width: 720,
        height: 579,
        fullWidth: 1024,
        fullHeight: 823,
        objectPosition: 'top center',
      },
      {
        src: '/work/creative-service-marketplace/detail-admin-launch-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-admin-launch-full.webp',
        alt: 'Studio Admin launch path: go-live stages, checklist, and traction panel',
        width: 720,
        height: 439,
        fullWidth: 1024,
        fullHeight: 624,
        objectPosition: 'top left',
      },
      {
        src: '/work/creative-service-marketplace/detail-gallery-cms-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-gallery-cms-full.webp',
        alt: 'Studio Admin Gallery CMS: published watercolor works in a five-across grid',
        width: 720,
        height: 443,
        fullWidth: 1024,
        fullHeight: 630,
        objectPosition: 'top left',
      },
      {
        src: '/work/creative-service-marketplace/detail-bg-previews-preview.webp',
        srcFull: '/work/creative-service-marketplace/detail-bg-previews-full.webp',
        alt: 'Studio Admin background previews: upload slots for no background, soft tone, detailed',
        width: 720,
        height: 442,
        fullWidth: 1024,
        fullHeight: 629,
        objectPosition: 'top left',
      },
    ],
    role: 'Sole owner: product, storefront UI, order and admin flows, payments, and delivery.',
    facts: [
      { label: 'Apps', value: '1 (store + admin)' },
      { label: 'Ownership', value: 'Sole (code and design)' },
      { label: 'Payments', value: 'Stripe' },
      { label: 'Auth', value: 'Session accounts' },
    ],
    complexity: 6,
    sections: [
      {
        heading: 'What it is',
        body: 'A freelance artist storefront for watercolor pet portrait commissions. Customers browse work, place an order, and pay; the artist and admin sides cover fulfillment and ops. It is a real commerce surface with auth and i18n, not a brochure landing.',
      },
      {
        heading: 'What I owned',
        body: 'End-to-end product ownership: public catalog and order path, customer accounts, artist and admin tools, Stripe checkout, email via Resend, image handling, and the Nuxt server delivery path. Source stays private; the live storefront and screens are what hiring readers can open.',
      },
      {
        heading: 'How it is built',
        body: 'Nuxt 4, Vue 3, TypeScript, Pinia, and Tailwind CSS with a Node server. Postgres via Drizzle ORM. Stripe for payments; jose and bcrypt for auth sessions. i18n for the storefront. Sharp for image work. Typecheck with vue-tsc before ship.',
      },
      {
        heading: 'Who it is for',
        body: 'Pet owners commissioning a traditional watercolor portrait, and the artist running orders without a patchwork of forms and spreadsheets. Hiring readers see Vue/Nuxt commerce ownership with Stripe, not another marketing mock.',
      },
      {
        heading: 'Visual system',
        body: 'Storefront chrome tuned for artwork first: calm surfaces, clear order steps, and admin density where ops need it. Hierarchy stays typographic; primary actions mark pay and submit.',
      },
    ],
    links: [
      {
        id: 'visit',
        label: 'Visit',
        href: 'http://creative-marketplace.duckdns.org/',
        external: true,
      },
    ],
  },
  {
    slug: 'role-based-platform',
    title: 'Role-based product platform',
    kind: 'code',
    shelf: 'nda',
    summary:
      'Three role-separated Nuxt apps from scratch: customer product, expert workspace, and admin ops, with auth, payments, booking, and realtime sessions under one platform.',
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Pinia', 'Socket.IO', 'Stripe'],
    signals: [
      'Three Nuxt apps by role',
      'Cognito auth and Stripe payments',
      'Realtime sessions and chat',
      'Admin ops and i18n publish',
    ],
    pitch:
      'Sole frontend across three apps: customers book and pay, experts run sessions and chat, admins operate the platform.',
    diagram: roleBasedPlatformDiagram,
    role: 'Frontend engineering at Yaradin: sole ownership across client, manager, and admin Nuxt apps. Visual design was not mine; I pushed UI changes when proposals were weak.',
    facts: [
      { label: 'Apps', value: '3 Nuxt' },
      { label: 'Ownership', value: 'Sole FE' },
      { label: 'Auth', value: 'Cognito' },
      { label: 'Realtime', value: 'Socket.IO' },
      { label: 'Payments', value: 'Stripe' },
    ],
    complexity: 10,
    sections: [
      {
        heading: 'What it is',
        body: 'A multi-domain commercial platform with a separate frontend per role. The customer app covers marketing, accounts, booking, payments, and product surfaces, with selective SSR where SEO matters. The expert app is an SPA workspace for schedule, live sessions, chat, media, and payouts. The admin app is platform ops: people, moderation, content, salary, analytics, and a localization publish workflow. Live URLs and client screens stay under NDA.',
      },
      {
        heading: 'What I owned',
        body: 'Sole Frontend Engineer on the product team, owning frontend across all three Nuxt apps end to end: architecture per app (feature-slice / domain separation), shared conventions without cross-app imports, Cognito auth flows, Stripe payment and booking UI, Socket.IO realtime for chat and session state, and admin tools including an i18n editor with publish workflow. Visual design was owned by design; I challenged weak proposals and pushed UI decisions that better fit business and product needs. Also frontend standards, Git workflow, and CI quality gates (lint, typecheck, tests, build).',
      },
      {
        heading: 'How it is built',
        body: 'Three Nuxt 4 apps (Vue 3, TypeScript, Pinia, Nuxt UI) in one monorepo beside a NestJS API. Customer app: SSR with route-level opt-outs and prerender for selected public pages; Stripe and reCAPTCHA on transactional flows. Expert and admin: SPA. Auth via AWS Cognito (aws-amplify). HTTP through a shared useApiFetch pattern. Realtime via Socket.IO namespaces with JWT on connect. i18n JSON per app; admin can publish translations. No shared frontend package between apps by design.',
      },
      {
        heading: 'Who it is for',
        body: 'Hiring readers evaluating multi-app Vue/Nuxt ownership: not a single dashboard, but three products with different jobs, rendering modes, and risk profiles (SEO customer surface, realtime operator workspace, dense admin ops).',
      },
    ],
    links: [],
  },
  {
    slug: 'link-analytics-platform',
    title: 'Link analytics platform',
    kind: 'code',
    shelf: 'nda',
    summary:
      'Task-based SEO link analytics: import backlink exports, then work a suite of dashboards for research, donors, URL analytics, and project tracking.',
    stack: ['Nuxt 2', 'Vue 2', 'Vuetify', 'Vuex', 'ApexCharts'],
    signals: [
      'Task hub with many dashboards',
      'Backlink import and link database',
      'Dense tables, filters, and charts',
      'Link research and donor monitoring',
    ],
    pitch:
      'Operators pick a link-building task, import backlink data, then run specialized dashboards for research, donors, and URL analytics.',
    diagram: linkAnalyticsPlatformDiagram,
    role: 'Frontend on the Nuxt 2 analytics SPA: task hub, import flows, and data-heavy dashboard suite.',
    facts: [
      { label: 'Apps', value: '1 SPA' },
      { label: 'Surfaces', value: '10+ dashboards' },
      { label: 'Focus', value: 'Link / SEO data' },
      { label: 'Stack era', value: 'Nuxt 2 + Vuex' },
    ],
    complexity: 7,
    sections: [
      {
        heading: 'What it is',
        body: 'An internal SEO / link-building analytics product. Work starts from a task (name, country, imported backlink files and domains). From the hub you open specialized tools: link analyzer, all-links and advanced analysis, stepped link research, composed analytics, URL analytics, link-database management, project tracking boards, page and anchor type checkers, rejected-donor monitoring, and an import manager. Live product URL and client screens stay under NDA.',
      },
      {
        heading: 'What I owned',
        body: 'Frontend on the Nuxt 2 SPA: welcome hub and task selection, create-task and import paths, and the dashboard surfaces operators use daily (filters, dense tables, charts, processing views). Vuex modules back the major tools. Visual chrome follows the company admin kit; engineering of the analytics UX and data workflows was the frontend job.',
      },
      {
        heading: 'How it is built',
        body: 'Nuxt 2 SPA (ssr: false), Vue 2, Vuetify 2, Vuex, and Composition API. ApexCharts for chart views. Axios API plugin, auth and task stores, per-dashboard Vuex modules. Jest unit tests and Cypress e2e; Sentry in the production client config.',
      },
      {
        heading: 'Who it is for',
        body: 'SEO and link operators who need many specialized views on the same imported link set, not a single generic table. Hiring readers see a classic data-heavy Vue analytics SPA with a clear task-to-dashboard loop.',
      },
    ],
    links: [],
  },
  {
    slug: 'seo-content-workspace',
    title: 'SEO content workspace',
    kind: 'code-and-design',
    shelf: 'nda',
    summary:
      'Competitor-driven SEO content workspace: build a brief from SERP pages and keywords, then write in a collaborative editor scored against term targets, readability, and length.',
    stack: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Pinia', 'TipTap', 'Yjs'],
    signals: [
      'Competitor-backed SEO brief',
      'Collaborative TipTap editor',
      'Term targets and readability score',
      'Code and product UI',
    ],
    pitch:
      'Writers set up a page against SERP competitors, then draft and score the text in a shared editor.',
    diagram: seoContentWorkspaceDiagram,
    role: 'Code and design: create-task flow, collaborative TipTap editor, SEO analytics sidebar, and the product UI system.',
    facts: [
      { label: 'Apps', value: '1 SPA' },
      { label: 'Ownership', value: 'Code and design' },
      { label: 'Editor', value: 'TipTap + Yjs' },
      { label: 'Focus', value: 'SEO scoring' },
    ],
    complexity: 6,
    sections: [
      {
        heading: 'What it is',
        body: 'A SaaS workspace for SEO content writers. You set a target URL, keywords, country, language, niche, page type, and intent, pull competitor pages from the SERP, and get a brief with term ranges and readability markers. The editor is where the draft is written and scored: useful vs not-useful terms, TF-IDF against competitors, a full readability suite, content score, H1-H6 structure, expected length, plus tools for AI section recommendations, controlled keyword replace, naturalness, short-sentence chains, and proper-name casing. Realtime co-editing runs in the document. Live product URL and client screens stay under NDA.',
      },
      {
        heading: 'What I owned',
        body: 'End-to-end frontend product work on the Nuxt 3 app: task list, five-step create-task wizard (settings, competitors, content prep, readability markers, term collection with WebSocket progress), and the editor (layout, TipTap document, analytics sidebar, highlight presets, writing tools). Collaboration uses Yjs with WebRTC cursors; keyword recalculation updates over Laravel Echo / Pusher. I owned both the engineering of those flows and the visual/UI decisions for the surfaces operators use daily.',
      },
      {
        heading: 'How it is built',
        body: 'Nuxt 3 SPA (ssr: false), Vue 3, TypeScript, Pinia, and Vuetify 3. TipTap for the rich document (tables, markdown, highlight, HTML mode). Yjs and y-webrtc for collaborative editing. Laravel Echo with Pusher for task and keyword events. Client NLP helpers via compromise for chain detection. Talks to a shared company analytics API for terms, readability, competitors, and AI recommendations.',
      },
      {
        heading: 'Who it is for',
        body: 'SEO and content operators who write or rewrite pages against real SERP competitors, not against a blank brief. Hiring readers see a data-heavy Vue/Nuxt product: brief from competitors, collaborative write loop, and score-driven iteration.',
      },
      {
        heading: 'Visual system',
        body: 'Dense operator UI built for long sessions: clear create-task steps, a split editor with a resizable analytics sidebar, term and readability panels that stay scannable next to the draft, and tool drawers that do not fight the document. Hierarchy comes from type, spacing, and section tabs rather than decorative chrome. Screenshots stay private under NDA; the structure is what this write-up documents.',
      },
    ],
    links: [],
  },
]

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((item) => item.slug === slug)
}
