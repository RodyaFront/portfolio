<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <ul class="case-signals" aria-label="Key facts">
    <li v-for="item in items" :key="item" class="case-signals-item text-ink">
      {{ item }}
    </li>
  </ul>
</template>

<style scoped>
.case-signals {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.case-signals-item {
  position: relative;
  padding-left: 0.875rem;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.case-signals-item::before {
  content: '';
  position: absolute;
  top: 0.55em;
  left: 0;
  width: 0.3125rem;
  height: 0.3125rem;
  border-radius: 999px;
  background-color: currentColor;
  opacity: 0.45;
}
</style>
