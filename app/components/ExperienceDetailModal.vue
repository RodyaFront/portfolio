<script setup lang="ts">
import type { CareerStop } from '~/utils/careerTimeline'
import { resolveCompany } from '~/data/companies'

const props = defineProps<{
  stop: CareerStop | null
}>()

const emit = defineEmits<{
  close: []
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const titleId = useId()
const displayStop = ref<CareerStop | null>(null)

const { openModal, requestClose, onCancel } = useDialogMotion(dialog)

const brand = computed(() =>
  displayStop.value ? resolveCompany(displayStop.value.company) : undefined,
)

watch(
  () => props.stop,
  (stop) => {
    if (stop) {
      displayStop.value = stop
      openModal()
      return
    }
    if (dialog.value?.open) requestClose()
  },
)

function onClose() {
  displayStop.value = null
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) requestClose()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="experience-dialog"
    :aria-labelledby="titleId"
    @cancel="onCancel"
    @close="onClose"
    @click="onBackdropClick"
  >
    <div
      v-if="displayStop"
      class="experience-dialog-panel"
      @click.stop
    >
      <div class="experience-dialog-head">
        <div class="experience-dialog-identity">
          <p
            :id="titleId"
            class="experience-dialog-company"
          >
            <CompanyMark
              v-if="brand"
              :brand="brand"
            />
            <template v-else>{{ displayStop.company }}</template>
          </p>
          <p class="experience-dialog-role">
            {{ displayStop.title }}
            <span v-if="displayStop.employment" class="experience-dialog-employment">
              ({{ displayStop.employment }})
            </span>
          </p>
          <p class="experience-dialog-meta">
            {{ displayStop.periodLabel }}
            <span class="experience-dialog-duration">({{ displayStop.durationLabel }})</span>
            <template v-if="displayStop.location">
              , {{ displayStop.location }}
            </template>
          </p>
        </div>

        <button
          type="button"
          class="press-control experience-dialog-close"
          aria-label="Close"
          @click="requestClose"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </button>
      </div>

      <ul class="experience-dialog-list">
        <li
          v-for="(item, index) in displayStop.highlights"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>

      <div v-if="displayStop.projects?.length" class="experience-dialog-projects">
        <p class="experience-dialog-projects-label">Key projects</p>
        <ul class="experience-project-cards">
          <li
            v-for="project in displayStop.projects"
            :key="project.title"
          >
            <article class="experience-project-card">
              <h3 class="experience-project-card-title">
                {{ project.title }}
              </h3>
              <p class="experience-project-card-summary">
                {{ project.summary }}
              </p>
              <NuxtLink
                v-if="project.caseSlug"
                class="press-control experience-project-card-link"
                :to="`/projects/${project.caseSlug}`"
                @click="requestClose"
              >
                Case page
              </NuxtLink>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.experience-dialog {
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: calc(var(--radius) + 0.125rem);
  background: transparent;
  max-width: min(40rem, calc(100vw - 2rem));
  max-height: calc(100vh - 2rem);
  opacity: 0;
  transform: translateY(0.5rem) scale(0.98);
}

.experience-dialog[open] {
  opacity: 1;
  transform: none;
}

.experience-dialog[open]:not(.is-closing) {
  animation: experience-dialog-in 200ms ease;
}

.experience-dialog[open].is-closing {
  opacity: 0;
  transform: translateY(0.35rem) scale(0.98);
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.experience-dialog::backdrop {
  background-color: rgb(26 26 26 / 0.45);
  opacity: 0;
}

.experience-dialog[open]::backdrop {
  opacity: 1;
}

.experience-dialog[open]:not(.is-closing)::backdrop {
  animation: experience-backdrop-in 200ms ease;
}

.experience-dialog[open].is-closing::backdrop {
  opacity: 0;
  transition: opacity 200ms ease;
}

@keyframes experience-dialog-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.98);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes experience-backdrop-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-dialog,
  .experience-dialog[open],
  .experience-dialog[open].is-closing,
  .experience-dialog::backdrop,
  .experience-dialog[open]::backdrop,
  .experience-dialog[open].is-closing::backdrop {
    animation: none;
    transition: none;
    opacity: 1;
    transform: none;
  }

  .experience-dialog:not([open]),
  .experience-dialog:not([open])::backdrop {
    opacity: 0;
  }
}

.experience-dialog-panel {
  overflow: auto;
  max-height: calc(100vh - 2rem);
  padding: 1.25rem 1.25rem 1.5rem;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: calc(var(--radius) + 0.125rem);
  background-color: var(--bg-elevate, #fff);
  color: #1a1a1a;
}

.experience-dialog-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.experience-dialog-identity {
  min-width: 0;
}

.experience-dialog-company {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
}

.experience-dialog-role {
  margin: 0.35rem 0 0;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.35;
}

.experience-dialog-employment {
  font-weight: 400;
  color: #5c5c5c;
}

.experience-dialog-meta {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #5c5c5c;
  font-variant-numeric: tabular-nums;
}

.experience-dialog-duration {
  font-size: 0.75rem;
}

.experience-dialog-close {
  --press-face: var(--bg-elevate);
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0;
  padding: 0;
  border: 1px solid rgb(26 26 26 / 0.15);
  border-radius: var(--radius);
  background: transparent;
  color: #1a1a1a;
  cursor: pointer;
}

.experience-dialog-close svg {
  width: 1.125rem;
  height: 1.125rem;
}

.experience-dialog-list {
  margin: 1.25rem 0 0;
  padding: 0 0 0 1.25rem;
  list-style: disc;
  list-style-position: outside;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.experience-dialog-list li + li {
  margin-top: 0.65rem;
}

.experience-dialog-list li::marker {
  color: #1a1a1a;
}

.experience-dialog-projects {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgb(26 26 26 / 0.1);
}

.experience-dialog-projects-label {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.experience-project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.experience-project-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.875rem;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: color-mix(in srgb, var(--bg-base) 55%, var(--bg-elevate));
}

.experience-project-card-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
}

.experience-project-card-summary {
  margin: 0;
  flex: 1;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #5c5c5c;
}

.experience-project-card-link {
  --press-face: var(--bg-elevate);
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  min-height: 1.75rem;
  padding: 0 0.625rem;
  border: 1px solid rgb(26 26 26 / 0.16);
  border-radius: 999px;
  background-color: var(--bg-elevate, #fff);
  color: #1a1a1a;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
}

.experience-project-card-link:hover,
.experience-project-card-link:focus-visible,
.experience-project-card-link:visited {
  color: #1a1a1a;
  text-decoration: none;
}
</style>
