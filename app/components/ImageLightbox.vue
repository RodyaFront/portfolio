<script setup lang="ts">
import type { CaseImage } from '~/data/cases'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 1.25

const props = defineProps<{
  images: readonly CaseImage[]
}>()

const emit = defineEmits<{
  navigate: [index: number]
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const { openModal, requestClose, onCancel } = useDialogMotion(dialog)
const index = ref(0)
const open = ref(false)
const trackX = ref(-100)
const sliding = ref(false)
const instant = ref(false)
const pendingDir = ref(0)
const scale = ref(MIN_ZOOM)
const panX = ref(0)
const panY = ref(0)
const panning = ref(false)
const pinching = ref(false)
const shiftHeld = ref(false)

/** pending = finger down, not decided; dragging = pan; pinching = two-finger zoom */
type Gesture = 'idle' | 'pending' | 'dragging' | 'pinching'

const HOLD_MS = 160
const DRAG_SLOP = 10

const pointers = new Map<number, { x: number; y: number }>()
let gesture: Gesture = 'idle'
let holdTimer: ReturnType<typeof setTimeout> | null = null
let lastPinchDist = 0
let suppressClose = false
let activePointerId: number | null = null
let origin = { x: 0, y: 0 }

const count = computed(() => props.images.length)
const multiple = computed(() => count.value > 1)
const current = computed(() => props.images[index.value] ?? props.images[0])
const canZoomOut = computed(() => scale.value > MIN_ZOOM)
const canZoomIn = computed(() => scale.value < MAX_ZOOM)

const zoomStyle = computed(() => {
  let cursor = 'default'
  if (panning.value) cursor = 'grabbing'
  else if (shiftHeld.value) cursor = canZoomOut.value ? 'zoom-out' : 'default'
  else if (canZoomIn.value) cursor = 'zoom-in'
  else if (canZoomOut.value) cursor = 'grab'

  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
    cursor,
    transition:
      panning.value || pinching.value
        ? 'none'
        : reducedMotion()
          ? 'none'
          : 'transform 120ms ease',
  }
})

const slides = computed(() => {
  const images = props.images
  const n = images.length
  const i = index.value
  if (n < 2) return []
  return [
    { slot: 'prev' as const, image: images[(i - 1 + n) % n]! },
    { slot: 'current' as const, image: images[i]! },
    { slot: 'next' as const, image: images[(i + 1) % n]! },
  ]
})

function reducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

function clearHoldTimer() {
  if (holdTimer == null) return
  clearTimeout(holdTimer)
  holdTimer = null
}

function resetGesture() {
  clearHoldTimer()
  gesture = 'idle'
  activePointerId = null
  lastPinchDist = 0
  pointers.clear()
  panning.value = false
  pinching.value = false
}

function beginDrag() {
  if (gesture !== 'pending') return
  if (scale.value <= MIN_ZOOM) return
  clearHoldTimer()
  gesture = 'dragging'
  panning.value = true
}

function resetTrack() {
  sliding.value = false
  instant.value = false
  pendingDir.value = 0
  trackX.value = -100
}

function resetZoom() {
  scale.value = MIN_ZOOM
  panX.value = 0
  panY.value = 0
  shiftHeld.value = false
  suppressClose = false
  resetGesture()
}

function currentImage() {
  return dialog.value?.querySelector<HTMLImageElement>('[data-lightbox-current]') ?? null
}

function imageCenter() {
  const img = currentImage()
  const box = img ?? dialog.value
  if (!box) return { x: 0, y: 0 }
  const rect = box.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function clampPan() {
  if (scale.value <= MIN_ZOOM) {
    panX.value = 0
    panY.value = 0
    return
  }

  const img = currentImage()
  const frame = dialog.value
  if (!img || !frame) return

  const maxX = Math.max(0, (img.clientWidth * scale.value - frame.clientWidth) / 2 + 24)
  const maxY = Math.max(0, (img.clientHeight * scale.value - frame.clientHeight) / 2 + 24)
  panX.value = Math.min(maxX, Math.max(-maxX, panX.value))
  panY.value = Math.min(maxY, Math.max(-maxY, panY.value))
}

function zoomAt(clientX: number, clientY: number, factor: number) {
  const prev = scale.value
  const next = clampZoom(prev * factor)
  if (next === prev) return

  if (next === MIN_ZOOM) {
    resetZoom()
    return
  }

  const center = imageCenter()
  const ratio = next / prev
  panX.value += (1 - ratio) * (clientX - center.x)
  panY.value += (1 - ratio) * (clientY - center.y)
  scale.value = next
  clampPan()
}

function zoomBy(factor: number) {
  const center = imageCenter()
  zoomAt(center.x, center.y, factor)
}

function show(start = 0) {
  if (!props.images.length) return
  index.value = Math.min(Math.max(0, start), props.images.length - 1)
  resetTrack()
  resetZoom()
  openModal()
  open.value = true
}

function hide() {
  if (pendingDir.value) {
    index.value = (index.value + pendingDir.value + count.value) % count.value
    emit('navigate', index.value)
  }
  requestClose()
}

function onClose() {
  open.value = false
  resetTrack()
  resetZoom()
}

function go(delta: number) {
  const dir = Math.sign(delta)
  if (!multiple.value || !dir || sliding.value) return

  resetZoom()

  const next = (index.value + dir + count.value) % count.value
  emit('navigate', next)

  if (reducedMotion()) {
    index.value = next
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
  index.value = (index.value + dir + count.value) % count.value
  trackX.value = -100
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      instant.value = false
      sliding.value = false
    })
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Shift') shiftHeld.value = true
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    go(-1)
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    go(1)
  }
  if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    zoomBy(ZOOM_STEP)
  }
  if (event.key === '-' || event.key === '_') {
    event.preventDefault()
    zoomBy(1 / ZOOM_STEP)
  }
  if (event.key === '0') {
    event.preventDefault()
    resetZoom()
  }
}

