<script setup lang="ts">
import {
  CASE_COMPLEXITY_MAX,
  complexityAxes,
  getCaseComplexity,
} from '~/utils/caseComplexity'

const props = defineProps<{
  /** Final 1-10 score stored on the case. */
  value: number
  /** Lookup axis breakdown for the tooltip. */
  slug: string
}>()

const scored = computed(() => getCaseComplexity(props.slug))

const breakdownRows = computed(() => {
  const breakdown = scored.value
  if (!breakdown) return []
  return complexityAxes.map((axis) => ({
    label: axis.label,
    value: breakdown[axis.id],
    max: axis.max,
  }))
})
</script>

<template>
  <AppTooltip placement="top">
    <template #trigger>
      <span
        class="case-complexity"
        :aria-label="`Complexity ${value} of ${CASE_COMPLEXITY_MAX}`"
      >
        <svg
          class="case-complexity-icon text-ink-mute"
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
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 12 10 5 10-5" />
            <path d="m2 17 10 5 10-5" />
          </g>
        </svg>
        <span class="case-complexity-value" aria-hidden="true">{{ value }}</span>
        <span class="case-complexity-max text-ink-mute" aria-hidden="true">
          /{{ CASE_COMPLEXITY_MAX }}
        </span>
      </span>
    </template>
    <div class="case-complexity-tip text-ink">
      <p class="case-complexity-tip-title">
        Complexity {{ value }}/{{ CASE_COMPLEXITY_MAX }}
      </p>
      <p class="case-complexity-tip-lead text-ink-mute">
        Engineering weight: surface, domain, platform risk, ownership.
      </p>
      <ul v-if="breakdownRows.length" class="case-complexity-tip-list">
        <li v-for="row in breakdownRows" :key="row.label">
          <span>{{ row.label }}</span>
          <span class="text-ink-mute">{{ row.value }}/{{ row.max }}</span>
        </li>
      </ul>
    </div>
  </AppTooltip>
</template>

<style scoped>
.case-complexity {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.55rem 0.35rem 0.45rem;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: color-mix(in srgb, var(--bg-base) 40%, var(--bg-elevate));
  font-variant-numeric: tabular-nums;
  line-height: 1;
  cursor: help;
  white-space: nowrap;
}

.case-complexity-icon {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.case-complexity-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink, #1a1a1a);
}

.case-complexity-max {
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: -0.05rem;
}

.case-complexity-tip {
  max-width: 16rem;
}

.case-complexity-tip-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.case-complexity-tip-lead {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.case-complexity-tip-list {
  margin: 0.625rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
}

.case-complexity-tip-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
