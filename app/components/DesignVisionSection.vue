<script setup lang="ts">
import { profile } from '~/data/profile'
import { designShots } from '~/data/designShots'
import ImageLightbox from '~/components/ImageLightbox.vue'

const lightbox = ref<{ show: (start?: number) => void } | null>(null)
const lightboxImages = computed(() => designShots)
</script>

<template>
  <section
    id="design"
    class="elevate-band"
    aria-labelledby="design-heading"
  >
    <div class="design-inner mx-auto max-w-page px-5 py-12">
      <div class="design-head">
        <div class="design-head-copy">
          <h2 id="design-heading" class="text-2xl font-semibold tracking-tight">
            Design vision
          </h2>
          <p class="mt-2 max-w-prose text-ink-mute">
            How I see product UI before and beside the code: payment, auth, commerce, sports, messaging.
            Point studies from Dribbble, not client NDA work.
          </p>
        </div>
        <a
          class="design-dribbble text-sm font-medium text-accent no-underline hover:underline"
          :href="profile.contacts.dribbble"
          rel="noopener noreferrer"
          target="_blank"
        >
          All shots on Dribbble
        </a>
      </div>

      <ul class="design-gallery">
        <li
          v-for="(shot, index) in designShots"
          :key="shot.id"
          class="design-shot"
          :class="`design-shot-${shot.span}`"
        >
          <button
            type="button"
            class="design-shot-btn press-media"
            :aria-label="`View ${shot.title}`"
            @click="lightbox?.show(index)"
          >
            <img
              :src="shot.src"
              :alt="shot.alt"
              :width="shot.width"
              :height="shot.height"
              :style="{ objectPosition: shot.objectPosition }"
              loading="lazy"
              decoding="async"
            />
            <span class="design-shot-label">{{ shot.title }}</span>
          </button>
        </li>
      </ul>
    </div>

    <ImageLightbox ref="lightbox" :images="lightboxImages" />
  </section>
</template>

<style scoped>
.design-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-related);
}

.design-head-copy {
  min-width: 0;
  flex: 1 1 16rem;
}

.design-dribbble {
  flex-shrink: 0;
}

.design-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 0;
  list-style: none;
}

.design-shot {
  min-width: 0;
}

.design-shot-btn {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(26 26 26 / 0.1);
  border-radius: calc(var(--radius) + 0.125rem);
  background-color: #efeae2;
  cursor: zoom-in;
  text-align: left;
}

.design-shot-btn img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.design-shot-wide,
.design-shot-square,
.design-shot-hero {
  aspect-ratio: 4 / 3;
}

.design-shot-tall {
  aspect-ratio: 3 / 4;
}

.design-shot-label {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  left: 0.75rem;
  z-index: 2;
  width: fit-content;
  max-width: calc(100% - 1.5rem);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background-color: rgb(247 244 239 / 0.92);
  color: #1a1a1a;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  pointer-events: none;
}

@media (min-width: 48rem) {
  .design-gallery {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: 7.5rem;
    gap: 1rem;
  }

  .design-shot-wide,
  .design-shot-square,
  .design-shot-hero,
  .design-shot-tall {
    aspect-ratio: auto;
  }

  /* Row 1: payment + auth */
  .design-shot-wide:nth-child(1) {
    grid-column: span 7;
    grid-row: span 3;
  }

  .design-shot-square:nth-child(2) {
    grid-column: span 5;
    grid-row: span 3;
  }

  /* Row 2-3: tall FastBite + pizza, then sports fills under pizza */
  .design-shot-tall:nth-child(3) {
    grid-column: span 5;
    grid-row: span 5;
  }

  .design-shot-wide:nth-child(4) {
    grid-column: span 7;
    grid-row: span 3;
  }

  .design-shot-square:nth-child(5) {
    grid-column: span 7;
    grid-row: span 2;
  }

  /* Row 4: messenger + saas */
  .design-shot-square:nth-child(6) {
    grid-column: span 6;
    grid-row: span 3;
  }

  .design-shot-wide:nth-child(7) {
    grid-column: span 6;
    grid-row: span 3;
  }

  /* Closer: full-bleed tickets */
  .design-shot-wide:nth-child(8) {
    grid-column: span 12;
    grid-row: span 3;
  }
}

@media (min-width: 72rem) {
  .design-gallery {
    grid-auto-rows: 8.5rem;
  }
}
</style>
