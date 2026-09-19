import type { CaseImage } from '~/data/cases'

export type DesignShotSpan = 'hero' | 'wide' | 'tall' | 'square'

export type DesignShot = CaseImage & {
  id: string
  title: string
  span: DesignShotSpan
}

/**
 * Dribbble point studies for the home "Design vision" gallery.
 * Skipped from export: AI Stickers (third-party IP), Calculation (DailyUI), slot machine.
 */
export const designShots: DesignShot[] = [
  {
    id: 'credit-card',
    title: 'Subscription and card payment',
    span: 'wide',
    src: '/design/credit-card-preview.webp',
    srcFull: '/design/credit-card-full.webp',
    alt: 'Two mobile screens: tariff picker and card payment form on a teal field',
    width: 960,
    height: 720,
    fullWidth: 1800,
    fullHeight: 1350,
    objectPosition: 'center center',
  },
  {
    id: 'auth-flow',
    title: 'Authorization flow',
    span: 'square',
    src: '/design/auth-flow-preview.webp',
    srcFull: '/design/auth-flow-full.webp',
    alt: 'Three overlapping phones: sign up, email verify, and password setup',
    width: 960,
    height: 720,
    fullWidth: 1800,
    fullHeight: 1350,
    objectPosition: 'center center',
  },
  {
    id: 'fastbite-menu',
    title: 'FastBite menu',
    span: 'tall',
    src: '/design/fastbite-menu-preview.webp',
    srcFull: '/design/fastbite-menu-full.webp',
    alt: 'FastBite food delivery desktop: promo banner, filters, rolls grid, and cart',
    width: 873,
    height: 960,
    fullWidth: 1636,
    fullHeight: 1800,
    objectPosition: 'top center',
  },
  {
    id: 'pizza-constructor',
    title: 'Pizza constructor',
    span: 'wide',
    src: '/design/pizza-constructor-preview.webp',
    srcFull: '/design/pizza-constructor-full.webp',
    alt: 'FastBite pizza constructor: size rings around the pie and ingredient controls',
    width: 960,
    height: 540,
    fullWidth: 1800,
    fullHeight: 1013,
    objectPosition: 'center center',
  },
  {
    id: 'sports-app',
    title: 'Sports match list',
    span: 'square',
    src: '/design/sports-app-preview.webp',
    srcFull: '/design/sports-app-full.webp',
    alt: 'Dark sports app: live basketball card and upcoming NBA match list',
    width: 960,
    height: 720,
    fullWidth: 1504,
    fullHeight: 1128,
    objectPosition: 'center center',
  },
  {
    id: 'messenger',
    title: 'Messenger',
    span: 'square',
    src: '/design/messenger-preview.webp',
    srcFull: '/design/messenger-full.webp',
    alt: 'Dark messenger: chat list, Design Team thread, and message context menu',
    width: 960,
    height: 721,
    fullWidth: 1438,
    fullHeight: 1080,
    objectPosition: 'center center',
  },
  {
    id: 'saas-landing',
    title: 'SaaS landing',
    span: 'wide',
    src: '/design/saas-landing-preview.webp',
    srcFull: '/design/saas-landing-full.webp',
    alt: 'HostMetrics SaaS landing: hero search, floating metric cards, and features',
    width: 960,
    height: 542,
    fullWidth: 1800,
    fullHeight: 1016,
    objectPosition: 'top center',
  },
  {
    id: 'tickets-landing',
    title: 'Tickets booking',
    span: 'wide',
    src: '/design/tickets-landing-preview.webp',
    srcFull: '/design/tickets-landing-full.webp',
    alt: 'Odessa Opera Nova landing: sky hero, floating tickets, and poster strip',
    width: 960,
    height: 540,
    fullWidth: 1504,
    fullHeight: 846,
    objectPosition: 'center center',
  },
]
