<script setup lang="ts">
import type { CaseImage } from '~/data/cases'
import ImageLightbox from '~/components/ImageLightbox.vue'

const props = defineProps<{
  images?: CaseImage[]
  label?: string
}>()

const index = ref(0)
const trackX = ref(-100)
const sliding = ref(false)
const instant = ref(false)
const pendingDir = ref(0)

const list = computed(() => props.images ?? [])
const count = computed(() => list.value.length)
const empty = computed(() => count.value === 0)
const multiple = computed(() => count.value > 1)
const current = computed(() => list.value[index.value] ?? list.value[0])
const lightbox = ref<{ show: (start?: number) => void } | null>(null)

const slides = computed(() => {
  const images = list.value
  const n = images.length
  const i = index.value
  if (n < 2) return []
  return [
    { slot: 'prev', image: images[(i - 1 + n) % n] },
    { slot: 'current', image: images[i] },
    { slot: 'next', image: images[(i + 1) % n] },
  ] as const
})

function reducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function commit(dir: number) {
  index.value = (index.value + dir + count.value) % count.value
}

function go(delta: number) {
  const dir = Math.sign(delta)
  if (!multiple.value || !dir || sliding.value) return

  if (reducedMotion()) {
    commit(dir)
    return
  }

  sliding.value = true
  pendingDir.value = dir
  trackX.value = dir > 0 ? -200 : 0
}

function onTrackTransitionEnd(event: TransitionEvent) {
  if (event.target !== event.currentTarget) return
  if (event.propertyName !== 'transform') return

  const dir = pendingDir.value
  pendingDir.value = 0
  if (!dir) {
    sliding.value = false
    return
  }

  instant.value = true
  commit(dir)
  trackX.value = -100
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      instant.value = false
      sliding.value = false
    })
  })
}

function onLightboxNavigate(next: number) {
  if (next === index.value || !multiple.value) return
  const n = count.value
  const forward = (next - index.value + n) % n
  const backward = (index.value - next + n) % n
  if (forward === 1) go(1)
  else if (backward === 1) go(-1)
  else index.value = next
}

function onKeydown(event: KeyboardEvent) {
  if (!multiple.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    go(-1)
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    go(1)
  }
}
</script>

<template>
  <div
    class="case-carousel"
    role="group"
    :aria-roledescription="multiple ? 'carousel' : undefined"
    :aria-label="label ?? (empty ? 'Screenshots pending' : 'Project screenshots')"
    :tabindex="multiple ? 0 : undefined"
    @keydown="onKeydown"
  >
    <figure
      class="case-carousel-frame"
      :class="{ 'case-carousel-frame-empty': empty }"
    >
      <div
        v-if="multiple"
        class="case-carousel-track"
        :class="{ 'case-carousel-track-instant': instant }"
        :style="{ transform: `translateX(${trackX}%)` }"
        @transitionend="onTrackTransitionEnd"
      >
        <button
          v-for="slide in slides"
          :key="slide.slot"
          type="button"
          class="case-carousel-open case-carousel-slide press-media"
          :tabindex="slide.slot === 'current' ? 0 : -1"
          :aria-hidden="slide.slot !== 'current'"
          :aria-label="slide.slot === 'current' ? `View ${slide.image.alt}` : undefined"
          @click="slide.slot === 'current' ? lightbox?.show(index) : undefined"
        >
          <img
            :src="slide.image.src"
            :alt="slide.slot === 'current' ? slide.image.alt : ''"
            :width="slide.image.width"
            :height="slide.image.height"
            :style="{ objectPosition: slide.image.objectPosition }"
            decoding="async"
          />
        </button>
      </div>

      <button
        v-else-if="current"
        type="button"
        class="case-carousel-open press-media"
        :aria-label="`View ${current.alt}`"
        @click="lightbox?.show(index)"
      >
        <img
          :src="current.src"
          :alt="current.alt"
          :width="current.width"
          :height="current.height"
          :style="{ objectPosition: current.objectPosition }"
          decoding="async"
        />
      </button>

      <p v-if="multiple" class="sr-only" aria-live="polite">
        {{ index + 1 }} of {{ count }}
      </p>

      <button
        v-if="multiple"
        type="button"
        class="press-control case-carousel-btn case-carousel-btn-prev"
        aria-label="Previous image"
        @click="go(-1)"
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
        v-if="multiple"
        type="button"
        class="press-control case-carousel-btn case-carousel-btn-next"
        aria-label="Next image"
        @click="go(1)"
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
    </figure>
  </div>

  <ImageLightbox
    v-if="!empty"
    ref="lightbox"
    :images="list"
    @navigate="onLightboxNavigate"
  />
</template>

<style scoped>
.case-carousel:focus-visible {
  outline: 2px solid #1a56db;
  outline-offset: 2px;
}

.case-carousel-frame {
  position: relative;
  margin: 0;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: #efeae2;
}

.case-carousel-frame-empty {
  border-style: dashed;
  background-color: rgb(239 234 226 / 0.65);
}

.case-carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 320ms ease;
}

.case-carousel-track-instant {
  transition: none;
}

.case-carousel-slide {
  flex: 0 0 100%;
  min-width: 100%;
  height: 100%;
}

.case-carousel-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: top center;
}

.case-carousel-open {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
}

.case-carousel-btn {
  --press-from: translateY(-50%);
  --press-face: #f7f4ef;
  position: absolute;
  top: 50%;
  z-index: 1;
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background-color: rgb(247 244 239 / 0.92);
  color: #1a1a1a;
}

.case-carousel-btn svg {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

.case-carousel-btn-prev {
  left: 0.5rem;
}

.case-carousel-btn-next {
  right: 0.5rem;
}

.case-carousel-btn:hover {
  background-color: #f7f4ef;
}

@media (prefers-reduced-motion: reduce) {
  .case-carousel-track {
    transition: none;
  }
}
</style>