function onKeyup(event: KeyboardEvent) {
  if (event.key === 'Shift') shiftHeld.value = false
}

function onWheel(event: WheelEvent) {
  if (!open.value) return
  if ((event.target as HTMLElement | null)?.closest('button')) return
  const factor = event.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP
  zoomAt(event.clientX, event.clientY, factor)
}

function isMediaTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el) return false
  if (el.closest('button')) return false
  return !!el.closest('.image-lightbox-slide')
}

function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (event.button !== 0) return
  if ((event.target as HTMLElement | null)?.closest('button')) return

  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  dialog.value?.setPointerCapture(event.pointerId)

  if (pointers.size === 2) {
    clearHoldTimer()
    const points = [...pointers.values()]
    const a = points[0]!
    const b = points[1]!
    lastPinchDist = Math.hypot(a.x - b.x, a.y - b.y)
    gesture = 'pinching'
    pinching.value = true
    panning.value = false
    return
  }

  if (!isMediaTarget(event.target)) {
    gesture = 'idle'
    return
  }

  // Quick click vs hold-to-drag: stay pending until move/hold decides.
  suppressClose = false
  gesture = 'pending'
  activePointerId = event.pointerId
  origin = { x: event.clientX, y: event.clientY }

  if (scale.value > MIN_ZOOM && !event.shiftKey) {
    holdTimer = setTimeout(() => beginDrag(), HOLD_MS)
  }
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return

  const point = pointers.get(event.pointerId)!
  const dx = event.clientX - point.x
  const dy = event.clientY - point.y
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (gesture === 'pinching' && pointers.size === 2) {
    const points = [...pointers.values()]
    const a = points[0]!
    const b = points[1]!
    const dist = Math.hypot(a.x - b.x, a.y - b.y)
    if (lastPinchDist) {
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / lastPinchDist)
      suppressClose = true
    }
    lastPinchDist = dist
    return
  }

  if (event.pointerId !== activePointerId) return

  if (gesture === 'pending') {
    const moved = Math.hypot(event.clientX - origin.x, event.clientY - origin.y)
    if (moved > DRAG_SLOP) beginDrag()
  }

  if (gesture !== 'dragging') return
  if (dx === 0 && dy === 0) return

  panX.value += dx
  panY.value += dy
  clampPan()
  suppressClose = true
}

function onPointerUp(event: PointerEvent) {
  const wasPendingClick =
    gesture === 'pending'
    && event.pointerId === activePointerId

  const wasDragging =
    gesture === 'dragging'
    && event.pointerId === activePointerId

  pointers.delete(event.pointerId)

  if (pointers.size < 2) {
    lastPinchDist = 0
    pinching.value = false
  }

  if (wasPendingClick) {
    clearHoldTimer()
    suppressClose = true
    if (event.shiftKey) zoomAt(event.clientX, event.clientY, 1 / ZOOM_STEP)
    else zoomAt(event.clientX, event.clientY, ZOOM_STEP)
    resetGesture()
    return
  }

  if (wasDragging) {
    clearHoldTimer()
    suppressClose = true
    resetGesture()
    return
  }

  if (pointers.size === 0) resetGesture()
  else if (pointers.size === 1 && gesture === 'pinching') {
    // Fall back to pending/idle after pinch ends with one finger left.
    gesture = 'idle'
    pinching.value = false
    panning.value = false
    activePointerId = [...pointers.keys()][0] ?? null
  }
}

function onBackdropClick() {
  if (suppressClose) {
    suppressClose = false
    return
  }
  hide()
}

defineExpose({ show, hide })
</script>

