<script setup lang="ts">
import type { TechInput } from '~/data/tech'
import TechMark from '~/components/TechMark.vue'

defineProps<{
  items: readonly TechInput[]
}>()
</script>

<template>
  <div>
    <p class="text-[1rem] text-ink-mute">Technologies</p>
    <p class="mt-1 text-[1rem] text-ink">
      <template v-for="(item, index) in items" :key="index">
        <TechMark :tech="item" :label="String(item)" variant="inline" />
        <template v-if="index < items.length - 1">, </template>
      </template>
    </p>
  </div>
</template>
