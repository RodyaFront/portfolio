<script setup lang="ts">
import { profile } from '~/data/profile'
import ActionBento from '~/components/ActionBento.vue'
</script>

<template>
  <section id="top" class="elevate-band" aria-labelledby="hero-name">
    <div class="mx-auto max-w-page px-5 pb-12 pt-10 md:pt-14">
      <div class="max-w-hero">
        <p class="text-sm text-ink-mute">{{ profile.location }}</p>
        <h1 id="hero-name" class="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {{ profile.name }}
        </h1>
        <p class="mt-2 text-base text-ink-mute">
          <TechText :text="profile.headline" />
        </p>
        <p class="mt-6 max-w-prose text-lg leading-relaxed text-ink">
          <TechText :text="profile.hero.thesis" />
        </p>
        <p class="mt-6 flex items-start gap-2.5 text-sm text-ink-mute">
          <span
            class="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-ink-mute"
            aria-hidden="true"
          />
          <span>
            {{ profile.hero.availability }}
            <ClientOnly>
              <LocalTime :time-zone="profile.hero.timeZone" />
            </ClientOnly>
          </span>
        </p>
        <ActionBento class="mt-8" />
      </div>
    </div>
  </section>
</template>
