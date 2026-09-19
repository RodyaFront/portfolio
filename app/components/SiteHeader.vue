<script setup lang="ts">
import { profile } from '~/data/profile'

const route = useRoute()

const homeHref = computed(() => (route.path === '/' ? '#top' : '/'))

function sectionHref(href: string) {
  if (route.path === '/') return href
  return `/${href}`
}
</script>

<template>
  <header class="elevate-band">
    <div class="mx-auto flex max-w-page flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
      <a
        :href="homeHref"
        class="font-medium text-ink no-underline hover:text-ink hover:underline"
      >
        {{ profile.name }}
      </a>

      <nav class="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Page sections">
        <a
          v-for="item in profile.nav"
          :key="item.href"
          :href="sectionHref(item.href)"
          class="text-sm text-ink-mute no-underline hover:text-accent hover:underline"
        >
          {{ item.label }}
        </a>
      </nav>

      <a
        :href="profile.contacts.telegram.href"
        class="ml-auto text-sm font-medium text-accent no-underline hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        Telegram
      </a>
    </div>
  </header>
</template>
