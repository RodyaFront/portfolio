<script setup lang="ts">
import type { CaseFact } from '~/data/cases'

defineProps<{
  facts: readonly CaseFact[]
  /** Tighter type on home cards. */
  dense?: boolean
}>()
</script>

<template>
  <dl
    class="case-facts"
    :class="{ 'case-facts-dense': dense }"
    aria-label="Key facts"
  >
    <div
      v-for="fact in facts"
      :key="fact.label"
      class="case-facts-item"
    >
      <dt class="case-facts-label text-ink-mute">{{ fact.label }}</dt>
      <dd class="case-facts-value text-ink">{{ fact.value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.case-facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: 0.75rem 1rem;
  margin: 0;
}

.case-facts-dense {
  gap: 0.625rem 0.875rem;
}

.case-facts-item {
  margin: 0;
  min-width: 0;
}

.case-facts-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.3;
}

.case-facts-value {
  margin: 0.2rem 0 0;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.35;
}

.case-facts-dense .case-facts-value {
  font-size: 0.875rem;
}
</style>
