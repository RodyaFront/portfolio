<script setup lang="ts">
import { parseTechText } from '~/data/tech'

const props = defineProps<{
  text: string
}>()

const parts = computed(() => parseTechText(props.text))
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <TechMark
      v-if="part.type === 'tech'"
      :tech="part.id"
      :label="part.value"
      variant="inline"
    />
    <template v-else>{{ part.value }}</template>
  </template>
</template>
