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
        class="site-header-brand"
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
          class="site-header-link"
        >
          {{ item.label }}
        </a>
      </nav>

      <a
        :href="profile.contacts.telegram.href"
        class="press-control site-header-telegram ml-auto"
        rel="noopener noreferrer"
        target="_blank"
      >
        Telegram
        <svg
          class="site-header-telegram-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </g>
        </svg>
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

.site-header-brand,
.site-header-link {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.375rem;
  text-decoration: none;
}

.site-header-brand,
.site-header-brand:hover,
.site-header-brand:focus-visible,
.site-header-brand:visited {
  color: #1a1a1a;
  text-decoration: none;
}

.site-header-brand:hover {
  text-decoration: underline;
}

.site-header-brand {
  font-weight: 500;
}

.site-header-link,
.site-header-link:visited {
  color: #5c5c5c;
  font-size: 0.875rem;
  text-decoration: none;
}

.site-header-link:hover,
.site-header-link:focus-visible {
  color: #1a56db;
  text-decoration: underline;
}

.site-header-telegram {
  --press-face: #26a5e4;
  --action-color: #26a5e4;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.5rem;
  margin: 0;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 999px;
  background-color: #26a5e4;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
}

.site-header-telegram,
.site-header-telegram:hover,
.site-header-telegram:focus-visible,
.site-header-telegram:visited {
  color: #fff;
  text-decoration: none;
}

.site-header-telegram:hover {
  background-color: #1f94cf;
}

.site-header-telegram-icon {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  opacity: 0.9;
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
