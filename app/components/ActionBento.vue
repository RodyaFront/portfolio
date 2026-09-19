<script setup lang="ts">
import { profile } from '~/data/profile'
import { actionVisuals } from '~/data/actions'
import type { ActionIconName } from '~/data/actions'
import ActionIcon from '~/components/ActionIcon.vue'

type ActionItem = {
  id: ActionIconName
  label: string
  href: string
  external?: boolean
}

const props = defineProps<{
  actions?: ActionItem[]
  label?: string
  fill?: boolean
}>()

const tiles = computed(() =>
  (props.actions ?? profile.hero.actions).map((action) => ({
    ...action,
    ...actionVisuals[action.id],
  })),
)
</script>

<template>
  <nav
    class="action-bento"
    :class="{ 'action-bento-fill': fill }"
    :aria-label="label ?? 'Primary actions'"
  >
    <a
      v-for="tile in tiles"
      :key="tile.id"
      class="action-tile"
      :class="{ 'action-tile-wide': tile.wide, 'action-tile-ink': tile.ink }"
      :href="tile.href"
      :style="{ '--action-color': tile.color }"
      :rel="tile.external ? 'noopener noreferrer' : undefined"
      :target="tile.external ? '_blank' : undefined"
    >
      <ActionIcon :name="tile.icon" />
      <span>{{ tile.label }}</span>
      <svg
        v-if="tile.external"
        class="action-external"
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
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </g>
      </svg>
    </a>
  </nav>
</template>

<style scoped>
.action-bento {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

@media (min-width: 40rem) {
  .action-bento {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .action-bento-fill {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.action-tile-wide {
  grid-column: span 2;
}

.action-tile {
  display: flex;
  min-height: 3.5rem;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border-radius: var(--radius);
  background-color: color-mix(in srgb, var(--action-color) 9%, var(--bg-base));
  color: var(--action-color);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  text-decoration: none;
}

a.action-tile,
a.action-tile:hover,
a.action-tile:visited,
a.action-tile:focus-visible {
  color: var(--action-color);
  text-decoration: none;
}

a.action-tile:hover {
  background-color: color-mix(in srgb, var(--action-color) 14%, var(--bg-base));
}

.action-tile-ink {
  background-color: var(--bg-elevate);
}

a.action-tile-ink:hover {
  background-color: color-mix(in srgb, var(--action-color) 6%, var(--bg-elevate));
}

a.action-tile:focus-visible {
  outline: 2px solid #1a56db;
  outline-offset: 2px;
}

.action-external {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0.55;
}
</style>
