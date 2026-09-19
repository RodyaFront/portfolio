<script setup lang="ts">
import type { CasePreview } from '~/data/cases'
import ImageLightbox from '~/components/ImageLightbox.vue'
import CaseNdaMedia from '~/components/CaseNdaMedia.vue'

const props = defineProps<{
  preview?: CasePreview
  label?: string
  /** NDA shelf: no screens by policy (not "pending"). */
  restricted?: boolean
}>()

const lightbox = ref<{ show: (start?: number) => void } | null>(null)

const images = computed(() => {
  if (!props.preview) return []
  return [props.preview.squares[0], props.preview.squares[1], props.preview.tall]
})

const empty = computed(() => !props.preview)
const ndaBlocked = computed(() => Boolean(props.restricted) && empty.value)
</script>

<template>
  <CaseNdaMedia v-if="ndaBlocked" dense />

  <div
    v-else
    class="case-preview"
    role="group"
    :aria-label="label ?? (empty ? 'Screenshots pending' : 'Project screenshots')"
  >
    <template v-if="preview">
      <button
        type="button"
        class="case-preview-square press-media"
        :aria-label="`View ${preview.squares[0].alt}`"
        @click="lightbox?.show(0)"
      >
        <img
          :src="preview.squares[0].src"
          :alt="preview.squares[0].alt"
          :width="preview.squares[0].width"
          :height="preview.squares[0].height"
          :style="{ objectPosition: preview.squares[0].objectPosition }"
          decoding="async"
        />
      </button>
      <button
        type="button"
        class="case-preview-square press-media"
        :aria-label="`View ${preview.squares[1].alt}`"
        @click="lightbox?.show(1)"
      >
        <img
          :src="preview.squares[1].src"
          :alt="preview.squares[1].alt"
          :width="preview.squares[1].width"
          :height="preview.squares[1].height"
          :style="{ objectPosition: preview.squares[1].objectPosition }"
          decoding="async"
        />
      </button>
      <button
        type="button"
        class="case-preview-tall press-media"
        :aria-label="`View ${preview.tall.alt}`"
        @click="lightbox?.show(2)"
      >
        <img
          :src="preview.tall.src"
          :alt="preview.tall.alt"
          :width="preview.tall.width"
          :height="preview.tall.height"
          :style="{ objectPosition: preview.tall.objectPosition }"
          decoding="async"
        />
      </button>
    </template>

    <template v-else>
      <div class="case-preview-square case-preview-empty" aria-hidden="true" />
      <div class="case-preview-square case-preview-empty" aria-hidden="true" />
      <div class="case-preview-tall case-preview-empty" aria-hidden="true" />
    </template>
  </div>

  <ImageLightbox v-if="images.length" ref="lightbox" :images="images" />
</template>

<style scoped>
.case-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0.5rem;
}

.case-preview-square,
.case-preview-tall {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  min-width: 0;
  min-height: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: #efeae2;
  cursor: zoom-in;
}

.case-preview-empty {
  cursor: default;
  border-style: dashed;
  background-color: rgb(239 234 226 / 0.65);
}

.case-preview-square {
  aspect-ratio: 1 / 1;
}

.case-preview-square:nth-child(1) {
  grid-column: 1;
  grid-row: 1;
}

.case-preview-square:nth-child(2) {
  grid-column: 1;
  grid-row: 2;
}

.case-preview-tall {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.case-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
</style>