<template>
  <dialog
    ref="dialog"
    class="image-lightbox"
    :class="{ 'image-lightbox-zoomed': canZoomOut }"
    aria-label="Full-size image"
    @cancel="onCancel"
    @keydown="onKeydown"
    @keyup="onKeyup"
    @close="onClose"
    @wheel.prevent="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="image-lightbox-zoom">
      <button
        type="button"
        class="press-control image-lightbox-btn"
        aria-label="Zoom out"
        :disabled="!canZoomOut"
        @click="zoomBy(1 / ZOOM_STEP)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            d="M5 12h14"
          />
        </svg>
      </button>
      <button
        type="button"
        class="press-control image-lightbox-btn"
        aria-label="Zoom in"
        :disabled="!canZoomIn"
        @click="zoomBy(ZOOM_STEP)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            d="M12 5v14M5 12h14"
          />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="press-control image-lightbox-btn image-lightbox-close"
      aria-label="Close"
      @click="hide"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          d="M6 6l12 12M18 6 6 18"
        />
      </svg>
    </button>

    <div
      v-if="multiple"
      class="image-lightbox-track"
      :class="{ 'image-lightbox-track-instant': instant }"
      :style="{ transform: `translateX(${trackX}%)` }"
      @transitionend="onTrackTransitionEnd"
    >
      <div
        v-for="slide in slides"
        :key="slide.slot"
        class="image-lightbox-slide"
        :aria-hidden="slide.slot !== 'current'"
        @click.self="onBackdropClick"
      >
        <img
          :src="slide.image.srcFull ?? slide.image.src"
          :alt="slide.slot === 'current' ? slide.image.alt : ''"
          :width="slide.image.fullWidth ?? slide.image.width"
          :height="slide.image.fullHeight ?? slide.image.height"
          :data-lightbox-current="slide.slot === 'current' ? '' : undefined"
          :style="slide.slot === 'current' ? zoomStyle : undefined"
          draggable="false"
        />
      </div>
    </div>

    <div
      v-else-if="current"
      class="image-lightbox-slide"
      @click.self="onBackdropClick"
    >
      <img
        :src="current.srcFull ?? current.src"
        :alt="current.alt"
        :width="current.fullWidth ?? current.width"
        :height="current.fullHeight ?? current.height"
        data-lightbox-current
        :style="zoomStyle"
        draggable="false"
      />
    </div>

    <p v-if="open && multiple" class="sr-only" aria-live="polite">
      {{ index + 1 }} of {{ count }}
    </p>

    <button
      v-if="multiple"
      type="button"
      class="press-control image-lightbox-btn image-lightbox-prev"
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
      class="press-control image-lightbox-btn image-lightbox-next"
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
  </dialog>
</template>

<style scoped>
.image-lightbox {
  inset: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  background-color: rgb(26 26 26 / 0.94);
  color: #f7f4ef;
  touch-action: none;
  opacity: 0;
}

.image-lightbox[open] {
  display: block;
  opacity: 1;
}

.image-lightbox[open]:not(.is-closing) {
  animation: image-lightbox-in 200ms ease;
}

.image-lightbox[open].is-closing {
  opacity: 0;
  transition: opacity 200ms ease;
}

.image-lightbox::backdrop {
  background-color: rgb(26 26 26 / 0.94);
  opacity: 0;
}

.image-lightbox[open]::backdrop {
  opacity: 1;
}

.image-lightbox[open]:not(.is-closing)::backdrop {
  animation: image-lightbox-in 200ms ease;
}

.image-lightbox[open].is-closing::backdrop {
  opacity: 0;
  transition: opacity 200ms ease;
}

@keyframes image-lightbox-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .image-lightbox,
  .image-lightbox[open],
  .image-lightbox[open].is-closing,
  .image-lightbox::backdrop,
  .image-lightbox[open]::backdrop,
  .image-lightbox[open].is-closing::backdrop {
    animation: none;
    transition: none;
  }

  .image-lightbox[open],
  .image-lightbox[open]::backdrop {
    opacity: 1;
  }
}

.image-lightbox-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 320ms ease;
}

.image-lightbox-track-instant {
  transition: none;
}

.image-lightbox-slide {
  display: flex;
  flex: 0 0 100%;
  min-width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.image-lightbox img {
  display: block;
  max-width: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  width: auto;
  height: auto;
  object-fit: contain;
  transform-origin: center center;
  user-select: none;
}

.image-lightbox-btn {
  --press-face: #f7f4ef;
  position: absolute;
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

.image-lightbox-btn svg {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

.image-lightbox-btn:hover {
  background-color: #f7f4ef;
}

.image-lightbox-btn:disabled {
  cursor: default;
  opacity: 0.4;
}

.image-lightbox-zoom {
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
}

.image-lightbox-zoom .image-lightbox-btn {
  position: static;
}

.image-lightbox-close {
  top: 0.75rem;
  right: 0.75rem;
}

.image-lightbox-prev,
.image-lightbox-next {
  --press-from: translateY(-50%);
}

.image-lightbox-prev {
  top: 50%;
  left: 0.5rem;
}

.image-lightbox-next {
  top: 50%;
  right: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .image-lightbox-track {
    transition: none;
  }
}
</style>
