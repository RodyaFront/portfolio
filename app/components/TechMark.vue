<script setup lang="ts">
import { resolveTech, type TechInput } from '~/data/tech'

const props = withDefaults(
  defineProps<{
    tech: TechInput
    label?: string
    variant?: 'inline' | 'chip'
  }>(),
  {
    variant: 'inline',
  },
)

const resolved = computed(() => resolveTech(props.tech))

const displayLabel = computed(
  () => props.label ?? resolved.value?.label ?? String(props.tech),
)

const inlineStyle = computed(() => {
  if (!resolved.value) return undefined
  return {
    '--tech-icon-1x': `url(${resolved.value.icon32})`,
    '--tech-icon-2x': `url(${resolved.value.icon64})`,
  } as Record<string, string>
})
</script>

<template>
  <AppTooltip
    v-if="variant === 'inline' && resolved"
    class="tech-mark"
    :style="inlineStyle"
    :label="`${resolved.label} logo`"
    placement="top"
  >
    <template #trigger>{{ displayLabel }}</template>
    <img
      :src="resolved.source"
      width="256"
      height="256"
      class="block h-32 w-32 object-contain"
      :alt="`${resolved.label} logo`"
      decoding="async"
    />
  </AppTooltip>

  <span v-else-if="variant === 'inline'">{{ displayLabel }}</span>

  <span v-else class="inline-flex items-center gap-1.5 text-sm text-ink">
    <AppTooltip
      v-if="resolved"
      :label="`${resolved.label} logo`"
      placement="top"
    >
      <template #trigger>
        <img
          class="h-8 w-8 shrink-0 object-contain"
          :src="resolved.icon32"
          :srcset="`${resolved.icon32} 1x, ${resolved.icon64} 2x`"
          width="32"
          height="32"
          alt=""
          decoding="async"
          loading="lazy"
        />
      </template>
      <img
        :src="resolved.source"
        width="256"
        height="256"
        class="block h-32 w-32 object-contain"
        :alt="`${resolved.label} logo`"
        decoding="async"
      />
    </AppTooltip>
    <span>{{ displayLabel }}</span>
  </span>
</template>

<style scoped>
/*
  Icon is a background on the same inline span as the label.
  No ::before / inline-block / flex — label glyphs share the paragraph baseline.
*/
.tech-mark {
  display: inline;
  white-space: nowrap;
  padding-left: 1.2em;
  background-image: var(--tech-icon-1x);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 1em 1em;
}

@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 1.5dppx) {
  .tech-mark {
    background-image: var(--tech-icon-2x);
  }
}
</style>
