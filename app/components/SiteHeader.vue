<script setup lang="ts">
import { profile } from '~/data/profile'

const route = useRoute()

const homeHref = computed(() => (route.path === '/' ? '#top' : '/'))

function sectionHref(href: string) {
  if (route.path === '/') return href
  return `/${href}`
}

const headerEl = ref<HTMLElement | null>(null)
const hidden = ref(false)
const elevated = ref(false)

const TOP_SHOW = 48
const DELTA = 6
let lastY = 0
let ticking = false

function reducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function updateFromScroll() {
  const y = window.scrollY
  elevated.value = y > 8

  if (y <= TOP_SHOW) {
    hidden.value = false
  } else if (!reducedMotion()) {
    const dy = y - lastY
    if (dy > DELTA) hidden.value = true
    else if (dy < -DELTA) hidden.value = false
  } else {
    // Keep header visible when motion is reduced.
    hidden.value = false
  }

  lastY = y
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateFromScroll()
    ticking = false
  })
}

function onHeaderFocusIn() {
  hidden.value = false
}

onMounted(() => {
  lastY = window.scrollY
  updateFromScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    ref="headerEl"
    class="site-header elevate-band"
    :class="{
      'site-header-hidden': hidden,
      'site-header-elevated': elevated,
    }"
    @focusin="onHeaderFocusIn"
  >
    <div class="site-header-inner mx-auto flex max-w-page flex-wrap items-center gap-x-6 gap-y-2 px-5">
      <a
        :href="homeHref"
        class="site-header-brand font-medium text-ink no-underline hover:text-ink hover:underline"
      >
        {{ profile.name }}
      </a>

      <nav
        class="flex flex-wrap items-center gap-x-1 gap-y-1"
        aria-label="Page sections"
      >
        <a
          v-for="item in profile.nav"
          :key="item.href"
          :href="sectionHref(item.href)"
          class="site-header-link text-sm text-ink-mute no-underline hover:text-accent hover:underline"
        >
          {{ item.label }}
        </a>
      </nav>

      <a
        :href="profile.contacts.telegram.href"
        class="site-header-link site-header-telegram ml-auto text-sm font-medium text-accent no-underline hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        Telegram
      </a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid transparent;
  transition:
    transform 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

.site-header-inner {
  min-height: 3.5rem;
  padding-block: 0.5rem;
}

.site-header-link,
.site-header-brand {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.375rem;
}

.site-header-telegram {
  padding-inline: 0.5rem;
}

.site-header-elevated {
  border-bottom-color: rgb(26 26 26 / 0.1);
  box-shadow: 0 0.5rem 1.25rem rgb(26 26 26 / 0.06);
}

.site-header-hidden {
  transform: translateY(-100%);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .site-header {
    transition: border-color 200ms ease, box-shadow 200ms ease;
  }

  .site-header-hidden {
    transform: none;
    pointer-events: auto;
  }
}
</style>
