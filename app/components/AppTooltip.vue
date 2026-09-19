<script setup lang="ts">
defineOptions({ inheritAttrs: false })

type Placement = 'top' | 'bottom'

const props = withDefaults(
  defineProps<{
    /** Accessible name for the trigger when content is visual-only */
    label?: string
    /** Prefer side; flips if there is not enough space */
    placement?: Placement
    openDelay?: number
    closeDelay?: number
    disabled?: boolean
  }>(),
  {
    placement: 'top',
    openDelay: 280,
    closeDelay: 120,
    disabled: false,
  },
)

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const coords = ref({ top: 0, left: 0, placement: props.placement as Placement })

const tooltipId = useId()
let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  if (openTimer) clearTimeout(openTimer)
  if (closeTimer) clearTimeout(closeTimer)
  openTimer = null
  closeTimer = null
}

const updatePosition = () => {
  const trigger = triggerRef.value
  const tip = tooltipRef.value
  if (!trigger || !tip) return

  const gap = 8
  const rect = trigger.getBoundingClientRect()
  const tipRect = tip.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  let placement: Placement = props.placement
  const spaceTop = rect.top
  const spaceBottom = vh - rect.bottom

  if (placement === 'top' && spaceTop < tipRect.height + gap && spaceBottom > spaceTop) {
    placement = 'bottom'
  } else if (placement === 'bottom' && spaceBottom < tipRect.height + gap && spaceTop > spaceBottom) {
    placement = 'top'
  }

  let top =
    placement === 'top' ? rect.top - tipRect.height - gap : rect.bottom + gap
  let left = rect.left + rect.width / 2 - tipRect.width / 2

  left = Math.min(Math.max(8, left), vw - tipRect.width - 8)
  top = Math.min(Math.max(8, top), vh - tipRect.height - 8)

  coords.value = { top, left, placement }
}

const show = () => {
  if (props.disabled) return
  clearTimers()
  openTimer = setTimeout(() => {
    open.value = true
    nextTick(() => {
      updatePosition()
      requestAnimationFrame(updatePosition)
    })
  }, props.openDelay)
}

const hide = () => {
  clearTimers()
  closeTimer = setTimeout(() => {
    open.value = false
  }, props.closeDelay)
}

const hideNow = () => {
  clearTimers()
  open.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    hideNow()
    triggerRef.value?.focus()
  }
}

watch(open, (value) => {
  if (!import.meta.client) return
  if (value) {
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
})

onUnmounted(() => {
  clearTimers()
  if (!import.meta.client) return
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <span
    ref="triggerRef"
    class="tech-tooltip-trigger cursor-default rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    v-bind="$attrs"
    tabindex="0"
    :aria-label="label"
    :aria-describedby="open ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
    @keydown="onKeydown"
  >
    <slot name="trigger" />

    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="open"
          :id="tooltipId"
          ref="tooltipRef"
          role="tooltip"
          class="tooltip-panel pointer-events-none fixed z-[80] overflow-hidden rounded-lg border border-ink/10 bg-elevate p-4 shadow-[0_0.75rem_2rem_-0.75rem_rgb(0_0_0_/_0.28)]"
          :style="{ top: `${coords.top}px`, left: `${coords.left}px` }"
          :data-placement="coords.placement"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.tech-tooltip-trigger {
  display: inline;
  line-height: inherit;
  vertical-align: baseline;
}

.tooltip-panel {
  transform-origin: center bottom;
}

.tooltip-panel[data-placement='bottom'] {
  transform-origin: center top;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(0.25rem);
}

.tooltip-panel[data-placement='bottom'].tooltip-enter-from,
.tooltip-panel[data-placement='bottom'].tooltip-leave-to {
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .tooltip-enter-active,
  .tooltip-leave-active {
    transition: opacity 80ms ease;
  }

  .tooltip-enter-from,
  .tooltip-leave-to,
  .tooltip-panel[data-placement='bottom'].tooltip-enter-from,
  .tooltip-panel[data-placement='bottom'].tooltip-leave-to {
    transform: none;
  }
}
</style>
