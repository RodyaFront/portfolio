<script setup lang="ts">
import { profile } from '~/data/profile'
import SiteHeader from '~/components/SiteHeader.vue'
</script>

<template>
  <div>
    <a href="#main" class="skip-link">Skip to content</a>
    <SiteHeader />
    <slot />
    <footer class="mx-auto max-w-page border-t border-ink/10 px-5 py-6">
      <p class="text-sm text-ink-faint">
        {{ profile.name }}
      </p>
    </footer>
  </div>
</template>
