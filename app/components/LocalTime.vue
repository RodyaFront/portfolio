<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    timeZone?: string
    label?: string
  }>(),
  {
    timeZone: 'Europe/Kyiv',
    label: 'Local time in Odesa',
  },
)

const hour = ref('')
const minute = ref('')
const second = ref('')
const iso = ref('')

let timer: ReturnType<typeof setInterval> | null = null

const formatter = computed(
  () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: props.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
)

const spoken = computed(() =>
  hour.value ? `${hour.value}:${minute.value}:${second.value}` : '',
)

const tick = () => {
  const now = new Date()
  const parts = formatter.value.formatToParts(now)
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  hour.value = valueOf('hour')
  minute.value = valueOf('minute')
  second.value = valueOf('second')
  iso.value = now.toLocaleString('sv-SE', { timeZone: props.timeZone }).replace(' ', 'T')
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <span v-if="hour" class="local-time-wrap">(<time
    class="local-time"
    :datetime="iso"
    :aria-label="`${label}, ${spoken}`"
  >{{ hour }}<span class="local-time-colon" aria-hidden="true">:</span>{{ minute }}<span class="local-time-colon" aria-hidden="true">:</span>{{ second }}</time>)</span>
</template>

<style scoped>
.local-time-wrap {
  white-space: nowrap;
}

.local-time {
  display: inline;
  padding-left: 1.2em;
  font-variant-numeric: tabular-nums;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='9' stroke='%231a1a1a' stroke-width='1.75'/%3E%3Cpath d='M12 7v5.25L16 14.5' stroke='%231a1a1a' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 1em 1em;
}

.local-time-colon {
  opacity: 0.5;
}
</style>
