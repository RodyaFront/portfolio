<script setup lang="ts">
import type { CompanyBrand } from '~/data/companies'

const props = defineProps<{
  brand: CompanyBrand
}>()

const markStyle = computed(() => ({
  '--company-logo': `url(${props.brand.logo})`,
  '--company-aspect': props.brand.aspect,
}))

const wide = computed(() => props.brand.aspect >= 2.5)

/** Keep tooltip preview readable for wide wordmarks without a huge square. */
const previewClass = computed(() =>
  wide.value
    ? 'block h-16 w-auto max-w-[16rem] object-contain'
    : 'block h-32 w-32 object-contain',
)
</script>

<template>
  <AppTooltip
    class="company-mark"
    :class="{ 'company-mark-wide': wide }"
    :style="markStyle"
    :label="`${brand.label} logo`"
    placement="top"
  >
    <template #trigger>{{ brand.label }}</template>
    <img
      :src="brand.logo"
      :class="previewClass"
      :alt="`${brand.label} logo`"
      decoding="async"
    />
  </AppTooltip>
</template>

<style scoped>
/*
  Same idea as TechMark: logo as background on the label span.
  Width follows asset aspect so Yaradin wordmark stays readable.
*/
.company-mark {
  display: inline;
  white-space: nowrap;
  padding-left: calc(1em * var(--company-aspect) + 0.35em);
  background-image: var(--company-logo);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: calc(1em * var(--company-aspect)) 1em;
}

.company-mark-wide {
  padding-left: calc(0.85em * var(--company-aspect) + 0.35em);
  background-size: calc(0.85em * var(--company-aspect)) 0.85em;
}
</style>
