<script setup lang="ts">
import type { CaseStudy } from '~/data/cases'
import CasePreviewGrid from '~/components/CasePreviewGrid.vue'
import CaseDiagramBoard from '~/components/CaseDiagramBoard.vue'
import CaseComplexityBadge from '~/components/CaseComplexityBadge.vue'
import CaseKindBadge from '~/components/CaseKindBadge.vue'
import CaseLanguages from '~/components/CaseLanguages.vue'
import TechList from '~/components/TechList.vue'

const props = defineProps<{
  study: CaseStudy
}>()

const secondary = computed(
  () =>
    props.study.links.find((link) => link.id === 'visit')
    ?? props.study.links.find((link) => link.id === 'github'),
)

const isNdaTextCard = computed(
  () => props.study.shelf === 'nda' && !props.study.preview,
)

/** One prose line on NDA cards - prefer pitch over long summary. */
const ndaLead = computed(
  () => props.study.pitch?.trim() || props.study.summary,
)
</script>

<template>
  <article
    class="case-card"
    :class="{ 'case-card-nda': isNdaTextCard }"
  >
    <template v-if="isNdaTextCard">
      <CaseDiagramBoard
        v-if="study.diagram"
        dense
        :diagram="study.diagram"
      />
      <div class="case-card-head">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 class="text-base font-semibold tracking-tight text-ink">
            {{ study.title }}
          </h3>
          <CaseKindBadge :kind="study.kind" />
        </div>
        <p class="case-card-nda-note mt-2 text-[0.8125rem] text-ink-mute">
          Under NDA · screenshots private
        </p>
        <p class="mt-2 text-[0.9375rem] leading-snug text-ink">
          {{ ndaLead }}
        </p>
      </div>
    </template>

    <template v-else>
      <CasePreviewGrid
        :preview="study.preview"
        :restricted="study.shelf === 'nda'"
        :label="`${study.title} screenshots`"
      />
      <div class="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <h3 class="text-base font-semibold tracking-tight text-ink">
          {{ study.title }}
        </h3>
        <CaseKindBadge :kind="study.kind" />
      </div>
      <p class="mt-3 text-base leading-relaxed text-ink">
        {{ study.summary }}
      </p>
      <CaseLanguages
        v-if="study.languages?.length"
        class="mt-5"
        :languages="study.languages"
      />
      <TechList
        v-else
        class="mt-5"
        :items="study.stack"
      />
    </template>

    <div class="case-card-footer">
      <div class="case-card-actions flex flex-wrap gap-3">
        <NuxtLink
          class="btn btn-primary"
          :to="`/projects/${study.slug}`"
        >
          Details
        </NuxtLink>
        <a
          v-if="secondary"
          class="btn btn-secondary"
          :href="secondary.href"
          :rel="secondary.external ? 'noopener noreferrer' : undefined"
          :target="secondary.external ? '_blank' : undefined"
        >
          {{ secondary.label }}
          <svg
            class="case-card-external"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </g>
          </svg>
        </a>
      </div>
      <CaseComplexityBadge
        class="case-card-complexity"
        :slug="study.slug"
        :value="study.complexity"
      />
    </div>
  </article>
</template>

<style scoped>
.case-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: 0.625rem;
  background-color: var(--bg-elevate);
  box-shadow: 0 1.5rem 5rem rgb(26 26 26 / 0.08);
}

.case-card-nda {
  gap: 1rem;
}

.case-card-nda-note {
  margin: 0;
  letter-spacing: 0.02em;
}

.case-card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-top: auto;
  padding-top: 1.25rem;
}

.case-card-nda .case-card-footer {
  padding-top: 0.25rem;
}

.case-card-complexity {
  margin-left: auto;
}

.case-card-external {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}
</style>
