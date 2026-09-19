<script setup lang="ts">
import { profile } from '~/data/profile'
import { getTotalExperience } from '~/utils/careerTimeline'
import CareerTimeline from '~/components/CareerTimeline.vue'

const total = computed(() => getTotalExperience(profile.experience))
</script>

<template>
  <section
    id="experience"
    class="elevate-band"
    aria-labelledby="experience-heading"
  >
    <div class="experience-inner mx-auto max-w-page px-5 pt-12">
      <div class="experience-head">
        <div class="experience-head-copy">
          <h2 id="experience-heading" class="text-2xl font-semibold tracking-tight text-ink">
            Experience
          </h2>
          <p class="mt-2 max-w-prose text-ink-mute">
            Commercial path by company and tenure. Open Details for what I owned on each stop.
          </p>
        </div>

        <p
          v-if="total"
          class="experience-total"
          :aria-label="`${total.durationLabel} total commercial experience`"
        >
          <span class="experience-total-value text-ink">{{ total.durationLabel }}</span>
          <span class="experience-total-hint text-ink-mute">total</span>
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-page px-5 pb-12 pt-8">
      <CareerTimeline />
    </div>
  </section>
</template>

<style scoped>
.experience-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-related);
}

.experience-head-copy {
  min-width: 0;
  flex: 1 1 16rem;
}

.experience-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  margin: 0;
  text-align: right;
}

.experience-total-value {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.experience-total-hint {
  font-size: 0.8125rem;
  line-height: 1.3;
}
</style>
