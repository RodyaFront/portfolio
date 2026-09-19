<script setup lang="ts">
import {
  cases,
  caseShelfLabel,
  caseShelves,
  type CaseShelf,
} from '~/data/cases'
import CaseCard from '~/components/CaseCard.vue'

const section = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const shelf = ref<CaseShelf>('nda')
const tablistId = useId()

const canPrev = ref(false)
const canNext = ref(false)
const showRailNav = computed(() => canPrev.value || canNext.value)

const visibleCases = computed(() =>
  cases
    .filter((study) => study.shelf === shelf.value)
    .slice()
    .sort((a, b) => b.complexity - a.complexity || a.title.localeCompare(b.title)),
)

const MAX_SHIFT = 14
const LERP = 0.14
const REST_EPSILON = 0.04

let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let rafId = 0

function reducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function applyPattern() {
  const el = section.value
  if (!el) return
  el.style.setProperty('--pattern-x', `${currentX.toFixed(2)}px`)
  el.style.setProperty('--pattern-y', `${currentY.toFixed(2)}px`)
}

function tick() {
  rafId = 0
  currentX += (targetX - currentX) * LERP
  currentY += (targetY - currentY) * LERP
  applyPattern()

  const settled =
    Math.abs(targetX - currentX) < REST_EPSILON
    && Math.abs(targetY - currentY) < REST_EPSILON

  if (settled) {
    currentX = targetX
    currentY = targetY
    applyPattern()
    return
  }

  rafId = requestAnimationFrame(tick)
}

function startLoop() {
  if (rafId || reducedMotion()) return
  rafId = requestAnimationFrame(tick)
}

function onWindowMove(event: PointerEvent) {
  if (reducedMotion()) return
  if (window.innerWidth === 0 || window.innerHeight === 0) return

  const nx = event.clientX / window.innerWidth - 0.5
  const ny = event.clientY / window.innerHeight - 0.5
  targetX = nx * MAX_SHIFT
  targetY = ny * MAX_SHIFT
  startLoop()
}

function updateRailScrollState() {
  const el = rail.value
  if (!el) {
    canPrev.value = false
    canNext.value = false
    return
  }
  const max = el.scrollWidth - el.clientWidth
  if (max <= 2) {
    canPrev.value = false
    canNext.value = false
    return
  }
  canPrev.value = el.scrollLeft > 2
  canNext.value = el.scrollLeft < max - 2
}

function scrollRail(dir: -1 | 1) {
  const el = rail.value
  if (!el) return
  const card = el.querySelector('.case-card') as HTMLElement | null
  const track = el.querySelector('.case-rail-track') as HTMLElement | null
  const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24 : 24
  const step = (card?.offsetWidth ?? Math.round(el.clientWidth * 0.85)) + gap
  el.scrollBy({
    left: dir * step,
    behavior: reducedMotion() ? 'auto' : 'smooth',
  })
}

function selectShelf(next: CaseShelf) {
  shelf.value = next
}

function onTabKeydown(event: KeyboardEvent) {
  const index = caseShelves.indexOf(shelf.value)
  if (index < 0) return

  let next = -1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = (index + 1) % caseShelves.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = (index - 1 + caseShelves.length) % caseShelves.length
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = caseShelves.length - 1
  }

  if (next < 0) return
  const nextShelf = caseShelves[next]
  if (!nextShelf) return
  event.preventDefault()
  shelf.value = nextShelf
}

function onRailKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollRail(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollRail(1)
  }
}

watch(shelf, async () => {
  await nextTick()
  const el = rail.value
  if (el) el.scrollLeft = 0
  updateRailScrollState()
})

watch(visibleCases, async () => {
  await nextTick()
  updateRailScrollState()
})

