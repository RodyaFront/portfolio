<script setup lang="ts">
import { profile } from '~/data/profile'
import { resolveCompany } from '~/data/companies'
import { getCareerTimeline, type CareerStop } from '~/utils/careerTimeline'
import ExperienceDetailModal from '~/components/ExperienceDetailModal.vue'

const stops = computed(() =>
  getCareerTimeline(profile.experience).map((stop) => ({
    ...stop,
    brand: resolveCompany(stop.company),
  })),
)

const activeStop = ref<CareerStop | null>(null)

function openDetails(stop: CareerStop) {
  activeStop.value = stop
}

function closeDetails() {
  activeStop.value = null
}
</script>

<template>
  <div class="career-timeline">
    <div class="career-track">
      <div class="career-lead" aria-hidden="true">
        <svg
          class="career-lead-chevron"
          viewBox="0 0 10 16"
          focusable="false"
        >
          <path d="M2 2.5 7.5 8 2 13.5" />
        </svg>
        <span class="career-lead-dash" />
      </div>

      <ol class="career-stops">
        <li
          v-for="stop in stops"
          :key="`${stop.company}-${stop.start}`"
          class="career-stop"
          :class="{ 'career-stop-current': stop.current }"
        >
          <div class="career-stop-flag" aria-hidden="true">
            <svg
              v-if="stop.current"
              class="career-flag"
              viewBox="0 0 16 20"
              focusable="false"
            >
              <path d="M3.5 1.5v17" />
              <path d="M3.5 2.5h9l-2.4 3.2 2.4 3.3h-9" />
            </svg>
          </div>

          <div class="career-stop-node" aria-hidden="true" />

          <div class="career-stop-copy">
            <p v-if="stop.current" class="sr-only">Current commercial role</p>
            <p class="career-stop-period">
              {{ stop.periodLabel }}
              <span class="career-stop-duration">({{ stop.durationLabel }})</span>
            </p>
            <p class="career-stop-company">
              <CompanyMark
                v-if="stop.brand"
                :brand="stop.brand"
              />
              <template v-else>{{ stop.company }}</template>
            </p>
            <button
              type="button"
              class="career-stop-details"
              :aria-label="`Details: ${stop.title} at ${stop.company}`"
              @click="openDetails(stop)"
            >
              Details
            </button>
          </div>
        </li>
      </ol>

      <div class="career-tail" aria-hidden="true">
        <span class="career-tail-line" />
        <svg
          class="career-tail-arrow"
          viewBox="0 0 10 16"
          focusable="false"
        >
          <path d="M2 2.5 7.5 8 2 13.5" />
        </svg>
      </div>
    </div>

    <ExperienceDetailModal
      :stop="activeStop"
      @close="closeDetails"
    />
  </div>
</template>

<style scoped>
.career-timeline {
  --career-line: rgb(26 26 26 / 0.2);
  width: 100%;
}

.career-track {
  display: flex;
  align-items: flex-start;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.career-lead {
  position: relative;
  flex: 0 0 4.75rem;
  align-self: stretch;
  min-height: calc(2rem + 0.75rem);
}

.career-lead-chevron {
  position: absolute;
  top: calc(2rem + 0.375rem);
  left: 0;
  width: 0.625rem;
  height: 1rem;
  transform: translateY(-50%);
  color: var(--career-line);
  overflow: visible;
}

.career-lead-chevron path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.career-lead-dash {
  position: absolute;
  top: calc(2rem + 0.375rem);
  right: 0;
  left: 0.85rem;
  height: 1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--career-line) 0 0.5rem,
    transparent 0.5rem 0.875rem
  );
}

.career-stops {
  display: flex;
  flex: 1 1 auto;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.career-stop {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  min-width: 10.5rem;
  padding: 2rem 0.5rem 0;
  scroll-snap-align: center;
  text-align: center;
}

.career-stop::before {
  content: '';
  position: absolute;
  top: calc(2rem + 0.375rem);
  right: 0;
  left: 0;
  height: 1px;
  background-color: var(--career-line);
}

.career-tail {
  position: relative;
  flex: 0 0 3.75rem;
  align-self: stretch;
  min-height: calc(2rem + 0.75rem);
}

.career-tail-line {
  position: absolute;
  top: calc(2rem + 0.375rem);
  right: 0.7rem;
  left: 0;
  height: 1px;
  background-color: var(--career-line);
}

.career-tail-arrow {
  position: absolute;
  top: calc(2rem + 0.375rem);
  right: 0;
  width: 0.625rem;
  height: 1rem;
  transform: translateY(-50%);
  color: var(--career-line);
  overflow: visible;
}

.career-tail-arrow path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.career-stop-flag {
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  height: 1.75rem;
  align-items: flex-end;
  justify-content: center;
  transform: translateX(-50%);
  color: #1a1a1a;
}

.career-flag {
  width: 1rem;
  height: 1.25rem;
  overflow: visible;
}

.career-flag path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.career-stop-node {
  position: relative;
  z-index: 1;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid #1a1a1a;
  border-radius: 999px;
  background-color: var(--bg-elevate, #fff);
}

.career-stop-current .career-stop-node {
  background-color: #1a1a1a;
}

.career-stop-copy {
  margin-top: 0.75rem;
  max-width: 11.5rem;
}

.career-stop-period {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
  color: #1a1a1a;
}

.career-stop-duration {
  font-size: 0.6875rem;
  font-weight: 400;
  color: #5c5c5c;
}

.career-stop-company {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: #5c5c5c;
}

.career-stop-details {
  margin: 0.5rem 0 0;
  padding: 0;
  border: 0;
  background: none;
  color: #1a56db;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  text-decoration: underline;
  text-underline-offset: 0.125rem;
  cursor: pointer;
}

.career-stop-details:hover {
  color: #1347b8;
}

@media (min-width: 48rem) {
  .career-track {
    overflow: visible;
  }

  .career-stop {
    min-width: 0;
  }

  .career-stop-copy {
    max-width: 13rem;
  }
}
</style>
