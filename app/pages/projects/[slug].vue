<script setup lang="ts">
import { profile } from '~/data/profile'
import { getCase } from '~/data/cases'
import ActionBento from '~/components/ActionBento.vue'
import CaseCarousel from '~/components/CaseCarousel.vue'
import CaseDiagramBoard from '~/components/CaseDiagramBoard.vue'
import CaseNdaMedia from '~/components/CaseNdaMedia.vue'
import CaseSignals from '~/components/CaseSignals.vue'
import CaseFactsStrip from '~/components/CaseFactsStrip.vue'
import CaseComplexityBadge from '~/components/CaseComplexityBadge.vue'
import CaseKindBadge from '~/components/CaseKindBadge.vue'
import CaseLanguages from '~/components/CaseLanguages.vue'
import TechList from '~/components/TechList.vue'
import TechText from '~/components/TechText.vue'

const route = useRoute()
const study = getCase(String(route.params.slug ?? ''))

if (!study) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Case not found',
  })
}

useHead({
  title: `${study.title} - ${profile.name}`,
  meta: [
    {
      name: 'description',
      content: study.summary,
    },
  ],
})
</script>

<template>
  <main id="main" class="case-page mx-auto max-w-page">
    <p class="text-sm">
      <NuxtLink to="/#portfolio" class="case-page-back text-ink-mute no-underline hover:underline">
        <svg
          class="case-page-back-icon"
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
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </g>
        </svg>
        Portfolio
      </NuxtLink>
    </p>

    <article class="case-page-article">
      <div class="case-page-title">
        <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">
          {{ study.title }}
        </h1>
        <CaseKindBadge :kind="study.kind" />
        <CaseComplexityBadge
          class="case-page-complexity"
          :slug="study.slug"
          :value="study.complexity"
        />
      </div>
      <p class="case-page-role text-[1rem] text-ink-mute">
        {{ study.role }}
      </p>

      <CaseFactsStrip
        class="case-page-facts max-w-hero"
        :facts="study.facts"
      />

      <div class="case-page-media max-w-hero">
        <template v-if="study.shelf === 'nda' && !study.images?.length">
          <CaseDiagramBoard
            v-if="study.diagram"
            caption="visible"
            :diagram="study.diagram"
          />
          <CaseNdaMedia
            class="case-page-nda-note"
            :class="{ 'mt-4': !!study.diagram }"
            :pitch="study.diagram ? undefined : study.pitch"
          />
        </template>
        <CaseCarousel
          v-else
          :images="study.images"
          :label="`${study.title} screenshots`"
        />
      </div>

      <div
        v-if="study.shelf === 'nda' && study.signals?.length"
        class="case-page-signals max-w-hero"
      >
        <CaseSignals :items="study.signals" />
      </div>

      <p class="case-page-lede max-w-prose text-[1rem] leading-relaxed text-ink">
        {{ study.summary }}
      </p>

      <ActionBento
        v-if="study.links.length"
        class="case-page-actions max-w-hero"
        fill
        :actions="study.links"
        :label="`${study.title} links`"
      />

      <CaseLanguages
        v-if="study.languages?.length"
        class="case-page-stack max-w-hero"
        :languages="study.languages"
      />
      <TechList
        v-else
        class="case-page-stack max-w-hero"
        :items="study.stack"
      />

      <section
        v-for="section in study.sections"
        :key="section.heading"
        class="case-page-section"
      >
        <h2 class="text-xl font-semibold tracking-tight">
          {{ section.heading }}
        </h2>
        <p class="case-page-copy max-w-prose text-[1rem] leading-relaxed text-ink">
          <TechText :text="section.body" />
        </p>
      </section>
    </article>
  </main>
</template>

<style scoped>
.case-page {
  padding: var(--space-section) var(--page-gutter);
}

.case-page-back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.case-page-back-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.case-page-article {
  margin-top: var(--space-related);
}

.case-page-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-tight);
  width: 100%;
}

.case-page-role {
  margin-top: var(--space-tight);
}

.case-page-media,
.case-page-lede,
.case-page-facts,
.case-page-signals,
.case-page-stack {
  margin-top: var(--space-block);
}

.case-page-complexity {
  margin-left: auto;
}

.case-page-actions {
  margin-top: var(--space-related);
}

.case-page-section {
  margin-top: var(--space-section);
}

.case-page-copy {
  margin-top: var(--space-tight);
}
</style>
