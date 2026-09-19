<script setup lang="ts">
import type { CaseLanguage } from '~/data/cases'

const props = defineProps<{
  languages: readonly CaseLanguage[]
}>()

const headingId = useId()

function formatPercent(percent: number): string {
  const rounded = Math.round(percent * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

const ariaSummary = computed(() =>
  props.languages.map((item) => `${item.name} ${formatPercent(item.percent)}`).join(', '),
)
</script>

<template>
  <section class="case-languages" :aria-labelledby="headingId">
    <p :id="headingId" class="case-languages-title text-[1rem] text-ink-mute">
      Languages
    </p>

    <div
      class="case-languages-bar"
      role="img"
      :aria-label="ariaSummary"
    >
      <span
        v-for="item in languages"
        :key="item.name"
        class="case-languages-segment"
        :style="{
          width: `${item.percent}%`,
          backgroundColor: item.color,
        }"
      />
    </div>

    <ul class="case-languages-legend">
      <li v-for="item in languages" :key="item.name" class="case-languages-item">
        <span
          class="case-languages-dot"
          :style="{ backgroundColor: item.color }"
          aria-hidden="true"
        />
        <span class="case-languages-name text-ink">{{ item.name }}</span>
        <span class="case-languages-pct text-ink-mute">{{ formatPercent(item.percent) }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.case-languages-title {
  margin: 0;
  font-weight: 400;
}

.case-languages-bar {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 0.5rem;
  margin-top: var(--space-tight);
  border-radius: 999px;
  background-color: rgb(26 26 26 / 0.08);
}

.case-languages-segment {
  display: block;
  height: 100%;
  min-width: 0;
}

.case-languages-segment + .case-languages-segment {
  box-shadow: inset 1px 0 0 rgb(247 244 239 / 0.9);
}

.case-languages-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin: calc(var(--space-related) / 2) 0 0;
  padding: 0;
  list-style: none;
}

.case-languages-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 1rem;
  line-height: 1.4;
}

.case-languages-dot {
  width: 0.5rem;
  height: 0.5rem;
  flex-shrink: 0;
  border-radius: 999px;
}

.case-languages-name {
  font-weight: 500;
}

.case-languages-pct {
  font-weight: 400;
}
</style>