onMounted(() => {
  updateRailScrollState()
  window.addEventListener('resize', updateRailScrollState, { passive: true })
  if (!reducedMotion()) {
    window.addEventListener('pointermove', onWindowMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onWindowMove)
  window.removeEventListener('resize', updateRailScrollState)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    id="portfolio"
    ref="section"
    class="pattern-band"
    aria-labelledby="portfolio-heading"
  >
    <div class="portfolio-head mx-auto max-w-page px-5 pt-12">
      <div class="portfolio-head-copy">
        <h2 id="portfolio-heading" class="text-2xl font-semibold tracking-tight">
          Portfolio
        </h2>
        <p class="text-ink-mute">
          Product UI and visual design.
        </p>
      </div>

      <div class="portfolio-head-controls">
        <div
          :id="tablistId"
          class="portfolio-tabs"
          role="tablist"
          aria-label="Portfolio shelves"
          @keydown="onTabKeydown"
        >
          <button
            v-for="item in caseShelves"
            :id="`${tablistId}-${item}`"
            :key="item"
            type="button"
            class="press-control portfolio-tab"
            :class="{ 'portfolio-tab-active': shelf === item }"
            role="tab"
            :aria-selected="shelf === item"
            :tabindex="shelf === item ? 0 : -1"
            :aria-controls="`portfolio-panel-${item}`"
            @click="selectShelf(item)"
          >
            {{ caseShelfLabel[item] }}
          </button>
        </div>

        <div
          v-if="showRailNav"
          class="case-rail-nav"
          role="group"
          aria-label="Scroll portfolio cases"
        >
          <button
            type="button"
            class="press-control case-rail-nav-btn"
            aria-label="Previous cases"
            :disabled="!canPrev"
            @click="scrollRail(-1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 18 9 12l6-6"
              />
            </svg>
          </button>
          <button
            type="button"
            class="press-control case-rail-nav-btn"
            aria-label="Next cases"
            :disabled="!canNext"
            @click="scrollRail(1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      :id="`portfolio-panel-${shelf}`"
      ref="rail"
      class="case-rail"
      role="tabpanel"
      :aria-labelledby="`${tablistId}-${shelf}`"
      tabindex="0"
      @scroll="updateRailScrollState"
      @keydown="onRailKeydown"
    >
      <div v-if="visibleCases.length" class="case-rail-track">
        <CaseCard
          v-for="study in visibleCases"
          :key="study.slug"
          :study="study"
        />
      </div>
      <p v-else class="case-rail-empty text-ink-mute">
        {{
          shelf === 'nda'
            ? 'NDA cases are not listed yet.'
            : 'No cases in this shelf yet.'
        }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.portfolio-head {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: var(--space-related);
}

.portfolio-head-copy {
  min-width: 0;
  grid-column: 1;
  justify-self: start;
}

.portfolio-head-controls {
  display: contents;
}

.portfolio-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: 999px;
  background-color: var(--bg-elevate);
  grid-column: 2;
  justify-self: center;
}

.portfolio-tab {
  --press-face: transparent;
  margin: 0;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 999px;
  background-color: transparent;
  color: #5c5c5c;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
}

.portfolio-tab-active {
  --press-face: #1a1a1a;
  background-color: #1a1a1a;
  color: #f7f4ef;
}

.portfolio-tab-active:hover {
  color: #f7f4ef;
}

.case-rail-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  grid-column: 3;
  justify-self: end;
}

.case-rail-nav-btn {
  --press-face: var(--bg-elevate);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin: 0;
  padding: 0;
  border: 1px solid rgb(26 26 26 / 0.22);
  border-radius: 999px;
  background-color: var(--bg-elevate);
  color: #1a1a1a;
  cursor: pointer;
}

.case-rail-nav-btn svg {
  display: block;
  width: 1.125rem;
  height: 1.125rem;
}

.case-rail-nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.case-rail-nav-btn:disabled:hover,
.case-rail-nav-btn:disabled:active {
  transform: none;
  outline-color: transparent;
}

@media (max-width: 40rem) {
  .portfolio-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
  }

  .portfolio-head-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
  }

  .portfolio-tabs {
    justify-self: auto;
  }

  .case-rail-nav {
    justify-self: auto;
    margin-left: auto;
  }
}

.case-rail {
  margin-top: 1.25rem;
  /* Room for case-card shadow (0 1.5rem 5rem); box-shadow is not scrollable overflow. */
  padding-top: 3.5rem;
  padding-bottom: 6.5rem;
  overflow-x: auto;
  overflow-y: visible;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.case-rail::-webkit-scrollbar {
  display: none;
}

.case-rail:focus-visible {
  outline: 2px solid #1a56db;
  outline-offset: -2px;
}

.case-rail-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: var(--case-gap);
  width: max-content;
  padding-inline: max(
    var(--page-gutter),
    calc((100vw - var(--page-max)) / 2 + var(--page-gutter))
  );
}

.case-rail-track :deep(.case-card) {
  flex: 0 0 min(var(--case-col), calc(100vw - var(--page-gutter) * 2));
  width: min(var(--case-col), calc(100vw - var(--page-gutter) * 2));
}

.case-rail-empty {
  margin: 0;
  padding-inline: max(
    var(--page-gutter),
    calc((100vw - var(--page-max)) / 2 + var(--page-gutter))
  );
  font-size: 1rem;
  line-height: 1.5;
}
</style>
