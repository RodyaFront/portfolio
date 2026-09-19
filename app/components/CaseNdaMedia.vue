<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Shorter copy and tighter padding on home cards. */
    dense?: boolean
    /** Plain-English product line (no internal wizard labels). */
    pitch?: string
  }>(),
  {
    dense: false,
  },
)
</script>

<template>
  <div
    class="case-nda-media"
    :class="{ 'case-nda-media-dense': dense }"
    role="note"
  >
    <p class="case-nda-media-kicker text-ink-mute">Under NDA</p>

    <p v-if="pitch" class="case-nda-media-pitch text-ink">
      {{ pitch }}
    </p>

    <p class="case-nda-media-copy text-ink-mute">
      <template v-if="dense">
        Screenshots stay private. Facts below stay public.
      </template>
      <template v-else-if="pitch">
        Client screenshots are not published under NDA. The pitch and facts are
        public; the write-up covers stack and ownership.
      </template>
      <template v-else>
        Client screenshots are not published under NDA. The diagram and facts
        are public; the write-up covers stack and ownership.
      </template>
    </p>
  </div>
</template>

<style scoped>
.case-nda-media {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  box-sizing: border-box;
  width: 100%;
  padding: 1rem 1.125rem 1.125rem;
  border: 1px solid rgb(26 26 26 / 0.12);
  border-radius: var(--radius);
  background-color: color-mix(in srgb, var(--bg-base) 55%, var(--bg-elevate));
}

.case-nda-media-dense {
  padding: 0.875rem 1rem 1rem;
}

.case-nda-media-kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.case-nda-media-pitch {
  margin: 0;
  max-width: 36rem;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.45;
}

.case-nda-media:not(.case-nda-media-dense) .case-nda-media-pitch {
  font-size: 1rem;
  line-height: 1.5;
}

.case-nda-media-copy {
  margin: 0;
  max-width: 36rem;
  font-size: 0.8125rem;
  line-height: 1.45;
}

.case-nda-media:not(.case-nda-media-dense) .case-nda-media-copy {
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
