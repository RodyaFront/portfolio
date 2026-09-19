<script setup lang="ts">
import { profile } from '~/data/profile'
import HeroSection from '~/components/HeroSection.vue'
import ExperienceSection from '~/components/ExperienceSection.vue'
import ProjectsSection from '~/components/ProjectsSection.vue'
import DesignVisionSection from '~/components/DesignVisionSection.vue'
import ContactSection from '~/components/ContactSection.vue'

useHead({
  title: `${profile.name} - ${profile.headline}`,
  meta: [
    {
      name: 'description',
      content: profile.hero.thesis,
    },
  ],
})
</script>

<template>
  <main id="main">
    <HeroSection />

    <ExperienceSection />

    <ProjectsSection />

    <DesignVisionSection />

    <ContactSection />
  </main>
</template>
