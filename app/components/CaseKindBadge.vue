<script setup lang="ts">
import { caseKindColor, caseKindHint, caseKindLabel, type CaseKind } from '~/data/cases'

defineProps<{
  kind: CaseKind
}>()
</script>

<template>
  <AppTooltip placement="top">
    <template #trigger>
      <span
        class="case-kind"
        :style="{ '--kind-color': caseKindColor[kind] }"
      >
        {{ caseKindLabel[kind] }}
        <svg
          class="case-kind-help"
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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </g>
        </svg>
      </span>
    </template>
    <p class="max-w-xs text-[0.875rem] leading-relaxed text-ink">
      {{ caseKindHint[kind] }}
    </p>
  </AppTooltip>
</template>

<style scoped>
.case-kind {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.425rem 0.7rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--kind-color) 14%, var(--bg-elevate));
  color: var(--kind-color);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: normal;
  white-space: nowrap;
  vertical-align: middle;
  cursor: help;
}

.case-kind-help {
  display: block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
</style>
