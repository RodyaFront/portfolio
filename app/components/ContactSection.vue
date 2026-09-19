<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section id="contact" class="mx-auto max-w-page px-5 py-12" aria-labelledby="contact-heading">
    <h2 id="contact-heading" class="text-2xl font-semibold tracking-tight">
      Contact
    </h2>
    <p class="mt-2 text-ink-mute">
      Prefer Telegram. Email and profiles below.
    </p>
    <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-3">
      <li v-for="link in profile.links" :key="link.href">
        <a
          :href="link.href"
          :rel="link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
          :target="link.href.startsWith('mailto:') ? undefined : '_blank'"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>
  </section>
</template>
